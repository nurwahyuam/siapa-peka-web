import React, { useState, useMemo } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    BarChart3,
    GraduationCap,
    Users,
    FileText,
    ArrowLeft,
    MapPin,
    Calendar,
    CreditCard,
    CircleArrowLeft,
    CalendarClock,
} from "lucide-react";

function sumPeriodData(items, fields) {
    const result = {};
    fields.forEach((field) => {
        result[field] = items.reduce(
            (sum, item) => sum + (parseInt(item[field]) || 0),
            0
        );
    });
    return result;
}

const Show = () => {
    const { city } = usePage().props;
    const [selectedYear, setSelectedYear] = useState(2025); // Default tahun 2024

    console.log(city);

    // Extract available years from the data
    const availableYears = useMemo(() => {
        const years = new Set();

        // Collect years from all data sources
        const dataSources = [
            city?.applications,
            city?.education_levels,
            city?.child_brides,
            city?.age_classifications,
            city?.reasons,
        ];

        dataSources.forEach((data) => {
            data?.forEach((item) => {
                if (item?.period?.year) years.add(item.period.year);
            });
        });

        // Convert to array and sort descending
        return Array.from(years).sort((a, b) => b - a);
    }, [city]);

    const yearData = useMemo(() => {
        // Helper untuk filter data per tahun & periode
        const filterByYear = (arr) =>
            arr?.filter((item) => item.period?.year === selectedYear) || [];
        const findSetahun = (arr) =>
            filterByYear(arr).find(
                (item) => item.period?.name?.toLowerCase() === "setahun"
            );
        const filterTriwulan = (arr) =>
            filterByYear(arr).filter((item) =>
                item.period?.name?.toLowerCase().includes("triwulan")
            );

        // Applications
        let applications = findSetahun(city?.applications);
        if (!applications) {
            // Gabung data triwulan
            const triwulan = filterTriwulan(city?.applications);
            applications = sumPeriodData(triwulan, ["submitted", "accepted"]);
            // Gabungkan sumber
            applications.source = triwulan
                .map((t) => t.source)
                .filter(Boolean)
                .join(", ");
        }

        // Education Levels
        let education_levels = findSetahun(city?.education_levels);
        if (!education_levels) {
            const triwulan = filterTriwulan(city?.education_levels);
            education_levels = sumPeriodData(triwulan, [
                "no_school",
                "sd",
                "smp",
                "sma",
            ]);
        }

        // Age Classifications
        let age_classifications = findSetahun(city?.age_classifications);
        if (!age_classifications) {
            const triwulan = filterTriwulan(city?.age_classifications);
            age_classifications = sumPeriodData(triwulan, [
                "less_than_15",
                "between_15_19",
            ]);
        }

        // Child Brides
        let child_brides = findSetahun(city?.child_brides);
        if (!child_brides) {
            const triwulan = filterTriwulan(city?.child_brides);
            child_brides = sumPeriodData(triwulan, [
                "number_of_men_under_19",
                "number_of_women_under_19",
            ]);
        }
        child_brides.total =
            (child_brides.number_of_men_under_19 || 0) +
            (child_brides.number_of_women_under_19 || 0);

        // Reasons
        let reasons = findSetahun(city?.reasons);
        if (!reasons) {
            const triwulan = filterTriwulan(city?.reasons);
            reasons = sumPeriodData(triwulan, [
                "pregnant",
                "promiscuity",
                "economy",
                "traditional_culture",
                "avoiding_adultery",
            ]);
        }

        return {
            applications,
            education_levels,
            age_classifications,
            child_brides,
            reasons,
        };
    }, [selectedYear, city]);

    // Calculate percentages and totals
    const acceptanceRate =
        yearData.applications.submitted > 0
            ? (yearData.applications.accepted /
                  yearData.applications.submitted) *
              100
            : 0;

    const totalEducation =
        (yearData.education_levels.no_school || 0) +
        (yearData.education_levels.sd || 0) +
        (yearData.education_levels.smp || 0) +
        (yearData.education_levels.sma || 0);
    const totalReasons =
        (yearData.reasons.avoiding_adultery || 0) +
        (yearData.reasons.ecomony || 0) +
        (yearData.reasons.promiscuity || 0) +
        (yearData.reasons.pregnant || 0) +
        (yearData.reasons.traditional_culture || 0);
    const totalAge =
        (yearData.age_classifications.less_than_15 || 0) +
        (yearData.age_classifications.between_15_19 || 0);
    const totalChildBrides = yearData.child_brides.total || 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                        <CalendarClock />
                        Manajemen Data
                    </h2>
                </div>
            }
        >
            <Head title={`Detail ${city?.name || "City"} - SIAPA PEKA`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Header Section */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center">
                                        <Link
                                            href={route("manage.index")}
                                            className="flex hover:text-indigo-500 items-center transition-colors duration-200"
                                        >
                                            <CircleArrowLeft className="h-7 w-7 mr-2" />
                                        </Link>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Detail Data - {city?.name || "City"}
                                        </h1>
                                    </div>
                                    {availableYears.length > 0 && (
                                        <div className="flex items-center">
                                            <label className="mr-3 text-md font-medium text-gray-700">
                                                Pilih Tahun:
                                            </label>
                                            <select
                                                value={selectedYear}
                                                onChange={(e) =>
                                                    setSelectedYear(
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm transition-all duration-200"
                                            >
                                                {availableYears.map((year) => (
                                                    <option
                                                        key={year}
                                                        value={year}
                                                    >
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Info Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center">
                                            <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Pengajuan
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {yearData.applications
                                                        .submitted || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center">
                                            <BarChart3 className="h-8 w-8 text-green-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Dikabulkan
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {yearData.applications
                                                        .accepted || 0}
                                                </p>
                                                <p className="text-xs text-green-600">
                                                    {acceptanceRate.toFixed(1)}%
                                                    berhasil
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center">
                                            <GraduationCap className="h-8 w-8 text-purple-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Pendidikan
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {totalEducation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center">
                                            <Users className="h-8 w-8 text-orange-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Usia 15-19
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {yearData
                                                        .age_classifications
                                                        .between_15_19 || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex items-center">
                                            <Users className="h-8 w-8 text-red-500 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Pengantin Anak
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {totalChildBrides}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* General Information */}
                                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center">
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Informasi Dasar
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center py-2">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Kabupaten/Kota
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {city?.name || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center py-2">
                                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Tahun Data
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {selectedYear}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center py-2">
                                                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Code
                                                    </p>
                                                    <p className="font-medium text-gray-900">
                                                        {city?.code || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Application Statistics */}
                                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center">
                                            <FileText className="h-5 w-5 mr-2" />
                                            Statistik Pengajuan
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">
                                                    Diajukan:
                                                </span>
                                                <span className="text-lg font-semibold">
                                                    {yearData.applications
                                                        .submitted || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">
                                                    Disetujui:
                                                </span>
                                                <span className="text-lg font-semibold text-green-600">
                                                    {yearData.applications
                                                        .accepted || 0}
                                                </span>
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-gray-700">
                                                        Persentase Disetujui:
                                                    </span>
                                                    <span className="text-lg font-semibold">
                                                        {acceptanceRate.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${acceptanceRate}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            {yearData.applications.source && (
                                                <div className="pt-2 border-t border-gray-100">
                                                    <span className="text-sm text-gray-500">
                                                        Sumber:{" "}
                                                        {
                                                            yearData
                                                                .applications
                                                                .source
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Age Classification */}
                                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center">
                                            <Users className="h-5 w-5 mr-2" />
                                            Klasifikasi Usia
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">
                                                    &lt; 15 Tahun:
                                                </span>
                                                <span className="text-lg font-semibold">
                                                    {yearData
                                                        .age_classifications
                                                        .less_than_15 || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">
                                                    15-19 Tahun:
                                                </span>
                                                <span className="text-lg font-semibold">
                                                    {yearData
                                                        .age_classifications
                                                        .between_15_19 || 0}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">
                                                        Total:
                                                    </span>
                                                    <span className="text-lg font-semibold text-blue-600">
                                                        {totalAge}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Education Levels */}
                                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center">
                                            <GraduationCap className="h-5 w-5 mr-2" />
                                            Tingkat Pendidikan
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    label: "Tidak Sekolah",
                                                    value:
                                                        yearData
                                                            .education_levels
                                                            .no_school || 0,
                                                    color: "bg-red-500",
                                                },
                                                {
                                                    label: "SD",
                                                    value:
                                                        yearData
                                                            .education_levels
                                                            .sd || 0,
                                                    color: "bg-yellow-500",
                                                },
                                                {
                                                    label: "SMP",
                                                    value:
                                                        yearData
                                                            .education_levels
                                                            .smp || 0,
                                                    color: "bg-blue-500",
                                                },
                                                {
                                                    label: "SMA",
                                                    value:
                                                        yearData
                                                            .education_levels
                                                            .sma || 0,
                                                    color: "bg-green-500",
                                                },
                                            ].map((item, index) => (
                                                <div key={index}>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-medium text-gray-700">
                                                            {item.label}:
                                                        </span>
                                                        <span className="font-semibold">
                                                            {item.value}
                                                        </span>
                                                    </div>
                                                    {totalEducation > 0 && (
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`${item.color} h-2 rounded-full transition-all duration-300`}
                                                                style={{
                                                                    width: `${
                                                                        (item.value /
                                                                            totalEducation) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">
                                                        Total:
                                                    </span>
                                                    <span className="text-lg font-semibold text-purple-600">
                                                        {totalEducation}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Child Brides */}
                                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center">
                                            <Users className="h-5 w-5 mr-2" />
                                            Data Pengantin Anak
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">
                                                    Laki-laki &lt; 19 Tahun:
                                                </span>
                                                <span className="text-lg font-semibold">
                                                    {yearData.child_brides
                                                        .number_of_men_under_19 ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">
                                                    Perempuan &lt; 19 Tahun:
                                                </span>
                                                <span className="text-lg font-semibold">
                                                    {yearData.child_brides
                                                        .number_of_women_under_19 ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">
                                                        Total:
                                                    </span>
                                                    <span className="text-lg font-semibold text-red-600">
                                                        {totalChildBrides}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reasons for Dispensation */}
                                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center">
                                            <BarChart3 className="h-5 w-5 mr-2" />
                                            Alasan Dispensasi
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    label: "Hamil",
                                                    value:
                                                        yearData.reasons
                                                            .pregnant || 0,
                                                },
                                                {
                                                    label: "Pergaulan Bebas",
                                                    value:
                                                        yearData.reasons
                                                            .promiscuity || 0,
                                                },
                                                {
                                                    label: "Ekonomi",
                                                    value:
                                                        yearData.reasons
                                                            .economy || 0,
                                                },
                                                {
                                                    label: "Budaya Adat",
                                                    value:
                                                        yearData.reasons
                                                            .traditional_culture ||
                                                        0,
                                                },
                                                {
                                                    label: "Menghindari Zina",
                                                    value:
                                                        yearData.reasons
                                                            .avoiding_adultery ||
                                                        0,
                                                },
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center py-1"
                                                >
                                                    <span className="font-medium text-gray-700">
                                                        {item.label}:
                                                    </span>
                                                    <span className="font-semibold">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            ))}
                                            <div className="pt-2 border-t border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">
                                                        Total:
                                                    </span>
                                                    <span className="text-lg font-semibold text-orange-600">
                                                        {totalReasons}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route("manage.index")}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Kembali
                                    </Link>
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
