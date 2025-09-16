import React, { useState, useMemo } from "react";
import {
    X,
    BarChart3,
    TrendingUp,
    Users,
    Calendar,
    CheckCircle,
    BarChart2,
    BarChart,
    Award,
    Frown,
    XCircle,
    BadgeCheck,
    BadgeAlert,
    ArrowUpToLine,
    ArrowDownToLine,
} from "lucide-react";

export default function Navbar({
    cityFeatures = [],
    currentYear = new Date().getFullYear(),
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openModal = (modalType) => {
        setActiveModal(modalType);
        setIsMenuOpen(false);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    // Precompute data dengan useMemo untuk performa
    const computedData = useMemo(() => {
        const totalData = cityFeatures.reduce(
            (sum, city) => sum + (parseInt(city.total_accepted) || 0),
            0
        );

        const totalDiterima = cityFeatures.reduce(
            (sum, city) => sum + (parseInt(city.total_accepted) || 0),
            0
        );

        const pendidikanData = {
            sd: cityFeatures.reduce(
                (sum, city) => sum + (parseInt(city.education_data?.sd) || 0),
                0
            ),
            smp: cityFeatures.reduce(
                (sum, city) => sum + (parseInt(city.education_data?.smp) || 0),
                0
            ),
            sma: cityFeatures.reduce(
                (sum, city) => sum + (parseInt(city.education_data?.sma) || 0),
                0
            ),
            smk: cityFeatures.reduce(
                (sum, city) => sum + (parseInt(city.education_data?.smk) || 0),
                0
            ),
            no_school: cityFeatures.reduce(
                (sum, city) =>
                    sum + (parseInt(city.education_data?.no_school) || 0),
                0
            ),
        };

        // Filter kota dengan data
        const citiesWithData = cityFeatures.filter(
            (city) => parseInt(city.total_accepted) > 0
        );

        // Temukan kabupaten tertinggi dan terendah
        const sortedCities =
            citiesWithData.length > 0
                ? [...citiesWithData].sort(
                      (a, b) =>
                          parseInt(b.total_accepted) -
                          parseInt(a.total_accepted)
                  )
                : [];

        const highestCity = sortedCities.length > 0 ? sortedCities[0] : null;
        const lowestCity =
            sortedCities.length > 0
                ? sortedCities[sortedCities.length - 1]
                : null;

        // Hitung rata-rata
        const totalAccepted = citiesWithData.reduce(
            (sum, city) => sum + parseInt(city.total_accepted),
            0
        );
        const averageAccepted =
            citiesWithData.length > 0
                ? totalAccepted / citiesWithData.length
                : 0;

        return {
            totalData,
            totalDiterima,
            pendidikanData,
            citiesWithData,
            sortedCities,
            highestCity,
            lowestCity,
            totalAccepted,
            averageAccepted,
        };
    }, [cityFeatures]);

    const modalContent = {
        ringkasan: {
            title: "Laporan Ringkasan",
            icon: <BarChart3 className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">
                                        Total Data Diajukan
                                    </p>
                                    <p className="text-2xl font-bold text-blue-800">
                                        {computedData.totalData.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-green-600 font-medium">
                                        Total Data Diterima
                                    </p>
                                    <p className="text-2xl font-bold text-green-800">
                                        {computedData.totalDiterima.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                            <div className="flex items-center space-x-3">
                                <BarChart className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">
                                        Rata-rata Diajukan
                                    </p>
                                    <p className="text-2xl font-bold text-purple-800">
                                        {(computedData.totalData / 38).toFixed(
                                            2
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-xl border border-sky-200">
                            <div className="flex items-center space-x-3">
                                <BarChart2 className="w-8 h-8 text-sky-600" />
                                <div>
                                    <p className="text-sm text-sky-600 font-medium">
                                        Rata-rata Diterima
                                    </p>
                                    <p className="text-2xl font-bold text-sky-800">
                                        {(
                                            computedData.totalDiterima / 38
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                            <div className="flex items-center space-x-3">
                                <ArrowUpToLine className="w-8 h-8 text-orange-600" />
                                <div>
                                    <p className="text-sm text-orange-600 font-medium">
                                        Kabupaten Tertinggi :{" "}
                                        {computedData.highestCity.name}
                                    </p>
                                    <p className="text-2xl font-bold text-orange-800">
                                        {parseInt(
                                            computedData.highestCity
                                                .total_accepted
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                            <div className="flex items-center space-x-3">
                                <ArrowDownToLine className="w-8 h-8 text-orange-600" />
                                <div>
                                    <p className="text-sm text-orange-600 font-medium">
                                        Kabupaten Terendah :{" "}
                                        {computedData.lowestCity.name}
                                    </p>
                                    <p className="text-2xl font-bold text-orange-800">
                                        {parseInt(
                                            computedData.lowestCity
                                                .total_accepted
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            {computedData.sortedCities.map((city, index) => {
                                const percentage =
                                    (parseInt(city.total_accepted) /
                                        computedData.totalAccepted) *
                                    100;
                                const progressWidth = Math.min(percentage, 100);

                                // Tentukan warna berdasarkan ranking
                                let progressColor = "bg-green-500";
                                if (index < 3) progressColor = "bg-purple-500";
                                if (index === 0)
                                    progressColor = "bg-orange-500";
                                if (
                                    index >
                                    computedData.sortedCities.length - 4
                                )
                                    progressColor = "bg-blue-500";

                                return (
                                    <div
                                        key={city.code}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                                    >
                                        <span className="text-gray-700 text-sm flex-1">
                                            {city.name}
                                        </span>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${progressColor} transition-all duration-300`}
                                                    style={{
                                                        width: `${progressWidth}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 w-12 text-right">
                                                {Math.round(percentage)}%
                                            </span>
                                            <span className="text-sm font-bold text-gray-800 w-16 text-right">
                                                {parseInt(
                                                    city.total_accepted
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ),
        },
    };

    return (
        <>
            <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-12 md:px-18 lg:px-24 xl:px-24">
                <div
                    className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 sm:px-6 py-3 border border-gray-200/20"
                    style={{ height: "70px" }}
                >
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center">
                            <img
                                src="/assets/dp3ak.png"
                                alt="logo dp3ak"
                                className="w-auto h-8 sm:h-10 md:h-12 object-contain"
                            />
                        </div>

                        <h1 className="font-bold text-indigo-500 text-2xl sm:text-2xl lg:text-4xl md:block uppercase">
                            Siapa Peka
                        </h1>

                        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                            <button
                                onClick={() => openModal("ringkasan")}
                                className="text-white hover:opacity-90 transition-colors duration-200 text-md font-medium capitalize transform bg-indigo-500 py-2 px-3 rounded-full"
                            >
                                Ringkasan
                            </button>
                        </div>

                        <button
                            onClick={toggleMenu}
                            className="lg:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
                            aria-label="Toggle menu"
                        >
                            <div
                                className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                                    isMenuOpen
                                        ? "rotate-45 translate-y-1.5"
                                        : ""
                                }`}
                            ></div>
                            <div
                                className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                                    isMenuOpen ? "opacity-0" : ""
                                }`}
                            ></div>
                            <div
                                className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${
                                    isMenuOpen
                                        ? "-rotate-45 -translate-y-1.5"
                                        : ""
                                }`}
                            ></div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden mt-4 transition-all duration-300 ${
                        isMenuOpen
                            ? "opacity-100 transform translate-y-0"
                            : "opacity-0 transform -translate-y-4 pointer-events-none"
                    }`}
                    style={isMenuOpen ? {} : { display: "none" }}
                >
                    <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-4 border border-gray-200/20">
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => openModal("ringkasan")}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50 text-left"
                            >
                                Ringkasan
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modal Backdrop */}
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/20 max-w-4xl w-full max-h-[85vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    {modalContent[activeModal].icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {modalContent[activeModal].title}
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                            >
                                <XCircle className="w-7 h-7 text-gray-500 group-hover:text-gray-700" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                            {modalContent[activeModal].content}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end p-6 border-t border-gray-200/50">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
