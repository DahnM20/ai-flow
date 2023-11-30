from .abstract_topological_processor_launcher import AbstractTopologicalProcessorLauncher


class BasicProcessorLauncher(AbstractTopologicalProcessorLauncher):
    """
    Basic Processor Launcher emiting event

    A class that launches processors based on configuration data.
    """

    def launch_processors(self, processors):
        for processor in processors.values():
            self.notify_current_node_running(processor)
            try :
                    output = processor.process()
                    self.notify_progress(processor, output)
                    
            except Exception as e:
                self.notify_error(processor, e)
                raise e

    def launch_processors_for_node(self, processors, node_name=None):
        for processor in processors.values():
            if processor.get_output() is None or processor.name == node_name:
                
                self.notify_current_node_running(processor)
                try :
                    output = processor.process()
                    self.notify_progress(processor, output)
                    
                except Exception as e:
                    self.notify_error(processor, e)
                    raise e

            if processor.name == node_name:
                break
