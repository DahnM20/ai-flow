from ..env_config import is_cloud_env

MAX_NODES_IN_LIVE_DEMO = 20
MAX_URL_INPUT_NODE_IN_LIVE_DEMO = 5


def max_nodes(flow_data):
    if not is_cloud_env():
        return

    if len(flow_data) > MAX_NODES_IN_LIVE_DEMO:
        raise Exception(
            f"You've created too many nodes for this flow (>{MAX_NODES_IN_LIVE_DEMO})."
        )


def max_url_input_nodes(flow_data):
    if not is_cloud_env():
        return

    count_url_input = sum(
        1 for node in flow_data if node.get("processorType") == "url_input"
    )

    if count_url_input > MAX_URL_INPUT_NODE_IN_LIVE_DEMO:
        raise Exception(
            f"You cannot have more than {MAX_URL_INPUT_NODE_IN_LIVE_DEMO} web extractor nodes in this flow. Please, create another flow."
        )


def max_empty_output_data(flow_data):
    if not is_cloud_env():
        return

    count_empty_output_data = sum(1 for node in flow_data if not node.get("outputData"))

    if count_empty_output_data > MAX_NODES_IN_LIVE_DEMO:
        raise Exception(
            f"You've created too many nodes for the live demo (>{MAX_NODES_IN_LIVE_DEMO}). If you want to not be limited, please install the tool locally."
        )
