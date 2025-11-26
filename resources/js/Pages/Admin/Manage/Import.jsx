import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    CalendarClock,
    CircleArrowLeft,
    ImportIcon,
    SquareKanban,
    TriangleAlert,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const Import = () => {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const { data, setData, errors, post, processing } = useForm({
        file: null,
    });

    const { flash } = usePage().props;

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

    // 🔹 fungsi reset file input
    const resetFile = () => {
        setFile(null);
        setData("file", null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // reset input file
        }
    };

    useEffect(() => {
        if (errors.file) {
            toast.error(errors.file, { duration: 5000 });
            resetFile();
        }
        if (flash?.error && flash.import_errors?.length === 0) {
            toast.error(flash.error, { duration: 6000 });
            resetFile();
        }
        if (flash.import_errors?.length > 0) {
            resetFile();
        }
    }, [flash, errors]);

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
            <Head title="Impor Data - SIAPA PEKA" />

            {/* Toast Container */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    error: {
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center mb-6">
                                <Link
                                    href={route("manage.index")}
                                    className="flex hover:text-indigo-500 items-center transition-colors duration-200"
                                >
                                    <CircleArrowLeft className="h-7 w-7 mr-2" />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Impor Data Baru
                                </h1>
                            </div>

                            {flash?.error &&
                                flash.import_errors?.length > 0 && (
                                    <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                                        <div className="flex w-full">
                                            <div className="ml-3 w-full">
                                                <div className="text-sm text-red-700">
                                                    <strong>
                                                        {flash.error}
                                                    </strong>
                                                    <div className="mt-2 w-full">
                                                        <ul className="list-disc pl-5 mt-1 text-sm max-h-32 overflow-y-auto w-full">
                                                            {flash.import_errors.map(
                                                                (err, i) => (
                                                                    <li key={i}>
                                                                        {err}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                                <div className="flex">
                                    <div className="ml-3">
                                        <div className="text-sm text-yellow-700">
                                            <strong>
                                                Aturan Upload File Excel:
                                            </strong>
                                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                                <li>
                                                    File harus berformat{" "}
                                                    <strong>.xlsx</strong>{" "}
                                                    dengan ukuran maksimal{" "}
                                                    <strong>10 MB</strong>.
                                                </li>
                                                <li>
                                                    Struktur file wajib sesuai
                                                    dengan{" "}
                                                    <a
                                                        href="/public/templates/template.xlsx"
                                                        download
                                                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        template
                                                    </a>{" "}
                                                    yang sudah disediakan:
                                                    <ul className="list-decimal pl-5 mt-1 space-y-1">
                                                        <li>
                                                            Nama kolom (header)
                                                            tidak boleh diubah.
                                                        </li>
                                                        <li>
                                                            Kolom{" "}
                                                            <strong>
                                                                Kode Kota
                                                            </strong>
                                                            ,{" "}
                                                            <strong>
                                                                Nama Kota
                                                            </strong>
                                                            ,{" "}
                                                            <strong>
                                                                Tahun
                                                            </strong>
                                                            , dan{" "}
                                                            <strong>
                                                                Periode
                                                            </strong>{" "}
                                                            wajib diisi.
                                                        </li>
                                                        <li>
                                                            Kolom{" "}
                                                            <strong>
                                                                Tahun
                                                            </strong>{" "}
                                                            harus berupa angka
                                                            (contoh: 2025).
                                                        </li>
                                                        <li>
                                                            Kolom{" "}
                                                            <strong>
                                                                Sumber Data
                                                            </strong>{" "}
                                                            Jika diisi lebih
                                                            dari 1, dipisah
                                                            menggunakan koma ("
                                                            , "). Contoh:
                                                            Provinsi Jawa Timur,
                                                            Kementerian Agama
                                                        </li>
                                                        <li>
                                                            Semua kolom angka
                                                            lain (Diajukan,
                                                            Dikabulkan,
                                                            Pendidikan,
                                                            Klasifikasi Usia,
                                                            Pernikahan Anak,
                                                            Alasan) wajib diisi
                                                            dengan nilai numeric{" "}
                                                            <em>(≥ 0)</em>.
                                                        </li>
                                                        <li>
                                                            Kolom{" "}
                                                            <strong>
                                                                Periode
                                                            </strong>{" "}
                                                            hanya boleh berisi{" "}
                                                            <code>Setahun</code>{" "}
                                                            atau{" "}
                                                            <code>
                                                                Triwulan I–IV
                                                            </code>
                                                            .
                                                        </li>
                                                        <li>
                                                            Jika sudah ada data{" "}
                                                            <strong>
                                                                Setahun
                                                            </strong>{" "}
                                                            pada tahun tertentu,
                                                            maka tidak boleh ada
                                                            data Triwulan di
                                                            tahun yang sama (dan
                                                            sebaliknya).
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    Jika ada data yang tidak
                                                    valid, baris terkait akan{" "}
                                                    <strong>ditolak</strong> dan
                                                    tidak masuk ke database.
                                                    Notifikasi error akan
                                                    menampilkan <em>baris</em>{" "}
                                                    dan <em>kolom</em> yang
                                                    bermasalah.
                                                </li>
                                            </ul>
                                            <div className="flex items-center gap-2 text-red-600 font-semibold mt-1">
                                                <TriangleAlert className="w-4 h-4" />{" "}
                                                <p>
                                                    Hati-hati: Jika data dengan
                                                    kombinasi{" "}
                                                    <strong>
                                                        Kota + Tahun + Periode
                                                    </strong>{" "}
                                                    sudah ada, maka data lama
                                                    akan <u>diganti (update)</u>{" "}
                                                    oleh data baru, bukan dibuat
                                                    duplikat.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Upload */}
                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Pilih File Excel Sesuai Template
                                    </label>
                                    <div className="flex items-center justify-between w-full border-2 border-dashed border-gray-300 rounded-md p-2">
                                        <label
                                            htmlFor="file"
                                            className="cursor-pointer flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow hover:bg-green-700 focus:outline-none"
                                        >
                                            {file ? "Ganti File" : "Pilih File"}
                                        </label>
                                        {file && (
                                            <span className="ml-3 text-sm text-green-600">
                                                {file.name}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="file"
                                        name="file"
                                        accept=".xlsx"
                                        ref={fileInputRef} // 🔹 pakai ref
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route("manage.index")}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Kembali
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || !file}
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50`}
                                    >
                                        <ImportIcon className="h-4 w-4 mr-2" />
                                        {processing
                                            ? "Mengimpor..."
                                            : "Impor Data"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Import;
