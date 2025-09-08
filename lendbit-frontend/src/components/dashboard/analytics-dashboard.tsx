'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, DollarSign, Users, Activity, Calendar, Eye, Download } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface AnalyticsDashboardProps {
  timeframe?: string
  onTimeframeChange?: (timeframe: string) => void
}

export function AnalyticsDashboard({ timeframe = '30d', onTimeframeChange }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'lending' | 'assets' | 'risk'>('overview')

  // Mock analytics data
  const tvlData = [
    { name: 'Jan', value: 1200000 },
    { name: 'Feb', value: 1800000 },
    { name: 'Mar', value: 2400000 },
    { name: 'Apr', value: 3200000 },
    { name: 'May', value: 4100000 },
    { name: 'Jun', value: 5500000 },
    { name: 'Jul', value: 7200000 },
    { name: 'Aug', value: 8900000 },
  ]

  const lendingVolumeData = [
    { name: 'Week 1', borrowed: 450000, lent: 420000 },
    { name: 'Week 2', borrowed: 680000, lent: 650000 },
    { name: 'Week 3', borrowed: 890000, lent: 920000 },
    { name: 'Week 4', borrowed: 1200000, lent: 1150000 },
  ]

  const assetDistribution = [
    { name: 'Real Estate', value: 45, amount: 4050000, color: '#3B82F6' },
    { name: 'Corporate Bonds', value: 30, amount: 2700000, color: '#10B981' },
    { name: 'Invoices', value: 15, amount: 1350000, color: '#8B5CF6' },
    { name: 'Commodities', value: 10, amount: 900000, color: '#F59E0B' },
  ]

  const riskMetrics = [
    { name: 'Safe (>150%)', value: 65, count: 28 },
    { name: 'Caution (120-150%)', value: 25, count: 11 },
    { name: 'Risk (<120%)', value: 10, count: 4 },
  ]

  const kpiData = {
    totalVolume: 12500000,
    activeLoans: 43,
    avgAPY: 6.8,
    totalUsers: 147,
    defaultRate: 0.8,
    protocolRevenue: 125000,
    utilizationRate: 78.5,
    avgLoanSize: 290000
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'lending', label: 'Lending', icon: DollarSign },
    { id: 'assets', label: 'Assets', icon: TrendingUp },
    { id: 'risk', label: 'Risk', icon: Activity },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-3 backdrop-blur-md">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">Comprehensive protocol insights and metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={timeframe} onChange={(e) => onTimeframeChange?.(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Volume', value: formatCurrency(kpiData.totalVolume), change: '+24.5%', positive: true },
          { label: 'Active Loans', value: kpiData.activeLoans.toString(), change: '+12', positive: true },
          { label: 'Average APY', value: formatPercentage(kpiData.avgAPY), change: '+0.3%', positive: true },
          { label: 'Protocol Revenue', value: formatCurrency(kpiData.protocolRevenue), change: '+18.2%', positive: true },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{kpi.label}</p>
                    <p className="text-2xl font-bold text-white">{kpi.value}</p>
                  </div>
                  <span className={`text-sm font-medium ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TVL Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Total Value Locked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={tvlData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000000}M`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        fill="url(#gradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Asset Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  Asset Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-black/90 border border-white/20 rounded-lg p-3 backdrop-blur-md">
                                <p className="text-white font-medium">{data.name}</p>
                                <p className="text-blue-400">{data.value}% ({formatCurrency(data.amount)})</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#fff' }}
                        formatter={(value, entry) => `${value} (${entry.payload.value}%)`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'lending' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lending Volume */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                  Lending Volume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lendingVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000000}M`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="borrowed" fill="#3B82F6" name="Borrowed" />
                      <Bar dataKey="lent" fill="#10B981" name="Lent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Lending Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Lending Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { label: 'Utilization Rate', value: formatPercentage(kpiData.utilizationRate), target: 80 },
                    { label: 'Average Loan Size', value: formatCurrency(kpiData.avgLoanSize), target: null },
                    { label: 'Default Rate', value: formatPercentage(kpiData.defaultRate), target: 2 },
                    { label: 'Total Users', value: kpiData.totalUsers.toString(), target: null },
                  ].map((metric, index) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">{metric.label}</span>
                        <span className="text-lg font-semibold text-white">{metric.value}</span>
                      </div>
                      {metric.target && (
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min((parseFloat(metric.value) / metric.target) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {assetDistribution.map((asset, index) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${asset.color}20`, border: `2px solid ${asset.color}` }}
                    >
                      <div className="text-2xl">
                        {asset.name.includes('Real Estate') ? '🏠' :
                         asset.name.includes('Bonds') ? '💼' :
                         asset.name.includes('Invoices') ? '📄' : '🥇'}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{asset.name}</h3>
                    <p className="text-3xl font-bold mb-2" style={{ color: asset.color }}>
                      {asset.value}%
                    </p>
                    <p className="text-gray-400">{formatCurrency(asset.amount)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-red-400" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.map((risk, index) => (
                    <div key={risk.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">{risk.name}</span>
                        <span className="text-sm text-white">{risk.count} loans</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${
                            risk.name.includes('Safe') ? 'bg-green-500' :
                            risk.name.includes('Caution') ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${risk.value}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">99.2%</p>
                    <p className="text-sm text-gray-400">Portfolio Health</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="text-xl font-bold text-white">2.1 days</p>
                      <p className="text-xs text-gray-400">Avg Liquidation Time</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <p className="text-xl font-bold text-white">$50K</p>
                      <p className="text-xs text-gray-400">Insurance Pool</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  )
}