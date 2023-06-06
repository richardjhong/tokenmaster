// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
  address public owner;
  uint256 public totalOccasions;
  uint256 public totalSupply;

  struct Occasion {
    uint256 id;
    string name;
    uint256 cost;
    uint256 tickets;
    uint256 maxTickets;
    string date;
    string time;
    string location;
  }

  mapping(uint256 => Occasion) occasions;
  mapping(uint256 => mapping(address => bool)) public hasBought;
  mapping(uint256 => mapping(uint256 => address)) public seatTaken;
  mapping(uint256 => uint256[]) seatsTaken;

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    owner = msg.sender;
  }

  function list(
    string memory _name,
    uint256 _cost,
    uint256 _maxTickets,
    string memory _date,
    string memory _time,
    string memory _location
  ) public onlyOwner {
    totalOccasions++;
    occasions[totalOccasions] = Occasion(
      totalOccasions,
      _name,
      _cost,
      _maxTickets,
      _maxTickets,
      _date,
      _time,
      _location
    );
  }

  function getOccasion(uint256 _id) public view returns (Occasion memory) {
    return occasions[_id];
  }
}
