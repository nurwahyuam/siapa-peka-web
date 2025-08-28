import React, { useMemo, useState } from "react";
import { Head,usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    RadialBarChart,
    RadialBar,
    Legend,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

const COLORS = {
    application: {
        accepted: "#800000", // Maroon tua
        submitted: "#CD5C5C", // Indian Red
    },
    childBride: {
        men: "#B22222", // Firebrick
        women: "#F08080", // Light Coral
        total: "#F5DEB3", // Krem
    }
};

// Custom Tooltip untuk Application
const ApplicationTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const total = payload[0].payload.total || (payload[0].value + payload[1].value);
        return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
            <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
            <p className="text-sm">
            <span className="font-medium">{payload[0].value}</span> aplikasi
            </p>
            {payload[0].payload.name === "Accepted" && (
            <p className="text-xs text-gray-500 mt-1">
                {total > 0 ? `${Math.round((payload[0].value / total) * 100)}% dari total aplikasi` : 'Tidak ada data'}
            </p>
            )}
        </div>
        );
    }
    return null;
};

// Custom Tooltip untuk Child Bride
const ChildBrideTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const total = payload[0].payload.total;
        return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
            <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
            <p className="text-sm">
            <span className="font-medium">{payload[0].value}</span> orang
            </p>
            {payload[0].payload.name !== "Total" && total > 0 && (
            <p className="text-xs text-gray-500 mt-1">
                {`${Math.round((payload[0].value / total) * 100)}% dari total`}
            </p>
            )}
        </div>
        );
    }
    return null;
};

// Custom Legend untuk chart
const CustomLegend = ({ payload }) => {
    return (
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
        {payload.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center text-xs">
            <div
                className="w-3 h-3 mr-1 rounded-full"
                style={{ backgroundColor: entry.color }}
            />
            <span className="font-bold">{entry.value}</span>
            </div>
        ))}
        </div>
    );
};

export default function Read() {
    const { cityFeatures = [] } = usePage().props;
    const [search, setSearch] = useState("");

    const filteredCities = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return cityFeatures;
        return cityFeatures.filter((c) => c.name?.toLowerCase().includes(q));
    }, [cityFeatures, search]);

    const makeApplicationData = (city) => {
        const submitted = city?.application?.submitted || 0;
        const accepted = city?.application?.accepted || 0;
        const total = submitted + accepted;
        
        return [
        { 
            name: "Diajukan ", 
            value: submitted, 
            fill: COLORS.application.submitted,
            total: total
        },
        { 
            name: "Diterima", 
            value: accepted, 
            fill: COLORS.application.accepted,
            total: total
        },
        ];
    };

    const makeChildBrideData = (city) => {
        const men = city?.child_bride_data?.men_under_19 || 0;
        const women = city?.child_bride_data?.women_under_19 || 0;
        const total = city?.child_bride_data?.total || 0;
        
        return [
        { 
            name: "Laki-laki ", 
            value: men, 
            fill: COLORS.childBride.men,
            total: total
        },
        { 
            name: "Perempuan", 
            value: women, 
            fill: COLORS.childBride.women,
            total: total
        },
        { 
            name: "Total", 
            value: total, 
            fill: COLORS.childBride.total,
            total: total
        },
        ];
    };
    return (
        <AuthenticatedLayout
        header={
            <div className="flex items-center gap-3 w-full">
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Analytics
                </h2>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari daerah…"
                    className="w-40 md:w-72 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#800000] ml-auto"
                />
            </div>
        }
        >
        <Head title="Statistik" />
        <div className="p-6">
            {filteredCities.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg font-medium">Tidak ada daerah yang cocok dengan pencarian.</p>
                <p className="text-gray-400 text-sm mt-2">Coba kata kunci lain atau lihat semua daerah</p>
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city) => {
                const applicationData = makeApplicationData(city);
                const childBrideData = makeChildBrideData(city);
                
                return (
                    <div
                    key={city.id ?? city.code ?? city.name}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                    >
                    {/* Header dengan gradien */}
                    <div className="bg-gradient-to-r from-[#800000] to-[#B22222] text-white p-4">
                        <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold">{city.name}</h3>
                            <p className="text-xs opacity-90">{city.province}</p>
                        </div>
                        <div className="bg-white/20 p-1 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col gap-5 flex-grow">
                        {/* Application - RadialBar */}
                        <section className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                            <svg className="w-4 h-4 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Application
                            </h4>
                            <div className="text-xs text-gray-500">
                            Total: {applicationData[0].total}
                            </div>
                        </div>
                        
                        <div className="h-60 flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="30%"
                                outerRadius="90%"
                                barSize={16}
                                data={applicationData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar
                                minAngle={15}
                                background
                                clockWise
                                dataKey="value"
                                cornerRadius={8}
                                />
                                <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xl font-bold"
                                fill="#800000"
                                >
                                {applicationData[1].value}
                                </text>
                                <text
                                x="50%"
                                y="60%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px]"
                                fill="#666"
                                >
                                Diterima
                                </text>
                                <Tooltip content={<ApplicationTooltip />} />
                            </RadialBarChart>
                            </ResponsiveContainer>
                            <CustomLegend payload={applicationData.map(item => ({
                            value: item.name,
                            color: item.fill
                            }))} />
                        </div>
                        </section>

                        {/* Child Bride - PieChart */}
                        <section className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                            <svg className="w-4 h-4 text-[#B22222]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Child Bride
                            </h4>
                            <div className="text-xs text-gray-500">
                            Total: {childBrideData[2].value}
                            </div>
                        </div>
                        
                        <div className="h-48 flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                data={childBrideData.filter(item => item.name !== "Total")}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                >
                                {childBrideData.filter(item => item.name !== "Total").map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                                </Pie>
                                <text
                                x="50%"
                                y="45%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-lg font-bold"
                                fill="#B22222"
                                >
                                {childBrideData[2].value}
                                </text>
                                <text
                                x="50%"
                                y="55%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs"
                                fill="#666"
                                >
                                Total
                                </text>
                                <Tooltip content={<ChildBrideTooltip />} />
                            </PieChart>
                            </ResponsiveContainer>
                            <CustomLegend payload={childBrideData.filter(item => item.name !== "Total").map(item => ({
                            value: item.name,
                            color: item.fill
                            }))} />
                        </div>
                        </section>
                    </div>
                </div>
                );
                })}
            </div>
            )}
        </div>
        </AuthenticatedLayout>
    );
}