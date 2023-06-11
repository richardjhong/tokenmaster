import React from "react";
import down from "./angle-down-solid.svg";

const sortTitles = [
  "Select Your Genre",
  "Select Your Dates",
  "Select Your Distance",
];

const Sort = () => {
  return (
    <div>
      <div className=''>
        <div className='flex justify-center items-center'>
          {sortTitles.map((title, index) => (
            <div
              key={index}
              className='w-52 h-10 mx-1 my-6 border-2 border-black flex justify-between items-center cursor-pointer hover:border-blue-400'
            >
              <p className='ml-2 text-sm md:text-base'>{title}</p>
              <img
                src='./angle-down-solid.svg'
                className='w-3 h-auto mr-2'
                alt='Dropdown'
              />
            </div>
          ))}
          {/* <div className='ml-4'>testing</div> */}
        </div>
      </div>
    </div>
  );
};

export default Sort;
