import { useTranslation } from "react-i18next";
import { NodeSection } from "../../../nodes-configuration/sectionConfig";
import {
  FiArrowDown,
  FiChevronDown,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";
import { useState } from "react";

interface SidebarSectionProps {
  section: NodeSection;
  index: number;
  children: React.ReactNode;
}

function SidebarSection({ section, index, children }: SidebarSectionProps) {
  const { t } = useTranslation("flow");
  const [show, setShow] = useState<boolean>(true);

  function toggleShow() {
    setShow((prev) => !prev);
  }
  return (
    <div key={index} className={`mb-5 flex flex-col gap-y-2`}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-md ml-1 flex flex-grow flex-row items-center gap-x-2 border-b-2 border-b-slate-500/20 py-1 text-slate-300">
          {section.icon && <section.icon />}
          {t(section.label)}
        </h2>

        {show ? (
          <FiChevronDown
            onClick={toggleShow}
            className="transition-colors duration-100 ease-in-out hover:text-slate-100"
          />
        ) : (
          <FiChevronRight
            onClick={toggleShow}
            className="transition-colors duration-100 ease-in-out hover:text-slate-100"
          />
        )}
      </div>

      {show && children}
    </div>
  );
}

export default SidebarSection;
