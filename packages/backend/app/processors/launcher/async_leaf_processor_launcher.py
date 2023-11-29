import eventlet
import logging
from .basic_processor_launcher import BasicProcessorLauncher

class AsyncLeafProcessorLauncher(BasicProcessorLauncher):
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

        if is_last_processor or current_processor not in processor_list[current_index + 1].get_input_processors():
            logging.info(f"{current_processor.name} can run independently!")
            return True

        return False
