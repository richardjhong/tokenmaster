"use client";

import { useState, useEffect } from "react";
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  getAddress,
  isAddressEqual,
  Log,
  formatUnits,
} from "viem";
import {
  NetworkOptions,
  NetworkOption,
  networkChain,
  TOKENMASTER_CONTRACT_ABI,
} from "../../constants";
import { localhost, sepolia } from "viem/chains";
import { toast } from "react-toastify";

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

type LogWithArg = Log & {
  args: {
    latestOccasionIndex: bigint;
    latestBalance: bigint;
  };
};

export type contractConfigType = {
  abi: typeof TOKENMASTER_CONTRACT_ABI;
  address: Address;
};

export type WalletClientType = ReturnType<typeof createWalletClient>;
export type PublicClientType = ReturnType<typeof createPublicClient>;

const useLoadBlockchainData = () => {
  const [account, setAccount] = useState<Address | null>(null);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [contractOwnerConnected, setContractOwnerConnected] =
    useState<boolean>(false);
  const [publicClient, setPublicClient] = useState<PublicClientType>();
  const [walletClient, setWalletClient] = useState<WalletClientType>();
  const [contractListenerAdded, setContractListenerAdded] =
    useState<boolean>(false);
  const [contractConfig, setContractConfig] = useState<contractConfigType | {}>(
    {},
  );
  const [contractBalance, setContractBalance] = useState<string>("0");

  const mappedChain = {
    "0x539": localhost,
    "0xaa36a7": sepolia,
  };

  const loadBlockchainData = async () => {
    const chainId = window.ethereum.chainId as NetworkOption;

    const contractConfig = {
      abi: TOKENMASTER_CONTRACT_ABI,
      address: NetworkOptions[networkChain[chainId]] as `0x${string}`,
    };

    setContractConfig({
      ...contractConfig,
    });

    const publicClient = createPublicClient({
      chain: mappedChain[chainId],
      transport: custom(window.ethereum),
    });

    setPublicClient(publicClient);

    const walletClient = createWalletClient({
      account: account !== null ? account : undefined,
      chain: mappedChain[chainId],
      transport: custom(window.ethereum),
    });

    setWalletClient(walletClient);

    const balance = await publicClient.getBalance({
      address: contractConfig.address,
    });

    setContractBalance(formatUnits(balance, 18));

    const totalOccasions = (await publicClient.readContract({
      ...contractConfig,
      functionName: "totalOccasions",
    })) as bigint;

    const fetchedOccasions: Occasion[] = [];

    for (let i = 1n; i <= Number(totalOccasions); i++) {
      const singleOccasion = await publicClient.readContract({
        ...contractConfig,
        functionName: "getOccasion",
        args: [i],
      });
      fetchedOccasions.push(singleOccasion as Occasion);
    }

    setOccasions(fetchedOccasions);

    const contractOwner = (await publicClient.readContract({
      ...contractConfig,
      functionName: "owner",
    })) as Address;

    if (account) {
      isAddressEqual(contractOwner as `0x${string}`, account as `0x${string}`)
        ? setContractOwnerConnected(true)
        : setContractOwnerConnected(false);
    }

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

  useEffect(() => {
    if (publicClient && !contractListenerAdded) {
      publicClient.watchContractEvent({
        abi: (contractConfig as contractConfigType).abi,
        address: (contractConfig as contractConfigType).address,
        eventName: "OccasionCreated",
        onLogs: async (logs) => {
          const emittedLog = logs[0] as LogWithArg;
          const occasion: Occasion = (await publicClient.readContract({
            abi: (contractConfig as contractConfigType).abi,
            address: (contractConfig as contractConfigType).address,
            functionName: "getOccasion",
            args: [emittedLog.args.latestOccasionIndex],
          })) as Occasion;
          setOccasions((prevOccasions) => [...prevOccasions, occasion]);
          toast.success(`${occasion.name} now listed`);
        },
      });

      publicClient.watchContractEvent({
        abi: (contractConfig as contractConfigType).abi,
        address: (contractConfig as contractConfigType).address,
        eventName: "BalanceUpdated",
        onLogs: async (logs) => {
          const emittedLog = logs[0] as LogWithArg;
          const balance = emittedLog.args.latestBalance;
          setContractBalance(formatUnits(balance, 18));
        },
      });

      setContractListenerAdded(true);
    }
  }, [publicClient, contractConfig, contractListenerAdded]);

  return {
    account,
    setAccount,
    occasions,
    contractOwnerConnected,
    publicClient,
    walletClient,
    contractConfig,
    contractBalance,
  };
};

export default useLoadBlockchainData;
