import React, { useState, useEffect } from "react";
import Seat from "./Seat";
import { Occasion } from "../page";
import {
  PublicClientType,
  WalletClientType,
} from "@/utils/useLoadBlockchainData";
import { toast } from "react-toastify";

interface SeatChartProps {
  occasion: Occasion;
  publicClient: PublicClientType;
  walletClient: WalletClientType;
  contractConfig: any;
  setToggle: (toggle: boolean) => void;
}

const SeatChart: React.FC<SeatChartProps> = ({
  occasion,
  publicClient,
  walletClient,
  contractConfig,
  setToggle,
}) => {
  const [seatsTaken, setSeatsTaken] = useState<bigint[] | null>(null);
  const [hasSold, setHasSold] = useState<boolean>(false);

  const getSeatsTaken = async () => {
    const seatsTaken = (await publicClient.readContract({
      ...contractConfig,
      functionName: "getSeatsTaken",
      args: [occasion.id],
    })) as bigint[];

    setSeatsTaken(seatsTaken);
  };

  const buyHandler = async (_seat: number) => {
    if (!walletClient?.account?.address) {
      toast.error(`Please connect your wallet to complete purchase of seat ${_seat}`);
      return;
    }

    setHasSold(false);

    const { request } = await publicClient!.simulateContract({
      address: contractConfig.address,
      abi: contractConfig.abi,
      account: walletClient!.account!.address,
      functionName: "mint",
      args: [occasion.id, _seat],
      value: occasion.cost,
    });

    const hash = await walletClient!.writeContract(request);
    await publicClient!.waitForTransactionReceipt({ hash });

    setHasSold(true);
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
