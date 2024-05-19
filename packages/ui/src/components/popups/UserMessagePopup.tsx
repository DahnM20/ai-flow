import { Modal } from "@mantine/core";

export enum MessageType {
  Error,
  Info,
}

export interface UserMessage {
  type?: MessageType;
  nodeId?: string;
  content: string;
}

interface PopupProps {
  isOpen: boolean;
  message: UserMessage;
  onClose: () => void;
}

function UserMessagePopup(props: PopupProps) {
  return props.isOpen ? (
    <Modal
      opened={props.isOpen}
      onClose={props.onClose}
      title={props.message?.type === MessageType.Error ? "Error" : "Info"}
      size="auto"
      centered
      styles={{
        header: {
          backgroundColor: "rgb(24 24 27)",
        },
        body: {
          backgroundColor: "rgb(24 24 27)",
        },
      }}
    >
      <div className="flex h-full flex-col rounded-lg bg-zinc-900 px-4 text-slate-200">
        {!!props.message.nodeId && (
          <div className="my-2 flex w-full justify-center">
            <div className="w-fit rounded-lg bg-sky-400/30 px-2 py-1">
              {props.message.nodeId}
            </div>
          </div>
        )}
        <div className="mt-5 text-slate-300">{props.message?.content}</div>
      </div>
    </Modal>
  ) : (
    <></>
  );
}

export default UserMessagePopup;
