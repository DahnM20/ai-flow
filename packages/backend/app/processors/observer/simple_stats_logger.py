from .observer import Observer
import logging

from injector import singleton


@singleton
class SimpleStatsLogger(Observer):
    """
    Simple Stats Logger
    Logs stats about processor instances and events
    """

    def __init__(self):
        self.processor_counts = {}
        self.event_counts = {}
        self.notification_count = 0
        self.log_interval = 10

    def notify(self, event, data):
        if event in self.event_counts:
            self.event_counts[event] += 1
        else:
            self.event_counts[event] = 1

        if event == "current_node_running":
            instance_name = data.get("instanceName", "")
            processor_type = (
                instance_name.split("#")[-1] if "#" in instance_name else instance_name
            )

            if processor_type in self.processor_counts:
                self.processor_counts[processor_type] += 1
            else:
                self.processor_counts[processor_type] = 1

        self.notification_count += 1
        if self.notification_count % self.log_interval == 0:
            self.print_stats()

    def print_stats(self):
        logging.info("===== Simple Stats Logger =====")
        logging.info("Event Stats:")
        for event, count in self.event_counts.items():
            logging.info(f"{event}: {count}")

        logging.info("Processor Type Stats:")
        for processor_type, count in self.processor_counts.items():
            logging.info(f"{processor_type}: {count}")
        logging.info("===== End of Stats =====\n")
