// LendBit Zero Web3 Application
let provider, signer, contract;
let userAddress = '';
let isConnected = false;

// Contract Configuration
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const CONTRACT_ABI = [
    'function tokenizeAsset(uint256 _assetType, uint256 _estimatedValue, string _description, string _location, string _metadataURI) returns (uint256)',
    'function verifyAsset(uint256 _tokenId, bool _approved, string _reason)',
    'function createLoanRequest(uint256 _collateralTokenId, uint256 _requestedAmount, uint256 _interestRate, uint256 _durationDays, string _purpose) returns (uint256)',
    'function fundLoan(uint256 _requestId) payable',
    'function repayLoan(uint256 _loanId) payable',
    'function calculateTotalOwed(uint256 _loanId) view returns (uint256)',
    'function getAsset(uint256 _tokenId) view returns (tuple(uint256 tokenId, uint256 assetType, address owner, uint256 currentValue, string metadataURI, string description, string location, bool isVerified, bool isLocked, uint256 approvalStatus, uint256 createdAt))',
    'function getLoanRequest(uint256 _requestId) view returns (tuple(uint256 requestId, address borrower, uint256 collateralTokenId, uint256 requestedAmount, uint256 interestRate, uint256 durationDays, string purpose, uint256 status, uint256 createdAt))',
    'function getUserAssets(address _user) view returns (uint256[])',
    'function getProtocolStats() view returns (uint256, uint256, uint256, uint256, uint256)',
    'function nextRequestId() view returns (uint256)',
    'event AssetTokenized(uint256 indexed tokenId, address indexed owner, uint256 assetType, uint256 value, string location)',
    'event LoanRequested(uint256 indexed requestId, address indexed borrower, uint256 indexed collateralTokenId, uint256 amount, uint256 interestRate)',
    'event LoanFunded(uint256 indexed loanId, uint256 indexed requestId, address indexed lender, uint256 amount)'
];

const ASSET_TYPES = {
    0: { name: 'Real Estate', icon: '🏠', color: 'bg-blue-500' },
    1: { name: 'Corporate Bond', icon: '💼', color: 'bg-green-500' },
    2: { name: 'Invoice', icon: '📄', color: 'bg-purple-500' },
    3: { name: 'Commodity', icon: '🥇', color: 'bg-yellow-500' }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkConnection();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
    document.getElementById('connect-wallet-main').addEventListener('click', connectWallet);
    document.getElementById('tokenize-btn').addEventListener('click', tokenizeAsset);
    document.getElementById('request-loan-btn').addEventListener('click', createLoanRequest);
    document.getElementById('get-request-info').addEventListener('click', getRequestInfo);
    document.getElementById('fund-loan-btn').addEventListener('click', fundLoan);
}

// Check if already connected
async function checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.log('Not connected');
        }
    }
}

// Connect wallet
async function connectWallet() {
    try {
        if (!window.ethereum) {
            showMessage('MetaMask not found! Please install MetaMask.', 'error');
            return;
        }

        showMessage('Connecting wallet...', 'info');
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        isConnected = true;
        updateUI();
        
        showMessage('Wallet connected successfully! 🎉', 'success');
        await loadProtocolData();
        
    } catch (error) {
        console.error('Connection error:', error);
        showMessage(`Connection failed: ${error.message}`, 'error');
    }
}

// Update UI based on connection status
function updateUI() {
    if (isConnected) {
        // Show connected state
        document.getElementById('wallet-section').innerHTML = `
            <div class="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                <p class="text-green-300 text-sm font-medium flex items-center">
                    <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}
                </p>
            </div>
        `;
        
        // Show main interface
        document.getElementById('connect-prompt').classList.add('hidden');
        document.getElementById('protocol-stats').classList.remove('hidden');
        document.getElementById('main-actions').classList.remove('hidden');
        document.getElementById('user-assets-section').classList.remove('hidden');
        
    } else {
        // Show disconnected state
        document.getElementById('connect-prompt').classList.remove('hidden');
        document.getElementById('protocol-stats').classList.add('hidden');
        document.getElementById('main-actions').classList.add('hidden');
        document.getElementById('user-assets-section').classList.add('hidden');
    }
}

// Load protocol data
async function loadProtocolData() {
    try {
        // Load protocol stats
        const stats = await contract.getProtocolStats();
        
        document.getElementById('stat-tvl').textContent = `${ethers.utils.formatEther(stats[0])} ETH`;
        document.getElementById('stat-assets').textContent = stats[3].toString();
        document.getElementById('stat-loans').textContent = stats[4].toString();
        document.getElementById('stat-fees').textContent = `${ethers.utils.formatEther(stats[2])} ETH`;
        
        // Load user assets
        await loadUserAssets();
        
    } catch (error) {
        console.error('Error loading protocol data:', error);
        showMessage('Failed to load protocol data', 'error');
    }
}

// Load user assets
async function loadUserAssets() {
    try {
        const assetIds = await contract.getUserAssets(userAddress);
        const assets = [];
        
        for (const id of assetIds) {
            try {
                const asset = await contract.getAsset(id);
                assets.push({
                    tokenId: asset.tokenId.toNumber(),
                    assetType: asset.assetType.toNumber(),
                    owner: asset.owner,
                    currentValue: asset.currentValue,
                    description: asset.description,
                    location: asset.location,
                    isVerified: asset.isVerified,
                    isLocked: asset.isLocked,
                    approvalStatus: asset.approvalStatus.toNumber()
                });
            } catch (err) {
                console.log(`Could not load asset ${id}:`, err);
            }
        }
        
        displayUserAssets(assets);
        
    } catch (error) {
        console.error('Error loading user assets:', error);
    }
}

// Display user assets
function displayUserAssets(assets) {
    const grid = document.getElementById('user-assets-grid');
    const countElement = document.getElementById('asset-count');
    
    countElement.textContent = assets.length;
    
    if (assets.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                </div>
                <p class="text-gray-400">No assets tokenized yet</p>
                <p class="text-gray-500 text-sm mt-2">Start by tokenizing your first real-world asset</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = assets.map(asset => {
        const assetType = ASSET_TYPES[asset.assetType];
        const statusBadges = [];
        
        if (asset.isVerified) {
            statusBadges.push('<span class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">✓ Verified</span>');
        } else {
            statusBadges.push('<span class="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">⏳ Pending</span>');
        }
        
        if (asset.isLocked) {
            statusBadges.push('<span class="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">🔒 Locked</span>');
        }
        
        return `
            <div class="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-12 h-12 ${assetType.color} rounded-lg flex items-center justify-center">
                        <span class="text-xl">${assetType.icon}</span>
                    </div>
                    <div class="flex flex-wrap gap-1">
                        ${statusBadges.join('')}
                    </div>
                </div>
                
                <h3 class="font-semibold text-white mb-1">
                    ${assetType.name} #${asset.tokenId}
                </h3>
                <p class="text-gray-300 text-sm mb-2">${asset.description}</p>
                <p class="text-gray-400 text-xs mb-3">📍 ${asset.location}</p>
                
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-white">
                        ${ethers.utils.formatEther(asset.currentValue)} ETH
                    </span>
                    <button onclick="verifyAsset(${asset.tokenId})" 
                            class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-all">
                        Verify
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Tokenize asset
async function tokenizeAsset() {
    if (!contract) {
        showMessage('Please connect your wallet first!', 'error');
        return;
    }
    
    try {
        const assetType = document.getElementById('asset-type').value;
        const assetValue = document.getElementById('asset-value').value;
        const description = document.getElementById('asset-description').value;
        const location = document.getElementById('asset-location').value;
        
        if (!assetValue || !description || !location) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        showMessage('Tokenizing asset... Please confirm transaction', 'info');
        
        const tx = await contract.tokenizeAsset(
            parseInt(assetType),
            ethers.utils.parseEther(assetValue),
            description,
            location,
            'ipfs://QmExample'
        );
        
        showMessage('Transaction submitted... Waiting for confirmation', 'info');
        const receipt = await tx.wait();
        
        // Extract token ID from event
        const event = receipt.events.find(e => e.event === 'AssetTokenized');
        const tokenId = event.args.tokenId.toString();
        
        showMessage(`Asset tokenized successfully! Token ID: ${tokenId} 🎉`, 'success');
        
        // Clear form
        document.getElementById('asset-value').value = '';
        document.getElementById('asset-description').value = '';
        document.getElementById('asset-location').value = '';
        
        // Reload data
        await loadProtocolData();
        
    } catch (error) {
        console.error('Tokenization error:', error);
        showMessage(`Tokenization failed: ${error.message}`, 'error');
    }
}

// Create loan request
async function createLoanRequest() {
    if (!contract) {
        showMessage('Please connect your wallet first!', 'error');
        return;
    }
    
    try {
        const collateralId = document.getElementById('collateral-id').value;
        const loanAmount = document.getElementById('loan-amount').value;
        const interestRate = document.getElementById('interest-rate').value;
        const duration = document.getElementById('duration').value;
        const purpose = document.getElementById('loan-purpose').value;
        
        if (!collateralId || !loanAmount || !interestRate || !duration) {
            showMessage('Please fill in all required fields', 'error');
            return;
        }
        
        showMessage('Creating loan request... Please confirm transaction', 'info');
        
        const tx = await contract.createLoanRequest(
            parseInt(collateralId),
            ethers.utils.parseEther(loanAmount),
            Math.floor(parseFloat(interestRate) * 100), // Convert to basis points
            parseInt(duration),
            purpose || 'General purpose'
        );
        
        showMessage('Transaction submitted... Waiting for confirmation', 'info');
        const receipt = await tx.wait();
        
        const event = receipt.events.find(e => e.event === 'LoanRequested');
        const requestId = event.args.requestId.toString();
        
        showMessage(`Loan request created successfully! Request ID: ${requestId} 🎉`, 'success');
        
        // Clear form
        document.getElementById('collateral-id').value = '';
        document.getElementById('loan-amount').value = '';
        document.getElementById('interest-rate').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('loan-purpose').value = '';
        
        await loadProtocolData();
        
    } catch (error) {
        console.error('Loan request error:', error);
        showMessage(`Loan request failed: ${error.message}`, 'error');
    }
}

// Get request info
async function getRequestInfo() {
    if (!contract) {
        showMessage('Please connect your wallet first!', 'error');
        return;
    }
    
    try {
        const requestId = document.getElementById('fund-request-id').value;
        
        if (!requestId) {
            showMessage('Please enter a request ID', 'error');
            return;
        }
        
        const request = await contract.getLoanRequest(parseInt(requestId));
        const asset = await contract.getAsset(request.collateralTokenId);
        
        const infoDiv = document.getElementById('request-info');
        const assetType = ASSET_TYPES[asset.assetType.toNumber()];
        
        infoDiv.innerHTML = `
            <div class="space-y-3">
                <h4 class="font-semibold text-white">Loan Request #${requestId}</h4>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-400">Borrower:</span>
                        <p class="text-white font-mono">${request.borrower.slice(0, 8)}...</p>
                    </div>
                    <div>
                        <span class="text-gray-400">Amount:</span>
                        <p class="text-white font-bold">${ethers.utils.formatEther(request.requestedAmount)} ETH</p>
                    </div>
                    <div>
                        <span class="text-gray-400">Interest Rate:</span>
                        <p class="text-white">${request.interestRate / 100}% annual</p>
                    </div>
                    <div>
                        <span class="text-gray-400">Duration:</span>
                        <p class="text-white">${request.durationDays} days</p>
                    </div>
                </div>
                
                <div class="border-t border-white/10 pt-3">
                    <span class="text-gray-400">Collateral:</span>
                    <div class="flex items-center mt-1">
                        <span class="text-lg mr-2">${assetType.icon}</span>
                        <div>
                            <p class="text-white font-medium">${assetType.name} #${asset.tokenId}</p>
                            <p class="text-gray-300 text-sm">${ethers.utils.formatEther(asset.currentValue)} ETH value</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-blue-500/10 p-3 rounded border border-blue-500/20">
                    <p class="text-blue-300 font-medium">Purpose:</p>
                    <p class="text-blue-100 text-sm">${request.purpose}</p>
                </div>
            </div>
        `;
        
        infoDiv.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error getting request info:', error);
        showMessage('Failed to load request information', 'error');
    }
}

// Fund loan
async function fundLoan() {
    if (!contract) {
        showMessage('Please connect your wallet first!', 'error');
        return;
    }
    
    try {
        const requestId = document.getElementById('fund-request-id').value;
        
        if (!requestId) {
            showMessage('Please enter a request ID', 'error');
            return;
        }
        
        // Get request details first
        const request = await contract.getLoanRequest(parseInt(requestId));
        const amount = request.requestedAmount;
        
        showMessage('Funding loan... Please confirm transaction', 'info');
        
        const tx = await contract.fundLoan(parseInt(requestId), { value: amount });
        
        showMessage('Transaction submitted... Waiting for confirmation', 'info');
        const receipt = await tx.wait();
        
        const event = receipt.events.find(e => e.event === 'LoanFunded');
        const loanId = event.args.loanId.toString();
        
        showMessage(`Loan funded successfully! Loan ID: ${loanId} 🎉`, 'success');
        
        // Clear form
        document.getElementById('fund-request-id').value = '';
        document.getElementById('request-info').classList.add('hidden');
        
        await loadProtocolData();
        
    } catch (error) {
        console.error('Funding error:', error);
        showMessage(`Funding failed: ${error.message}`, 'error');
    }
}

// Verify asset (admin function)
async function verifyAsset(tokenId) {
    if (!contract) {
        showMessage('Please connect your wallet first!', 'error');
        return;
    }
    
    try {
        showMessage(`Verifying asset #${tokenId}... Please confirm transaction`, 'info');
        
        const tx = await contract.verifyAsset(tokenId, true, '');
        
        showMessage('Transaction submitted... Waiting for confirmation', 'info');
        await tx.wait();
        
        showMessage(`Asset #${tokenId} verified successfully! ✅`, 'success');
        
        await loadProtocolData();
        
    } catch (error) {
        console.error('Verification error:', error);
        showMessage(`Verification failed: ${error.message}`, 'error');
    }
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('status-message');
    
    let bgColor, textColor, borderColor;
    
    switch (type) {
        case 'success':
            bgColor = 'bg-green-500/10';
            textColor = 'text-green-300';
            borderColor = 'border-green-500/30';
            break;
        case 'error':
            bgColor = 'bg-red-500/10';
            textColor = 'text-red-300';
            borderColor = 'border-red-500/30';
            break;
        case 'info':
            bgColor = 'bg-blue-500/10';
            textColor = 'text-blue-300';
            borderColor = 'border-blue-500/30';
            break;
        default:
            bgColor = 'bg-gray-500/10';
            textColor = 'text-gray-300';
            borderColor = 'border-gray-500/30';
    }
    
    messageDiv.innerHTML = `
        <div class="${bgColor} ${textColor} ${borderColor} p-4 rounded-lg border backdrop-blur-md">
            <p class="font-medium">${message}</p>
        </div>
    `;
    
    messageDiv.classList.remove('hidden');
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    } else if (type === 'info') {
        // Auto-hide info messages after 10 seconds
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 10000);
    }
}