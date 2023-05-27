import styled from 'styled-components';

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
    return (
        props.isOpen ?
            <PopupContainer>
                <PopupInner>
                    <PopupHeader>
                        <h3>{props.message?.type === MessageType.Error ? "Error" : "Info"}</h3>
                        <CloseButton onClick={props.onClose}>X</CloseButton>
                    </PopupHeader>
                    <PopupBody>
                        {props.message?.content}
                    </PopupBody>
                </PopupInner>
            </PopupContainer>
            : <></>
    );
}


const PopupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const PopupInner = styled.div`
  background-color: ${({ theme }) => theme.nodeBg};
  color: ${({ theme }) => theme.text};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: 20px;
  border-radius: 10px;
  width: 50%;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PopupBody = styled.div`
  margin-top: 20px;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

export default UserMessagePopup;