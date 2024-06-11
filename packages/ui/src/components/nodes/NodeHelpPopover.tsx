import React from "react";
import { Popover } from "@mantine/core";
import { NodeHelp, NodeHelpData } from "./utils/NodeHelp";

type NodeHelpPopoverProps = {
  children: React.ReactNode;
  showHelp: boolean;
  data: NodeHelpData;
  onClose: () => void;
};

function NodeHelpPopover({
  children,
  showHelp,
  data,
  onClose,
}: NodeHelpPopoverProps) {
  return (
    <Popover
      width={500}
      opened={showHelp}
      withArrow
      position="right"
      arrowSize={12}
      offset={45}
      withinPortal
      clickOutsideEvents={["mouseup", "touchend"]}
      closeOnClickOutside
      shadow="md"
      styles={{
        dropdown: {
          padding: 0,
        },
      }}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        {data && <NodeHelp data={data} onClose={onClose} />}
      </Popover.Dropdown>
    </Popover>
  );
}

export default NodeHelpPopover;
