# Tokenized Crowdfunding

<p align="center">
<img src="https://i.imgur.com/VWpADVD.png"/>
</p>

A website that allows users to contribute to a decentralized crowdfund. Shows details about the crowdfund goal, amount that has been raised, number of contributors, deadline, completion status, and time remaining until the deadline.

The owner of the crowdfund can:
- Contribute to the crowdfund
- Withdraw donated funds

Donors can:
- Contribute to the crowdfund
- Request a refund (if the deadline is reached and not enough funds were raised)

## Setup Instructions

These instructions assume the user already has Ganache & MetaMask accounts set up on their respective device/browser, and that the Solidity contract is already in Remix IDE.

1. Compile the smart contract in Remix. Make sure the EVM version is set to Istanbul.
2. With a Ganache workspace running & an account connected to MetaMask, change the Remix deployment environment to a custom external HTTP provider. Set the endpoint to match the RPC server IP in ganache (`127.0.0.1:7545` by default).
3. Set up a custom network in MetaMask with the same RPC URL. The chain ID will be `1337`, Ganache's default chain ID, and the currency symbol will be `ETH`. Connect to the custom network.
4. Deploy the smart contract with the desired input parameters for *goal* and *duration* (time until deadline). Change the `contractAddress` variable in `script.js` to the address of the deployed contract.
5. In the terminal, set up a local HTTP server using the command `python -m http.server`.
6. Navigate to `localhost:8000` in your browser. The website should be up and running.
