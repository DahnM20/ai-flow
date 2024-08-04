from dataclasses import dataclass, field
from typing import Any

from ..components.processor import Processor


@dataclass
class ProcessorLauncherEvent:
    instance_name: str
    user_id: int = field(default=None)
    output: Any = field(default=None)
    processor_type: str = field(default=None)
    processor: Processor = field(default=None)
    isDone: bool = field(default=False)
    error: str = field(default=None)
    session_id: str = field(default=None)
    duration: float = field(default=0)
