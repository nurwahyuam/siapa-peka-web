import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { LayoutDashboard } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
    const { yearlyData } = usePage().props;
    const stats = yearlyData.years.map((year, index) => ({
        year,
        accepted: yearlyData.accepted[index],
        submitted: yearlyData.submitted[index],
    }));
    const totalSubmitted = stats.reduce((sum, item) => sum + item.submitted, 0);
    const totalAccepted = stats.reduce((sum, item) => sum + item.accepted, 0);
    return (
        <AuthenticatedLayout
            header={
                <>
                    <div className="flex items-center gap-2">
                        <LayoutDashboard />
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Beranda
                        </h2>
                    </div>
                </>
            }
        >
            <div className="m-4 space-y-6 rounded-lg">
                {/* Header Section */}
                <div className="relative bg-[url('/assets/Header.jpg')] bg-center bg-cover w-full h-60   flex items-center justify-between p-8 shadow-lg rounded-xl">
                    <div>
                        <p className="text-5xl font-extrabold text-white">
                            Selamat Datang
                        </p>
                        <p className="text-white font-semibold mt-2 text-xl">
                            Sistem Informasi Digital Pencegahan Perkawinan Sejak
                            Dini
                        </p>
                    </div>
                    <div className="w-40 h-40">
                        {/* Bisa taruh logo atau ilustrasi */}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Kota/Kabupaten Card */}
                    <div className="bg-[#7B68EE] p-6 rounded-xl text-white">
                        <p className="text-lg font-semibold">
                            Kota dan Kabupaten Provinsi Jawa Timur
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <h2 className="text-5xl font-bold">38</h2>
                            <div className="flex flex-col">
                                <p className="text-sm px-2 py-1 rounded-md">
                                    9 Kota
                                </p>
                                <p className="text-sm mt-1">29 Kabupaten</p>
                            </div>
                        </div>
                    </div>

                    {/* Pengajuan Cuti Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-lg font-bold text-gray-700">
                            Diterima
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <h2 className="text-5xl font-bold ">
                                {totalAccepted}
                            </h2>
                        </div>
                    </div>

                    {/* Pengajuan Dispensasi Card */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <p className="text-lg font-bold text-gray-700">
                            Pengajuan
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <h2 className="text-5xl font-bold">
                                {totalSubmitted}
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold mb-4">
                        Statistik Pengajuan
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={stats}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="submitted"
                                stroke="#8884d8"
                                strokeWidth={3}
                                name="Diterima"
                            />
                            <Line
                                type="monotone"
                                dataKey="accepted"
                                stroke="#82ca9d"
                                strokeWidth={3}
                                name="Diajukan"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Card Ringkasan Tahunan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((item) => (
                        <div
                            key={item.year}
                            className="bg-white p-6 rounded-lg shadow-sm"
                        >
                            <p className="text-lg font-bold text-gray-700">
                                Tahun {item.year}
                            </p>
                            <div className="mt-2">
                                <p className="text-gray-500">Total Diterima</p>
                                <h2 className="text-3xl font-bold">
                                    {item.submitted.toLocaleString()}
                                </h2>
                            </div>
                            <div className="mt-2">
                                <p className="text-gray-500">Total Diajukan</p>
                                <h2 className="text-3xl font-bold">
                                    {item.accepted.toLocaleString()}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
