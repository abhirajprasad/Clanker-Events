// Import ethers
const { ethers } = require('ethers');

// Set up the RPC URL and contract address
const rpcUrl = 'https://base-mainnet.g.alchemy.com/v2/NP7YFZmmhAO9Su3k4p9GFg0olJCLyAQE'; // Replace with your RPC URL
const contractAddress = '0x732560fa1d1A76350b1A500155BA978031B53833'; // Replace with your contract address

// Create a provider
const provider = new ethers.JsonRpcProvider(rpcUrl);

// Define the ABI of the contract (replace with your contract's ABI)
const contractABI = [
    // ... your contract's ABI ...
        {
            type: 'event',
            name: 'TokenCreated',
            inputs: [
                { type: 'address', name: 'tokenAddress', indexed: true },
                { type: 'uint256', name: 'positionId' },
                { type: 'address', name: 'deployer' },
                { type: 'uint256', name: 'fid' },
                { type: 'string', name: 'name' },
                { type: 'string', name: 'symbol' },
                { type: 'uint256', name: 'supply' },
                { type: 'address', name: 'lockerAddress' },
                { type: 'string', name: 'castHash' }
            ]
        }
];

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Function to get past events
async function getPastEvents() {
    try {
        // Get the latest block number
        const latestBlock = await provider.getBlockNumber();
        const fromBlock = Math.max(latestBlock - 500, 0); // Ensure fromBlock is not negative

        // Fetch events
        const events = await contract.queryFilter(
            contract.filters.TokenCreated(), // Replace with your event name
            fromBlock,
            latestBlock
        );

        //address tokenAddress, uint256 positionId, address deployer, uint256 fid, string name, string symbol, uint256 supply, address locke 

        // events.forEach(event => {
        //     if (event.args) { // Check if event.args is defined
        //         const { tokenAddress, deployer, symbol, supply } = event.args;
        //         console.log({ tokenAddress, deployer, symbol, supply });
        //     } else {
        //         console.warn('Event args are undefined:', event);
        //     }
        // });
        // Log only the required fields and call image() function
        for (const event of events) {
            if (event.args) { // Check if event.args is defined
                const { tokenAddress, deployer, symbol, supply } = event.args;

                // Create a new contract instance for the tokenAddress
                const tokenContract = new ethers.Contract(tokenAddress, [
                    // ABI for the image() function
                    "function image() view returns (string memory)"
                ], provider);

                // Call the image() function
                const imageUrl = await tokenContract.image();

                // Log the results
                console.log({ tokenAddress, deployer, symbol, supply, imageUrl });
            } else {
                console.warn('Event args are undefined:', event);
            }
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }

}

// Call the function to get past events
getPastEvents();