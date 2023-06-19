import { modalOptions } from "@/utils/modalOptions";
import useLoadBlockchainData from "@/utils/useLoadBlockchainData";
import React from "react";

const sortOptions = [
  "Select Your Genre",
  "Select Your Dates",
  "Select Your Distance",
];

interface SortProps {
  setModalContent: (addEvent: modalOptions.addEvent) => void;
  toggle: any;
  setToggle: (toggle: boolean) => void;
}

const Sort: React.FC<SortProps> = ({ setModalContent, toggle, setToggle }) => {
  const { contractOwnerConnected } = useLoadBlockchainData();
  const togglePop = () => {
    setModalContent(modalOptions.addEvent)
    toggle ? setToggle(false) : setToggle(true);
  }

  return (
    <div className='grid grid-cols-12 grid-rows-2 h-full p-10 text-left transition duration-250 ease  bg-opacity-20'>
      {sortOptions.map((option, index) => (
        <div
          key={index}
          className={`md:col-span-full lg:col-span-3 md:row-start-${index} w-52 h-10 mx-1 my-6 border-2 row-span-2 place-self-center border-black flex justify-between items-center cursor-pointer hover:border-blue-400`}
        >
          <p className='ml-2 text-sm md:text-base'>{option}</p>
          <img
            src='./angle-down-solid.svg'
            className='w-3 h-auto mr-2'
            alt='Dropdown'
          />
        </div>
      ))}
      {contractOwnerConnected && (
        <button
          type='button'
          onClick={() => togglePop()}
          className='md:col-span-full lg:col-span-3 row-span-2 place-self-center w-32 h-10 bg-light-blue text-white ml-auto border-none rounded-md font-open-sans text-base font-semibold cursor-pointer transition-all duration-250 ease bg-blue-600'
        >
          Add Event
        </button>
      )}
    </div>
  );
};

export default Sort;
