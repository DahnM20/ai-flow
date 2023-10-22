import { FaGithub, FaXTwitter } from 'react-icons/fa6';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SocketContext, WSConfiguration } from '../providers/SocketProvider';
import { useTranslation } from 'react-i18next';
import UserProfile from '../login/UserProfile';
import { Auth } from '@aws-amplify/auth';
import { UserContext } from '../providers/UserProvider';

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate?: () => void;
}

function ConfigPopup({ isOpen, onClose, onValidate }: ConfigPopupProps) {

  const { t } = useTranslation('config');

  const { config, connectSocket } = useContext(SocketContext);
  const { user } = useContext(UserContext);

  const [apiKeyOpenAI, setApiKeyOpenAI] = useState('');
  const [apiKeyStabilityAI, setApiKeyStabilityAI] = useState('');

  useEffect(() => {
    const storedOpenAIKey = config?.openaiApiKey
    const storedStabilityAIKey = config?.stabilityaiApiKey
    if (storedOpenAIKey) {
      setApiKeyOpenAI(storedOpenAIKey);
    }
    if (storedStabilityAIKey) {
      setApiKeyStabilityAI(storedStabilityAIKey);
    }
  }, []);

  const onApiKeyOpenAIChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = event.target.value;
    setApiKeyOpenAI(newKey);
  };

  const onStabilityAIAPIKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = event.target.value;
    setApiKeyStabilityAI(newKey);
  };

  const handleValidate = () => {
    window.localStorage.setItem('openaiApiKey', apiKeyOpenAI);
    window.localStorage.setItem('stabilityaiApiKey', apiKeyStabilityAI);

    const config: WSConfiguration = {
      openaiApiKey: apiKeyOpenAI,
      stabilityaiApiKey: apiKeyStabilityAI,
    };

    if (!!connectSocket) {
      connectSocket(config);
    }

    onClose();
  }

  const handleLogout = () => {
    Auth.signOut();
  }

  return (
    isOpen ?
      <Popup isOpen={isOpen}>
        <Content>
          <Header>
            <Title>{t('configurationTitle')}</Title>
          </Header>
          {
            !user
              ? <>
                <SoftMessage>{t('openSourceDisclaimer')}</SoftMessage>
                <SoftMessage>{t('apiKeyDisclaimer')}</SoftMessage>
                <SoftMessage>{t('apiKeyRevokeReminder')}</SoftMessage>
              </>
              : <>
                <UserProfile user={user} />
                <Button className='bg-[#F09686] my-2' onClick={handleLogout}> Logout </Button>
              </>

          }

          <Field>
            <Label htmlFor="api-key">{t('openAIKeyFieldLabel')}</Label>
            <Input type={"text"} id="api-key" value={apiKeyOpenAI} onChange={onApiKeyOpenAIChange} />
          </Field>
          <Field>
            <Label htmlFor="api-key-stabilityai">Stability AI API Key (Optionnal):</Label>
            <Input type="text" id="api-key-stabilityai" value={apiKeyStabilityAI} onChange={onStabilityAIAPIKeyChange} />
          </Field>
          <Actions>
            <Button onClick={onClose} className='bg-[#9B8D8A]'>{t('closeButtonLabel')}</Button>
            <Button onClick={handleValidate} className='bg-[#72CCA5]'>{t('validateButtonLabel')}</Button>
          </Actions>
          <Footer>
            <MessageContainer>
              <Message>{t('likeProjectPrompt')}</Message>
              <Icon href="https://github.com/DahnM20/ai-flow" target="_blank" rel="noopener noreferrer"><FaGithub /></Icon>
            </MessageContainer>
            <Message>{t('supportProjectPrompt')}</Message>
            <Icons>
              <Icon href="https://twitter.com/DahnM20" target="_blank" rel="noopener noreferrer"><FaXTwitter /></Icon>
            </Icons>
          </Footer>
        </Content>
      </Popup>
      : <></>
  );
};

const Popup = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s ease;
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    pointer-events: ${(props) => (props.isOpen ? 'all' : 'none')};
  `;

const Content = styled.div`
    position: relative;
    width: 500px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  `;

const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  `;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #555;
  }
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  width: 100%;
  background-color: #80808012;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #777;
`;

const Message = styled.p`
  margin-bottom: 10px;
`;

const SoftMessage = styled.p`
  text-align: center;
  color: #888;
  margin-bottom: 20px;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const Icons = styled.div`
  display: flex;
  gap: 10px;
`;

const Icon = styled.a`
  font-size: 24px;
  color: #555;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

export default ConfigPopup;