"use client";

import { useState, useEffect } from "react";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  isAddressEqual,
} from "viem";
import {
  NetworkOptions,
  NetworkOption,
  networkChain,
  TOKENMASTER_CONTRACT_ABI,
} from "../../constants";
import { localhost, sepolia } from "viem/chains";

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

const useLoadBlockchainData = () => {
  const [account, setAccount] = useState<Address>();
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [contractOwnerConnected, setContractOwnerConnected] =
    useState<boolean>(false);

  const mappedChain = {
    "0x539": localhost,
    "0xaa36a7": sepolia,
  };

  const loadBlockchainData = async () => {
    const chainId = window.ethereum.chainId as NetworkOption;

    const wagmiContractConfig = {
      abi: TOKENMASTER_CONTRACT_ABI,
      address: NetworkOptions[networkChain[chainId]] as `0x${string}`,
    };

    const [connectedAccount] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const publicClient = createPublicClient({
      chain: mappedChain[chainId],
      transport: custom(window.ethereum),
    });

    const walletClient = createWalletClient({
      account: connectedAccount,
      chain: mappedChain[chainId],
      transport: custom(window.ethereum),
    });

    const totalOccasions = (await publicClient.readContract({
      ...wagmiContractConfig,
      functionName: "totalOccasions",
    })) as bigint;

    const fetchedOccasions: Occasion[] = [];

    for (let i = 1n; i <= Number(totalOccasions); i++) {
      const singleOccasion = await publicClient.readContract({
        ...wagmiContractConfig,
        functionName: "getOccasion",
        args: [i],
      });
      fetchedOccasions.push(singleOccasion as Occasion);
    }

    setOccasions(fetchedOccasions);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

  return {occasions};
};

export default useLoadBlockchainData;
