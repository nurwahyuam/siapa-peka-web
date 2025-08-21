import { useState } from "react";
import { X, ChevronLeft, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

// Dummy data untuk crypto market
const priceData = [
    { time: '00:00', BTC: 43250, ETH: 2650, BNB: 310, ADA: 0.52, SOL: 98 },
    { time: '04:00', BTC: 43180, ETH: 2630, BNB: 308, ADA: 0.51, SOL: 96 },
    { time: '08:00', BTC: 43500, ETH: 2680, BNB: 315, ADA: 0.53, SOL: 101 },
    { time: '12:00', BTC: 43750, ETH: 2720, BNB: 320, ADA: 0.54, SOL: 103 },
    { time: '16:00', BTC: 43650, ETH: 2700, BNB: 318, ADA: 0.53, SOL: 102 },
    { time: '20:00', BTC: 43900, ETH: 2750, BNB: 325, ADA: 0.55, SOL: 105 },
];

const marketCapData = [
    { name: 'Bitcoin', value: 850000, color: '#F7931A' },
    { name: 'Ethereum', value: 320000, color: '#627EEA' },
    { name: 'BNB', value: 48000, color: '#F3BA2F' },
    { name: 'Solana', value: 42000, color: '#9945FF' },
    { name: 'Cardano', value: 18000, color: '#0033AD' },
    { name: 'Others', value: 280000, color: '#8884d8' },
];

const volumeData = [
    { crypto: 'BTC', volume: 28500, change: 5.2 },
    { crypto: 'ETH', volume: 15200, change: -2.1 },
    { crypto: 'BNB', volume: 8900, change: 3.8 },
    { crypto: 'SOL', volume: 6400, change: 12.4 },
    { crypto: 'ADA', volume: 4200, change: -1.5 },
];

export default function Statistik() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('price');

    const formatPrice = (value) => {
        if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
        }
        return `$${value.toFixed(2)}`;
    };

    const formatMarketCap = (value) => {
        return `$${(value / 1000).toFixed(0)}B`;
    };

    return (
        <>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${
            isOpen ? "hidden" : ""
            } fixed bottom-48 right-6 lg:top-40 lg:bottom-auto bg-black text-white p-4 rounded-full shadow-lg hover:rotate-180 transition-transform duration-300`}
        >
            <ChevronLeft />
        </button>

        {isOpen && (
            <div className="fixed top-28 right-4 w-[800px] max-w-[95vw] h-[600px] bg-white shadow-2xl rounded-lg border border-gray-200 animate-slide-up overflow-hidden">
                <div className="relative flex items-center justify-center p-4 pl-12 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <button
                    onClick={() => setIsOpen(false)}
                    className="absolute left-4 p-2 hover:rotate-90 transition-transform hover:bg-gray-100 rounded-full"
                    >
                    <X size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-center flex items-center gap-2">
                    <BarChart3 className=" hidden sm:block" size={24} />
                    Cryptocurrency Market Dashboard
                    </h2>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                    onClick={() => setActiveTab('price')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'price'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    >
                    Price Trends
                    </button>
                    <button
                    onClick={() => setActiveTab('marketcap')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'marketcap'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    >
                    Market Cap
                    </button>
                    <button
                    onClick={() => setActiveTab('volume')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'volume'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    >
                    Trading Volume
                    </button>
                </div>

                <div className="p-4 h-[480px] overflow-auto">
                    {activeTab === 'price' && (
                    <div>
                        <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">24H Price Movement</h3>
                        <div className="grid grid-cols-5 gap-4 mb-4">
                            {[
                            { name: 'BTC', price: 43900, change: 1.5, color: '#F7931A' },
                            { name: 'ETH', price: 2750, change: 3.8, color: '#627EEA' },
                            { name: 'BNB', price: 325, change: 4.8, color: '#F3BA2F' },
                            { name: 'ADA', price: 0.55, change: 5.8, color: '#0033AD' },
                            { name: 'SOL', price: 105, change: 7.1, color: '#9945FF' },
                            ].map((crypto) => (
                            <div key={crypto.name} className="bg-gray-50 p-3 rounded-lg">
                                <div className="font-semibold text-sm">{crypto.name}</div>
                                <div className="text-lg font-bold" style={{ color: crypto.color }}>
                                ${crypto.price.toLocaleString()}
                                </div>
                                <div className={`text-sm flex items-center gap-1 ${
                                crypto.change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {crypto.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {Math.abs(crypto.change)}%
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                        
                        <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis tickFormatter={formatPrice} />
                            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                            <Legend />
                            <Line type="monotone" dataKey="BTC" stroke="#F7931A" strokeWidth={3} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="ETH" stroke="#627EEA" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="BNB" stroke="#F3BA2F" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="SOL" stroke="#9945FF" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                    )}

                    {activeTab === 'marketcap' && (
                    <div>
                        <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Market Capitalization Distribution</h3>
                        <div className="text-sm text-gray-600 mb-4">
                            Total Market Cap: <span className="font-bold text-blue-600">$1.56T</span>
                        </div>
                        </div>
                        
                        <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={marketCapData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={formatMarketCap} />
                            <Tooltip formatter={(value) => [`$${(value / 1000).toFixed(1)}B`, 'Market Cap']} />
                            <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#8884d8" 
                            fill="url(#colorGradient)" 
                            strokeWidth={2}
                            />
                            <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                            </defs>
                        </AreaChart>
                        </ResponsiveContainer>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                        {marketCapData.slice(0, 3).map((item) => (
                            <div key={item.name} className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="font-semibold text-sm">{item.name}</div>
                            <div className="text-lg font-bold" style={{ color: item.color }}>
                                {formatMarketCap(item.value)}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}

                    {activeTab === 'volume' && (
                    <div>
                        <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">24H Trading Volume</h3>
                        <div className="text-sm text-gray-600 mb-4">
                            Total Volume: <span className="font-bold text-green-600">$63.2B</span>
                        </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="crypto" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(1)}B`} />
                            <Tooltip formatter={(value) => [`$${value.toFixed(1)}B`, 'Volume']} />
                            <Bar dataKey="volume" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {volumeData.map((entry, index) => (
                                <Bar key={`cell-${index}`} fill={entry.change > 0 ? '#10B981' : '#EF4444'} />
                            ))}
                            </Bar>
                        </BarChart>
                        </ResponsiveContainer>

                        <div className="mt-4">
                        <h4 className="font-semibold mb-3">Volume Changes (24H)</h4>
                        <div className="space-y-2">
                            {volumeData.map((item) => (
                            <div key={item.crypto} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                <div className="font-semibold">{item.crypto}</div>
                                <div className="text-gray-600">${item.volume.toFixed(1)}B</div>
                                </div>
                                <div className={`flex items-center gap-1 font-semibold ${
                                item.change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {item.change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                {Math.abs(item.change)}%
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        )}
        </>
    );
}