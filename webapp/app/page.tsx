'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Building, 
  CreditCard, 
  FileText, 
  Coins, 
  TrendingUp, 
  Shield, 
  DollarSign,
  Users,
  BarChart3,
  Wallet,
  Plus,
  Eye,
  AlertTriangle
} from 'lucide-react';

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
];

const ASSET_TYPES = {
  0: { name: 'Real Estate', icon: Building, color: 'bg-blue-500' },
  1: { name: 'Corporate Bond', icon: CreditCard, color: 'bg-green-500' },
  2: { name: 'Invoice', icon: FileText, color: 'bg-purple-500' },
  3: { name: 'Commodity', icon: Coins, color: 'bg-yellow-500' }
};

interface Asset {
  tokenId: number;
  assetType: number;
  owner: string;
  currentValue: bigint;
  description: string;
  location: string;
  isVerified: boolean;
  isLocked: boolean;
}

interface ProtocolStats {
  totalValueLocked: bigint;
  totalLoansOriginated: bigint;
  protocolFeeCollected: bigint;
  totalAssets: bigint;
  totalLoans: bigint;
}

export default function LendBitZero() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [protocolStats, setProtocolStats] = useState<ProtocolStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [assetForm, setAssetForm] = useState({
    type: '0',
    value: '',
    description: '',
    location: '',
    metadataURI: ''
  });

  const [loanForm, setLoanForm] = useState({
    collateralId: '',
    amount: '',
    interestRate: '',
    duration: '',
    purpose: ''
  });

  const [fundForm, setFundForm] = useState({
    requestId: ''
  });

  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('MetaMask not found!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setProvider(provider);
      setContract(contract);
      setUserAddress(address);
      setIsConnected(true);

      toast.success('Wallet connected successfully!');
      await loadData(contract, address);
    } catch (error: any) {
      toast.error(`Connection failed: ${error.message}`);
    }
  };

  // Load user data and protocol stats
  const loadData = async (contract: ethers.Contract, address: string) => {
    try {
      setLoading(true);
      
      // Load user assets
      const assetIds = await contract.getUserAssets(address);
      const assets = [];
      
      for (const id of assetIds) {
        try {
          const asset = await contract.getAsset(id);
          assets.push({
            tokenId: Number(asset.tokenId),
            assetType: Number(asset.assetType),
            owner: asset.owner,
            currentValue: asset.currentValue,
            description: asset.description,
            location: asset.location,
            isVerified: asset.isVerified,
            isLocked: asset.isLocked
          });
        } catch (err) {
          console.log(`Could not load asset ${id}:`, err);
        }
      }
      
      setUserAssets(assets);

      // Load protocol stats
      const stats = await contract.getProtocolStats();
      setProtocolStats({
        totalValueLocked: stats[0],
        totalLoansOriginated: stats[1],
        protocolFeeCollected: stats[2],
        totalAssets: stats[3],
        totalLoans: stats[4]
      });

    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Tokenize Asset
  const tokenizeAsset = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      toast.loading('Tokenizing asset...');
      
      const tx = await contract.tokenizeAsset(
        parseInt(assetForm.type),
        ethers.parseEther(assetForm.value),
        assetForm.description,
        assetForm.location,
        assetForm.metadataURI || 'ipfs://QmExample'
      );
      
      await tx.wait();
      toast.dismiss();
      toast.success('Asset tokenized successfully!');
      
      // Reset form
      setAssetForm({
        type: '0',
        value: '',
        description: '',
        location: '',
        metadataURI: ''
      });
      
      // Reload data
      await loadData(contract, userAddress);
      
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Tokenization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create Loan Request
  const createLoanRequest = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      toast.loading('Creating loan request...');
      
      const tx = await contract.createLoanRequest(
        parseInt(loanForm.collateralId),
        ethers.parseEther(loanForm.amount),
        Math.floor(parseFloat(loanForm.interestRate) * 100), // Convert to basis points
        parseInt(loanForm.duration),
        loanForm.purpose
      );
      
      await tx.wait();
      toast.dismiss();
      toast.success('Loan request created successfully!');
      
      // Reset form
      setLoanForm({
        collateralId: '',
        amount: '',
        interestRate: '',
        duration: '',
        purpose: ''
      });
      
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Loan request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fund Loan
  const fundLoan = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      toast.loading('Getting loan request details...');
      
      const requestId = parseInt(fundForm.requestId);
      const request = await contract.getLoanRequest(requestId);
      const amount = request.requestedAmount;
      
      toast.dismiss();
      toast.loading('Funding loan...');
      
      const tx = await contract.fundLoan(requestId, { value: amount });
      await tx.wait();
      
      toast.dismiss();
      toast.success('Loan funded successfully!');
      
      setFundForm({ requestId: '' });
      
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Funding failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">LendBit Zero</h1>
                <p className="text-blue-200 text-sm">RWA-Backed DeFi Lending</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                  <p className="text-green-300 text-sm font-medium">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </p>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        
        {/* Protocol Stats */}
        {protocolStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Value Locked</p>
                  <p className="text-2xl font-bold text-white">
                    {ethers.formatEther(protocolStats.totalValueLocked)} ETH
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Assets</p>
                  <p className="text-2xl font-bold text-white">
                    {protocolStats.totalAssets.toString()}
                  </p>
                </div>
                <Building className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Loans</p>
                  <p className="text-2xl font-bold text-white">
                    {protocolStats.totalLoans.toString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Protocol Fees</p>
                  <p className="text-2xl font-bold text-white">
                    {ethers.formatEther(protocolStats.protocolFeeCollected)} ETH
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Tokenize Asset */}
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Tokenize Asset
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Asset Type</label>
                <select
                  value={assetForm.type}
                  onChange={(e) => setAssetForm({...assetForm, type: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  <option value="0">🏠 Real Estate</option>
                  <option value="1">💼 Corporate Bond</option>
                  <option value="2">📄 Invoice</option>
                  <option value="3">🥇 Commodity</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Value (ETH)</label>
                <input
                  type="number"
                  value={assetForm.value}
                  onChange={(e) => setAssetForm({...assetForm, value: e.target.value})}
                  placeholder="10.0"
                  step="0.01"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={assetForm.description}
                  onChange={(e) => setAssetForm({...assetForm, description: e.target.value})}
                  placeholder="Describe your asset..."
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={assetForm.location}
                  onChange={(e) => setAssetForm({...assetForm, location: e.target.value})}
                  placeholder="New York, NY"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <button
                onClick={tokenizeAsset}
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-all"
              >
                {loading ? 'Processing...' : 'Tokenize Asset'}
              </button>
            </div>
          </div>

          {/* Request Loan */}
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Request Loan
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Collateral Asset ID</label>
                <input
                  type="number"
                  value={loanForm.collateralId}
                  onChange={(e) => setLoanForm({...loanForm, collateralId: e.target.value})}
                  placeholder="1"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Loan Amount (ETH)</label>
                <input
                  type="number"
                  value={loanForm.amount}
                  onChange={(e) => setLoanForm({...loanForm, amount: e.target.value})}
                  placeholder="8.0"
                  step="0.01"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">Max 80% of asset value</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={loanForm.interestRate}
                    onChange={(e) => setLoanForm({...loanForm, interestRate: e.target.value})}
                    placeholder="5.0"
                    step="0.1"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    value={loanForm.duration}
                    onChange={(e) => setLoanForm({...loanForm, duration: e.target.value})}
                    placeholder="365"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Purpose</label>
                <input
                  type="text"
                  value={loanForm.purpose}
                  onChange={(e) => setLoanForm({...loanForm, purpose: e.target.value})}
                  placeholder="Business expansion"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <button
                onClick={createLoanRequest}
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-all"
              >
                {loading ? 'Processing...' : 'Request Loan'}
              </button>
            </div>
          </div>

          {/* Fund Loan */}
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Fund Loan
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Request ID</label>
                <input
                  type="number"
                  value={fundForm.requestId}
                  onChange={(e) => setFundForm({...fundForm, requestId: e.target.value})}
                  placeholder="1"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
              
              <button
                onClick={fundLoan}
                disabled={loading || !isConnected}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-all"
              >
                {loading ? 'Processing...' : 'Fund Loan'}
              </button>
            </div>
          </div>
        </div>

        {/* User Assets */}
        {userAssets.length > 0 && (
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Your Assets ({userAssets.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userAssets.map((asset) => {
                const AssetIcon = ASSET_TYPES[asset.assetType as keyof typeof ASSET_TYPES]?.icon || Building;
                const assetColor = ASSET_TYPES[asset.assetType as keyof typeof ASSET_TYPES]?.color || 'bg-gray-500';
                
                return (
                  <div key={asset.tokenId} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${assetColor} rounded-lg flex items-center justify-center`}>
                        <AssetIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex space-x-2">
                        {asset.isVerified ? (
                          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">
                            ⏳ Pending
                          </span>
                        )}
                        {asset.isLocked && (
                          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1">
                      {ASSET_TYPES[asset.assetType as keyof typeof ASSET_TYPES]?.name || 'Unknown'} #{asset.tokenId}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">{asset.description}</p>
                    <p className="text-gray-400 text-xs mb-3">{asset.location}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">
                        {ethers.formatEther(asset.currentValue)} ETH
                      </span>
                      <span className="text-xs text-gray-400">
                        ID: {asset.tokenId}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Connection Required Message */}
        {!isConnected && (
          <div className="text-center py-12">
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-8 border border-white/10 max-w-md mx-auto">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-6">
                Connect your MetaMask wallet to start using LendBit Zero
              </p>
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}