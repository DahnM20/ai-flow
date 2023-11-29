
from enum import Enum
from dataclasses import dataclass, field
from typing import Any

from ..types.processor import Processor

class EventType(Enum):
    PROGRESS = "progress"
    CURRENT_NODE_RUNNING = "current_node_running"
    ERROR = "error"

@dataclass
class NodeProcessorEvent:
    instance_name: str
    user_id: int = field(default=None)
    output: Any = field(default=None)
    processor_type: str = field(default=None)
    processor: Processor = field(default=None)
    error: str = field(default=None)
    session_id: str = field(default=None)