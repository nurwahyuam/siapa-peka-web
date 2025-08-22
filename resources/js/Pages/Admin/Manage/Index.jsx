import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = () => {
    const { cities } = usePage().props;

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
            <Head title="Data Excel Import" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    Data Kabupaten/Kota
                                </h2>
                                <div className="space-x-2">
                                    <Link
                                        href={route("manage.create")}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Import Excel
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Apakah Anda yakin ingin menghapus semua data?"
                                                )
                                            ) {
                                                window.location.href = route(
                                                    "excel-import.destroyAll"
                                                );
                                            }
                                        }}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Hapus Semua Data
                                    </button>
                                </div>
                            </div>

                            {cities.data.length === 0 ? (
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
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kabupaten/Kota
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jenis
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
                                            {cities.data.map((city) => (
                                                <tr key={city.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {city.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {city.kind}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {city.code}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {
                                                            city.applications
                                                                .length
                                                        }{" "}
                                                        periode
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route(
                                                                "manage.show",
                                                                city.id
                                                            )}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Detail
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        "Apakah Anda yakin ingin menghapus data ini?"
                                                                    )
                                                                ) {
                                                                    window.location.href =
                                                                        route(
                                                                            "excel-import.destroy",
                                                                            city.id
                                                                        );
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    <div className="mt-4">
                                        {cities.links && (
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-700">
                                                    Menampilkan {cities.from}{" "}
                                                    sampai {cities.to} dari{" "}
                                                    {cities.total} data
                                                </div>
                                                <div className="flex space-x-2">
                                                    {cities.links.map(
                                                        (link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={
                                                                    link.url ||
                                                                    "#"
                                                                }
                                                                className={`px-3 py-1 rounded-md ${
                                                                    link.active
                                                                        ? "bg-blue-500 text-white"
                                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                                } ${
                                                                    !link.url &&
                                                                    "opacity-50 cursor-not-allowed"
                                                                }`}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: link.label,
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
