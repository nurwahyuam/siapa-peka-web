import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

export default function ModalDetail({ isOpen, onClose, feature, currentYear }) {
    const [applicationData, setapplicationData] = useState([]);
    const [reasonData, setreasonData] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [ageData, setAgeData] = useState([]);
    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    // Prepare education data for chart
    useEffect(() => {
        if (feature?.application) {
            const data = [
                {
                    name: "Diajukan",
                    value: feature.application.submitted || 0,
                    color: "#1F78B4",
                },
                {
                    name: "Disetujui",
                    value: feature.application.accepted || 0,
                    color: "#33A02C",
                },
                {
                    name: "Ditolak",
                    value: feature.application.rejected || 0,
                    color: "#ff0000",
                },
            ].filter((item) => item.value > 0);

            setapplicationData(data);
        }

        if (feature?.reason_data) {
            const data = [
                {
                    name: "Menghindari Zina",
                    value: feature.reason_data.avoiding_adultery || 0,
                    color: "#0468BF",
                },
                {
                    name: "Ekonomi",
                    value: feature.reason_data.ecomony || 0,
                    color: "#115D8C",
                },
                {
                    name: "Hamil",
                    value: feature.reason_data.pregnant || 0,
                    color: "#A2D4F2",
                },
                {
                    name: "Pergaulan Bebas",
                    value: feature.reason_data.promiscuity || 0,
                    color: "#88C9F2",
                },
                {
                    name: "Budaya Sosial",
                    value: feature.reason_data.traditional_culture || 0,
                    color: "#05AFF2",
                },
            ].filter((item) => item.value > 0);

            setreasonData(data);
        }

        if (feature?.education_data) {
            const data = [
                {
                    name: "SD",
                    value: feature.education_data.sd || 0,
                    color: "#F57D59",
                },
                {
                    name: "SMP",
                    value: feature.education_data.smp || 0,
                    color: "#DB3C0D",
                },
                {
                    name: "SMA",
                    value: feature.education_data.sma || 0,
                    color: "#A82E0A",
                },
                {
                    name: "Tidak Sekolah",
                    value: feature.education_data.no_school || 0,
                    color: "#5B1905",
                },
            ].filter((item) => item.value > 0);

            setEducationData(data);
        }

        // Prepare age data for bar chart
        if (feature?.age_data) {
            const data = [
                {
                    name: "< 15 Tahun",
                    value: feature.age_data.less_than_15 || 0,
                    color: "#A6CEE3",
                },
                {
                    name: "15-19 Tahun",
                    value: feature.age_data.between_15_19 || 0,
                    color: "#B2DF8A",
                },
            ].filter((item) => item.value > 0);

            setAgeData(data);
        }
    }, [feature]);

    // Don't render if not open
    if (!isOpen || !feature) return null;

    const totalEducation = educationData.reduce(
        (sum, item) => sum + item.value,
        0
    );
    const totalAge = ageData.reduce((sum, item) => sum + item.value, 0);
    const totalReason = reasonData.reduce((sum, item) => sum + item.value, 0);

    // Custom tooltip untuk pie chart
    const PieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage =
                totalEducation > 0
                    ? ((data.value / totalEducation) * 100).toFixed(1)
                    : 0;

            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">
                        Jumlah: {data.value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip untuk bar chart
    const BarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage =
                totalAge > 0 ? ((data.value / totalAge) * 100).toFixed(1) : 0;

            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">
                        Jumlah: {data.value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom shape untuk bar chart (segitiga)
    const getPath = (x, y, width, height) => {
        return `M${x},${y + height}C${x + width / 3},${y + height} ${
            x + width / 2
        },${y + height / 3}
            ${x + width / 2}, ${y}
            C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${
            y + height
        } ${x + width}, ${y + height}
            Z`;
    };

    const TriangleBar = (props) => {
        const { fill, x, y, width, height } = props;
        return (
            <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 pb-6">
                    {/* Header */}
                    <div className="mb-4 sticky top-0 bg-white z-10 border-b pb-4 pt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold capitalize">
                                {feature?.name || "N/A"}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label="Tutup modal"
                            >
                                <XCircle className="w-7 h-7" />
                            </button>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-semibold text-gray-700">
                                Kode :
                            </span>
                            <span className="text-gray-900">
                                {feature.code || "N/A"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-semibold text-gray-700">
                                Periode :
                            </span>
                            <span className="text-gray-900">
                                {feature.year[0] || "N/A"}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-semibold text-gray-700">
                                Jumlah Dispensasi:
                            </span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    feature?.application?.accepted > 0 &&
                                    feature?.application?.accepted <= 100
                                        ? "bg-[#FDDBC7]"
                                        : feature?.application?.accepted >
                                              100 &&
                                          feature?.application?.accepted <= 250
                                        ? "bg-[#F4A582]"
                                        : feature?.application?.accepted >
                                              250 &&
                                          feature?.application?.accepted <= 500
                                        ? "bg-[#B2182B] text-white"
                                        : feature?.application?.accepted > 500
                                        ? "bg-[#67001F] text-white"
                                        : "bg-[#E2E2E2]"
                                }`}
                            >
                                {typeof feature?.application?.accepted ===
                                "number" ? (
                                    <>
                                        {feature.application.accepted > 0 &&
                                        feature.application.accepted <= 100
                                            ? "1-100 Disetujui"
                                            : feature.application.accepted >
                                                  100 &&
                                              feature.application.accepted <=
                                                  250
                                            ? "100-250 Disetujui"
                                            : feature.application.accepted >
                                                  250 &&
                                              feature.application.accepted <=
                                                  500
                                            ? "251-500 Disetujui"
                                            : feature.application.accepted > 500
                                            ? "500+ Disetujui"
                                            : "0 Disetujui"}
                                    </>
                                ) : (
                                    <>0 Disetujui</>
                                )}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-semibold text-gray-700">
                                Sumber :
                            </span>
                            <span className="block md:hidden text-blue-600 font-medium">
                                {(() => {
                                    const srcArr = Array.isArray(
                                        feature?.application?.sources
                                    )
                                        ? feature?.application?.sources.flat()
                                        : [];
                                    const names = srcArr
                                        .map((s) => s?.name)
                                        .filter(Boolean);

                                    if (names.length === 0) return "N/A";
                                    if (names.length <= 1)
                                        return names.join(", ");
                                    return `${names
                                        .slice(0, 1)
                                        .join(", ")}, ...`;
                                })()}
                            </span>
                            <span className="hidden md:block text-blue-600 font-medium">
                                {(() => {
                                    const srcArr = Array.isArray(
                                        feature?.application?.sources
                                    )
                                        ? feature?.application?.sources.flat()
                                        : [];
                                    const names = srcArr
                                        .map((s) => s?.name)
                                        .filter(Boolean);

                                    if (names.length === 0) return "N/A";
                                    if (names.length <= 2)
                                        return names.join(", ");
                                    return `${names
                                        .slice(0, 2)
                                        .join(", ")}, ...`;
                                })()}
                            </span>
                        </div>
                    </div>

                    {/* Application Section with Bar Chart */}
                    {feature.application && applicationData.length > 0 && (
                        <div className="mt-6 border-b">
                            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                                Permohonan Dispensasi Kawin
                            </h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Bar Chart */}
                                <div className="h-64 w-75%">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={applicationData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip content={<BarTooltip />} />
                                            <Bar
                                                dataKey="value"
                                                label={{ position: "top" }}
                                            >
                                                {applicationData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Data Table */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-gray-700 mb-3">
                                            Detail Jumlah
                                        </h5>
                                        <div className="space-y-3">
                                            {applicationData.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <div className="flex items-center">
                                                            <div
                                                                className="w-3 h-3 rounded-sm mr-2"
                                                                style={{
                                                                    backgroundColor:
                                                                        item.color,
                                                                }}
                                                            ></div>
                                                            <span className="text-sm">
                                                                {item.name}:
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold">
                                                            {item.value.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reason Section with Bar Chart */}
                    {feature.reason_data && reasonData.length > 0 && (
                        <div className="mt-6 border-b">
                            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                                Alasan Dispensasi Kawin
                            </h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Data Table */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-gray-700 mb-3">
                                            Detail Jumlah
                                        </h5>
                                        <div className="space-y-3">
                                            {reasonData.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center"
                                                >
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-sm mr-2"
                                                            style={{
                                                                backgroundColor:
                                                                    item.color,
                                                            }}
                                                        ></div>
                                                        <span className="text-sm">
                                                            {item.name}:
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold">
                                                        {item.value.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex justify-between items-center font-semibold">
                                                    <span>Total:</span>
                                                    <span>
                                                        {totalReason.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={reasonData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                label={({ name }) => `${name}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {reasonData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip content={<PieTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Education Data Section with Pie Chart */}
                    {feature.education_data && educationData.length > 0 && (
                        <div className="mt-6 border-b">
                            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                                Data Pendidikan
                            </h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={educationData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={true}
                                                label={({ name }) => `${name}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {educationData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip content={<PieTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Data Table */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-gray-700 mb-3">
                                            Detail Jumlah
                                        </h5>
                                        <div className="space-y-2">
                                            {educationData.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <div className="flex items-center">
                                                            <div
                                                                className="w-3 h-3 rounded-sm mr-2"
                                                                style={{
                                                                    backgroundColor:
                                                                        item.color,
                                                                }}
                                                            ></div>
                                                            <span className="text-sm">
                                                                {item.name}:
                                                            </span>
                                                        </div>
                                                        <span className="font-semibold">
                                                            {item.value.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex justify-between items-center font-semibold">
                                                    <span>Total:</span>
                                                    <span>
                                                        {totalEducation.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Age Data Section with Bar Chart */}
                    {feature.age_data && ageData.length > 0 && (
                        <div className="mt-6 border-b">
                            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                                Klasifikasi Usia
                            </h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Data Table */}
                                <div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-gray-700 mb-3">
                                            Detail Jumlah
                                        </h5>
                                        <div className="space-y-3">
                                            {ageData.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center"
                                                >
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-sm mr-2"
                                                            style={{
                                                                backgroundColor:
                                                                    item.color,
                                                            }}
                                                        ></div>
                                                        <span className="text-sm">
                                                            {item.name}:
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold">
                                                        {item.value.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex justify-between items-center font-semibold">
                                                    <span>Total:</span>
                                                    <span>
                                                        {totalAge.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bar Chart */}
                                <div className="h-64 w-75%">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={ageData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip content={<BarTooltip />} />
                                            <Bar
                                                dataKey="value"
                                                fill="#8884d8"
                                                label={{ position: "top" }}
                                            >
                                                {ageData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
