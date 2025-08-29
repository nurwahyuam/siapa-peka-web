import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { SquareKanban } from "lucide-react";

const Import = () => {
    const [file, setFile] = useState(null);
    const { data, setData, errors, post, processing } = useForm({
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("manage.import.store"), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setData("file", selectedFile);
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
            <Head title="Import Data - SIAPA PEKA" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold mb-6">
                                Import Data Excel
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                <div className="mb-4">
                                    <label
                                        htmlFor="file"
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                        Pilih File Excel
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        name="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.file && (
                                        <p className="text-red-500 text-xs italic mt-1">
                                            {errors.file}
                                        </p>
                                    )}
                                    {file && (
                                        <p className="text-green-500 text-sm mt-2">
                                            File terpilih: {file.name}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <Link
                                        href={route("manage.index")}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Kembali
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || !file}
                                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                            processing || !file
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {processing
                                            ? "Mengimpor..."
                                            : "Import Data"}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            <strong>
                                                Format file Excel yang didukung:
                                            </strong>
                                            <ul className="list-disc pl-5 mt-2">
                                                <li>
                                                    File harus berformat .xlsx
                                                </li>
                                                <li>
                                                    Struktur kolom harus sesuai
                                                    dengan template yang
                                                    ditentukan
                                                </li>
                                                <li>
                                                    Ukuran file maksimal 2MB
                                                </li>
                                            </ul>
                                        </p>
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

export default Import;
