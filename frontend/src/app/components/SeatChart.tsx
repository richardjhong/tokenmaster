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
  fetchBalance,
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
    <>
      <div className='text-center self-center col-span-full w-full row-start-2 h-40 border-3 border-black rounded-b-lg bg-gray-500 text-white'>
        <strong className='font-bold'>STAGE</strong>
      </div>

      <div className='col-start-6 rotate-90 border-1 border-black'>
        <strong className='font-bold'>WALKWAY</strong>
      </div>

      <div className='col-start-22 rotate-90 border-1 border-black'>
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
    </>
  );
};

export default SeatChart;
