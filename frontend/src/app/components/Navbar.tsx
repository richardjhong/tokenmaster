import React from "react";
import { ethers } from "ethers";
import Link from "next/link";

interface NavbarProps {
  account: string | null;
  setAccount: (account: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav className='grid grid-cols-4 items-center'>
      <div className='flex items-center px-75 grid-col-span-3 h-65'>
        <h1 className='text-white text-1.50em italic mr-10'>tokenMaster</h1>
        <input
          type='text'
          placeholder='Find millions of experiences'
          className='bg-white bg-opacity-20 bg-no-repeat bg-center text-white h-35 border-none rounded-md mx-5 pl-2 placeholder-white font-open-sans'
        />

        <ul className='nav__links flex justify-center items-center h-full list-none'>
          <li className='h-full min-w-60'>
            <Link
              href=''
              className='flex justify-center items-center flex-wrap h-full px-10 text-white font-semibold no-underline hover:bg-blue-700 bg-opacity-30'
            >
              Concerts
            </Link>
          </li>
          <li className='h-full min-w-60'>
            <Link
              href=''
              className='flex justify-center items-center flex-wrap h-full px-10 text-white font-semibold no-underline hover:bg-blue-700 bg-opacity-30'
            >
              Sports
            </Link>
          </li>
          <li className='h-full min-w-60'>
            <Link
              href=''
              className='flex justify-center items-center flex-wrap h-full px-10 text-white font-semibold no-underline hover:bg-blue-700 bg-opacity-30'
            >
              Arts & Theater
            </Link>
          </li>
          <li className='h-full min-w-60'>
            <Link
              href=''
              className='flex justify-center items-center flex-wrap h-full px-10 text-white font-semibold no-underline hover:bg-blue-700 bg-opacity-30'
            >
              More
            </Link>
          </li>
        </ul>
      </div>

      {account ? (
        <button
          type='button'
          className='w-200 h-50 ml-auto mr-75 bg-white bg-opacity-20 text-white border-none rounded-md font-open-sans text-1.10em font-semibold cursor-pointer transition-all duration-250 ease-out hover:bg-indigo-900'
        >
          {account.slice(0, 6) + "..." + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type='button'
          className='w-200 h-50 ml-auto mr-75 bg-white bg-opacity-20 text-white border-none rounded-md font-open-sans text-1.10em font-semibold cursor-pointer transition-all duration-250 ease-out hover:bg-indigo-900'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
};

export default Navbar;
