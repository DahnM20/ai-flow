class LightException(Exception):
    def __init__(
        self,
        message: str,
        langvar_message: str = "LightException",
        langvar_values: dict = None,
    ):
        self.message = message
        self.langvar_message = langvar_message
        self.langvar_values = langvar_values
        super().__init__(f"{message}")
