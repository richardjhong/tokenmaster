// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title A contract dealing with NFTs of unique seats mapped to unique occasions
/// @author Richard J. Hong
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
    require(msg.sender == owner, "Only the contract owner can call this");
    _;
  }

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    owner = msg.sender;
  }

  /// @notice list increments the totalOccasions and creates a new Occasion
  /// @dev only the deployer/contract owner can invoke listing an occasion
  /// @param _name - Name of occasion
  /// @param _cost - Cost of occasion
  /// @param _maxTickets - Maximum tickets of occasion
  /// @param _date - Date of occasion
  /// @param _time - Time of occasion
  /// @param _location - Location of occasion
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

  /// @notice mint uses ERC721 to safely mint a new token after going through validation and upkeep of storage variables
  /// @param _id - ID of the occasion being searched
  /// @param _seat - Seat that is being reserved
  function mint(uint256 _id, uint256 _seat) public payable {
    // Require that id is within valid range of totalOccasions
    require(_id != 0, "Invalid ticket id");
    require(_id <= totalOccasions, "Invalid ticket id, the searched occasion does not exist");

    // Require that the payment is enough
    require(msg.value >= occasions[_id].cost, "Payment is not enough to reserve seat");

    // Require that seat is not taken and that seat exists
    require(seatTaken[_id][_seat] == address(0), "This seat has already been taken");
    require(_seat <= occasions[_id].maxTickets, "This is not a valid seat number");

    occasions[_id].tickets--;
    hasBought[_id][msg.sender] = true;
    seatTaken[_id][_seat] = msg.sender;

    seatsTaken[_id].push(_seat);

    totalSupply++;
    _safeMint(msg.sender, totalSupply);
  }

  /// @notice getOccasion returns the occasion associated with the input _id
  /// @param _id - ID of the occasion to retrieve
  /// @return Occasion struct mapped to the input _id
  function getOccasion(uint256 _id) public view returns (Occasion memory) {
    return occasions[_id];
  }

  /// @notice getSeatsTaken returns the mapped array of seatsTaken associated with the input _id
  /// @param _id - ID of occasion to search associated seats with
  /// @return Array of seats
  function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
    return seatsTaken[_id];
  }

  /// @notice withdraw sends the funds the contracts currently holds to the contract owner
  /// @dev only the contract owner may invoke withdrawing of contract funds
  function withdraw() public onlyOwner {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Failed to send ETH");
  }
}
