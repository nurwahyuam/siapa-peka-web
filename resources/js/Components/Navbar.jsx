import React, { useState } from "react";
import {
    X,
    BarChart3,
    TrendingUp,
    PieChart,
    Users,
    Calendar,
    Award,
} from "lucide-react";

export default function Navbar() {
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

    const modalContent = {
        ringkasan: {
            title: "Laporan Ringkasan",
            icon: <BarChart3 className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">
                                        Total Data Masuk
                                    </p>
                                    <p className="text-2xl font-bold text-blue-800">
                                        1,247
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-3">
                                <Award className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-green-600 font-medium">
                                        Total Diterima
                                    </p>
                                    <p className="text-2xl font-bold text-green-800">
                                        856
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">
                                        Total Dikabulkan
                                    </p>
                                    <p className="text-2xl font-bold text-purple-800">
                                        23.4k
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-3">
                            Pendidikan Terakhir Pelamar Dispensasi
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">
                                    Sekolah Dasar
                                </span>
                                <span className="text-sm text-gray-500">
                                    15 Orang
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">
                                    Sekolah Menengah Pertama
                                </span>
                                <span className="text-sm text-gray-500">
                                    28 Orang
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">
                                    Sekolah Menengah Atas
                                </span>
                                <span className="text-sm text-gray-500">
                                    33 Orang
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">
                                    Sekolah Menengah Kejuran
                                </span>
                                <span className="text-sm text-gray-500">
                                    33 Orang
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">
                                    Tidak Sekolah
                                </span>
                                <span className="text-sm text-gray-500">
                                    30 Orang
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        rerata: {
            title: "Analisis Rerata",
            icon: <TrendingUp className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 w-full ">
                        <div className="w-full bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                            <h4 className="font-semibold text-gray-800 mb-4">
                                Kabupaten Tertinggi
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-orange-600">
                                        78.5%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total Diterima
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-red-600">
                                        4.2%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total Dikabulkan
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                            <h4 className="font-semibold text-gray-800 mb-4">
                                Kabupaten Terendah
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-orange-600">
                                        78.5%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total Diterima
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-red-600">
                                        4.2%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total Dikabulkan
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">
                            Keseluruhan Rerata
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Pasuruan
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-4/5 h-full bg-blue-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        80%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Bangkalan
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Banyuwangi
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Gresik
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Blitar
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-full h-full bg-purple-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        95%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kota Blitar
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Bojonegoro
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Bondowoso
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Jember
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Jombang
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Sumenep
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Kediri
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kota Kediri
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">
                                    Kabupaten Probolinggo
                                </span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">
                                        60%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    };

    return (
        <>
            <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-16l md:px-24 lg:px-32 xl:px-48">
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
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-lg font-medium capitalize hover:scale-105 transform"
                            >
                                ringkasan
                            </button>
                            <button
                                onClick={() => openModal("rerata")}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-lg font-medium capitalize hover:scale-105 transform"
                            >
                                rerata
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
                            : "opacity-0 transform -translate-y-4 pointer-events-none hidden"
                    }`}
                >
                    <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-4 border border-gray-200/20">
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => openModal("ringkasan")}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50 text-left"
                            >
                                ringkasan
                            </button>
                            <button
                                onClick={() => openModal("rerata")}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50 text-left"
                            >
                                rerata
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modal Backdrop */}
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/20 max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
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
                                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
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
