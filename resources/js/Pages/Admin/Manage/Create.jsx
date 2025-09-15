import React, { useState, useMemo, useEffect } from "react";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Plus,
    Users,
    MapPin,
    FileText,
    GraduationCap,
    BarChart3,
    CircleArrowLeft,
    AlertCircle,
    SquareKanban,
    PlusCircle,
    InfoIcon,
    Clock,
    CalendarClock,
    Info,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const manualOptions = [
    "Triwulan I",
    "Triwulan II",
    "Triwulan III",
    "Triwulan IV",
    "Setahun",
];

const Create = () => {
    const {
        cities,
        periods,
        sources,
        errors: serverErrors,
        existingData,
    } = usePage().props;
    const [showAddSourceInput, setShowAddSourceInput] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [activeTab, setActiveTab] = useState("applications");
    const [customSourceInput, setCustomSourceInput] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        city_feature_id: "",
        selected_year: new Date().getFullYear(),
        manual_period_name: "",
        period_id: "",

        // Applications
        submitted: "",
        accepted: "",
        sources: [],

        // Education Levels
        no_school: "",
        sd: "",
        smp: "",
        sma: "",

        // Age Classifications
        less_than_15: "",
        between_15_19: "",

        // Child Brides
        number_of_men_under_19: "",
        number_of_women_under_19: "",

        // Reasons
        pregnant: "",
        promiscuity: "",
        economy: "",
        traditional_culture: "",
        avoiding_adultery: "",
    });

    // Handle server errors
    useEffect(() => {
        if (serverErrors && Object.keys(serverErrors).length > 0) {
            setFieldErrors(serverErrors);

            // Tampilkan error sebagai toast
            Object.values(serverErrors).forEach((error) => {
                toast.error(error, {
                    duration: 5000,
                    position: "top-right",
                });
            });

            // Scroll to the first error field
            const firstErrorField = Object.keys(serverErrors)[0];
            if (firstErrorField) {
                const errorElement = document.querySelector(
                    `[name="${firstErrorField}"]`
                );
                if (errorElement) {
                    setTimeout(() => {
                        errorElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                        errorElement.focus();
                    }, 300);
                }
            }
        }
    }, [serverErrors]);

    const handleInputChange = (name, value) => {
        setData(name, value);

        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Tambah sumber
    const handleAddSource = (source) => {
        if (!source) return;

        // Kalau source berupa string dari input manual
        const newSource =
            typeof source === "string" ? { name: source } : source;

        // Cek duplikasi
        const exists = data.sources.some(
            (s) => s.name.toLowerCase() === newSource.name.toLowerCase()
        );

        if (!exists) {
            setData((prev) => ({
                ...prev,
                sources: [...prev.sources, newSource],
            }));
        }

        // Reset input manual
        setCustomSourceInput("");
    };

    // Hapus sumber
    const handleRemoveSource = (index) => {
        setData((prev) => ({
            ...prev,
            sources: prev.sources.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validasi informasi dasar
        if (!data.city_feature_id) {
            newErrors.city_feature_id = "Kabupaten/Kota harus dipilih";
            isValid = false;
        }

        if (!data.selected_year) {
            newErrors.selected_year = "Tahun data harus dipilih";
            isValid = false;
        }

        if (!data.manual_period_name) {
            newErrors.manual_period_name = "Periode harus dipilih";
            isValid = false;
        }

        if (!data.sources.length) {
            newErrors.sources = "Minimal 1 sumber data ditambah";
            isValid = false;
        }

        if (
            data.submitted &&
            data.accepted &&
            parseInt(data.accepted) > parseInt(data.submitted)
        ) {
            newErrors.accepted =
                "Jumlah disetujui tidak boleh lebih dari jumlah diajukan";
            isValid = false;
        }

        setFieldErrors(newErrors);

        // Tampilkan error sebagai toast jika validasi gagal
        if (!isValid) {
            Object.values(newErrors).forEach((error) => {
                toast.error(error, {
                    duration: 5000,
                    position: "top-right",
                });
            });
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll ke error pertama
            const firstErrorField = Object.keys(fieldErrors)[0];
            if (firstErrorField) {
                const errorElement = document.querySelector(
                    `[name="${firstErrorField}"]`
                );
                if (errorElement) {
                    setTimeout(() => {
                        errorElement.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                        errorElement.focus();
                    }, 300);
                }
            }
            return;
        }

        // Prepare the data to be sent
        const formData = {
            city_feature_id: data.city_feature_id,
            selected_year: data.selected_year,
            manual_period_name: data.manual_period_name,

            // Applications
            submitted: data.submitted || 0,
            accepted: data.accepted || 0,
            sources: data.sources,

            // Education Levels
            no_school: data.no_school || 0,
            sd: data.sd || 0,
            smp: data.smp || 0,
            sma: data.sma || 0,

            // Age Classifications
            less_than_15: data.less_than_15 || 0,
            between_15_19: data.between_15_19 || 0,

            // Child Brides
            number_of_men_under_19: data.number_of_men_under_19 || 0,
            number_of_women_under_19: data.number_of_women_under_19 || 0,

            // Reasons
            pregnant: data.pregnant || 0,
            promiscuity: data.promiscuity || 0,
            economy: data.economy || 0,
            traditional_culture: data.traditional_culture || 0,
            avoiding_adultery: data.avoiding_adultery || 0,
        };

        post(route("manage.create.store"), formData, {
            onSuccess: () => {
                toast.success("Data berhasil disimpan!", {
                    duration: 3000,
                    position: "top-right",
                });
            },
            onError: (errors) => {
                if (errors && Object.keys(errors).length > 0) {
                    Object.values(errors).forEach((error) => {
                        toast.error(error, {
                            duration: 5000,
                            position: "top-right",
                        });
                    });
                } else {
                    toast.error("Terjadi kesalahan saat menyimpan data", {
                        duration: 5000,
                        position: "top-right",
                    });
                }
            },
        });
    };

    // Dapatkan data yang sudah ada berdasarkan kombinasi kota + tahun
    const existingDataForCityYear = useMemo(() => {
        if (!data.city_feature_id || !data.selected_year) return [];

        return (Array.isArray(existingData) ? existingData : []).filter(
            (item) =>
                item.city_feature_id == data.city_feature_id &&
                item.year == data.selected_year
        );
    }, [existingData, data.city_feature_id, data.selected_year]);

    // Ambil nama periode yang sudah ada untuk kota dan tahun tertentu
    const existingPeriodNames = existingDataForCityYear.map(
        (item) => item.period_name
    );

    const hasTriwulan = existingPeriodNames.some((p) =>
        ["Triwulan I", "Triwulan II", "Triwulan III", "Triwulan IV"].includes(p)
    );
    const hasSetahun = existingPeriodNames.includes("Setahun");

    // Filter option berdasarkan periode yang sudah ada untuk kota dan tahun tertentu
    const filteredManualOptions =
        existingPeriodNames.length === 0
            ? manualOptions // kalau belum ada data sama sekali → tampilkan semua
            : manualOptions.filter((option) => {
                  if (hasTriwulan && option === "Setahun") return false;
                  if (hasSetahun && option.startsWith("Triwulan")) return false;
                  if (existingPeriodNames.includes(option)) return false;
                  return true;
              });

    // Render konten tab berdasarkan tab aktif
    const renderTabContent = () => {
        switch (activeTab) {
            case "applications":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Data Pengajuan Dispensasi
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            {/* Jumlah Diajukan */}
                            <div>
                                <label
                                    htmlFor="submitted"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Jumlah Diajukan
                                </label>
                                <input
                                    id="submitted"
                                    name="submitted"
                                    type="number"
                                    value={data.submitted ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "submitted",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* Jumlah Dikabulkan */}
                            <div>
                                <label
                                    htmlFor="accepted"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Jumlah Dikabulkan
                                </label>
                                <input
                                    id="accepted"
                                    name="accepted"
                                    type="number"
                                    value={data.accepted ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "accepted",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                        </div>
                        {/* Sumber Data */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sumber Data{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            {/* Input tambah manual */}
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={customSourceInput}
                                    onChange={(e) =>
                                        setCustomSourceInput(e.target.value)
                                    }
                                    placeholder="Tambah sumber manual..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleAddSource({
                                            name: customSourceInput,
                                        })
                                    }
                                    className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    disabled={!customSourceInput.trim()} // disable kalau kosong
                                >
                                    <PlusCircle className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex justify-between">
                                {/* Daftar sumber tersedia */}
                                {sources?.length > 0 && (
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Sumber tersedia:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                ...new Map(
                                                    sources
                                                        .filter((s) => s?.name) // hanya ambil yang valid
                                                        .map((s) => [
                                                            s.name.toLowerCase(),
                                                            s,
                                                        ]) // buang duplikat berdasarkan lowercase
                                                ).values(),
                                            ]
                                                .filter(
                                                    (s) =>
                                                        s?.name &&
                                                        !data.sources.some(
                                                            (selected) =>
                                                                selected?.name?.toLowerCase() ===
                                                                s.name.toLowerCase()
                                                        )
                                                )
                                                .map((s, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() =>
                                                            handleAddSource(s)
                                                        }
                                                        className="px-3 py-2 bg-gray-100 hover:bg-indigo-200 rounded text-xs"
                                                    >
                                                        {s.name}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                <div className="w-full">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Sumber yang dipilih:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {data.sources.map((src, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-indigo-100 hover:bg-indigo-200 rounded text-xs flex items-center"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveSource(idx)
                                                    }
                                                    className="px-3 py-2 bg-indigo-100 hover:bg-red-200 rounded"
                                                >
                                                    {src.name}
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "education":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Data Tingkat Pendidikan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Tidak Sekolah */}
                            <div>
                                <label
                                    htmlFor="no_school"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Tidak Sekolah
                                </label>
                                <input
                                    id="no_school"
                                    name="no_school"
                                    type="number"
                                    value={data.no_school ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "no_school",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* SD */}
                            <div>
                                <label
                                    htmlFor="sd"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    SD
                                </label>
                                <input
                                    id="sd"
                                    name="sd"
                                    type="number"
                                    value={data.sd ?? ""}
                                    onChange={(e) =>
                                        handleInputChange("sd", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* SMP */}
                            <div>
                                <label
                                    htmlFor="smp"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    SMP
                                </label>
                                <input
                                    id="smp"
                                    name="smp"
                                    type="number"
                                    value={data.smp ?? ""}
                                    onChange={(e) =>
                                        handleInputChange("smp", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* SMA */}
                            <div>
                                <label
                                    htmlFor="sma"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    SMA
                                </label>
                                <input
                                    id="sma"
                                    name="sma"
                                    type="number"
                                    value={data.sma ?? ""}
                                    onChange={(e) =>
                                        handleInputChange("sma", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "age":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Data Klasifikasi Usia
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kurang dari 15 Tahun */}
                            <div>
                                <label
                                    htmlFor="less_than_15"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Kurang dari 15 Tahun
                                </label>
                                <input
                                    id="less_than_15"
                                    name="less_than_15"
                                    type="number"
                                    value={data.less_than_15 ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "less_than_15",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* 15-19 Tahun */}
                            <div>
                                <label
                                    htmlFor="between_15_19"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    15-19 Tahun
                                </label>
                                <input
                                    id="between_15_19"
                                    name="between_15_19"
                                    type="number"
                                    value={data.between_15_19 ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "between_15_19",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "child_brides":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Data Pengantin Anak
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Laki-laki < 19 Tahun */}
                            <div>
                                <label
                                    htmlFor="number_of_men_under_19"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Laki-laki &lt; 19 Tahun
                                </label>
                                <input
                                    id="number_of_men_under_19"
                                    name="number_of_men_under_19"
                                    type="number"
                                    value={data.number_of_men_under_19 ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "number_of_men_under_19",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* Perempuan < 19 Tahun */}
                            <div>
                                <label
                                    htmlFor="number_of_women_under_19"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Perempuan &lt; 19 Tahun
                                </label>
                                <input
                                    id="number_of_women_under_19"
                                    name="number_of_women_under_19"
                                    type="number"
                                    value={data.number_of_women_under_19 ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "number_of_women_under_19",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                );

            case "reasons":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Data Alasan Dispensasi
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Hamil */}
                            <div>
                                <label
                                    htmlFor="pregnant"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Hamil
                                </label>
                                <input
                                    id="pregnant"
                                    name="pregnant"
                                    type="number"
                                    value={data.pregnant ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "pregnant",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* Pergaulan Bebas */}
                            <div>
                                <label
                                    htmlFor="promiscuity"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Pergaulan Bebas
                                </label>
                                <input
                                    id="promiscuity"
                                    name="promiscuity"
                                    type="number"
                                    value={data.promiscuity ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "promiscuity",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* Ekonomi */}
                            <div>
                                <label
                                    htmlFor="economy"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Ekonomi
                                </label>
                                <input
                                    id="economy"
                                    name="economy"
                                    type="number"
                                    value={data.economy ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "economy",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* Budaya Adat */}
                            <div>
                                <label
                                    htmlFor="traditional_culture"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Budaya Adat
                                </label>
                                <input
                                    id="traditional_culture"
                                    name="traditional_culture"
                                    type="number"
                                    value={data.traditional_culture ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "traditional_culture",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>

                            {/* Menghindari Zina */}
                            <div>
                                <label
                                    htmlFor="avoiding_adultery"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Menghindari Zina
                                </label>
                                <input
                                    id="avoiding_adultery"
                                    name="avoiding_adultery"
                                    type="number"
                                    value={data.avoiding_adultery ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "avoiding_adultery",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

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
            <Head title="Tambah Data - SIAPA PEKA" />

            {/* Toast Container */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: "#10B981",
                            secondary: "#fff",
                        },
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
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white">
                            {/* Header Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <Link
                                        href={route("manage.index")}
                                        className="flex hover:text-indigo-500 items-center transition-colors duration-200"
                                    >
                                        <CircleArrowLeft className="h-7 w-7 mr-2" />
                                    </Link>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Tambah Data Baru
                                    </h1>
                                </div>
                            </div>

                            <div className="bg-white">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                >
                                    {/* Basic Information */}
                                    <div className="bg-indigo-50 rounded-lg p-4">
                                        <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                                            Informasi Dasar
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Kabupaten/Kota */}
                                            <div>
                                                <label
                                                    htmlFor="city_feature_id"
                                                    className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    <MapPin className="h-5 w-5 text-indigo-600" />
                                                    Kabupaten/Kota{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    id="city_feature_id"
                                                    name="city_feature_id"
                                                    value={data.city_feature_id}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "city_feature_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                >
                                                    <option value="">
                                                        Pilih Kabupaten/Kota
                                                    </option>
                                                    {cities.map((city) => (
                                                        <option
                                                            key={city.id}
                                                            value={city.id}
                                                        >
                                                            {city.name} (
                                                            {city.code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Tahun Data */}
                                            <div>
                                                <label
                                                    htmlFor="selected_year"
                                                    className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    <CalendarClock className="h-5 w-5 text-indigo-600" />
                                                    Tahun Data{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    id="selected_year"
                                                    name="selected_year"
                                                    value={data.selected_year}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "selected_year",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                >
                                                    <option value="">
                                                        Pilih Tahun
                                                    </option>
                                                    {Array.from(
                                                        { length: 6 },
                                                        (_, i) =>
                                                            new Date().getFullYear() +
                                                            i
                                                    ).map((year) => (
                                                        <option
                                                            key={year}
                                                            value={year}
                                                        >
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Periode */}
                                            <div>
                                                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                                                    <Clock className="h-5 w-5 text-indigo-600" />
                                                    Periode{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>

                                                {!data.city_feature_id ||
                                                !data.selected_year ? (
                                                    <div className="text-md ring-gray-300 ring-1 py-2 px-3 text-black bg-white rounded-md">
                                                        Pilih Kabupaten/Kota dan
                                                        Tahun terlebih dahulu
                                                    </div>
                                                ) : (
                                                    <>
                                                        <select
                                                            id="manual_period_name"
                                                            name="manual_period_name"
                                                            value={
                                                                data.manual_period_name
                                                            }
                                                            onChange={(e) =>
                                                                handleInputChange(
                                                                    "manual_period_name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        >
                                                            <option value="">
                                                                Pilih Nama
                                                                Periode
                                                            </option>
                                                            {filteredManualOptions.length >
                                                            0 ? (
                                                                filteredManualOptions.map(
                                                                    (
                                                                        option
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                option
                                                                            }
                                                                            value={
                                                                                option
                                                                            }
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </option>
                                                                    )
                                                                )
                                                            ) : (
                                                                <option
                                                                    value=""
                                                                    disabled
                                                                >
                                                                    Semua
                                                                    periode
                                                                    sudah dibuat
                                                                </option>
                                                            )}
                                                        </select>
                                                        <p className="text-yellow-700 flex items-center mt-1">
                                                            <span className="text-xs">
                                                                Pilih "Setahun"
                                                                jika data
                                                                tahunan atau
                                                                "Triwulan" untuk
                                                                data per
                                                                triwulan.
                                                            </span>
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            {/* Keterangan tambahan */}
                                            {existingPeriodNames.length > 0 && (
                                                <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                                    {hasSetahun && (
                                                        <div className="flex items-center text-yellow-700">
                                                            <AlertCircle className="h-6 w-6 mr-2" />
                                                            <span>
                                                                Periode{" "}
                                                                <strong>
                                                                    Setahun
                                                                </strong>{" "}
                                                                sudah dibuat.
                                                            </span>
                                                        </div>
                                                    )}

                                                    {hasTriwulan && (
                                                        <div className="flex items-center text-yellow-700">
                                                            <AlertCircle className="h-6 w-6 mr-5" />
                                                            <div className="">
                                                                <span className="text-xs">
                                                                    Periode{" "}
                                                                    <strong>
                                                                        Triwulan
                                                                    </strong>{" "}
                                                                    sudah
                                                                    dibuat.
                                                                    Periode{" "}
                                                                    {"  "}
                                                                    {
                                                                        data.selected_year
                                                                    }{" "}
                                                                    yang sudah
                                                                    ada:
                                                                </span>
                                                                <ul className="list-disc list-inside text-xs text-gray-700">
                                                                    {[
                                                                        ...new Set(
                                                                            existingPeriodNames
                                                                        ),
                                                                    ].map(
                                                                        (
                                                                            p,
                                                                            idx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    idx
                                                                                }
                                                                            >
                                                                                {
                                                                                    p
                                                                                }
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Navigation Tabs */}
                                    <div className="border-b border-gray-200">
                                        <nav className="flex space-x-8 px-6">
                                            {[
                                                {
                                                    id: "applications",
                                                    label: "Pengajuan",
                                                    icon: FileText,
                                                },
                                                {
                                                    id: "education",
                                                    label: "Pendidikan",
                                                    icon: GraduationCap,
                                                },
                                                {
                                                    id: "age",
                                                    label: "Usia",
                                                    icon: Users,
                                                },
                                                {
                                                    id: "child_brides",
                                                    label: "Pengantin Anak",
                                                    icon: Users,
                                                },
                                                {
                                                    id: "reasons",
                                                    label: "Alasan",
                                                    icon: BarChart3,
                                                },
                                            ].map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveTab(tab.id)
                                                    }
                                                    className={`py-3 px-4 border-b-2 rounded-t-lg font-medium text-sm flex items-center ${
                                                        activeTab === tab.id
                                                            ? "bg-indigo-500 text-white border-indigo-700"
                                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    }`}
                                                >
                                                    <tab.icon className="h-4 w-4 mr-2" />
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* Render Tab Content */}
                                    {renderTabContent()}

                                    {/* Submit Button */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="flex justify-end space-x-3">
                                            <Link
                                                href={route("manage.index")}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Kembali
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                {processing
                                                    ? "Membuat..."
                                                    : "Buat Data"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
