import React from "react";
import { Occasion } from "../page";

interface ModalProps {
  isOpen: boolean;
  setToggle: (toggle: boolean) => void;
  occasion: Occasion | null;
  modalContent: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  setToggle,
  occasion,
  modalContent,
  children,
}) => {

  if (!isOpen) return null;
  return (
    <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-black bg-opacity-70'>
      <div className='grid gap-5 grid-cols-27 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-blue-900 to-white bg-opacity-75 border-10 border-gray-500 rounded-2xl p-20 h-85 overflow-x-auto'>
        <div className='col-span-full text-center self-center text-white font-light'>
          <div className='col-span-25'>
            {modalContent === 'View Seats' ? (
              <h1 className='font-bold'>{occasion!.name} Seating Map</h1>
            ) : (
              <h1>New Event</h1>
            )}
          </div>
          <button
            onClick={() => setToggle(false)}
            className='col-start-25 col-span-1 w-10 h-10 bg-opacity-20 bg-white border-1 border-gray-500 rounded-md cursor-pointer transition duration-250 ease-all hover:bg-opacity-100 hover:border-white'
          >
            <img
              src='./close.svg'
              alt='Close'
              className='w-10 h-10'
            />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
