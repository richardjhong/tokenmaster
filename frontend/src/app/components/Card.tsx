import { ethers, utils } from "ethers";
import { Occasion } from "../page";

interface CardProps {
  id: number;
  occasion: Occasion;
  toggle: any;
  setToggle: (toggle: boolean) => void;
  setOccasion: (occasion: Occasion) => void;
}

const Card: React.FC<CardProps> = ({
  occasion,
  toggle,
  setToggle,
  setOccasion,
}) => {
  const togglePop = () => {
    setOccasion(occasion);
    toggle ? setToggle(false) : setToggle(true);
  };

  return (
    <>
      <div className='grid grid-cols-12 grid-rows-2 h-full p-10 text-left transition duration-250 ease hover:bg-stone-200 bg-opacity-20'>
        <p className='col-span-2 row-span-2 self-center place-self-center text-[0.95rem] sm:text-[3vw] md:text-[1.15rem]'>
          <span className='font-bold'>{occasion.date}</span>
          <br /> {occasion.time}
        </p>
        <p className='col-span-6 row-span-2 self-center text-center font-open-sans text-base sm:text-3xl md:text-xl'>
          <span className="font-bold">{occasion.name}</span>
          <br /> {occasion.location}
        </p>
        <div className='col-span-1 row-span-2 self-center text-base sm:text-3xl font-light'>
          <p className="font-semibold">
            {utils.formatUnits(occasion.cost.toString(), "ether")}
          </p>{" "}
          ETH
        </div>
        {occasion.tickets.toString() === "0" ? (
          <button
            type='button'
            className='col-span-3 row-span-2 place-self-center w-32 h-10 bg-light-blue text-white ml-auto border-none rounded-md font-open-sans text-base font-semibold cursor-pointer transition-all duration-250 ease bg-red-600'
            disabled={true}
          >
            Sold Out
          </button>
        ) : (
          <button
            type='button'
            className='col-span-3 row-span-2 place-self-center w-32 h-10 bg-light-blue text-white ml-auto border-none rounded-md font-open-sans text-base font-semibold cursor-pointer transition-all duration-250 ease bg-blue-600'
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
      </div>
      <hr />
    </>
  );
};

export default Card;
