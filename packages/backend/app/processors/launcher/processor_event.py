from dataclasses import dataclass, field
from typing import Any


@dataclass
class ProcessorEvent:
    source: Any = field(default=None)
    output: Any = field(default=None)
    error: str = field(default=None)
