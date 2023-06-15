import React, { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  setToggle: (toggle: boolean) => void;
  occasionName: string | null;
  modalContent: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  setToggle,
  occasionName,
  modalContent,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  // collapses modal on pressing ESC key
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? setToggle(false) : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [isOpen]);

  // collapses modal when clicking outside of modal
  useEffect(() => {
    const outsideClick = (e: MouseEvent) => {
      if (isOpen && !modalRef.current?.contains(e.target as Node)) {
        setToggle(false);
      }
    };
    document.body.addEventListener("click", outsideClick);
    return () => {
      document.body.removeEventListener("click", outsideClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-black bg-opacity-70'>
      <div
        className='grid gap-5 grid-cols-27 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-blue-900 to-white bg-opacity-75 border-10 border-gray-500 rounded-2xl p-20 h-85 overflow-x-auto'
        ref={modalRef}
      >
        <div className='col-span-full text-white font-light flex flex-col'>
          <button
            onClick={() => setToggle(false)}
            className='ml-auto bg-opacity-20 bg-white border-1 border-gray-500 rounded-md cursor-pointer transition duration-250 ease-all hover:bg-opacity-100 hover:border-white'
          >
            <img
              src='./close.svg'
              alt='Close'
              className='w-10 h-10'
            />
          </button>
          <div className='mx-auto text-center self-center'>
            {modalContent === "View Seats" ? (
              <h1 className='font-bold'>{occasionName} Seating Map</h1>
            ) : (
              <h1 className='font-bold'>New Event</h1>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
