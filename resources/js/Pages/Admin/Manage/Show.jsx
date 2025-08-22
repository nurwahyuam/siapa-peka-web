import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Show = () => {
    const { city } = usePage().props;
    const [selectedPeriod, setSelectedPeriod] = useState(0);

    // Group data by period
    const periods = city.applications.map((app) => app.period);
    const currentPeriod = periods[selectedPeriod] || {};

    // Find data for selected period
    const application =
        city.applications.find((app) => app.period_id === currentPeriod.id) ||
        {};
    const education =
        city.educationLevels.find(
            (edu) => edu.period_id === currentPeriod.id
        ) || {};
    const age =
        city.ageClassifications.find(
            (age) => age.period_id === currentPeriod.id
        ) || {};
    const reason =
        city.reasons.find((reason) => reason.period_id === currentPeriod.id) ||
        {};

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard Analytics
                    </h2>
                </div>
            }
        >
            <Head title={`Detail Data - ${city.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    Detail Data: {city.name}
                                </h2>
                                <Link
                                    href={route("excel-import.index")}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Kembali
                                </Link>
                            </div>

                            {/* Period Selector */}
                            {periods.length > 0 && (
                                <div className="mb-6">
                                    <label
                                        htmlFor="period"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Pilih Periode:
                                    </label>
                                    <select
                                        id="period"
                                        value={selectedPeriod}
                                        onChange={(e) =>
                                            setSelectedPeriod(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        {periods.map((period, index) => (
                                            <option
                                                key={period.id}
                                                value={index}
                                            >
                                                {period.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Informasi Umum
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Kabupaten/Kota:
                                            </span>
                                            <span>{city.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Jenis:
                                            </span>
                                            <span>{city.kind}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Kode Kemendagri:
                                            </span>
                                            <span>{city.code}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Periode:
                                            </span>
                                            <span>{currentPeriod.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Statistik Pengajuan
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Diajukan:
                                            </span>
                                            <span>
                                                {application.submitted || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Dikabulkan:
                                            </span>
                                            <span>
                                                {application.accepted || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Klasifikasi Usia
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                &lt; 15 Tahun:
                                            </span>
                                            <span>{age.less_than_15 || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                15-19 Tahun:
                                            </span>
                                            <span>
                                                {age.between_15_19 || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Tingkat Pendidikan
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Tidak Sekolah:
                                            </span>
                                            <span>
                                                {education.no_school || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                SD:
                                            </span>
                                            <span>{education.sd || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                SMP:
                                            </span>
                                            <span>{education.smp || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                SMA:
                                            </span>
                                            <span>{education.sma || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md md:col-span-2">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Alasan Dispensasi
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Hamil:
                                            </span>
                                            <span>{reason.pregnant || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Pergaulan Bebas:
                                            </span>
                                            <span>
                                                {reason.promiscuity || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Ekonomi:
                                            </span>
                                            <span>{reason.economy || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Budaya Adat:
                                            </span>
                                            <span>
                                                {reason.traditional_culture ||
                                                    0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between md:col-span-2">
                                            <span className="font-medium">
                                                Menghindari Zina:
                                            </span>
                                            <span>
                                                {reason.avoiding_adultery || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
