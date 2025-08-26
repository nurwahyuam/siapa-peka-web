import { useState } from "react";
import {
    XCircle,
    ChevronLeft,
    Users,
    User,
    UserCheck,
    BarChart3,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Data dummy untuk statistik penduduk Indonesia
const populationData = {
    2020: [
        { provinsi: "DKI Jakarta", laki: 4221, perempuan: 4215, total: 8436 },
        { provinsi: "Jawa Barat", laki: 24731, perempuan: 24685, total: 49416 },
        {
            provinsi: "Jawa Tengah",
            laki: 16997,
            perempuan: 17042,
            total: 34039,
        },
        {
            provinsi: "Jawa Timur",
            laki: 194436,
            perempuan: 194932,
            total: 389368,
        },
        { provinsi: "Banten", laki: 6213, perempuan: 6178, total: 12391 },
    ],
    2021: [
        { provinsi: "DKI Jakarta", laki: 4250, perempuan: 4245, total: 8495 },
        { provinsi: "Jawa Barat", laki: 24980, perempuan: 24930, total: 49910 },
        {
            provinsi: "Jawa Tengah",
            laki: 17120,
            perempuan: 17165,
            total: 34285,
        },
        {
            provinsi: "Jawa Timur",
            laki: 195800,
            perempuan: 196300,
            total: 392100,
        },
        { provinsi: "Banten", laki: 6280, perempuan: 6245, total: 12525 },
    ],
    2022: [
        { provinsi: "DKI Jakarta", laki: 4280, perempuan: 4275, total: 8555 },
        { provinsi: "Jawa Barat", laki: 25230, perempuan: 25180, total: 50410 },
        {
            provinsi: "Jawa Tengah",
            laki: 17245,
            perempuan: 17290,
            total: 34535,
        },
        {
            provinsi: "Jawa Timur",
            laki: 197200,
            perempuan: 197700,
            total: 394900,
        },
        { provinsi: "Banten", laki: 6350, perempuan: 6315, total: 12665 },
    ],
    2023: [
        { provinsi: "DKI Jakarta", laki: 4310, perempuan: 4305, total: 8615 },
        { provinsi: "Jawa Barat", laki: 25480, perempuan: 25430, total: 50910 },
        {
            provinsi: "Jawa Tengah",
            laki: 17370,
            perempuan: 17415,
            total: 34785,
        },
        {
            provinsi: "Jawa Timur",
            laki: 198600,
            perempuan: 199100,
            total: 397700,
        },
        { provinsi: "Banten", laki: 6420, perempuan: 6385, total: 12805 },
    ],
};

// Data untuk grafik perkembangan penduduk
const growthData = [
    { tahun: "2018", total: 264000, laki: 132500, perempuan: 131500 },
    { tahun: "2019", total: 267500, laki: 134000, perempuan: 133500 },
    { tahun: "2020", total: 270600, laki: 135500, perempuan: 135100 },
    { tahun: "2021", total: 273800, laki: 137100, perempuan: 136700 },
    { tahun: "2022", total: 275500, laki: 138000, perempuan: 137500 },
    { tahun: "2023", total: 278000, laki: 139200, perempuan: 138800 },
];

// Data untuk distribusi jenis kelamin
const genderDistribution = [
    { name: "Laki-laki", value: 139200, color: "#3B82F6" },
    { name: "Perempuan", value: 138800, color: "#EC4899" },
];

// Data untuk provinsi dengan penduduk terbanyak
const topProvinces = [
    { provinsi: "Jawa Barat", penduduk: 50910, persentase: 18.3 },
    { provinsi: "Jawa Timur", penduduk: 39770, persentase: 14.3 },
    { provinsi: "Jawa Tengah", penduduk: 34785, persentase: 12.5 },
    { provinsi: "Sumatera Utara", penduduk: 14790, persentase: 5.3 },
    { provinsi: "Banten", penduduk: 12805, persentase: 4.6 },
];

export default function Statistik({ year, cityFeatures, onToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedYear, setSelectedYear] = useState("2023");

    const handleToggle = (open) => {
        setIsOpen(open);
        if (onToggle) {
            onToggle(open); // Panggil callback function
        }
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat("id-ID").format(value);
    };

    const formatPopulation = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}JT`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}RB`;
        }
        return value;
    };

    return (
        <>
            <button
                onClick={() => handleToggle(true)}
                className={`${
                    isOpen ? "hidden" : ""
                } fixed bottom-48 right-6 lg:top-40 lg:bottom-auto bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 z-10`}
            >
                <ChevronLeft />
            </button>

            {isOpen && (
                <div className="fixed top-28 right-4 w-[640px] h-[420px] bg-white shadow-2xl rounded-lg border border-gray-200 animate-slide-up overflow-hidden z-50">
                    <div className="relative flex items-center justify-center p-4 pl-12 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <button
                            onClick={() => handleToggle(false)}
                            className="absolute left-4 p-2 hover:rotate-90 transition-transform hover:bg-gray-100 rounded-full"
                        >
                            <XCircle size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-center flex items-center gap-2">
                            <Users className="hidden sm:block" size={24} />
                            Statistik Pencegahan Perkawinan Anak
                        </h2>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 bg-gray-50">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === "overview"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Grafik Usia Pengantin Dibawah 19 Tahun
                        </button>
                        <button
                            onClick={() => setActiveTab("distribution")}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === "distribution"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Tren Dispensasi Kawin 3 Tahun Terakhir
                        </button>
                        <button
                            onClick={() => setActiveTab("provinces")}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === "provinces"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Data Survey Forum Anak
                        </button>
                    </div>

                    <div className="p-4 h-full overflow-auto">
                        {activeTab === "overview" && (
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">
                                        Data Penduduk Indonesia ({selectedYear})
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="font-semibold text-sm text-blue-700 flex items-center gap-1">
                                                <User size={16} />
                                                Laki-laki
                                            </div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {formatNumber(
                                                    growthData.find(
                                                        (d) =>
                                                            d.tahun ===
                                                            selectedYear
                                                    )?.laki * 1000 || 0
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                                            <div className="font-semibold text-sm text-pink-700 flex items-center gap-1">
                                                <UserCheck size={16} />
                                                Perempuan
                                            </div>
                                            <div className="text-lg font-bold text-pink-600">
                                                {formatNumber(
                                                    growthData.find(
                                                        (d) =>
                                                            d.tahun ===
                                                            selectedYear
                                                    )?.perempuan * 1000 || 0
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                            <div className="font-semibold text-sm text-purple-700 flex items-center gap-1">
                                                <Users size={16} />
                                                Total
                                            </div>
                                            <div className="text-lg font-bold text-purple-600">
                                                {formatNumber(
                                                    growthData.find(
                                                        (d) =>
                                                            d.tahun ===
                                                            selectedYear
                                                    )?.total * 1000 || 0
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="font-semibold mb-2">
                                    Perkembangan Jumlah Penduduk (2018-2023)
                                </h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={growthData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="tahun" />
                                        <YAxis
                                            tickFormatter={formatPopulation}
                                        />
                                        <Tooltip
                                            formatter={(value) => [
                                                `${formatNumber(value * 1000)}`,
                                                "",
                                            ]}
                                            labelFormatter={(label) =>
                                                `Tahun ${label}`
                                            }
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="total"
                                            name="Total Penduduk"
                                            stroke="#8B5CF6"
                                            strokeWidth={3}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="laki"
                                            name="Laki-laki"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="perempuan"
                                            name="Perempuan"
                                            stroke="#EC4899"
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {activeTab === "distribution" && (
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-4">
                                    Distribusi Jenis Kelamin ({selectedYear})
                                </h3>

                                <div className="flex w-full">
                                    <div className="w-1/2">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={genderDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({
                                                        name,
                                                        percent,
                                                    }) =>
                                                        `${name}: ${(
                                                            percent * 100
                                                        ).toFixed(1)}%`
                                                    }
                                                >
                                                    {genderDistribution.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    entry.color
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [
                                                        `${formatNumber(
                                                            value * 1000
                                                        )}`,
                                                        "",
                                                    ]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="w-1/2 pl-4">
                                        <h4 className="font-semibold mb-3">
                                            Proporsi Jenis Kelamin
                                        </h4>
                                        <div className="space-y-3">
                                            {genderDistribution.map((item) => (
                                                <div
                                                    key={item.name}
                                                    className="flex items-center"
                                                >
                                                    <div
                                                        className="w-4 h-4 rounded-sm mr-2"
                                                        style={{
                                                            backgroundColor:
                                                                item.color,
                                                        }}
                                                    ></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm">
                                                                {item.name}
                                                            </span>
                                                            <span className="text-sm font-semibold">
                                                                {(
                                                                    (item.value /
                                                                        (genderDistribution[0]
                                                                            .value +
                                                                            genderDistribution[1]
                                                                                .value)) *
                                                                    100
                                                                ).toFixed(1)}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                            <div
                                                                className="h-2 rounded-full"
                                                                style={{
                                                                    width: `${
                                                                        (item.value /
                                                                            (genderDistribution[0]
                                                                                .value +
                                                                                genderDistribution[1]
                                                                                    .value)) *
                                                                        100
                                                                    }%`,
                                                                    backgroundColor:
                                                                        item.color,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">
                                                Rasio Jenis Kelamin:{" "}
                                                <span className="font-semibold">
                                                    {(
                                                        (genderDistribution[0]
                                                            .value /
                                                            genderDistribution[1]
                                                                .value) *
                                                        100
                                                    ).toFixed(1)}
                                                </span>{" "}
                                                (Laki-laki per 100 Perempuan)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "provinces" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Penduduk per Provinsi ({selectedYear})
                                </h3>

                                <div className="mb-6">
                                    <h4 className="font-semibold mb-2">
                                        5 Provinsi dengan Penduduk Terbanyak
                                    </h4>
                                    <div className="space-y-3">
                                        {topProvinces.map((prov, index) => (
                                            <div
                                                key={prov.provinsi}
                                                className="flex items-center"
                                            >
                                                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-3">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">
                                                            {prov.provinsi}
                                                        </span>
                                                        <span className="font-semibold">
                                                            {formatNumber(
                                                                prov.penduduk *
                                                                    1000
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                        <div
                                                            className="h-2 rounded-full bg-blue-500"
                                                            style={{
                                                                width: `${prov.persentase}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <h4 className="font-semibold mb-2">
                                    Distribusi Penduduk per Provinsi (ribu jiwa)
                                </h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart
                                        data={populationData[selectedYear]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="provinsi" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value) => [
                                                `${formatNumber(value)}`,
                                                "",
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="laki"
                                            name="Laki-laki"
                                            fill="#3B82F6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="perempuan"
                                            name="Perempuan"
                                            fill="#EC4899"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
