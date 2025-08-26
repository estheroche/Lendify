// LendBitZero MVP Frontend JavaScript

let provider, signer, contract;
let userAddress;

// Contract ABI for LendBitZeroFixed
const CONTRACT_ABI = [
    "function tokenizeAsset(uint256 _assetType, uint256 _estimatedValue, string _description, string _location, string _metadataURI) returns (uint256)",
    "function verifyAsset(uint256 _tokenId, bool _approved, string _reason)",
    "function createLoanRequest(uint256 _collateralTokenId, uint256 _requestedAmount, uint256 _interestRate, uint256 _durationDays, string _purpose) returns (uint256)",
    "function fundLoan(uint256 _requestId) payable",
    "function repayLoan(uint256 _loanId) payable",
    "function calculateTotalOwed(uint256 _loanId) view returns (uint256)",
    "function calculateHealthFactor(uint256 _loanId) view returns (uint256)",
    "function isLiquidatable(uint256 _loanId) view returns (bool)",
    "function liquidateLoan(uint256 _loanId)",
    "function updateAssetPrice(uint256 _tokenId, uint256 _newPrice)",
    "function getAsset(uint256 _tokenId) view returns (tuple(uint256 tokenId, uint256 assetType, address owner, uint256 currentValue, string metadataURI, string description, string location, bool isVerified, bool isLocked, uint256 approvalStatus, uint256 createdAt))",
    "function getLoan(uint256 _loanId) view returns (tuple(uint256 loanId, address borrower, address lender, uint256 collateralTokenId, uint256 requestedAmount, uint256 fundedAmount, uint256 interestRate, uint256 durationDays, uint256 createdAt, uint256 fundedAt, uint256 dueDate, uint256 status, uint256 totalRepaid, uint256 lastPaymentDate))",
    "function getLoanRequest(uint256 _requestId) view returns (tuple(uint256 requestId, address borrower, uint256 collateralTokenId, uint256 requestedAmount, uint256 interestRate, uint256 durationDays, string purpose, uint256 status, uint256 createdAt))",
    "function getUserAssets(address _user) view returns (uint256[])",
    "function getUserLoans(address _user) view returns (uint256[])",
    "function getProtocolStats() view returns (uint256, uint256, uint256, uint256, uint256)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function nextTokenId() view returns (uint256)",
    "function nextLoanId() view returns (uint256)",
    "function nextRequestId() view returns (uint256)",
    "function owner() view returns (address)",
    "event AssetTokenized(uint256 indexed tokenId, address indexed owner, uint256 assetType, uint256 value, string location)",
    "event AssetApproved(uint256 indexed tokenId, address indexed verifier)",
    "event AssetRejected(uint256 indexed tokenId, address indexed verifier, string reason)",
    "event LoanRequested(uint256 indexed requestId, address indexed borrower, uint256 indexed collateralTokenId, uint256 amount, uint256 interestRate)",
    "event LoanFunded(uint256 indexed loanId, uint256 indexed requestId, address indexed lender, uint256 amount)",
    "event LoanRepayment(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 remaining)",
    "event LoanLiquidated(uint256 indexed loanId, address indexed liquidator, uint256 collateralValue)",
    "event PriceUpdated(uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice)"
];

// Deployed contract address from local deployment
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // LendBitZeroFixed deployed locally

// Asset type mapping
const ASSET_TYPES = {
    0: "Real Estate",
    1: "Bond", 
    2: "Invoice",
    3: "Commodity"
};

const LOAN_STATUS = {
    0: "Requested",
    1: "Active", 
    2: "Repaid",
    3: "Liquidated"
};

// Initialize the app
async function init() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        setupEventListeners();
        showMessage("Wallet detected! Click 'Connect Wallet' to start.", "info");
    } else {
        showMessage("Please install MetaMask to use this demo!", "error");
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('connect-wallet').onclick = connectWallet;
    document.getElementById('tokenize-btn').onclick = tokenizeAsset;
    document.getElementById('loan-request-btn').onclick = createLoanRequest;
    document.getElementById('fund-loan-btn').onclick = fundLoan;
    document.getElementById('repay-loan-btn').onclick = repayLoan;
    document.getElementById('calculate-owed-btn').onclick = calculateOwed;
    document.getElementById('verify-asset-btn').onclick = verifyAsset;
    document.getElementById('update-price-btn').onclick = updatePrice;
    document.getElementById('refresh-data-btn').onclick = refreshUserData;
    
    // Demo simulation buttons
    document.getElementById('demo-real-estate').onclick = () => runDemoSimulation(1);
    document.getElementById('demo-bond').onclick = () => runDemoSimulation(2);
    document.getElementById('demo-invoice').onclick = () => runDemoSimulation(3);
    document.getElementById('demo-liquidation').onclick = () => runDemoSimulation(4);
    document.getElementById('demo-portfolio').onclick = () => runDemoSimulation(5);
}

// Connect wallet
async function connectWallet() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        document.getElementById('wallet-address').textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        document.getElementById('connect-wallet').textContent = "Connected ✅";
        document.getElementById('connect-wallet').disabled = true;
        
        showMessage("Wallet connected successfully! 🎉", "success");
        
        // Auto-refresh user data
        setTimeout(refreshUserData, 1000);
        
    } catch (error) {
        showMessage(`Connection failed: ${error.message}`, "error");
    }
}

// Tokenize asset
async function tokenizeAsset() {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    try {
        const assetType = document.getElementById('asset-type').value;
        const assetValue = ethers.utils.parseEther(document.getElementById('asset-value').value || "0");
        const description = document.getElementById('asset-description').value || "Asset description";
        const location = document.getElementById('asset-location').value || "Location";
        const metadataURI = document.getElementById('metadata-uri').value || "ipfs://QmExample";
        
        showMessage("Tokenizing asset... Please confirm transaction", "info");
        
        const tx = await contract.tokenizeAsset(assetType, assetValue, description, location, metadataURI);
        const receipt = await tx.wait();
        
        // Extract token ID from event
        const event = receipt.events.find(e => e.event === 'AssetTokenized');
        const tokenId = event.args.tokenId.toString();
        
        showMessage(`Asset tokenized successfully! Token ID: ${tokenId}`, "success");
        refreshUserData();
        
    } catch (error) {
        showMessage(`Tokenization failed: ${error.message}`, "error");
    }
}

// Create loan request
async function createLoanRequest() {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    try {
        const collateralId = document.getElementById('collateral-id').value;
        const loanAmount = ethers.utils.parseEther(document.getElementById('loan-amount').value || "0");
        const interestRate = Math.floor(parseFloat(document.getElementById('interest-rate').value || "0") * 100); // Convert to basis points
        const duration = document.getElementById('duration').value || "365";
        
        showMessage("Creating loan request... Please confirm transaction", "info");
        
        const tx = await contract.createLoanRequest(collateralId, loanAmount, interestRate, duration);
        const receipt = await tx.wait();
        
        const event = receipt.events.find(e => e.event === 'LoanRequested');
        const loanId = event.args.loanId.toString();
        
        showMessage(`Loan request created! Loan ID: ${loanId}`, "success");
        refreshUserData();
        
    } catch (error) {
        showMessage(`Loan request failed: ${error.message}`, "error");
    }
}

// Fund loan
async function fundLoan() {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    try {
        const loanId = document.getElementById('fund-loan-id').value;
        const fundAmount = ethers.utils.parseEther(document.getElementById('fund-amount').value || "0");
        
        showMessage("Funding loan... Please confirm transaction", "info");
        
        const tx = await contract.fundLoan(loanId, { value: fundAmount });
        await tx.wait();
        
        showMessage(`Loan funded successfully! 🎉`, "success");
        refreshUserData();
        
    } catch (error) {
        showMessage(`Loan funding failed: ${error.message}`, "error");
    }
}

// Calculate amount owed
async function calculateOwed() {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    try {
        const loanId = document.getElementById('repay-loan-id').value;
        const amountOwed = await contract.calculateTotalOwed(loanId);
        
        const amountEth = ethers.utils.formatEther(amountOwed);
        document.getElementById('amount-owed').innerHTML = `
            <div class="status info" style="margin-top: 10px;">
                <strong>Amount Owed:</strong> ${amountEth} ETH
            </div>
        `;
        
    } catch (error) {
        showMessage(`Calculation failed: ${error.message}`, "error");
    }
}

// Repay loan
async function repayLoan() {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    try {
        const loanId = document.getElementById('repay-loan-id').value;
        const amountOwed = await contract.calculateTotalOwed(loanId);
        
        showMessage("Repaying loan... Please confirm transaction", "info");
        
        const tx = await contract.repayLoan(loanId, { value: amountOwed });
        await tx.wait();
        
        showMessage(`Loan repaid successfully! 🎉`, "success");
        refreshUserData();
        
    } catch (error) {
        showMessage(`Loan repayment failed: ${error.message}`, "error");
    }
}

// Verify asset (admin function)
async function verifyAsset() {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    try {
        const tokenId = document.getElementById('verify-token-id').value;
        
        showMessage("Verifying asset... Please confirm transaction", "info");
        
        const tx = await contract.verifyAsset(tokenId);
        await tx.wait();
        
        showMessage(`Asset verified successfully! ✅`, "success");
        refreshUserData();
        
    } catch (error) {
        showMessage(`Asset verification failed: ${error.message}`, "error");
    }
}

// Update asset price (admin function)
async function updatePrice() {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    try {
        const tokenId = document.getElementById('price-token-id').value;
        const newPrice = ethers.utils.parseEther(document.getElementById('new-price').value || "0");
        
        showMessage("Updating price... Please confirm transaction", "info");
        
        const tx = await contract.updateAssetPrice(tokenId, newPrice);
        await tx.wait();
        
        showMessage(`Price updated successfully! 📊`, "success");
        refreshUserData();
        
    } catch (error) {
        showMessage(`Price update failed: ${error.message}`, "error");
    }
}

// Refresh user data
async function refreshUserData() {
    if (!contract || !userAddress) return;
    
    try {
        // Get next token/loan IDs to know how many to check
        const nextTokenId = await contract.nextTokenId();
        const nextLoanId = await contract.nextLoanId();
        
        // Get user assets
        const assetsHtml = [];
        for (let i = 1; i < nextTokenId; i++) {
            try {
                const owner = await contract.ownerOf(i);
                if (owner.toLowerCase() === userAddress.toLowerCase()) {
                    const asset = await contract.getAsset(i);
                    assetsHtml.push(`
                        <div class="asset-card">
                            <h4>🏠 ${ASSET_TYPES[asset.assetType]} #${asset.tokenId}</h4>
                            <p><strong>Value:</strong> ${ethers.utils.formatEther(asset.currentValue)} ETH</p>
                            <p><strong>Status:</strong> 
                                <span class="asset-status ${asset.isVerified ? 'verified' : 'unverified'}">
                                    ${asset.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                                ${asset.isLocked ? '<span class="asset-status locked">Locked</span>' : ''}
                            </p>
                            <p><strong>Metadata:</strong> ${asset.metadataURI}</p>
                        </div>
                    `);
                }
            } catch (e) {
                // Token might not exist or be burned
                continue;
            }
        }
        
        document.getElementById('my-assets').innerHTML = 
            assetsHtml.length > 0 ? assetsHtml.join('') : '<p>No assets found</p>';
        
        // Get user loans
        const loansHtml = [];
        for (let i = 1; i < nextLoanId; i++) {
            try {
                const loan = await contract.getLoan(i);
                if (loan.borrower.toLowerCase() === userAddress.toLowerCase() || 
                    loan.lender.toLowerCase() === userAddress.toLowerCase()) {
                    
                    const role = loan.borrower.toLowerCase() === userAddress.toLowerCase() ? 'Borrower' : 'Lender';
                    const statusClass = LOAN_STATUS[loan.status].toLowerCase();
                    
                    loansHtml.push(`
                        <div class="loan-card">
                            <h4>💰 Loan #${loan.loanId} (${role})</h4>
                            <p><strong>Amount:</strong> ${ethers.utils.formatEther(loan.principalAmount)} ETH</p>
                            <p><strong>Interest:</strong> ${loan.interestRate / 100}%</p>
                            <p><strong>Duration:</strong> ${loan.duration} days</p>
                            <p><strong>Collateral:</strong> Token #${loan.collateralTokenId}</p>
                            <p><strong>Status:</strong> 
                                <span class="loan-status ${statusClass}">${LOAN_STATUS[loan.status]}</span>
                            </p>
                        </div>
                    `);
                }
            } catch (e) {
                // Loan might not exist
                continue;
            }
        }
        
        document.getElementById('my-loans').innerHTML = 
            loansHtml.length > 0 ? loansHtml.join('') : '<p>No loans found</p>';
            
        showMessage("Data refreshed! 🔄", "success");
        
    } catch (error) {
        showMessage(`Refresh failed: ${error.message}`, "error");
    }
}

// Demo simulations
async function runDemoSimulation(simNumber) {
    if (!contract) {
        showMessage("Please connect your wallet first!", "error");
        return;
    }
    
    const demoOutput = document.getElementById('demo-output');
    const demoLog = document.getElementById('demo-log');
    demoOutput.classList.remove('hidden');
    
    let logHtml = `<h4>🎯 Running Simulation ${simNumber}...</h4>`;
    
    try {
        switch(simNumber) {
            case 1: // Real Estate Loan
                logHtml += await demoRealEstateLoan();
                break;
            case 2: // Bond Collateral
                logHtml += await demoBondCollateral();
                break;
            case 3: // Invoice Financing
                logHtml += await demoInvoiceFinancing();
                break;
            case 4: // Liquidation Event
                logHtml += await demoLiquidationEvent();
                break;
            case 5: // Multi-Asset Portfolio
                logHtml += await demoMultiAssetPortfolio();
                break;
        }
        
        logHtml += `<p>✅ <strong>Simulation ${simNumber} completed successfully!</strong></p>`;
        
    } catch (error) {
        logHtml += `<p>❌ <strong>Simulation failed:</strong> ${error.message}</p>`;
    }
    
    demoLog.innerHTML = logHtml;
    refreshUserData();
}

// Demo simulation functions
async function demoRealEstateLoan() {
    let log = '<p>🏠 <strong>Real Estate Loan Simulation:</strong></p>';
    
    // Step 1: Tokenize property
    log += '<p>Step 1: Tokenizing $1M property...</p>';
    const tx1 = await contract.tokenizeAsset(0, ethers.utils.parseEther("1000"), "ipfs://RealEstate123");
    await tx1.wait();
    const tokenId = (await contract.nextTokenId()) - 1;
    log += `<p>✅ Property tokenized as Token #${tokenId}</p>`;
    
    // Step 2: Verify asset
    log += '<p>Step 2: Verifying asset...</p>';
    const tx2 = await contract.verifyAsset(tokenId);
    await tx2.wait();
    log += '<p>✅ Asset verified</p>';
    
    // Step 3: Request loan
    log += '<p>Step 3: Requesting $800 loan...</p>';
    const tx3 = await contract.createLoanRequest(tokenId, ethers.utils.parseEther("800"), 500, 365);
    await tx3.wait();
    const loanId = (await contract.nextLoanId()) - 1;
    log += `<p>✅ Loan #${loanId} requested</p>`;
    
    return log;
}

async function demoBondCollateral() {
    let log = '<p>💼 <strong>Bond Collateral Simulation:</strong></p>';
    
    log += '<p>Step 1: Tokenizing $500 corporate bond...</p>';
    const tx1 = await contract.tokenizeAsset(1, ethers.utils.parseEther("500"), "ipfs://CorporateBond456");
    await tx1.wait();
    const tokenId = (await contract.nextTokenId()) - 1;
    log += `<p>✅ Bond tokenized as Token #${tokenId}</p>`;
    
    log += '<p>Step 2: Verifying bond...</p>';
    const tx2 = await contract.verifyAsset(tokenId);
    await tx2.wait();
    log += '<p>✅ Bond verified</p>';
    
    return log;
}

async function demoInvoiceFinancing() {
    let log = '<p>📄 <strong>Invoice Financing Simulation:</strong></p>';
    
    log += '<p>Step 1: Tokenizing $100 invoice...</p>';
    const tx1 = await contract.tokenizeAsset(2, ethers.utils.parseEther("100"), "ipfs://Invoice789");
    await tx1.wait();
    const tokenId = (await contract.nextTokenId()) - 1;
    log += `<p>✅ Invoice tokenized as Token #${tokenId}</p>`;
    
    return log;
}

async function demoLiquidationEvent() {
    let log = '<p>⚠️ <strong>Liquidation Event Simulation:</strong></p>';
    
    log += '<p>Step 1: Tokenizing property at peak value...</p>';
    const tx1 = await contract.tokenizeAsset(0, ethers.utils.parseEther("800"), "ipfs://PropertyPeak");
    await tx1.wait();
    const tokenId = (await contract.nextTokenId()) - 1;
    log += `<p>✅ Property tokenized at $800 ETH</p>`;
    
    log += '<p>Step 2: Simulating market crash (40% drop)...</p>';
    const tx2 = await contract.updateAssetPrice(tokenId, ethers.utils.parseEther("480"));
    await tx2.wait();
    log += '<p>📉 Asset price crashed to $480 ETH</p>';
    
    return log;
}

async function demoMultiAssetPortfolio() {
    let log = '<p>🏗️ <strong>Multi-Asset Portfolio Simulation:</strong></p>';
    
    log += '<p>Step 1: Tokenizing commercial property ($2000)...</p>';
    const tx1 = await contract.tokenizeAsset(0, ethers.utils.parseEther("2000"), "ipfs://Commercial");
    await tx1.wait();
    
    log += '<p>Step 2: Tokenizing treasury bond ($1000)...</p>';
    const tx2 = await contract.tokenizeAsset(1, ethers.utils.parseEther("1000"), "ipfs://Treasury");
    await tx2.wait();
    
    log += '<p>✅ Portfolio worth $3000 ETH created</p>';
    
    return log;
}

// Utility function to show messages
function showMessage(message, type) {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;
    statusElement.classList.remove('hidden');
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusElement.classList.add('hidden');
        }, 5000);
    }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', init);