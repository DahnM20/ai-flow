import { FC } from "react";
import { AiOutlineMergeCells } from "react-icons/ai";
import {
  FaUserCircle,
  FaRobot,
  FaPlay,
  FaLink,
  FaFilm,
  FaImage,
  FaEye,
} from "react-icons/fa";

const ICON_MAP: { [key: string]: FC } = {
  FaUserCircle: FaUserCircle,
  FaRobot: FaRobot,
  FaPlay: FaPlay,
  FaLink: FaLink,
  FaFilm: FaFilm,
  FaImage: FaImage,
  FaEye: FaEye,
  AiOutlineMergeCells: AiOutlineMergeCells,
  AIFlowLogo: () => <img src="./logo.svg" alt="hi" className="w-full" />,
  OpenAILogo: () => (
    <img
      src="./img/openai-white-logomark.svg"
      alt="openai"
      className="rounded-lg bg-zinc-950 p-1"
    />
  ),
  ReplicateLogo: () => (
    <img
      src="./img/replicate-logo.png"
      alt="replicate"
      className="rounded-lg"
    />
  ),
  YoutubeLogo: () => (
    <img
      src="./img/youtube-logo.svg"
      alt="youtube"
      className="w-full rounded-lg bg-white px-1 py-2"
    />
  ),
  AnthropicLogo: () => (
    <img
      src="./img/anthropic-logo.svg"
      alt="anthropic"
      className="w-full rounded-lg bg-white p-1"
    />
  ),
};

export const getIconComponent = (type: string) => ICON_MAP[type];
