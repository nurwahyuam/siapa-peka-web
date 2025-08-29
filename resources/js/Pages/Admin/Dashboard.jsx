import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
    // Dummy data
    const salesData = [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 6000 },
        { name: 'Apr', sales: 2000 },
        { name: 'May', sales: 5000 },
        { name: 'Jun', sales: 8000 },
    ];

    const revenueData = [
        { name: 'Mon', earning: 4000, expense: 2400 },
        { name: 'Tue', earning: 3000, expense: 1398 },
        { name: 'Wed', earning: 2000, expense: 9800 },
        { name: 'Thu', earning: 2780, expense: 3908 },
        { name: 'Fri', earning: 1890, expense: 4800 },
    ];

    const salesOverview = [
        { name: 'Apparel', value: 12150 },
        { name: 'Electronics', value: 24900 },
        { name: 'FMCG', value: 12750 },
        { name: 'Other Sales', value: 50200 },
    ];
    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

    const weeklySales = [
        { name: 'S', value: 3000 },
        { name: 'M', value: 4500 },
        { name: 'T', value: 6000 },
        { name: 'W', value: 8500 },
        { name: 'T', value: 4000 },
        { name: 'F', value: 3500 },
        { name: 'S', value: 2500 },
    ];

    const activities = [
        { text: "12 Invoices have been paid", time: "12 min ago", type: "invoice" },
        { text: "Client Meeting with John @10:15am", time: "45 min ago", type: "meeting" },
        { text: "Create a new project for client", time: "2 Day ago", type: "project" }
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <div className="m-4 space-y-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Ratings */}
                    <div className="bg-purple-300 p-4 rounded-xl text-white">
                        <p className="text-[20px] font-bold white-600">Kota dan Kabupaten Provinsi Jawa Timur</p>
                        <div className="flex items-center gap-4">
                            <h2 className="text-[50px] font-bold">38</h2>
                            <div className="flex flex-col">
                                <p className="bg-purple-300 px-0 py-1 rounded-xl text-white-600">9 Kota</p>
                                <p className="text-white-600">29 Kabupaten</p>
                            </div>
                        </div>

                    </div>
                    {/* Sessions */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-[20px] font-bold gray-600">Pengajuan Dispensasi</p>
                        <div className="flex items-center gap-4">
                            <h2 className="text-[50px] font-bold">1.120</h2>
                            <div className="flex flex-col"></div>
                        </div>
                            <p className="px-1 py-1 rounded-xl text-white-600">Pengajuan</p>
                         </div>
                    </div>
                    {/* Transactions */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-gray-600">Transactions</p>
                        <h2 className="text-xl font-bold">48.5% Growth</h2>
                        <div className="flex space-x-4 mt-2">
                            <div><p>Sales</p><h3>245k</h3></div>
                            <div><p>Users</p><h3>12.5k</h3></div>
                            <div><p>Product</p><h3>1.54k</h3></div>
                        </div>
                    </div>
                </div>

                {/* Sales, Revenue & Sales Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Sales */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p>Total Sales $21,845</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={salesData}>
                                <Line type="monotone" dataKey="sales" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Revenue Report */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p>Revenue Report</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={revenueData}>
                                <Bar dataKey="earning" fill="#00C49F" />
                                <Bar dataKey="expense" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Sales Overview */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p>Sales Overview</p>
                        <h3 className="text-xl font-bold">$86,400</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={salesOverview} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                                    {salesOverview.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Activity Timeline */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="font-semibold mb-2">Activity Timeline</h3>
                        <ul className="space-y-2">
                            {activities.map((a, i) => (
                                <li key={i} className="flex justify-between text-sm">
                                    <span>{a.text}</span>
                                    <span className="text-gray-500">{a.time}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Weekly Sales */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p>Weekly Sales</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={weeklySales}>
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-green-600 mt-2">$482k Total Profit</p>
                    </div>
                    {/* Growth & New Project */}
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <p>Total Growth</p>
                            <h2 className="text-2xl font-bold">42.5k</h2>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <p>New Project</p>
                            <h2 className="text-2xl font-bold">862</h2>
                            <p className="text-red-600">-18% Yearly Project</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Upgrade Plan */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p>Upgrade Plan</p>
                        <h2 className="text-xl font-bold">Platinum $5,250/Year</h2>
                        <button className="bg-purple-500 text-white px-4 py-2 rounded mt-4">Contact Now</button>
                    </div>
                    {/* Meeting Schedule */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p>Meeting Schedule</p>
                        <ul className="space-y-2 mt-2 text-sm">
                            <li>Call with Woods - 21 Jul</li>
                            <li>Call with Hilda - 24 Jul</li>
                            <li>Conference call - 28 Jul</li>
                            <li>Meeting with Mark - 03 Aug</li>
                        </ul>
                    </div>
                    {/* Developer Meetup */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p>Developer Meetup</p>
                        <h3 className="font-bold">24 Jan, NYC</h3>
                        <button className="bg-pink-500 text-white px-4 py-2 rounded mt-4"></button>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}
