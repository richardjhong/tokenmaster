import React, { useState, useEffect } from "react";
import { ethers, providers } from "ethers";
import CircularProgress from "@mui/material/CircularProgress";

interface CreateEventProps {
  tokenMasterContract: ethers.Contract;
  provider: providers.Web3Provider;
}

const CreateEvent: React.FC<CreateEventProps> = ({
  tokenMasterContract,
  provider,
}) => {
  const [inputs, setInputs] = useState({
    name: "",
    cost: "",
    tickets: "",
    date: "",
    time: "",
    location: "",
  });

  const [disabled, setDisabled] = useState<boolean>(true);
  const [loadingTx, setLoadingTx] = useState<boolean>(false);

  useEffect(() => {
    inputs.name &&
    inputs.cost &&
    inputs.tickets &&
    inputs.date &&
    inputs.time &&
    inputs.location
      ? setDisabled(false)
      : setDisabled(true);
  }, [inputs]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const signer = await provider.getSigner();

      setLoadingTx(true);
      const tx = await tokenMasterContract
        .connect(signer)
        .list(
          inputs.name,
          ethers.utils.parseUnits(inputs.cost, "ether"),
          parseInt(inputs.tickets),
          inputs.date,
          inputs.time,
          inputs.location,
        );
      await tx.wait();

      setLoadingTx(false);
    } catch (err) {
      setLoadingTx(false);
      console.error(err);
    }
  };

  return (
    <form
      className='col-span-full grid gap-5 grid-cols-27'
      onSubmit={handleSubmit}
    >
      <input
        type='text'
        className='row-start-3 col-span-full self-center border rounded p-3 mb-4 border-gray-300'
        placeholder='Name of Event'
        value={inputs.name}
        name='name'
        onChange={handleChangeInput}
      />
      <input
        type='text'
        className='row-start-4 col-span-9 self-center border rounded p-3 mb-4 border-gray-300'
        placeholder='Cost'
        value={inputs.cost}
        name='cost'
        onChange={handleChangeInput}
      />

      <input
        type='text'
        className='row-start-4 col-span-9 self-center border rounded p-3 mb-4 border-gray-300'
        placeholder='Amount of Tickets'
        value={inputs.tickets}
        name='tickets'
        onChange={handleChangeInput}
      />

      <input
        type='text'
        className='row-start-4 col-span-9 self-center border rounded p-3 mb-4 border-gray-300'
        placeholder='Time'
        value={inputs.time}
        name='time'
        onChange={handleChangeInput}
      />
      <input
        type='text'
        className='row-start-5 col-span-9 self-center border rounded p-3 mb-4 border-gray-300'
        placeholder='Date'
        value={inputs.date}
        name='date'
        onChange={handleChangeInput}
      />

      <input
        type='text'
        className='row-start-5 col-span-9 self-center border rounded p-3 mb-4 border-gray-300'
        placeholder='Location'
        value={inputs.location}
        name='location'
        onChange={handleChangeInput}
      />

      <button
        className='row-start-6 col-span-3 row-span-2 place-self-center w-32 h-12 bg-light-blue text-white ml-auto border-none rounded-md font-open-sans text-base font-semibold cursor-pointer transition-all duration-250 ease bg-blue-700 disabled:bg-gray-400'
        type='submit'
        disabled={disabled}
      >
        {loadingTx ? <CircularProgress color='inherit' /> : "Create Event"}
      </button>
    </form>
  );
};

export default CreateEvent;
