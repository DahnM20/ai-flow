import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
interface Item {
  name?: string;
  value: any;
}

interface SelectAutocompleteProps<T> {
  values: T[];
  selectedValue?: T;
  onChange: (value: T) => void;
}

function SelectAutocomplete<T extends Item>({
  values,
  selectedValue,
  onChange,
}: SelectAutocompleteProps<T>) {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? values
      : values.filter((item) => {
          const nameStr = item.name ?? "" + item.value;
          return nameStr.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox value={selectedValue} onChange={onChange}>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg  border-none text-left shadow-md outline-none sm:text-sm">
          <Combobox.Input
            className="w-full border-none bg-zinc-700/40 py-2 pl-3 pr-10 text-lg leading-5 text-slate-50"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(value: any) =>
              filteredItems.find((item) => item.value === value)?.name ?? ""
            }
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FiChevronRight
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-900 py-1 text-lg shadow-lg  outline-none sm:text-sm">
            {filteredItems.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-slate-100">
                Nothing found.
              </div>
            ) : (
              filteredItems.map((item) => (
                <Combobox.Option
                  key={item.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-slate-100"
                    }`
                  }
                  value={item.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name ?? item.value}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <FaCheck />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}

export default SelectAutocomplete;
