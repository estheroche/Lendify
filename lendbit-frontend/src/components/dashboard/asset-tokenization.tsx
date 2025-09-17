'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Plus, Upload, MapPin, FileText, Coins, Building, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import { useTokenizeAsset, useWatchAssetTokenized } from '@/hooks/useLendifyContract'
import { AssetType, ASSET_TYPE_LABELS } from '@/lib/contract-config'

interface AssetTokenizationProps {
  isConnected: boolean
  // External props kept for compatibility but not used for core functionality
  onTokenize?: (assetData: AssetFormData) => Promise<void>
  isLoading?: boolean
}

export interface AssetFormData {
  type: AssetType
  value: string
  description: string
  location: string
  metadataURI: string
}

const assetTypeIcons = {
  [AssetType.RealEstate]: Building,
  [AssetType.CorporateBond]: CreditCard,
  [AssetType.Invoice]: FileText,
  [AssetType.Commodity]: Coins,
  [AssetType.IntellectualProperty]: FileText,
  [AssetType.Equipment]: Building,
  [AssetType.Inventory]: Building,
  [AssetType.Receivables]: CreditCard,
}

export function AssetTokenization({ isConnected }: AssetTokenizationProps) {
  const { tokenizeAsset, isPending, isSuccess, error } = useTokenizeAsset()
  
  const [formData, setFormData] = useState<AssetFormData>({
    type: AssetType.RealEstate,
    value: '',
    description: '',
    location: '',
    metadataURI: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Watch for successful tokenization
  useWatchAssetTokenized((log) => {
    alert(`Asset tokenized successfully! Token ID: ${log.args.tokenId}`)
    console.log('Asset tokenized:', log)
  })

  // Handle success/error states
  useEffect(() => {
    if (isSuccess) {
      alert('Asset tokenization transaction submitted!')
      console.log('Transaction submitted successfully')
      // Reset form on success
      setFormData({
        type: AssetType.RealEstate,
        value: '',
        description: '',
        location: '',
        metadataURI: ''
      })
      setErrors({})
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      alert(`Tokenization failed: ${error.message}`)
      console.error('Tokenization error:', error)
    }
  }, [error])

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

  const createMetadataURI = () => {
    if (formData.metadataURI) return formData.metadataURI
    
    // Create a simple metadata object for IPFS or direct use
    const metadata = {
      name: `${ASSET_TYPE_LABELS[formData.type]} Asset`,
      description: formData.description,
      location: formData.location,
      assetType: formData.type,
      value: formData.value,
      timestamp: Date.now(),
    }
    
    // For now, we'll use a data URI. In production, this should be uploaded to IPFS
    return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const metadataURI = createMetadataURI()
      // Always use the internal contract hook for real blockchain interaction
      await tokenizeAsset(formData.type, formData.value, metadataURI)
    } catch (error) {
      console.error('Tokenization failed:', error)
    }
  }

  const getCurrentAssetType = () => ASSET_TYPE_LABELS[formData.type]
  const IconComponent = assetTypeIcons[formData.type]

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
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
              onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as AssetType })}
            >
              {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <p className="text-xs text-gray-600 font-medium">
              Select the type of real-world asset you want to tokenize
            </p>
          </div>

          {/* Asset Value */}
          <div className="space-y-2">
            <Label htmlFor="asset-value">Asset Value (STT)</Label>
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
            <p className="text-xs text-gray-600 font-medium">
              Current market value of your asset in STT (Somnia Token)
            </p>
          </div>

          {/* Asset Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={`Describe your ${getCurrentAssetType().toLowerCase()}...`}
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
            <p className="text-xs text-gray-600 font-medium">
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
            <p className="text-xs text-gray-600 font-medium">
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
                <p className="text-xs text-gray-600 font-medium">
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
              disabled={!isConnected || isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Tokenizing...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Transaction Submitted!
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Tokenize {getCurrentAssetType()}
                </div>
              )}
            </Button>

            <div className="text-xs text-center text-gray-400">
              <p>✅ Gas fees optimized for Somnia</p>
              <p>🔒 Your asset will be secured on-chain</p>
              <p>⚡ Instant tokenization with smart contract verification</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}