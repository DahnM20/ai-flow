import eventlet
import logging
from .abstract_topological_processor_launcher import AbstractTopologicalProcessorLauncher

class AsyncLeafProcessorLauncher(AbstractTopologicalProcessorLauncher):
    """
    This launcher extends the Basic Processor Launcher, maintaining the same topological order for processor execution.
    
    The key distinction lies in the 'launch_processors' method, which employs eventlet greenthreads to enable asynchronous 
    execution of processors. This asynchronous behavior is applied specifically when the processor in question is a leaf processor.
    """
    
    def launch_processors(self, processors):
        greenthreads = []

        for processor in processors.values():
            if self.can_run_independently(processors, processor):
                gt = eventlet.spawn(self.run_processor, processor)
                greenthreads.append((gt, processor))
            else:
                self.run_processor(processor)
    
    def launch_processors_for_node(self, processors, node_name=None):
        for processor in processors.values():
            if processor.get_output() is None or processor.name == node_name:
                self.run_processor(processor)

            if processor.name == node_name:
                break

    def run_processor(self, processor):
        try:
            self.notify_current_node_running(processor)
            output = processor.process()
            self.notify_progress(processor, output)
        except Exception as e:
            self.notify_error(processor, e)
            raise e

    def can_run_independently(self, processors, current_processor):
        processor_list = list(processors.values())
        current_index = processor_list.index(current_processor)
        is_last_processor = current_index + 1 == len(processor_list)
        
        if not is_last_processor:
            for next_processor in processor_list[current_index + 1:]:
                if current_processor in next_processor.get_input_processors():
                    return False

        logging.info(f"{current_processor.name} can run independently!")
        return True
