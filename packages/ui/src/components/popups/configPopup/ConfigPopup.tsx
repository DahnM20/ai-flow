import { FaGithub, FaTwitter, FaCoffee } from 'react-icons/fa';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SocketContext, WSConfiguration } from '../../providers/SocketProvider';

interface ConfigPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate?: () => void;
}

const ConfigPopup: React.FC<ConfigPopupProps> = ({
  isOpen,
  onClose,
  onValidate,
}) => {

  const { config, connectSocket } = useContext(SocketContext);

  const [apiKeyOpenAI, setApiKeyOpenAI] = useState('');
  const [apiKeyLeonardo, setApiKeyLeonardo] = useState('');

  useEffect(() => {
    const storedOpenAIKey = config?.openai_api_key
    const storedLeonardoKey = config?.leonardo_api_key
    if (storedOpenAIKey) {
      setApiKeyOpenAI(storedOpenAIKey);
    }
    if (storedLeonardoKey) {
      setApiKeyLeonardo(storedLeonardoKey);
    }
  }, []);

  const onApiKeyOpenAIChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = event.target.value;
    setApiKeyOpenAI(newKey);
  };

  const onApiKeyLeonardoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = event.target.value;
    setApiKeyLeonardo(newKey);
  };

  const handleValidate = () => {
    window.localStorage.setItem('openai_api_key', apiKeyOpenAI);
    window.localStorage.setItem('leonardo_api_key', apiKeyLeonardo);

    const config: WSConfiguration = {
      openai_api_key: apiKeyOpenAI,
      leonardo_api_key: apiKeyLeonardo,
    };
    if(!!connectSocket) connectSocket(config);
    onClose();
  }


  return (
    isOpen ?
      <Popup isOpen={isOpen}>
        <Content>
          <Header>
            <Title>Configuration</Title>
          </Header>
          <SoftMessage>We do not use or store your API keys.</SoftMessage>
          <SoftMessage>This project is open source, and you can verify this.</SoftMessage>
          <SoftMessage> Remember, you can revoke your keys at any time and generate new ones.</SoftMessage>
          <Field>
            <Label htmlFor="api-key">OpenAI API Key:</Label>
            <Input type="text" id="api-key" value={apiKeyOpenAI} onChange={onApiKeyOpenAIChange} />
          </Field>
          {/* <Field>
            <Label htmlFor="api-key-leonardo">Leonardo API Key (Optionnal):</Label>
            <Input type="text" id="api-key-leonardo" value={apiKeyLeonardo} onChange={onApiKeyLeonardoChange} />
          </Field> */}
          <Actions>
            <Button onClick={onClose}>Close</Button>
            <Button validate onClick={handleValidate}>Valider</Button>
          </Actions>
          <Footer>
            <MessageContainer>
              <Message>If you like this project, you can add a star on:</Message>
              <Icon href="https://github.com/DahnM20/ai-flow" target="_blank" rel="noopener noreferrer"><FaGithub /></Icon>
            </MessageContainer>
            <Message>Consider supporting the future of the project on:</Message>
            <Icons>
              <Icon href="https://twitter.com/DahnM20" target="_blank" rel="noopener noreferrer"><FaTwitter /></Icon>
              {/* <Icon href="https://ko-fi.com/YOUR-ACCOUNT-HERE" target="_blank" rel="noopener noreferrer"><FaCoffee /></Icon> */}
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
    width: 400px;
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

const Button = styled.button<{ validate?: boolean }>`
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
  background-color: ${props => props.validate ? '#27ae60' : '#6d6a69'};

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

function connectSocket(config: WSConfiguration) {
  throw new Error('Function not implemented.');
}
