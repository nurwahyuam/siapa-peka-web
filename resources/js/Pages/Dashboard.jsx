import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye, Activity, Calendar } from 'lucide-react';

export default function Dashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState('7days');
    const [selectedMetric, setSelectedMetric] = useState('users');
    const [animatedValues, setAnimatedValues] = useState({
        users: 0,
        sales: 0,
        revenue: 0,
        views: 0
    });

    // Dummy data untuk berbagai periode
    const periodData = {
        '7days': {
            users: 1247,
            sales: 342,
            revenue: 15678,
            views: 8923,
            growth: { users: 12.5, sales: 8.3, revenue: 15.7, views: 6.2 }
        },
        '30days': {
            users: 5892,
            sales: 1456,
            revenue: 67432,
            views: 34567,
            growth: { users: 18.3, sales: -3.2, revenue: 22.1, views: 14.8 }
        },
        '90days': {
            users: 18934,
            sales: 4321,
            revenue: 198765,
            views: 112334,
            growth: { users: 25.6, sales: 12.9, revenue: 35.4, views: 19.7 }
        }
    };

    // Data untuk chart
    const lineChartData = [
        { name: 'Sen', users: 120, sales: 45, revenue: 2340, views: 890 },
        { name: 'Sel', users: 180, sales: 52, revenue: 2890, views: 1200 },
        { name: 'Rab', users: 160, sales: 38, revenue: 2100, views: 950 },
        { name: 'Kam', users: 220, sales: 65, revenue: 3200, views: 1400 },
        { name: 'Jum', users: 190, sales: 58, revenue: 2950, views: 1100 },
        { name: 'Sab', users: 240, sales: 72, revenue: 3800, views: 1600 },
        { name: 'Min', users: 200, sales: 48, revenue: 2450, views: 1150 }
    ];

    const barChartData = [
        { name: 'E-commerce', value: 4000, color: '#8884d8' },
        { name: 'Social Media', value: 3000, color: '#82ca9d' },
        { name: 'Direct', value: 2000, color: '#ffc658' },
        { name: 'Email', value: 2780, color: '#ff7300' },
        { name: 'Referral', value: 1890, color: '#00ff88' }
    ];

    const pieChartData = [
        { name: 'Desktop', value: 65, color: '#0088FE' },
        { name: 'Mobile', value: 30, color: '#00C49F' },
        { name: 'Tablet', value: 5, color: '#FFBB28' }
    ];

    // Animasi untuk counter
    useEffect(() => {
        const currentData = periodData[selectedPeriod];
        const duration = 1000;
        const steps = 50;
        const stepDuration = duration / steps;

        let step = 0;
        const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setAnimatedValues({
                users: Math.floor(currentData.users * easeOutQuart),
                sales: Math.floor(currentData.sales * easeOutQuart),
                revenue: Math.floor(currentData.revenue * easeOutQuart),
                views: Math.floor(currentData.views * easeOutQuart)
            });

            if (step >= steps) {
                clearInterval(interval);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [selectedPeriod]);

    const StatCard = ({ title, value, icon: Icon, growth, color }) => {
        const isPositive = growth > 0;
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {title === 'Revenue' ? `Rp ${value.toLocaleString()}` : value.toLocaleString()}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${color}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(growth)}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs periode sebelumnya</span>
                </div>
            </div>
        );
    };

    const currentData = periodData[selectedPeriod];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Analytics
                    </h2>
                    <div className="p-2 flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <select 
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="7days">7 Hari Terakhir</option>
                            <option value="30days">30 Hari Terakhir</option>
                            <option value="90days">90 Hari Terakhir</option>
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className="m-4 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Users"
                        value={animatedValues.users}
                        icon={Users}
                        growth={currentData.growth.users}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Sales"
                        value={animatedValues.sales}
                        icon={ShoppingCart}
                        growth={currentData.growth.sales}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Revenue"
                        value={animatedValues.revenue}
                        icon={DollarSign}
                        growth={currentData.growth.revenue}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Page Views"
                        value={animatedValues.views}
                        icon={Eye}
                        growth={currentData.growth.views}
                        color="bg-orange-500"
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Trend Mingguan</h3>
                            <select 
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value="users">Users</option>
                                <option value="sales">Sales</option>
                                <option value="revenue">Revenue</option>
                                <option value="views">Views</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey={selectedMetric} 
                                    stroke="#8884d8" 
                                    fill="#8884d8"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Source</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }} 
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {barChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Usage</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Activity className="h-5 w-5 mr-2" />
                            Aktivitas Terbaru
                        </h3>
                        <div className="space-y-3">
                            {[
                                { user: "John Doe", action: "membuat pesanan baru", time: "2 menit yang lalu", type: "success" },
                                { user: "Jane Smith", action: "mengupdate profil", time: "15 menit yang lalu", type: "info" },
                                { user: "Bob Wilson", action: "menambah produk ke keranjang", time: "32 menit yang lalu", type: "warning" },
                                { user: "Alice Brown", action: "memberikan review", time: "1 jam yang lalu", type: "success" },
                                { user: "Charlie Davis", action: "melakukan pembayaran", time: "2 jam yang lalu", type: "success" }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-3 ${
                                            activity.type === 'success' ? 'bg-green-500' :
                                            activity.type === 'info' ? 'bg-blue-500' :
                                            'bg-yellow-500'
                                        }`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                <span className="font-semibold">{activity.user}</span> {activity.action}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}