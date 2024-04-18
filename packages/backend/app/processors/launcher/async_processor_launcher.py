import eventlet
import logging
import traceback

from typing import List
from enum import Enum

from .processor_event import ProcessorEvent

from .event_type import EventType

from ..observer.observer import Observer

from ..components.processor import Processor
from .abstract_topological_processor_launcher import (
    AbstractTopologicalProcessorLauncher,
)


class AsyncProcessorLauncher(AbstractTopologicalProcessorLauncher, Observer):
    """
    AsyncProcessorLauncher extends the functionality of the Basic Processor Launcher.

    The main enhancement in this class is the implementation of the 'launch_processors' method,
    which leverages eventlet greenthreads. This allows for asynchronous execution of processors,
    enabling efficient handling of I/O-bound tasks and improving the overall performance of processor execution.
    """

    GREENTHREAD_POOL_SIZE = 25

    class NodeState(Enum):
        PENDING = 1
        RUNNING = 2
        COMPLETED = 3
        ERROR = 4

    class Node:
        def __init__(self, id: str, parent_ids: List[str], processor: Processor):
            self.id = id
            self.parent_ids = parent_ids
            self.state = AsyncProcessorLauncher.NodeState.PENDING
            self.output = None
            self.processor = processor

        def run(self):
            self.state = AsyncProcessorLauncher.NodeState.RUNNING

            try:
                self.output = self.processor.process()
            except Exception as e:
                self.state = AsyncProcessorLauncher.NodeState.ERROR
                raise e

            self.state = AsyncProcessorLauncher.NodeState.COMPLETED
            return self.output

        def get_processor(self):
            return self.processor

    def get_input_processor_names(self, processor: Processor):
        return [
            input_processor.name for input_processor in processor.get_input_processors()
        ]

    def convert_processors_to_node_dict(self, processors: List[Processor]):
        nodes = {}
        for processor in processors.values():
            nodes[processor.name] = self.Node(
                processor.name, self.get_input_processor_names(processor), processor
            )
        return nodes

    def launch_processors(self, processors: List[Processor]):
        for processor in processors.values():
            processor.add_observer(self)

        nodes = self.convert_processors_to_node_dict(processors)

        pool = eventlet.GreenPool(AsyncProcessorLauncher.GREENTHREAD_POOL_SIZE)

        while nodes:
            for id, node in nodes.items():
                if node.state == AsyncProcessorLauncher.NodeState.ERROR:
                    nodes = {}
                    break
                if (
                    node.state == AsyncProcessorLauncher.NodeState.PENDING
                    and self.can_run(node, nodes)
                ):
                    pool.spawn(self.run_node, node)

            # pool.waitall()
            eventlet.sleep(0.5)

            nodes = self.remove_completed_nodes(nodes)
            logging.debug(f"Remaining nodes: {[node.id for node in nodes.values()]}")

    def remove_completed_nodes(self, nodes: List[Node]):
        return {
            id: n
            for id, n in nodes.items()
            if n.state not in [AsyncProcessorLauncher.NodeState.COMPLETED]
        }

    def can_run(self, node: Node, nodes: List[Node]):
        # If parents aren't in the list, then the node can run
        return all(parent_id not in nodes for parent_id in node.parent_ids)

    def launch_processors_for_node(self, processors: List[Processor], node_name=None):
        for processor in processors.values():
            if processor.get_output() is None or processor.name == node_name:
                processor.add_observer(self)
                self.run_processor(processor)

            if processor.name == node_name:
                break

    def run_processor(self, processor):
        try:
            self.notify_current_node_running(processor)
            output = processor.process()
            self.notify_progress(processor, output, isDone=True)
        except Exception as e:
            self.notify_error(processor, e)
            raise e

    def run_node(self, node: Node):
        try:
            self.notify_current_node_running(node.get_processor())
            output = node.run()
            self.notify_progress(node.get_processor(), output)
        except Exception as e:
            node.state = AsyncProcessorLauncher.NodeState.ERROR
            self.notify_error(node.get_processor(), e)
            traceback.print_exc()
            raise e

    def notify(self, event: EventType, data: ProcessorEvent):
        if event == EventType.PROGRESS:
            self.notify_progress(data.source, data.output)
