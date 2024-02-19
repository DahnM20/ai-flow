import styled from "styled-components";
import DefaultPopupWrapper from "./DefaultPopup";

export enum MessageType {
  Error,
  Info,
}

export interface UserMessage {
  type?: MessageType;
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
      <div className="flex h-full flex-col bg-zinc-900 p-6 text-slate-200">
        <PopupHeader>
          <h3 className="text-xl">
            {props.message?.type === MessageType.Error ? "Error" : "Info"}
          </h3>
          <CloseButton onClick={props.onClose}>X</CloseButton>
        </PopupHeader>
        <PopupBody className="mt-2 text-slate-300">
          {props.message?.content}
        </PopupBody>
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

const PopupBody = styled.div``;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

export default UserMessagePopup;
