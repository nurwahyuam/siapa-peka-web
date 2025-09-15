import { useState } from "react";
import { X, ChevronsUp } from "lucide-react";

export default function Legenda({
    currentYear,
    availableYears,
    onYearChange,
    colorScheme,
    onColorSchemeChange,
    showHighRiskOnly,
    onHighRiskChange,
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Tombol Toggle dengan animasi */}
            {!isOpen && (
                <div className="fixed bottom-6 inset-x-0 flex justify-center z-10">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 px-10 text-white py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 animate-bounce-once"
                    >
                        <ChevronsUp />
                    </button>
                </div>
            )}

            {/* Panel Filter dengan animasi */}
            <div className={`fixed bottom-0 w-full flex justify-center transition-all duration-500 ease-in-out z-20 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="relative bg-white shadow-xl rounded-lg px-4 py-3 border border-gray-200 m-4">

                    {/* Tombol X */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                    >
                        <X size={18} />
                    </button>

                    <div className="space-y-5 h-full w-full">
                        {/* Filter Tahun */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Periode Tahun :
                            </label>
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
                        {/* Konten Filter */}
                    <div className="block w-full">
                        <h4 className="block text-sm font-medium text-gray-700 mb-2">Warna Peta Berdasarkan yang Disetujui:</h4>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#FDDBC7] mr-2"></div>
                                <span>0-100</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#F4A582] mr-2"></div>
                                <span>101-250</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#B2182B] mr-2"></div>
                                <span>251-500</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-[#67001F] mr-2"></div>
                                <span>500+</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#E2E2E2] mr-2"></div>
                                    <span>0 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#FDDBC7] mr-2"></div>
                                    <span>1-100 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#F4A582] mr-2"></div>
                                    <span>100-250 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#B2182B] mr-2"></div>
                                    <span>251-500 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#67001F] mr-2"></div>
                                    <span>500+ Diterima</span>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </>
    );
}
