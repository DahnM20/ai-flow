import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Input, Label, Section } from "./ParametersFields";
import { AppConfig, configMetadata } from "./configMetadata";
import { SocketContext } from "../../../providers/SocketProvider";

export default function AppParameters() {
  const { t } = useTranslation("flow");
  const { socket, connect } = useContext(SocketContext);

  // Load configuration from local storage immediately
  const initialConfig: Partial<AppConfig> = JSON.parse(
    localStorage.getItem("appConfig") || "{}",
  );
  const [config, setConfig] = useState<Partial<AppConfig>>(initialConfig);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    connect();
  }, [connect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setConfig((prev: Partial<AppConfig>) => {
      const newConfig = { ...prev, [id]: value };
      localStorage.setItem("appConfig", JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    try {
      if (!socket) {
        throw new Error("Socket is not connected");
      }
      socket.emit("update_app_config", config);
      setSuccess("Configuration updated successfully.");
    } catch (err) {
      console.error("Error updating config:", err);
      setError("Failed to update configuration.");
    }
  };

  return (
    <div className="app-parameters">
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {(Object.keys(configMetadata) as (keyof AppConfig)[]).map((key) => (
        <Section key={key}>
          <Field key={key}>
            <Label htmlFor={key}>{configMetadata[key].label}</Label>
            {configMetadata[key].description && (
              <p className="text-sm text-slate-400">
                {configMetadata[key].description}
              </p>
            )}
            <Input
              type={configMetadata[key].type}
              id={key}
              value={config[key] || ""}
              onChange={handleChange}
            />
          </Field>
        </Section>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Save Configuration
      </button>
    </div>
  );
}
