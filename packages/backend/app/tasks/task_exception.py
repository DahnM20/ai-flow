class TaskAlreadyRegisteredError(Exception):
    """Exception raised when attempting to register a task that is already registered."""

    def __init__(self, task_name):
        self.task_name = task_name
        super().__init__(f"Task '{task_name}' is already registered.")
