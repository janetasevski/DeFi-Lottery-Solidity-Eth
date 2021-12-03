// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
  address public manager;
  address [] public players;

  constructor() {
    manager = msg.sender;
  }

  modifier onlyManager {
    require(msg.sender == manager);
    _;
  }

  function getBalance() public view returns(uint) {
    return address(this).balance;
  }

  function enter() public payable returns(bool) {
    require(msg.value == 1 ether);
    require(msg.sender != manager);
    players.push(msg.sender);
    return true;
  }

  function random() public view returns(uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
  }

  function pickWinner() public payable onlyManager {
    address payable winner;
    uint randomIndex = random() % players.length;
    winner = payable(players[randomIndex]);
    winner.transfer(getBalance());
    players = new address[](0); //reset lotary
  }

  function returnEntries() public returns(bool) {
    for (uint i = 0; i < players.length; i++) { 
      if(msg.sender == players[i]) {
        payable(players[i]).transfer(1 ether);
      }
    }
    return true;
  }
  
  function stopLottary() public onlyManager {
    for (uint i = 0; i < players.length; i++) { 
      payable(players[i]).transfer(1 ether);
    }
    players = new address[](0); //reset lotary
  }

  function getPlayers() public view returns (address[] memory) {
    return players;
  }
  
}
