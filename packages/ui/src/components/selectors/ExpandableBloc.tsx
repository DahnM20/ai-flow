import { Disclosure, Transition } from "@headlessui/react";
import { FiChevronRight } from "react-icons/fi";

interface ExpandableBlocProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function ExpandableBloc({
  title,
  defaultOpen,
  children,
}: ExpandableBlocProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex flex-row items-center space-x-3 rounded-lg  bg-zinc-900/50 p-2 text-left text-xl">
            <FiChevronRight className={open ? "rotate-90 transform" : ""} />
            <div>{title}</div>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className={"p-1"}>{children}</Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
