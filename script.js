console.log("Ethers.js loaded:", typeof ethers !== "undefined");
// Contract ABI (simplified for this example)
const contractAddress = "0xc736b3D9c94a2dA0daF04De3bC510eAB5855C489";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_durationInDays",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundReceived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalRaised",
				"type": "uint256"
			}
		],
		"name": "GoalReached",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Refunded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "checkBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fundsWithdrawn",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_goal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amountRaised",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_contributorCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_goalReached",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "_fundsWithdrawn",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "goalReached",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalContributors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalRaised",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

// Contract address (update this after deployment)
let provider, signer, contract;
let isOwner = false;

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletStatus = document.getElementById('walletStatus');
const ownerStatus = document.getElementById('ownerStatus');
const contributeBtn = document.getElementById('contributeBtn');
const contributionAmount = document.getElementById('contributionAmount');
const yourContribution = document.getElementById('yourContribution');
const refundBtn = document.getElementById('refundBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const ownerActions = document.getElementById('owner-actions');

// Info display elements
const goalDisplay = document.getElementById('goal');
const raisedDisplay = document.getElementById('raised');
const contributorsDisplay = document.getElementById('contributors');
const deadlineDisplay = document.getElementById('deadline');
const statusDisplay = document.getElementById('status');
const timeLeftDisplay = document.getElementById('timeLeft');

// Connect wallet
connectWalletBtn.addEventListener('click', async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const address = await signer.getAddress();
            walletStatus.textContent = `Connected: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
            walletStatus.className = 'connected';
            console.log("Wallet connected");
            
            // Initialize contract
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            console.log("Contract instance: ", contract);

            // Verify provider and signer
            console.log("Provider:", provider);
            console.log("Signer address:", await signer.getAddress());
            
            // Check if user is owner
            console.log("Attempting to get owner...");
            const ownerAddress = await contract.owner();
            console.log("Owner address retrieved:", ownerAddress);
            isOwner = (address.toLowerCase() === ownerAddress.toLowerCase());
            
            
            console.log("Checking if owner");
            if (isOwner) {
                console.log("Owner");
                ownerStatus.textContent = "You are the owner of this campaign";
                ownerActions.style.display = 'block';
            } else {
                console.log("Not owner");
                ownerStatus.textContent = "";
                ownerActions.style.display = 'none';
            }
            
            console.log("Attempting to load campaign data");
            // Load campaign data
            loadCampaignData();
            setInterval(loadCampaignData, 10000); // Refresh every 10 seconds
            
        } catch (error) {
            console.error("Error connecting wallet:", error);
            walletStatus.textContent = "Error connecting wallet";
        }
    } else {
        walletStatus.textContent = "Please install MetaMask!";
    }
});

// Contribute function
contributeBtn.addEventListener('click', async () => {
    const amount = contributionAmount.value;
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    
    try {
        contributeBtn.disabled = true;
        contributeBtn.textContent = "Processing...";
        
        console.log("Attempting contribution...");
        const tx = await contract.contribute({
            value: ethers.utils.parseEther(amount)
        });
        console.log("Tx hash:", tx.hash);
        
        alert("Transaction sent! Waiting for confirmation...");
        const receipt = await tx.wait();
        console.log("Confirmed:", receipt);
        
        alert("Contribution successful!");
        loadCampaignData();
        
    } catch (error) {
        console.error("Contribution error:", error);
        alert(`Failed: ${error.message}`);
    } finally {
        contributeBtn.disabled = false;
        contributeBtn.textContent = "Contribute";
        contributionAmount.value = "";
    }
});

// Refund function
refundBtn.addEventListener('click', async () => {
    try {
        refundBtn.disabled = true;
        refundBtn.textContent = "Processing...";
        
        const tx = await contract.refund();
        await tx.wait();
        alert("Refund successful!");
        refundBtn.disabled = true;
        loadCampaignData();
        
    } catch (error) {
        console.error("Refund error:", error);
        alert(`Refund failed: ${error.message}`);
    } finally {
        refundBtn.disabled = false;
        refundBtn.textContent = "Request Refund";
    }
});

// Withdraw function (owner only)
withdrawBtn.addEventListener('click', async () => {
    try {
        withdrawBtn.disabled = true;
        withdrawBtn.textContent = "Processing...";
        
        console.log("Attempting withdraw");
        const tx = await contract.withdraw( { gasLimit: 300000 } );
        await tx.wait();
        alert("Withdrawal successful!");
        loadCampaignData();
        
    } catch (error) {
        console.error("Withdrawal error:", error);
        console.error("Revert reason:", error.reason || error.message);
        alert(`Withdrawal failed: ${error.message}`);
    } finally {
        withdrawBtn.disabled = false;
        withdrawBtn.textContent = "Withdraw Funds";
    }
});

// Load campaign data
async function loadCampaignData() {
    if (!contract) {
        console.log("No contract found");
        return;
    }
    
    try {
        const details = await contract.getDetails();
        const [goal, deadline, amountRaised, contributorCount, goalReached, fundsWithdrawn] = details;
        console.log("Raw details from contract: ", details);
        
        // Convert from Wei to Ether
        const goalEth = ethers.utils.formatEther(goal);
        // const goalEth = goal;
        const raisedEth = ethers.utils.formatEther(amountRaised);
        
        // Update displays
        goalDisplay.textContent = goalEth;
        raisedDisplay.textContent = raisedEth;
        contributorsDisplay.textContent = contributorCount;
        
        // Format deadline
        const deadlineDate = new Date(deadline * 1000);
        deadlineDisplay.textContent = deadlineDate.toLocaleString();
        
        // Calculate time left
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = deadline - now;
        
        if (timeLeft <= 0) {
            timeLeftDisplay.textContent = "Campaign ended";
            statusDisplay.textContent = fundsWithdrawn ? "Funds withdrawn" : 
                                    goalReached ? "Goal reached" : "Goal not reached";
        } else {
            const days = Math.floor(timeLeft / (60 * 60 * 24));
            const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
            timeLeftDisplay.textContent = `${days}d ${hours}h`;
            statusDisplay.textContent = goalReached ? "Goal reached" : "In progress";
        }
        
        // Check if user can refund
        console.log("Goal reached:", !goalReached);
        if (!goalReached) {
            console.log("Attempting to get signer address");
            const userAddress = await signer.getAddress();
            console.log("Successfully obtained signer address");
            console.log("Attempting to get user contribution");
            const userContribution = await contract.contributions(userAddress);
            console.log("User contribution obtained successfully: ", userContribution);
            
            if (userContribution > 0) {
                refundBtn.disabled = false;
            }
        }
        
        // Check if owner can withdraw
        // console.log("Is owner:", isOwner, ", goalReached:", goalReached, " fundsWithdrawn:", fundsWithdrawn);
        if (isOwner && goalReached && !fundsWithdrawn) {
            withdrawBtn.disabled = false;
        }
        
        // Update user's contribution
        if (signer) {
            const userAddress = await signer.getAddress();
            const contribution = await contract.contributions(userAddress);
            yourContribution.textContent = ethers.utils.formatEther(contribution);
        }
        
    } catch (error) {
        console.error("Error loading campaign data:", error);
    }
}