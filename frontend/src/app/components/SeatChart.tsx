import React, { useState, useEffect } from "react";
import { ethers, providers } from "ethers";
import Seat from "./Seat";
import { Occasion } from "../page";

interface SeatChartProps {
  occasion: Occasion;
  tokenMasterContract: ethers.Contract;
  provider: providers.Web3Provider;
  setToggle: (toggle: boolean) => void;
  fetchBalance: () => void;
}

const SeatChart: React.FC<SeatChartProps> = ({
  occasion,
  tokenMasterContract,
  provider,
  setToggle,
  fetchBalance
}) => {
  const [seatsTaken, setSeatsTaken] = useState<boolean>(false);
  const [hasSold, setHasSold] = useState<boolean>(false);

  const getSeatsTaken = async () => {
    const seatsTaken = await tokenMasterContract.getSeatsTaken(occasion.id);
    setSeatsTaken(seatsTaken);
  };

  const buyHandler = async (_seat: number) => {
    setHasSold(false);

    const signer = await provider.getSigner();
    const tx = await tokenMasterContract
      .connect(signer)
      .mint(occasion.id, _seat, { value: occasion.cost });
    await tx.wait();

    setHasSold(true);

    await fetchBalance();
  };

  useEffect(() => {
    getSeatsTaken();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setToggle(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasSold]);

  return (
    <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-black bg-opacity-70'>
      <div className='grid gap-5 grid-cols-27 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-blue-900 to-white bg-opacity-75 border-10 border-gray-500 rounded-2xl p-20 h-85 overflow-x-auto'>
        <div className='col-span-full text-center self-center text-white font-light'>
          <div className='col-span-25'>
            <h1 className='font-bold'>{occasion.name} Seating Map</h1>
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

        <div className='text-center self-center col-span-full w-full row-start-2 h-40 border-3 border-black rounded-b-lg bg-gray-500 text-white'>
          <strong className='font-bold'>STAGE</strong>
        </div>

        <div className='col-start-6 col-span-1 row-start-3 row-span-10 h-50 rotate-90 border-1 border-black bg-gray-500'>
          <strong className='font-bold'>WALKWAY</strong>
        </div>

        <div className='col-start-22 w-30 rotate-90 border-1 border-black bg-gray-500'>
          <strong className='font-bold'>WALKWAY</strong>
        </div>

        {seatsTaken &&
          Array(25)
            .fill(1)
            .map((e, i) => (
              <Seat
                i={i}
                step={1}
                columnStart={0}
                maxColumns={5}
                rowStart={2}
                maxRows={5}
                seatsTaken={seatsTaken}
                buyHandler={buyHandler}
                key={i}
              />
            ))}

        {seatsTaken &&
          Array(Number(occasion.maxTickets) - 50)
            .fill(1)
            .map((e, i) => (
              <Seat
                i={i}
                step={26}
                columnStart={6}
                maxColumns={15}
                rowStart={2}
                maxRows={15}
                seatsTaken={seatsTaken}
                buyHandler={buyHandler}
                key={i}
              />
            ))}

        {seatsTaken &&
          Array(25)
            .fill(1)
            .map((e, i) => (
              <Seat
                i={i}
                step={Number(occasion.maxTickets) - 24}
                columnStart={22}
                maxColumns={5}
                rowStart={2}
                maxRows={5}
                seatsTaken={seatsTaken}
                buyHandler={buyHandler}
                key={i}
              />
            ))}
      </div>
    </div>
  );
};

export default SeatChart;
