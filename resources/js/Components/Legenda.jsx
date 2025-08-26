export default function Legenda({
    currentYear,
    availableYears,
    onYearChange,
    colorScheme,
    onColorSchemeChange,
    showHighRiskOnly,
    onHighRiskChange,
}) {
    return (
        <>
            {/* Panel Filter */}
            <div className={`fixed bottom-4 w-full flex justify-center`}>
                <div className="w-100 sm:w-1/2 lg:w-1/3 h-50 bg-white shadow-xl rounded-lg px-4 py-3 border border-gray-200 animate-slide-up block md:flex justify-between items-center gap-6">
                    {/* Header
                    <div className="flex items-center justify-between mb-4 pb-2 border-b">
                        <h3 className="text-lg font-semibold text-gray-800">Filter Peta</h3>
                    </div> */}

                    {/* Konten Filter */}
                    <div className="space-y-4 w-full">
                        {/* Filter Tahun */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2">
                                Tahun
                            </label>
                            <select
                                value={currentYear}
                                onChange={(e) => onYearChange(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Warna Peta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Warna Peta
                            </label>
                            <select
                                value={colorScheme}
                                onChange={(e) =>
                                    onColorSchemeChange(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="accepted">
                                    Berdasarkan Jumlah Diterima
                                </option>
                                <option value="category">
                                    Berdasarkan Kategori Risiko
                                </option>
                            </select>
                        </div>

                        {/* Toggle Risiko Tinggi */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="highRiskOnly"
                                checked={showHighRiskOnly}
                                onChange={(e) =>
                                    onHighRiskChange(e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="highRiskOnly"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Tampilkan daerah berisiko tinggi saja
                            </label>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="hidden md:block w-full">
                        <h4 className="font-bold mb-2">Legenda</h4>
                        {colorScheme === "accepted" ? (
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#E2E2E2] mr-2"></div>
                                    <span>0 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#FFF4E0] mr-2"></div>
                                    <span>1-10 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#D8A5A5] mr-2"></div>
                                    <span>11-50 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#FFDADA] mr-2"></div>
                                    <span>51-100 Diterima</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#924A4A] mr-2"></div>
                                    <span>100+ Diterima</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#FFF4E0] mr-2"></div>
                                    <span>Risiko Rendah</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#D8A5A5] mr-2"></div>
                                    <span>Risiko Cukup</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#FFDADA] mr-2"></div>
                                    <span>Risiko Tinggi</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-[#924A4A] mr-2"></div>
                                    <span>Risiko Sangat Tinggi</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
