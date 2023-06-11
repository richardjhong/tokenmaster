import React from "react";
import { BigNumber } from "ethers";

interface SeatProps {
  i: number;
  step: any;
  columnStart: any;
  maxColumns: any;
  rowStart: any;
  maxRows: any;
  seatsTaken: any;
  buyHandler: any;
}

const Seat: React.FC<SeatProps> = ({
  i,
  step,
  columnStart,
  maxColumns,
  rowStart,
  maxRows,
  seatsTaken,
  buyHandler,
}) => {
  return (
    <div
      onClick={() => buyHandler(i + step)}
      className={
        seatsTaken.find((seat: BigNumber) => Number(seat) == i + step)
          ? "text-center bg-red-400 text-white border border-black rounded-full text-sm cursor-pointer transition duration-250 ease-in-out w-7 h-7"
          : "text-center bg-blue-900 text-white border border-black rounded-full text-sm cursor-pointer transition duration-250 ease-in-out w-7 h-7"
      }
      style={{
        gridColumn: `${(i % maxColumns) + 1 + columnStart}`,
        gridRow: `${Math.ceil((i + 1) / maxRows) + rowStart}`,
      }}
    >
      {i + step}
    </div>
  );
};

export default Seat;
