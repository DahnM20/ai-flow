import React, { useState } from 'react';
import './ConfigPopup.css';

interface ConfigPopupProps {
  apiKey: string;
  isOpen: boolean;
  onApiKeyChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onValidate?: () => void;
}

const ConfigPopup: React.FC<ConfigPopupProps> = ({
  apiKey,
  isOpen,
  onApiKeyChange,
  onClose,
  onValidate,
}) => {
    
  return (
    isOpen ?
    <div className={`config-popup ${isOpen ? 'open' : ''}`}>
      <div className="config-popup-content">
        <div className="config-popup-header">
        <h2 className="config-popup-title">Configuration</h2>
        </div>
        <div className="config-popup-field">
          <label htmlFor="api-key">OpenAI API Key:</label>
          <input type="text" id="api-key" value={apiKey} onChange={onApiKeyChange} />
        </div>
        <div className="config-popup-actions">
          <button className="config-popup-button config-popup-button-close" onClick={onClose}>Close</button>
          <button className="config-popup-button config-popup-button-validate" onClick={onValidate}>Valider</button>
        </div>
        <div className="config-popup-footer">
          <p className="config-popup-message">If you like this project, please consider supporting it on:</p>
          <div className="config-popup-icons">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
              <i className="config-popup-icon fab fa-github"></i>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <i className="config-popup-icon fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    : <>   </>
  );
};

export default ConfigPopup;