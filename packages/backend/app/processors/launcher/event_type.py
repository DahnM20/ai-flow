from enum import Enum


class EventType(Enum):
    PROGRESS = "progress"
    STREAMING = "streaming"
    CURRENT_NODE_RUNNING = "current_node_running"
    ERROR = "error"
