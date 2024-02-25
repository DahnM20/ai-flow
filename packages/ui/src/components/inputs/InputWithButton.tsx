import { NodeInput } from "../nodes/Node.styles";

interface InputWithButtonProps {
  buttonText: string;
  onInputChange: (value: string) => void;
  onButtonClick: () => void;
  inputPlaceholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

const InputWithButton = ({
  inputPlaceholder,
  buttonText,
  onInputChange,
  onButtonClick,
  inputClassName = "",
  buttonClassName = "",
}: InputWithButtonProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center px-2 pb-4">
      <div className="flex w-2/3 flex-row space-x-2">
        <NodeInput
          type="text"
          className={` ${inputClassName ? inputClassName : "text-center"} `}
          placeholder={inputPlaceholder}
          onChange={(e) => onInputChange(e.target.value)}
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
