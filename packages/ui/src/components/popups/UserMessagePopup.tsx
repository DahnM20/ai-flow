import styled from "styled-components";
import DefaultPopupWrapper from "./DefaultPopup";
import { MdClose } from "react-icons/md";
import { Divider } from "@mantine/core";

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
    <DefaultPopupWrapper onClose={props.onClose} centered show={props.isOpen}>
      <div className="flex h-full flex-col rounded-lg bg-zinc-900 p-4 text-slate-200">
        <PopupHeader className="mb-2">
          <h3 className="text-xl">
            {props.message?.type === MessageType.Error ? "Error" : "Info"}
          </h3>
          <MdClose className="text-xl" onClick={props.onClose} />
        </PopupHeader>
        {!!props.message.nodeId && (
          <div className="my-2 flex w-full justify-center">
            <div className="w-fit rounded-lg bg-sky-400/30 px-2 py-1">
              {props.message.nodeId}
            </div>
          </div>
        )}
        <div className="mt-5 text-slate-300">{props.message?.content}</div>
      </div>
    </DefaultPopupWrapper>
  ) : (
    <></>
  );
}
const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default UserMessagePopup;
