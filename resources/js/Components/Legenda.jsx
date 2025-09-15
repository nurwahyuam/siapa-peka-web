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
            {/* Panel Filter */}
            <div className={`fixed bottom-4 w-full flex justify-center`}>
                <div className="w-100 sm:w-1/2 lg:w-1/3 h-50 bg-white shadow-xl rounded-lg px-4 py-3 border border-gray-200 animate-slide-up block md:flex justify-between items-center gap-6">
                    {/* Konten Filter */}
                    <div className="space-y-4 w-full">
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
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}
