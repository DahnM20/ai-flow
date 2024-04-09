import NodeTextField from "../nodes/node-input/NodeTextField";

interface InputWithButtonProps {
  buttonText: string;
  onInputChange: (value: string) => void;
  onButtonClick: () => void;
  value: string;
  inputPlaceholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

const InputWithButton = ({
  inputPlaceholder,
  buttonText,
  value,
  onInputChange,
  onButtonClick,
  inputClassName = "",
  buttonClassName = "",
}: InputWithButtonProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center px-2 pb-4">
      <div className="flex w-full flex-row space-x-2">
        <NodeTextField
          // className={` ${inputClassName ? inputClassName : "text-center"} `}
          placeholder={inputPlaceholder}
          onChange={onInputChange}
          value={value}
        />
        <button
          className={`${buttonClassName ? buttonClassName : "rounded-lg bg-sky-500 p-2 hover:bg-sky-400"}`}
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InputWithButton;
