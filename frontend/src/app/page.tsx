"use client";

import { useState } from "react";
import {
  Card,
  Navbar,
  Sort,
  SeatChart,
  Modal,
  CreateEvent,
} from "./components";
import { modalOptions } from "@/utils/modalOptions";
import useLoadBlockchainData, {
  contractConfigType,
} from "@/utils/useLoadBlockchainData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Occasion {
  id: bigint;
  name: string;
  cost: bigint;
  tickets: bigint;
  maxTickets: bigint;
  date: string;
  time: string;
  location: string;
}

const Home = () => {
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<modalOptions>(
    modalOptions.addEvent,
  );

  const {
    account,
    setAccount,
    occasions,
    contractOwnerConnected,
    publicClient,
    walletClient,
    contractConfig,
    contractBalance,
  } = useLoadBlockchainData();

  const displayModalContent = () => {
    switch (modalContent) {
      case modalOptions.viewSeats:
        return (
          <SeatChart
            occasion={occasion!}
            publicClient={publicClient!}
            walletClient={walletClient!}
            contractConfig={contractConfig as contractConfigType}
            setToggle={setToggle}
          />
        );
      case modalOptions.addEvent:
        return (
          <CreateEvent
            publicClient={publicClient!}
            walletClient={walletClient!}
            contractConfig={contractConfig as contractConfigType}
            setToggle={setToggle}
          />
        );
      default:
        return;
    }
  };

  return (
    <>
      <ToastContainer />

      <header className='bg-gradient-banner from-indigo-900 via-blue-500 to-indigo-900 min-h-[25vh] relative'>
        <Navbar
          account={account as `0x${string}`}
          setAccount={setAccount}
        />
        <div className='absolute bottom-5 left-20 text-white text-2xl sm:text-5xl md:text-3xl font-light'>
          {contractOwnerConnected && (
            <h3>Contract Balance: {contractBalance} ETH</h3>
          )}
          <h2>
            <strong>Event</strong> Tickets
          </h2>
        </div>
      </header>

      <div className='items-center max-w-7xl h-75 mx-auto relative transition-all duration-250 ease'>
        <Sort
          setModalContent={setModalContent}
          toggle={toggle}
          setToggle={setToggle}
          contractOwnerConnected={contractOwnerConnected}
        />
      </div>

      <div className='items-center max-w-7xl h-75 mx-auto relative transition-all duration-250 ease'>
        {occasions.map((occasion, index) => (
          <Card
            key={occasion.id.toString()}
            id={index + 1}
            occasion={occasion}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            setModalContent={setModalContent}
          />
        ))}
      </div>

      <Modal
        isOpen={toggle}
        setToggle={setToggle}
        occasionName={occasion?.name || null}
        modalContent={modalContent}
      >
        {displayModalContent()}
      </Modal>
    </>
  );
};

export default Home;
