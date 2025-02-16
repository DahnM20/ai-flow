import React, { memo, useContext, useMemo } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";

import "github-markdown-css";
import { FiCopy, FiMinus, FiPlus } from "react-icons/fi";
import { copyToClipboard } from "../../../utils/navigatorUtils";
import { toastFastInfoMessage } from "../../../utils/toastUtils";
import { useTranslation } from "react-i18next";
import { NodeContext } from "../../../providers/NodeProvider";
import { NodeAppearance } from "../types/node";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as theme } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownOutputProps {
  data: string;
  name: string;
  appearance?: NodeAppearance;
}

const MarkdownOutput: React.FC<MarkdownOutputProps> = ({
  data,
  name,
  appearance,
}) => {
  const { t } = useTranslation("flow");
  const { updateNodeAppearance } = useContext(NodeContext);

  const fontSize = appearance?.fontSize ?? 1.2;

  const stringifiedData = useMemo(() => {
    if (!data) return "";
    return typeof data === "string" ? data : JSON.stringify(data);
  }, [data]);

  if (!data) return <p> </p>;

  const increaseFontSize = () => {
    updateNodeAppearance(name, {
      ...appearance,
      fontSize: fontSize + 0.1,
    });
  };

  const decreaseFontSize = () =>
    updateNodeAppearance(name, {
      ...appearance,
      fontSize: fontSize - 0.1,
    });

  const handleCopyToClipboard = (event: any) => {
    event.stopPropagation();
    if (data) {
      copyToClipboard(data);
      toastFastInfoMessage(t("CopiedToClipboard"));
    }
  };

  const handleElementCopyToClipboard = (element: any) => {
    if (element) {
      copyToClipboard(element);
      toastFastInfoMessage(t("CopiedToClipboard"));
    }
  };

  return (
    <div className="relative">
      <MemoizedStyledReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={stringifiedData}
        fontSize={fontSize}
        className={`markdown-body px-8 pt-8 text-lg`}
        components={{
          code(props: any) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="flex flex-col">
                <div className=" flex justify-between rounded-t-xl bg-zinc-800 px-1 py-2 text-zinc-300">
                  <div> {match[1]} </div>
                  <div className="mr-2">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementCopyToClipboard(children);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        handleElementCopyToClipboard(children);
                      }}
                      className="copy-icon"
                      aria-label="Copy text"
                      title="Copy text"
                    >
                      <div className=" flex items-center text-sm">
                        <FiCopy />

                        <div> Copy </div>
                      </div>
                    </IconButton>
                  </div>
                </div>
                <div className="rounded-b-xl bg-zinc-800 px-1 pb-1">
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={theme}
                    customStyle={{
                      margin: "0px",
                    }}
                  />
                </div>
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
      <IconContainer
        className="z-50"
        onDoubleClick={(e) => {
          e.stopPropagation();
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            increaseFontSize();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            increaseFontSize();
          }}
          aria-label="Increase text size"
          title="Increase text size"
        >
          <FiPlus />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            decreaseFontSize();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            decreaseFontSize();
          }}
          aria-label="Decrease text size"
          title="Decrease text size"
        >
          <FiMinus />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleCopyToClipboard(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleCopyToClipboard(e);
          }}
          className="copy-icon"
          aria-label="Copy text"
          title="Copy text"
        >
          <FiCopy />
        </IconButton>
      </IconContainer>
    </div>
  );
};

const IconButton = styled.div`
  cursor: pointer;
  transition: color 0.2s;
  color: #ffffff80;

  &:hover {
    color: #ffffff;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  top: 0.5em;
  right: 0.1em;
`;

const StyledReactMarkdown = styled(ReactMarkdown)<{ fontSize: number }>`
  background-color: transparent !important;
  color: #f5f5f5;
  font-size: ${(props) => props.fontSize}em;
  user-select: text;
`;

export const MemoizedStyledReactMarkdown = memo(
  StyledReactMarkdown,
  (prevProps, nextProps) => {
    return (
      prevProps.children === nextProps.children &&
      prevProps.fontSize === nextProps.fontSize
    );
  },
);

export default memo(MarkdownOutput);
