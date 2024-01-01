from ..launcher.event_type import EventType, NodeProcessorEvent
from .observer import Observer
import logging

from injector import singleton


@singleton
class SimpleStatsLogger(Observer):
    """
    Simple Stats Logger
    Logs stats about processor instances and events
    """

    processor_counts: dict[str, int]
    event_counts: dict[EventType, int]
    notification_count: int

    DEFAULT_EVENT_THRESHOLD = 10

    def __init__(self) -> None:
        self.processor_counts = {}
        self.event_counts = {}
        self.notification_count = 0
        self.event_threshold = self.DEFAULT_EVENT_THRESHOLD

    def notify(self, event: EventType, data: NodeProcessorEvent) -> None:
        if event in self.event_counts:
            self.event_counts[event] += 1
        else:
            self.event_counts[event] = 1

        if event == EventType.CURRENT_NODE_RUNNING:
            instance_name = data.instance_name
            processor_type = (
                instance_name.split("#")[-1] if "#" in instance_name else instance_name
            )

            if processor_type in self.processor_counts:
                self.processor_counts[processor_type] += 1
            else:
                self.processor_counts[processor_type] = 1

        self.notification_count += 1
        if self.notification_count % self.event_threshold == 0:
            self.print_stats()

    def print_stats(self) -> None:
        logging.info("===== Simple Stats Logger =====")
        logging.info("Event Stats:")
        for event, count in self.event_counts.items():
            logging.info(f"{event}: {count}")

        logging.info("Processor Type Stats:")
        for processor_type, count in self.processor_counts.items():
            logging.info(f"{processor_type}: {count}")
        logging.info("===== End of Stats =====\n")
