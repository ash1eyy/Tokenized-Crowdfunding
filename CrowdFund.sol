// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goal;
    uint public deadline;
    uint public totalRaised;
    uint public totalContributors;
    bool public goalReached;
    bool public fundsWithdrawn;
    
    mapping(address => uint) public contributions;
    
    event FundReceived(address contributor, uint amount);
    event GoalReached(uint totalRaised);
    event Refunded(address contributor, uint amount);
    event FundsWithdrawn(uint amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier campaignActive() {
        require(block.timestamp < deadline, "Campaign has ended");
        _;
    }
    
    modifier campaignEnded() {
        require(block.timestamp >= deadline, "Campaign is still active");
        _;
    }
    
    modifier goalNotReached() {
        require(!goalReached, "Goal has been reached");
        _;
    }
    
    constructor(uint _goal, uint _durationInDays) {
        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }
    
    function contribute() external payable campaignActive {
        require(msg.value > 0, "Contribution must be greater than 0");
        
        if (contributions[msg.sender] == 0) {
            totalContributors++;
        }
        
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        
        if (totalRaised >= goal && !goalReached) {
            goalReached = true;
            emit GoalReached(totalRaised);
        }
        
        emit FundReceived(msg.sender, msg.value);
    }
    
    function checkBalance() external view returns (uint) {
        return totalRaised;
    }
    
    function withdraw() external onlyOwner {
        require(goalReached, "Goal not reached");
        require(!fundsWithdrawn, "Funds already withdrawn");
        
        fundsWithdrawn = true;
        payable(owner).transfer(totalRaised);
        
        emit FundsWithdrawn(totalRaised);
    }
    
    function refund() external campaignEnded goalNotReached {
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contribution to refund");
        
        totalRaised -= amount;
        contributions[msg.sender] = 0;
        totalContributors--;
        payable(msg.sender).transfer(amount);
        
        emit Refunded(msg.sender, amount);
    }
    
    function getDetails() external view returns (
        uint _goal,
        uint _deadline,
        uint _amountRaised,
        uint _contributorCount,
        bool _goalReached,
        bool _fundsWithdrawn
    ) {
        return (
            goal,
            deadline,
            totalRaised,
            totalContributors,
            goalReached,
            fundsWithdrawn
        );
    }
}