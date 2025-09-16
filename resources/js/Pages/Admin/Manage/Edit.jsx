import React, { useState, useMemo, useEffect } from "react";
import { Head, useForm, router, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    MapPin,
    CalendarClock,
    AlertCircle,
    Save,
    FileText,
    GraduationCap,
    Users,
    BarChart3,
    SquareKanban,
    CircleArrowLeft,
    Trash2,
    Clock,
    PlusCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Edit = ({
    city,
    periods,
    existingData,
    availableYears,
    selectedYear,
    available_sources,
}) => {
    const [activeTab, setActiveTab] = useState("applications");
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customSourceInput, setCustomSourceInput] = useState("");

    // Parse sources dari string ke array jika perlu
    const parseSources = (sources) => {
        if (Array.isArray(sources)) return sources;
        if (typeof sources === "string" && sources.trim() !== "") {
            return sources.split(",").map((s) => ({ name: s.trim() }));
        }
        return [];
    };

    // Inisialisasi form dengan data existing
    const { data, setData, put, processing, errors } = useForm({
        city_feature_id: city?.id || "",
        selected_year: selectedYear || new Date().getFullYear(),
        period_id: existingData?.period_id || "",

        // Applications
        submitted: existingData?.submitted || "",
        accepted: existingData?.accepted || "",
        sources: parseSources(existingData?.sources),

        // Education Levels
        no_school: existingData?.no_school || "",
        sd: existingData?.sd || "",
        smp: existingData?.smp || "",
        sma: existingData?.sma || "",

        // Age Classifications
        less_than_15: existingData?.less_than_15 || "",
        between_15_19: existingData?.between_15_19 || "",

        // Child Brides
        number_of_men_under_19: existingData?.number_of_men_under_19 || "",
        number_of_women_under_19: existingData?.number_of_women_under_19 || "",

        // Reasons
        pregnant: existingData?.pregnant || "",
        promiscuity: existingData?.promiscuity || "",
        economy: existingData?.economy || "",
        traditional_culture: existingData?.traditional_culture || "",
        avoiding_adultery: existingData?.avoiding_adultery || "",
    });

    // Effect untuk menampilkan toast error dari backend
    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            // Tampilkan semua error dalam satu toast
            const errorMessages = Object.values(errors).join(", ");
            toast.error(`Terjadi kesalahan: ${errorMessages}`);
        }
    }, [errors]);

    const handleInputChange = (field, value) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
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

    const handleRemoveSource = (index) => {
        setData((prev) => ({
            ...prev,
            sources: prev.sources.filter((_, i) => i !== index),
        }));
    };

    const availablePeriods = useMemo(() => {
        return (Array.isArray(periods) ? periods : []).filter(
            (period) => period.year === parseInt(data.selected_year)
        );
    }, [periods, data.selected_year]);

    // Fungsi untuk mendapatkan nama periode yang dipilih
    const selectedPeriodName = useMemo(() => {
        if (!data.period_id) return "";
        const period = availablePeriods.find(
            (p) => p.id === parseInt(data.period_id)
        );
        return period ? period.name : "";
    }, [data.period_id, availablePeriods]);

    // Effect untuk menangani perubahan tahun
    useEffect(() => {
        // Jika tahun berubah, reset period_id
        if (data.selected_year !== selectedYear) {
            setData((prev) => ({
                ...prev,
                period_id: "",
            }));
        }
    }, [data.selected_year, selectedYear]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        console.log(data);

        if (!data.period_id) {
            newErrors.period_id = "Periode harus dipilih";
            isValid = false;
        }

        if (!data.sources || data.sources.length === 0) {
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

        // Validasi untuk memastikan tidak ada nilai negatif
        const numericFields = [
            "submitted",
            "accepted",
            "no_school",
            "sd",
            "smp",
            "sma",
            "less_than_15",
            "between_15_19",
            "number_of_men_under_19",
            "number_of_women_under_19",
            "pregnant",
            "promiscuity",
            "economy",
            "traditional_culture",
            "avoiding_adultery",
        ];

        numericFields.forEach((field) => {
            if (data[field] && parseInt(data[field]) < 0) {
                newErrors[field] = "Nilai tidak boleh negatif";
                isValid = false;
            }
        });

        setFieldErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Format data untuk dikirim ke backend
        const formData = {
            city_feature_id: data.city_feature_id,
            period_id: data.period_id,
            submitted: data.submitted || 0,
            accepted: data.accepted || 0,
            source: data.sources.map((s) => s.name).join(", "), // Konversi array ke string
            no_school: data.no_school || 0,
            sd: data.sd || 0,
            smp: data.smp || 0,
            sma: data.sma || 0,
            less_than_15: data.less_than_15 || 0,
            between_15_19: data.between_15_19 || 0,
            number_of_men_under_19: data.number_of_men_under_19 || 0,
            number_of_women_under_19: data.number_of_women_under_19 || 0,
            pregnant: data.pregnant || 0,
            promiscuity: data.promiscuity || 0,
            economy: data.economy || 0,
            traditional_culture: data.traditional_culture || 0,
            avoiding_adultery: data.avoiding_adultery || 0,
        };

        put(
            route("manage.update", {
                city: city.slug,
                year: data.selected_year,
                period: data.period_id,
            }),
            formData
        );
    };

    const navigateToYear = (year) => {
        setIsLoading(true);
        router.get(
            route("manage.edit", {
                city: city.slug,
                year: year,
            }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
        setData((prev) => ({ ...prev, selected_year: year, period_id: "" }));
    };

    const navigateToPeriod = (periodId) => {
        setData((prev) => ({ ...prev, period_id: periodId }));
        if (periodId) {
            setIsLoading(true);
            router.get(
                route("manage.edit", {
                    city: city.slug,
                    year: data.selected_year,
                    period: periodId,
                }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsLoading(false),
                }
            );
        }
        setData((prev) => ({ ...prev, period_id: periodId }));
    };

    const handleDelete = () => {
        router.delete(
            route("manage.destroy", {
                city: city.slug,
                period: data.period_id,
            })
        );
    };

    useEffect(() => {
        // Jika ada fieldErrors
        Object.keys(fieldErrors).forEach((key) => {
            if (fieldErrors[key]) {
                toast.error(fieldErrors[key]);
            }
        });

        // Jika ada errors dari server
        Object.keys(errors).forEach((key) => {
            if (errors[key]) {
                toast.error(errors[key]);
            }
        });
    }, [fieldErrors, errors]);

    useEffect(() => {
        if (existingData) {
            setData((prev) => ({
                ...prev,
                period_id: existingData.period_id || "",
                submitted: existingData.submitted || "",
                accepted: existingData.accepted || "",
                sources: parseSources(existingData.sources),
                no_school: existingData.no_school || "",
                sd: existingData.sd || "",
                smp: existingData.smp || "",
                sma: existingData.sma || "",
                less_than_15: existingData.less_than_15 || "",
                between_15_19: existingData.between_15_19 || "",
                number_of_men_under_19:
                    existingData.number_of_men_under_19 || "",
                number_of_women_under_19:
                    existingData.number_of_women_under_19 || "",
                pregnant: existingData.pregnant || "",
                promiscuity: existingData.promiscuity || "",
                economy: existingData.economy || "",
                traditional_culture: existingData.traditional_culture || "",
                avoiding_adultery: existingData.avoiding_adultery || "",
            }));
        } else {
            setData((prev) => ({
                ...prev,
                period_id: "",
                submitted: "",
                accepted: "",
                sources: [],
                no_school: "",
                sd: "",
                smp: "",
                sma: "",
                less_than_15: "",
                between_15_19: "",
                number_of_men_under_19: "",
                number_of_women_under_19: "",
                pregnant: "",
                promiscuity: "",
                economy: "",
                traditional_culture: "",
                avoiding_adultery: "",
            }));
        }
    }, [existingData]);

    // Render konten tab berdasarkan tab aktif
    const renderTabContent = () => {
        switch (activeTab) {
            case "applications":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Data Pengajuan Dispensasi
                        </h3>
                        <div className="gap-6">
                            <div className="grid grid-cols-2 gap-6">
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
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            fieldErrors.submitted
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
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
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            fieldErrors.accepted
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Sumber Data */}
                            <div className="mt-4">
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
                                            handleAddSource(customSourceInput)
                                        }
                                        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                        disabled={!customSourceInput.trim()}
                                    >
                                        <PlusCircle className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex justify-between gap-2">
                                    {/* Daftar sumber tersedia */}
                                    {available_sources?.length > 0 && (
                                        <div className="w-full">
                                            <p className="text-xs text-gray-500 mb-1">
                                                Sumber tersedia:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {available_sources
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
                                                                handleAddSource(
                                                                    s
                                                                )
                                                            }
                                                            className="px-3 py-2 bg-gray-100 hover:text-indigo-600 hover:bg-indigo-200 rounded text-xs"
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
                                                    className="text-xs flex items-center"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveSource(
                                                                idx
                                                            )
                                                        }
                                                        className="ml-1 rounded px-3 py-2 bg-indigo-100 text-indigo-800 hover:bg-red-100 hover:text-red-600 flex items-center gap-1"
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.no_school
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.sd
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.smp
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.sma
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.less_than_15
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.between_15_19
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.number_of_men_under_19
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.number_of_women_under_19
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.pregnant
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.promiscuity
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.economy
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.traditional_culture
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.avoiding_adultery
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
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
            <Head title={`Edit Data - SIAPA PEKA`} />

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
                        duration: 5000,
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />

            {/* Dialog Konfirmasi Hapus */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Konfirmasi Hapus Data
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus data {city?.name}{" "}
                            untuk tahun {data.selected_year}
                            {selectedPeriodName &&
                                `, periode ${selectedPeriodName}`}
                            ? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white ">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Link
                                        href={route("manage.index")}
                                        className="flex hover:text-indigo-500 items-center transition-colors duration-200"
                                    >
                                        <CircleArrowLeft className="h-7 w-7 mr-2" />
                                    </Link>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Perubahan Data
                                    </h1>
                                </div>
                                <div>
                                    {existingData && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowDeleteConfirm(true)
                                            }
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Hapus Data
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Header Info */}
                            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-8 w-8 text-indigo-600 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Kabupaten/Kota
                                            </p>
                                            <p className="font-medium">
                                                {city?.name} ({city?.code})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-full">
                                            <p className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                                                <CalendarClock className="h-5 w-5 text-indigo-600" />
                                                Tahun Data
                                            </p>
                                            <select
                                                value={data.selected_year ?? ""}
                                                onChange={(e) =>
                                                    navigateToYear(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border rounded-md border-gray-300"
                                                disabled={isLoading}
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
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Pilih Periode */}
                                        <div className="w-full">
                                            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                                                <Clock className="h-5 w-5 text-indigo-600" />
                                                Periode{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <select
                                                value={data.period_id ?? ""}
                                                onChange={(e) =>
                                                    navigateToPeriod(
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 border rounded-md ${
                                                    fieldErrors.period_id
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                } ${
                                                    isLoading
                                                        ? "opacity-50"
                                                        : ""
                                                }`}
                                                disabled={isLoading}
                                            >
                                                <option value="">
                                                    Pilih Periode
                                                </option>
                                                {availablePeriods.map(
                                                    (period) => (
                                                        <option
                                                            key={period.id}
                                                            value={period.id}
                                                        >
                                                            {period.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Tabs */}
                            <form onSubmit={handleSubmit}>
                                {/* Tab Navigation */}
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

                                {/* Render tab content */}
                                <div className="py-8">{renderTabContent()}</div>

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
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan Data"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};
export default Edit;
