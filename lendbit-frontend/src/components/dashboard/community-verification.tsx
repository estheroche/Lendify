'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Users, CheckCircle, XCircle, Clock, Award, Star, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

interface Asset {
  tokenId: number
  name: string
  type: string
  value: number
  owner: string
  verificationScore: number
  verificationCount: number
  isVerified: boolean
  verifiers: Array<{
    address: string
    approved: boolean
    notes: string
    timestamp: number
  }>
}

export function CommunityVerification() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock assets pending verification
  const pendingAssets: Asset[] = [
    {
      tokenId: 15,
      name: '🏢 WeWork Office Building',
      type: 'Real Estate',
      value: 8500000,
      owner: '0x1234...5678',
      verificationScore: 65,
      verificationCount: 2,
      isVerified: false,
      verifiers: [
        {
          address: '0xabcd...ef01',
          approved: true,
          notes: 'Property deed verified, location confirmed via satellite imagery.',
          timestamp: Date.now() - 86400000
        },
        {
          address: '0x2345...6789',
          approved: true,
          notes: 'Financial documents check out, valuation seems reasonable.',
          timestamp: Date.now() - 43200000
        }
      ]
    },
    {
      tokenId: 16,
      name: '💎 Rare Diamond Collection',
      type: 'Commodity',
      value: 2500000,
      owner: '0x5678...9012',
      verificationScore: 45,
      verificationCount: 3,
      isVerified: false,
      verifiers: [
        {
          address: '0xcdef...0123',
          approved: true,
          notes: 'GIA certificates verified, diamonds are authentic.',
          timestamp: Date.now() - 129600000
        },
        {
          address: '0x3456...7890',
          approved: false,
          notes: 'Valuation seems inflated compared to market rates.',
          timestamp: Date.now() - 86400000
        },
        {
          address: '0x4567...8901',
          approved: true,
          notes: 'Insurance documents validate the collection value.',
          timestamp: Date.now() - 21600000
        }
      ]
    }
  ]

  const handleSubmitVerification = async (approved: boolean) => {
    if (!selectedAsset) return
    
    setIsSubmitting(true)
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    alert(`Verification ${approved ? 'approved' : 'rejected'} for ${selectedAsset.name}`)
    setSelectedAsset(null)
    setVerificationNotes('')
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-500/20 border-green-500/30'
    if (score >= 50) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Users className="w-7 h-7 mr-3 text-purple-400" />
            Community Asset Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">47</div>
              <div className="text-sm text-gray-600">Total Verifications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">89%</div>
              <div className="text-sm text-gray-600">Approval Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">15</div>
              <div className="text-sm text-gray-600">Active Verifiers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets Pending Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Clock className="w-6 h-6 mr-2 text-yellow-400" />
              Assets Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAssets.map((asset, index) => (
                <motion.div
                  key={asset.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedAsset?.tokenId === asset.tokenId
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-gray-700 bg-white/5 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{asset.name}</h3>
                      <p className="text-sm text-gray-600">{asset.type} • ${asset.value.toLocaleString()}</p>
                    </div>
                    <Badge className={getScoreBg(asset.verificationScore)}>
                      {asset.verificationScore}/100
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {asset.verificationCount} reviews
                      </span>
                      <span>Owner: {asset.owner}</span>
                    </div>
                    
                    {selectedAsset?.tokenId === asset.tokenId && (
                      <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">
                        Selected
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verification Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Award className="w-6 h-6 mr-2 text-gold-400" />
              Submit Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAsset ? (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h3 className="font-semibold text-white mb-2">{selectedAsset.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="text-white ml-2">{selectedAsset.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Value:</span>
                      <span className="text-white ml-2">${selectedAsset.value.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Score:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(selectedAsset.verificationScore)}`}>
                        {selectedAsset.verificationScore}/100
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Reviews:</span>
                      <span className="text-white ml-2">{selectedAsset.verificationCount}</span>
                    </div>
                  </div>
                </div>

                {/* Previous Verifications */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Previous Verifications</h4>
                  {selectedAsset.verifiers.map((verifier, index) => (
                    <div key={index} className="p-3 rounded-lg bg-white/5 border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{verifier.address}</span>
                        {verifier.approved ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{verifier.notes}</p>
                    </div>
                  ))}
                </div>

                {/* Verification Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Verification Notes
                    </label>
                    <Textarea
                      placeholder="Provide detailed notes about your verification process..."
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      className="bg-white/5 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => handleSubmitVerification(true)}
                      disabled={isSubmitting || !verificationNotes.trim()}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleSubmitVerification(false)}
                      disabled={isSubmitting || !verificationNotes.trim()}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-700 hover:bg-red-500/10"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-red-300/20 border-t-red-300 rounded-full animate-spin mr-2" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Select an Asset</h3>
                <p className="text-gray-500">Choose an asset from the list to begin verification</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}