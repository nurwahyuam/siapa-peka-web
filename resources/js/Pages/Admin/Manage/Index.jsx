import React, { useState, useMemo } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    CalendarClock,
    CirclePlus,
    Download,
    Eye,
    FilePenLine,
    Import,
    Map,
    Pen,
    SquareKanban,
    Trash,
    Trash2,
    Search,
    X,
} from "lucide-react";

const Index = () => {
    const { cities } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Debug: Lihat struktur data yang diterima
    console.log('Cities data:', cities);

    // Akses data yang benar - cities adalah array langsung
    const allCities = useMemo(() => {
        if (Array.isArray(cities)) {
            return cities;
        }
        // Fallback jika struktur berbeda
        return cities?.data || [];
    }, [cities]);

    // Filter data berdasarkan input pencarian
    const filteredCities = useMemo(() => {
        if (!searchTerm) return allCities;

        return allCities.filter(city =>
            city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (city.code && city.code.toString().includes(searchTerm))
        );
    }, [allCities, searchTerm]);

    // Pagination untuk data yang difilter
    const paginatedCities = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCities.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCities, currentPage]);

    // Total halaman untuk data yang difilter
    const totalPages = useMemo(() => {
        return Math.ceil(filteredCities.length / itemsPerPage);
    }, [filteredCities.length]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    // Fungsi untuk mengubah halaman
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Generate pagination links
    const generatePaginationLinks = () => {
        const links = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous page
        links.push(
            <button
                key="prev"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
                &laquo; Prev
            </button>
        );

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            links.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 rounded-md ${
                        currentPage === i
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Next page
        links.push(
            <button
                key="next"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
                Next &raquo;
            </button>
        );

        return links;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                        <SquareKanban className="-rotate-90" />
                        Manajemen Data
                    </h2>
                </div>
            }
        >
            <Head title="Manajemen Data - SIAPA PEKA" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Map />
                                    Data Kabupaten/Kota
                                </h2>
                                <div className="flex items-center justify-center gap-2">
                                    {/* Input Pencarian */}
                                    <div className="relative mr-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Cari kabupaten/kota..."
                                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-64"
                                            value={searchTerm}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={clearSearch}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                            </button>
                                        )}
                                    </div>

                                    <Link
                                        href={route("manage.create")}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded flex items-center gap-1"
                                    >
                                        <CirclePlus className="h-5 w-5" />
                                        Baru
                                    </Link>
                                    <Link
                                        href={route("manage.import")}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded flex items-center gap-1"
                                    >
                                        <Import className="h-5 w-5" />
                                        Impor
                                    </Link>
                                    <a
                                        href={route("manage.export")}
                                        className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-3 rounded flex items-center gap-1"
                                    >
                                        <Download className="h-5 w-5" />
                                        Unduh
                                    </a>
                                </div>
                            </div>

                            {/* PERBAIKAN DI SINI: Gunakan allCities.length bukan cities.data.length */}
                            {allCities.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        Belum ada data yang diimpor.
                                    </p>
                                    <Link
                                        href={route("manage.create")}
                                        className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
                                    >
                                        Klik di sini untuk mengimpor data
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    {/* Informasi hasil pencarian */}
                                    {searchTerm && (
                                        <div className="mb-4 text-sm text-gray-600">
                                            Menampilkan {filteredCities.length} hasil pencarian
                                            {searchTerm && ` untuk "${searchTerm}"`}
                                            <button
                                                className="ml-2 text-blue-500 hover:text-blue-700"
                                                onClick={clearSearch}
                                            >
                                                Hapus filter
                                            </button>
                                        </div>
                                    )}

                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kabupaten/Kota
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kode
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jumlah Data
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paginatedCities.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                        Tidak ada data yang cocok dengan pencarian "{searchTerm}"
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedCities.map((city) => (
                                                    <tr key={city.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {city.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {city.code}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {
                                                                city.applications
                                                                    ? city.applications.length
                                                                    : 0
                                                            }{" "}
                                                            periode
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                                            <Link
                                                                href={route(
                                                                    "manage.show",
                                                                    city.slug
                                                                )}
                                                                className="text-blue-600 hover:text-blue-900 mr-3 flex items-center gap-2"
                                                            >
                                                                <Eye />
                                                                Lihat
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "manage.edit",
                                                                    {
                                                                        city: city.slug,
                                                                        year: new Date().getFullYear(),
                                                                    }
                                                                )}
                                                                className="text-yellow-600 hover:text-yellow-900 mr-3 flex items-center gap-2"
                                                            >
                                                                <Pen className="w-5 h-5" />
                                                                Ubah
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {filteredCities.length > itemsPerPage && (
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-700">
                                                    Menampilkan {((currentPage - 1) * itemsPerPage) + 1}{" "}
                                                    sampai {Math.min(currentPage * itemsPerPage, filteredCities.length)} dari{" "}
                                                    {filteredCities.length} data
                                                </div>
                                                <div className="flex space-x-2">
                                                    {generatePaginationLinks()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
