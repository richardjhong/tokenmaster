<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">tokenMaster</h3>

  <p align="center">
    A dApp where users can reserve seats for events and the contract deployer can list new events
    <br />
    <a href="https://github.com/richardjhong/tokenmaster"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://tokenmaster-blockchain.vercel.app/">View Demo</a>
    ·
    <a href="https://sepolia.etherscan.io/address/0x9F3C98fAc3410156ce5F62C8ceDBb84d3F6BB405">View Contract</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]]()

This project started off with following along the YouTube tutorial listed in the <a href="#acknowledgments">Acknowledgments</a> section. I then branched off with adding features such as building the create event feature, migrating styling to tailwind css, and migrating from ethers to viem on the frontend. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Ethereum][Ethereum]][Ethereum-url]
- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![TypeScript][TypeScript.js]][TypeScript-url]
- [![Tailwindcss][Tailwindcss]][Tailwindcss-url]
- [![Hardhat][Hardhat.js]][Hardhat-url]
- [![Metamask][Metamask.js]][Metamask-url]
- [![Viem][Viem.sh]][Viem-url]
- [![OpenZeppelin][OpenZeppelin]][OpenZeppelin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps:

### Prerequisites

The frontend leverages window.ethereum to detect the network chainId and connected account's address; the hardhat config also uses a private key to deploy to the Ethereum Sepolia test network. In my case, I used a MetaMask account and MetaMask browser extension. 

A [QuickNode](https://www.quicknode.com/) HTTP URL and [Etherscan](https://etherscan.io/) API key will be needed also for an .env file within the backend directory.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/richardjhong/tokenmaster.git
   ```
2. Install NPM packages within the backend directory
   ```sh
   cd backend && npm install
   ```
3. Create an env file at the root level of the backend directory named `.env`
   Within this file copy in the following code and replace where appropriate.

   ```js
   QUICKNODE_HTTP_URL="ENTER YOUR QUICKNODE HTTP URL"
   PRIVATE_KEY="ENTER YOUR METAMASK PRIVATE KEY HERE"
   ETHERSCAN_API_KEY="ENTER YOUR ETHERSCAN API KEY HERE"
   ```

4. a. While still in the backend directory, enter the following command to deploy your contract to the Sepolia network and record the contract address afterwards (Note: this will take a while as there's a built in 40 second timer to give enough time for the contract to be written to the Sepolia network first prior to verification):
    ```sh
    npx hardhat run scripts/deploy.ts --network sepolia
    ```

4. b. Alternatively to run a local blockchain and deploy the contract there, open a second terminal window also pointing to the backend directory. From there, within one terminal run the following command:
    ```sh
    npx hardhat node
    ```

    Make sure that the terminal shows the confirmation that a local blockchain is running with the following line in particular:
    ```js
    Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
    ```
    
    Within the second terminal, run the following command and record the contract address afterwards: 
    ```sh
    npx hardhat run scripts/deploy.ts --network localhost
    ```
  
5. Open a terminal window and change into the frontend directory. Within here, run the following command:
    ```sh
    npm install
    ```

6. Within the frontend directory, find the `frontend/constants/index.ts` file. Change the contract addresses within NetworkOptions to the deployed addresses within step 4. 
    ```js
    export const NetworkOptions = {
      [NetworkName.LOCALHOST]: "ENTER YOUR LOCALHOST CONTRACT ADDRESS HERE",
      [NetworkName.SEPOLIA]: "ENTER YOUR SEPOLIA CONTRACT ADDRESS HERE",
    };
    ```

7. Within the same frontend pointed directory, run the following command:
    ```sh
    npm run dev
    ```

8. Lastly open `http://localhost:3000` within a browser.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

The frontend has some elements that are not interactable at the moment as the emphasis of this project was on learning web3 rather than building a robust web2 application. That being said, the main highlights of this project are:

* When first loading the site, the page is presented with a "Connect" button on the top right of the page within the NavBar. After connecting to an account, the chainId of the network the account is connected to affects which smart contract to load: the one deployed on the localhost or the one live on sepolia. In addition, this connection of an account is necessary to complete the transactions in the following two features.

* Any user can "reserve" a seat to an event via minting an NFT mapped to that event (assuming the user has the balance to complete the transaction as well as the seat is not reserved). To do so, a user clicks a "View Seat" button next to the appropriate event which opens a modal. From here, the user can reserve seats with a blue background. The user then should be prompted to complete the transaction within the MetaMask extension. If the user clicks on a seat to reserve but is not connected (and therefore there is no wallet address to complete the MetaMask transaction), a toast message instead will display to connect an account.

* The contract deployer can list new occasions with the following fields:
  - occasion name
  - occasion cost (note: this field is formatted in ETH when trying to list an occasion.)
  - number of tickets/seats for this occasion
  - occasion time
  - occasion date
  - occasion location

To list a contract, the contract itself has an onlyOwner modifier to finish the listing; as such the button UI to list an occasion will only display if the connected user account's address matches the contract owner's address. 

Beyond these features, the useLoadBlockchain custom React hook changes whenever the user connects to a different account. The hook also listens for two emitted events from the contract; whenever the contract owner lists a new occasion or whenever a new NFT is minted. In the case of the former, the newly created occasion is appended to the list of occasions; in the case of the latter, the contract balance is updated. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
  - [ ] Nested Feature

See the [open issues](https://github.com/richardjhong/tokenmaster/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Richard Hong - rhong24@gmail.com

Project Link: [https://github.com/richardjhong/tokenmaster](https://github.com/richardjhong/tokenmaster)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Code a Web 3.0 Ticketmaster Clone Step-By-Step with Solidity, Ethers.js, React & Hardhat](https://www.youtube.com/watch?v=_H9Qppf13GI&ab_channel=DappUniversity)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/richardjhong/tokenmaster.svg?style=for-the-badge
[contributors-url]: https://github.com/richardjhong/tokenmaster/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/richardjhong/tokenmaster.svg?style=for-the-badge
[forks-url]: https://github.com/richardjhong/tokenmaster/network/members
[stars-shield]: https://img.shields.io/github/stars/richardjhong/tokenmaster.svg?style=for-the-badge
[stars-url]: https://github.com/richardjhong/tokenmaster/stargazers
[issues-shield]: https://img.shields.io/github/issues/richardjhong/tokenmaster.svg?style=for-the-badge
[issues-url]: https://github.com/richardjhong/tokenmaster/issues
[license-shield]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: https://opensource.org/licenses/MIT
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: ./assets/event_page.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Ethereum]: https://img.shields.io/badge/ethereum-%23222222?style=for-the-badge&logo=ethereum
[Ethereum-url]: https://ethereum.org/en/
[Hardhat.js]: https://img.shields.io/badge/hardhat-js
[Hardhat-url]: https://hardhat.org/
[Metamask.js]: https://img.shields.io/badge/metamask-orange
[Metamask-url]: https://metamask.io/
[TypeScript.js]: https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tailwindcss]: https://img.shields.io/badge/tailwindcss-white?style=for-the-badge&logo=tailwindcss&logoColor=39BDF8&color=0B1120
[Tailwindcss-url]: https://tailwindcss.com/
[Viem.sh]: https://img.shields.io/badge/viem-sh?color=1E1E20
[Viem-url]: https://viem.sh/
[OpenZeppelin]: https://img.shields.io/badge/OpenZeppelin-white
[OpenZeppelin-url]: https://www.openzeppelin.com/
