import { FC } from "react";
import {
  AiOutlineEdit,
  AiOutlineMergeCells,
  AiOutlineSearch,
} from "react-icons/ai";
import { BiMask } from "react-icons/bi";
import { BsFiletypeJson, BsListTask, BsRegex } from "react-icons/bs";
import { GiPerspectiveDiceSix } from "react-icons/gi";
import {
  FaUserCircle,
  FaRobot,
  FaPlay,
  FaLink,
  FaFilm,
  FaImage,
  FaEye,
  FaAws,
  FaProjectDiagram,
  FaGoogle,
  FaRandom,
} from "react-icons/fa";
import { SiZapier } from "react-icons/si";
import { FiFilter, FiRepeat } from "react-icons/fi";
import {
  MdHttp,
  MdLoop,
  MdOutlineBolt,
  MdOutlineCrop,
  MdSwapHoriz,
} from "react-icons/md";
import { TbHttpGet } from "react-icons/tb";

const ICON_MAP: { [key: string]: FC } = {
  FaUserCircle: FaUserCircle,
  FaRobot: FaRobot,
  FaPlay: FaPlay,
  FaLink: FaLink,
  FaFilm: FaFilm,
  FaImage: FaImage,
  FaEye: FaEye,
  FiFilter: FiFilter,
  AiOutlineSearch: AiOutlineSearch,
  BsRegex: BsRegex,
  MdSwapHoriz: MdSwapHoriz,
  AiOutlineEdit: AiOutlineEdit,
  AiOutlineMergeCells: AiOutlineMergeCells,
  BsJson: BsFiletypeJson,
  FaAws: FaAws,
  TbHttpGet: TbHttpGet,
  MdHttp: MdHttp,
  MdOutlineCrop: MdOutlineCrop,
  BiMask: BiMask,
  FaProjectDiagram: FaProjectDiagram,
  FiRepeat: FiRepeat,
  BsListTask: BsListTask,
  SubflowLoop: () => (
    <div>
      <FaProjectDiagram className="" />
      <MdLoop className="absolute left-11 top-9" />
    </div>
  ),
  AIFlowLogo: () => <img src="./logo.svg" alt="hi" className="w-full" />,
  OpenAILogo: () => (
    <img
      src="./img/openai-white-logomark.svg"
      alt="openai"
      className="rounded-lg bg-teal-600 p-1"
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
  StabilityAILogo: () => (
    <img
      src="./img/stabilityai-logo.jpg"
      alt="stabilityai"
      className="w-full rounded-lg"
    />
  ),
  AirTableLogo: () => (
    <img src="./img/airtable-logo.svg" alt="airtable" className="w-full" />
  ),
  OpenRouterLogo: () => (
    <img
      src="./img/openrouter-logo.jpg"
      alt="openrouter"
      className="w-full rounded-lg "
    />
  ),
  FaGoogle,
  ZapierIcon: () => <SiZapier />,
  MakeIcon: () => (
    <img src="./img/make-logo.svg" alt="make" className="w-full" />
  ),
  DeepSeekLogo: () => (
    <img
      src="./img/deepseek-logo.png"
      alt="deepseek"
      className="w-full rounded-lg bg-white p-1"
    />
  ),
  GeminiIcon: () => (
    <img
      src="./img/gemini-logo.png"
      alt="gemini"
      className="w-full rounded-lg"
    />
  ),
  FaRandom,
  GiPerspectiveDiceSix,
};

export const getIconComponent = (type: string) => ICON_MAP[type];
