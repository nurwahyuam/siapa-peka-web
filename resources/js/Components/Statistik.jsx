import { useState } from "react";
import {
    XCircle,
    ChevronLeft,
    Users,
    User,
    UserCheck,
    BarChart3,
    Frown,
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

export default function Statistik({
    year,
    cityFeatures,
    forumChildren,
    yearlyData,
    onToggle,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const handleToggle = (open) => {
        setIsOpen(open);
        if (onToggle) {
            onToggle(open);
        }
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat("id-ID").format(value);
    };

    // Format data untuk grafik tren dispensasi kawin
    const formatDispensasiData = () => {
        if (
            !yearlyData ||
            !yearlyData.years ||
            !yearlyData.submitted ||
            !yearlyData.accepted
        ) {
            return [];
        }

        return yearlyData.years.map((year, index) => ({
            tahun: year.toString(),
            submitted: yearlyData.submitted[index],
            accepted: yearlyData.accepted[index],
        }));
    };

    const dispensasiData = formatDispensasiData();

    return (
        <>
            <button
                onClick={() => handleToggle(true)}
                className={`${
                    isOpen ? "hidden" : ""
                } fixed top-64 right-4 lg:bottom-auto bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 z-10`}
            >
                <ChevronLeft />
            </button>

            {isOpen && (
                <div className="fixed top-[106px] right-4 w-[640px] h-[440px] bg-white shadow-2xl rounded-lg border border-gray-200 animate-slide-up overflow-hidden z-50">
                    <div className="relative flex items-center justify-center p-4 pl-12 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <button
                            onClick={() => handleToggle(false)}
                            className="absolute left-4 p-2 transition-transform hover:text-gray-500 rounded-full"
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
                            className={`px-6 py-2 w-full text-sm font-medium transition-colors ${
                                activeTab === "overview"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Tren Dispensasi Kawin
                        </button>
                        <button
                            onClick={() => setActiveTab("cities")}
                            className={`px-6 py-2 w-full text-sm font-medium transition-colors ${
                                activeTab === "cities"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Pengantin 19 Tahun
                        </button>
                        <button
                            onClick={() => setActiveTab("survey")}
                            className={`px-6 py-2 w-full text-sm font-medium transition-colors ${
                                activeTab === "survey"
                                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Survey Forum Anak
                        </button>
                    </div>

                    <div className="p-4 overflow-auto">
                        {/* Chart Tren Dispensasi Kawin */}
                        {activeTab === "overview" && (
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Tren Dispensasi Kawin{" "}
                                        {dispensasiData.length} Tahun Terakhir
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Data Dispensasi Kawin di Jawa Timur
                                    </p>
                                </div>

                                {dispensasiData.length > 0 ? (
                                    <div className="flex items-center justify-center">
                                        <ResponsiveContainer
                                            width="100%"
                                            height={240}
                                        >
                                            <LineChart data={dispensasiData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="tahun" />
                                                <YAxis />
                                                <Tooltip
                                                    formatter={(
                                                        value,
                                                        name
                                                    ) => {
                                                        if (
                                                            name ===
                                                            "Total Diajukan"
                                                        )
                                                            return [
                                                                formatNumber(
                                                                    value
                                                                ),
                                                                "Diajukan",
                                                            ];
                                                        return [
                                                            formatNumber(value),
                                                            "Diterima",
                                                        ];
                                                    }}
                                                    labelFormatter={(label) =>
                                                        `Tahun ${label}`
                                                    }
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="submitted"
                                                    name="Total Diajukan"
                                                    stroke="#8B5CF6"
                                                    strokeWidth={3}
                                                    dot={{ r: 4 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="accepted"
                                                    name="Total Diterima"
                                                    stroke="#10B981"
                                                    strokeWidth={2}
                                                    dot={{ r: 3 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Frown
                                            size={48}
                                            className="text-gray-500 mb-3"
                                        />
                                        <p className="text-lg font-medium mb-1">
                                            Data Data Dispensasi Kawin di Jawa
                                            Timur Tidak Tersedia
                                        </p>
                                        <p className="text-sm">
                                            Untuk Periode {year}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Chart Data Pengantin Dibawah 19 Tahun */}
                        {activeTab === "cities" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    5 Kota Kabupaten Dengan Pengantin Dibawah 19
                                    Tahun (Periode {year})
                                </h3>

                                {/* Pengecekan yang benar untuk data yang tidak ada */}
                                {cityFeatures &&
                                cityFeatures.some(
                                    (city) =>
                                        city.child_bride_data &&
                                        city.child_bride_data.total > 0
                                ) ? (
                                    <>
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart
                                                data={cityFeatures
                                                    .filter(
                                                        (city) =>
                                                            city.child_bride_data &&
                                                            city
                                                                .child_bride_data
                                                                .total > 0
                                                    )
                                                    .sort(
                                                        (a, b) =>
                                                            b.child_bride_data
                                                                .total -
                                                            a.child_bride_data
                                                                .total
                                                    )
                                                    .slice(0, 5)
                                                    .map((city) => ({
                                                        name: city.name,
                                                        laki:
                                                            city
                                                                .child_bride_data
                                                                .men_under_19 ||
                                                            0,
                                                        perempuan:
                                                            city
                                                                .child_bride_data
                                                                .women_under_19 ||
                                                            0,
                                                        total:
                                                            city
                                                                .child_bride_data
                                                                .total || 0,
                                                    }))}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip
                                                    formatter={(
                                                        value,
                                                        name
                                                    ) => {
                                                        if (
                                                            name === "Laki-laki"
                                                        )
                                                            return [
                                                                formatNumber(
                                                                    value
                                                                ),
                                                                "Laki-laki < 19 tahun",
                                                            ];
                                                        if (
                                                            name === "Perempuan"
                                                        )
                                                            return [
                                                                formatNumber(
                                                                    value
                                                                ),
                                                                "Perempuan < 19 tahun",
                                                            ];
                                                        return [
                                                            formatNumber(value),
                                                            "Total",
                                                        ];
                                                    }}
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
                                                <Bar
                                                    dataKey="total"
                                                    name="Total"
                                                    fill="#8B5CF6"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>

                                        {/* Tampilkan data dalam tabel juga */}
                                        <div className="mt-6">
                                            <h4 className="font-semibold mb-3">
                                                Detail Data
                                            </h4>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full bg-white border border-gray-200">
                                                    <thead>
                                                        <tr className="bg-gray-50">
                                                            <th className="px-4 py-2 border-b text-left">
                                                                Kota
                                                            </th>
                                                            <th className="px-4 py-2 border-b text-center">
                                                                Laki-laki
                                                            </th>
                                                            <th className="px-4 py-2 border-b text-center">
                                                                Perempuan
                                                            </th>
                                                            <th className="px-4 py-2 border-b text-center">
                                                                Total
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {cityFeatures
                                                            .filter(
                                                                (city) =>
                                                                    city.child_bride_data &&
                                                                    city
                                                                        .child_bride_data
                                                                        .total >
                                                                        0
                                                            )
                                                            .sort(
                                                                (a, b) =>
                                                                    b
                                                                        .child_bride_data
                                                                        .total -
                                                                    a
                                                                        .child_bride_data
                                                                        .total
                                                            )
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    city,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            city.id
                                                                        }
                                                                        className={
                                                                            index %
                                                                                2 ===
                                                                            0
                                                                                ? "bg-gray-50"
                                                                                : "bg-white"
                                                                        }
                                                                    >
                                                                        <td className="px-4 py-2 border-b">
                                                                            {
                                                                                city.name
                                                                            }
                                                                        </td>
                                                                        <td className="px-4 py-2 border-b text-center">
                                                                            {formatNumber(
                                                                                city
                                                                                    .child_bride_data
                                                                                    .men_under_19
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-2 border-b text-center">
                                                                            {formatNumber(
                                                                                city
                                                                                    .child_bride_data
                                                                                    .women_under_19
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-2 border-b text-center font-semibold">
                                                                            {formatNumber(
                                                                                city
                                                                                    .child_bride_data
                                                                                    .total
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Frown
                                            size={48}
                                            className="text-gray-500 mb-3"
                                        />
                                        <p className="text-lg font-medium mb-1">
                                            Data pengantin dibawah 19 Tahun
                                            Tidak Tersedia
                                        </p>
                                        <p className="text-sm">
                                            Untuk Periode {year}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Data Survey Form Anak */}
                        {activeTab === "survey" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-1">
                                    Hasil Survey Forum Anak (Periode {year})
                                </h3>

                                {forumChildren && forumChildren.length > 0 ? (
                                    <div className="flex justify-between gap-2">
                                        {forumChildren.map((item, index) => {
                                            // Pastikan data ada sebelum membuat chart
                                            if (
                                                !item ||
                                                typeof item.yes_count ===
                                                    "undefined" ||
                                                typeof item.no_count ===
                                                    "undefined"
                                            ) {
                                                return (
                                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                                        <Frown
                                                            size={48}
                                                            className="text-gray-500 mb-3"
                                                        />
                                                        <p className="text-lg font-medium mb-1">
                                                            Data Hasil Survey
                                                            Forum Anak Tidak
                                                            Tersedia
                                                        </p>
                                                        <p className="text-sm">
                                                            Untuk Periode {year}
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            const yesCount =
                                                Number(item.yes_count) || 0;
                                            const noCount =
                                                Number(item.no_count) || 0;
                                            const total = yesCount + noCount;

                                            // Data untuk pie chart
                                            const pieData = [
                                                {
                                                    name: "Ya",
                                                    value: yesCount,
                                                    color: "#10B981",
                                                },
                                                {
                                                    name: "Tidak",
                                                    value: noCount,
                                                    color: "#EF4444",
                                                },
                                            ];

                                            const yesPercentage =
                                                total > 0
                                                    ? Math.round(
                                                          (yesCount / total) *
                                                              100
                                                      )
                                                    : 0;
                                            const noPercentage =
                                                total > 0
                                                    ? Math.round(
                                                          (noCount / total) *
                                                              100
                                                      )
                                                    : 0;

                                            return (
                                                <div
                                                    key={index}
                                                    className="w-full md:w-[48%] bg-white"
                                                >
                                                    <h4 className="font-medium text-gray-700 mb-2 text-center text-sm">
                                                        {item.question ||
                                                            "Pertanyaan tidak tersedia"}
                                                    </h4>

                                                    <div className="flex flex-col items-center">
                                                        {/* Pie Chart */}
                                                        <div className="h-48 w-full">
                                                            <ResponsiveContainer
                                                                width="100%"
                                                                height="100%"
                                                            >
                                                                <PieChart>
                                                                    <Pie
                                                                        data={
                                                                            pieData
                                                                        }
                                                                        cx="50%"
                                                                        cy="50%"
                                                                        innerRadius={
                                                                            40
                                                                        }
                                                                        outerRadius={
                                                                            70
                                                                        }
                                                                        paddingAngle={
                                                                            2
                                                                        }
                                                                        dataKey="value"
                                                                        labelLine={
                                                                            false
                                                                        }
                                                                    >
                                                                        {pieData.map(
                                                                            (
                                                                                entry,
                                                                                index
                                                                            ) => (
                                                                                <Cell
                                                                                    key={`cell-${index}`}
                                                                                    fill={
                                                                                        entry.color
                                                                                    }
                                                                                    stroke="#fff"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                    </Pie>
                                                                    <Tooltip
                                                                        formatter={(
                                                                            value,
                                                                            name
                                                                        ) => [
                                                                            `${formatNumber(
                                                                                value
                                                                            )} (${
                                                                                name ===
                                                                                "Ya"
                                                                                    ? yesPercentage
                                                                                    : noPercentage
                                                                            }%)`,
                                                                            "Jumlah",
                                                                        ]}
                                                                    />
                                                                    <Legend
                                                                        verticalAlign="bottom"
                                                                        height={
                                                                            36
                                                                        }
                                                                        formatter={(
                                                                            value,
                                                                            entry,
                                                                            index
                                                                        ) => (
                                                                            <span className="text-xs">
                                                                                {
                                                                                    value
                                                                                }

                                                                                :{" "}
                                                                                {formatNumber(
                                                                                    pieData[
                                                                                        index
                                                                                    ]
                                                                                        .value
                                                                                )}
                                                                            </span>
                                                                        )}
                                                                    />
                                                                </PieChart>
                                                            </ResponsiveContainer>
                                                        </div>

                                                        <div className="text-sm text-gray-600 text-center">
                                                            Total Responden:{" "}
                                                            <span className="font-semibold">
                                                                {formatNumber(
                                                                    total
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <Frown
                                            size={48}
                                            className="text-gray-500 mb-3"
                                        />
                                        <p className="text-lg font-medium mb-1">
                                            Data Hasil Survey Forum Anak Tidak
                                            Tersedia
                                        </p>
                                        <p className="text-sm">
                                            Untuk Periode {year}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
