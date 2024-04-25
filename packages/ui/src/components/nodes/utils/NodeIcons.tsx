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

export const ICON_MAP: { [key: string]: FC } = {
  FaUserCircle: FaUserCircle,
  FaRobot: FaRobot,
  FaPlay: FaPlay,
  FaLink: FaLink,
  FaFilm: FaFilm,
  FaImage: FaImage,
  FaEye: FaEye,
  AiOutlineMergeCells: AiOutlineMergeCells,
  AIFlowLogo: () => <img src="./logo.svg" alt="hi" className="w-full" />,
};
