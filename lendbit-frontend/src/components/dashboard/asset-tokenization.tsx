'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Plus, Upload, MapPin, FileText, Coins, Building, CreditCard, AlertCircle } from 'lucide-react'
import { ASSET_TYPES } from '@/lib/utils'

interface AssetTokenizationProps {
  onTokenize: (assetData: AssetFormData) => Promise<void>
  isLoading: boolean
  isConnected: boolean
}

export interface AssetFormData {
  type: number
  value: string
  description: string
  location: string
  metadataURI: string
}

const assetTypeIcons = {
  0: Building,
  1: CreditCard,
  2: FileText,
  3: Coins,
}

export function AssetTokenization({ onTokenize, isLoading, isConnected }: AssetTokenizationProps) {
  const [formData, setFormData] = useState<AssetFormData>({
    type: 0,
    value: '',
    description: '',
    location: '',
    metadataURI: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Asset value must be greater than 0'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Asset description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Asset location is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onTokenize(formData)
      // Reset form on success
      setFormData({
        type: 0,
        value: '',
        description: '',
        location: '',
        metadataURI: ''
      })
      setErrors({})
    } catch (error) {
      console.error('Tokenization failed:', error)
    }
  }

  const getCurrentAssetType = () => ASSET_TYPES[formData.type as keyof typeof ASSET_TYPES]
  const IconComponent = assetTypeIcons[formData.type as keyof typeof assetTypeIcons]

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCurrentAssetType().color}`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <span>Tokenize Asset</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset-type">Asset Type</Label>
            <Select
              id="asset-type"
              value={formData.type.toString()}
              onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}
            >
              {Object.entries(ASSET_TYPES).map(([value, type]) => (
                <option key={value} value={value}>
                  {type.emoji} {type.name}
                </option>
              ))}
            </Select>
            <p className="text-xs text-gray-400">
              Select the type of real-world asset you want to tokenize
            </p>
          </div>

          {/* Asset Value */}
          <div className="space-y-2">
            <Label htmlFor="asset-value">Asset Value (ETH)</Label>
            <Input
              id="asset-value"
              type="number"
              step="0.01"
              placeholder="10.00"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className={errors.value ? 'border-red-500' : ''}
            />
            {errors.value && (
              <p className="text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.value}
              </p>
            )}
            <p className="text-xs text-gray-400">
              Current market value of your asset in ETH
            </p>
          </div>

          {/* Asset Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={`Describe your ${getCurrentAssetType().name.toLowerCase()}...`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
            <p className="text-xs text-gray-400">
              Provide detailed information about your asset ({formData.description.length}/500)
            </p>
          </div>

          {/* Asset Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="New York, NY, USA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-sm text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.location}
              </p>
            )}
            <p className="text-xs text-gray-400">
              Physical location or jurisdiction of the asset
            </p>
          </div>

          {/* Advanced Options */}
          <motion.div
            initial={false}
            animate={{ height: showAdvanced ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <Label htmlFor="metadata-uri" className="flex items-center">
                  <Upload className="w-4 h-4 mr-1" />
                  Metadata URI (Optional)
                </Label>
                <Input
                  id="metadata-uri"
                  placeholder="ipfs://QmExample... or https://..."
                  value={formData.metadataURI}
                  onChange={(e) => setFormData({ ...formData, metadataURI: e.target.value })}
                />
                <p className="text-xs text-gray-400">
                  Link to asset documentation, images, or legal documents
                </p>
              </div>
            </div>
          </motion.div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-sm"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          {/* Submit Button */}
          <div className="space-y-4">
            {!isConnected && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Please connect your wallet to tokenize assets
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isConnected || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Tokenizing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Tokenize {getCurrentAssetType().name}
                </div>
              )}
            </Button>

            <div className="text-xs text-center text-gray-400">
              <p>✅ Gas fees optimized for Arbitrum</p>
              <p>🔒 Your asset will be secured on-chain</p>
              <p>⚡ Instant tokenization with smart contract verification</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}