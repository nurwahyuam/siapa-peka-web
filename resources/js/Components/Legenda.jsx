import { useState } from "react";
import { X, ChevronsUp, XCircle } from "lucide-react";

export default function Legenda({
    currentYear,
    availableYears,
    onYearChange,
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Tombol Toggle dengan animasi */}
            {!isOpen && (
                <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-6 z-10 pointer-events-none">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 px-10 text-white py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-bounce-once pointer-events-auto"
                    >
                        <ChevronsUp />
                    </button>
                </div>
            )}

            {/* Panel Filter dengan animasi */}
            <div
                className={`fixed bottom-0 w-full flex justify-center transition-all duration-500 ease-in-out -z-1 ${
                    isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0 pointer-events-none"
                }`}
            >
                <div className="relative w-[250px] bg-white shadow-xl rounded-lg px-4 py-3 border border-gray-200 m-4 mx-auto">
                    <div className="w-full mb-3">
                        {/* Filter Tahun */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Periode Tahun :
                                </label>
                                {/* Tombol X */}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <select
                                value={currentYear}
                                onChange={(e) => onYearChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Konten Filter */}
                    <div className="block w-full">
                        <h4 className="block text-sm font-medium text-gray-700 mb-2">
                            Warna Peta Berdasarkan :
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#FDDBC7] mr-2"></div>
                                <span>1-100 Disetujui</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#F4A582] mr-2"></div>
                                <span>100-250 Disetujui</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#B2182B] mr-2"></div>
                                <span>251-500 Disetujui</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#67001F] mr-2"></div>
                                <span>500+ Disetujui</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
