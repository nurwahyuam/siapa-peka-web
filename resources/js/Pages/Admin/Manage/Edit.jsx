import React, { useState, useMemo, useEffect } from "react";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Save,
    MapPin,
    FileText,
    GraduationCap,
    Users,
    BarChart3,
    CircleArrowLeft,
    CalendarClock,
    AlertCircle,
    Eye,
    Trash2,
} from "lucide-react";

const Edit = ({
    city,
    periods,
    existingData,
    availableYears,
    selectedYear,
}) => {
    const [showManualPeriod, setShowManualPeriod] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [activeTab, setActiveTab] = useState("applications");
    const [years] = useState(availableYears || []);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State untuk dialog konfirmasi

    // Inisialisasi data form dengan nilai yang sudah ada
    const { data, setData, put, processing, errors } = useForm({
        city_feature_id: city?.id || "",
        selected_year: existingData?.year || new Date().getFullYear(),
        manual_period_name: existingData?.period_name || "",
        period_id: existingData?.period_id || "",

        // Applications
        submitted: existingData?.submitted || "",
        accepted: existingData?.accepted || "",
        source: existingData?.source || "",

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

    // Set showManualPeriod berdasarkan apakah period_id ada atau tidak
    useEffect(() => {
        if (
            existingData &&
            !existingData.period_id &&
            existingData.period_name
        ) {
            setShowManualPeriod(true);
        }
    }, [existingData]);

    const handleInputChange = (name, value) => {
        setData(name, value);
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

        if (!showManualPeriod && !data.period_id) {
            newErrors.period_id = "Periode harus dipilih";
            isValid = false;
        }

        if (showManualPeriod && !data.manual_period_name) {
            newErrors.manual_period_name = "Nama periode manual harus dipilih";
            isValid = false;
        }

        // Validasi data aplikasi
        if (!data.source) {
            newErrors.source = "Sumber data harus dipilih";
            isValid = false;
        }

        if (
            data.submitted &&
            data.accepted &&
            parseInt(data.accepted) > parseInt(data.submitted)
        ) {
            newErrors.accepted =
                "Jumlah dikabulkan tidak boleh lebih dari jumlah diajukan";
            isValid = false;
        }

        setFieldErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll ke error pertama
            const firstErrorField = Object.keys(fieldErrors).find(
                (key) => fieldErrors[key]
            );
            if (firstErrorField) {
                const errorElement = document.querySelector(
                    `[name="${firstErrorField}"]`
                );
                if (errorElement) {
                    errorElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                    errorElement.focus();
                }
            }
            return;
        }

        // Prepare the data to be sent
        const formData = {
            city_feature_id: data.city_feature_id,
            selected_year: data.selected_year,
            period_id: showManualPeriod ? null : data.period_id,
            manual_period_name: showManualPeriod
                ? data.manual_period_name
                : null,

            // Applications
            submitted: data.submitted || 0,
            accepted: data.accepted || 0,
            source: data.source || "",

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

        // Gunakan put untuk update, post untuk create
        const method = existingData ? put : post;
        const url = existingData
            ? route("manage.update", {
                  city: city.slug,
                  year: data.selected_year,
              })
            : route("manage.store", {
                  city: city.slug,
                  year: data.selected_year,
              });

        method(url, formData);
    };

    const availablePeriods = useMemo(() => {
        return (Array.isArray(periods) ? periods : []).filter(
            (period) => period.year === parseInt(data.selected_year)
        );
    }, [periods, data.selected_year]);

    // Fungsi untuk menghapus data
    const handleDelete = () => {
        router.delete(
            route("manage.destroy", {
                city: city.slug,
                year: data.selected_year,
            })
        );
    };

    // Render konten tab berdasarkan tab aktif
    const renderTabContent = () => {
        switch (activeTab) {
            case "applications":
                return (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Data Pengajuan Dispensasi
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                {(fieldErrors.submitted ||
                                    errors.submitted) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.submitted ||
                                            errors.submitted}
                                    </p>
                                )}
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
                                {(fieldErrors.accepted || errors.accepted) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.accepted ||
                                            errors.accepted}
                                    </p>
                                )}
                            </div>

                            {/* Sumber Data */}
                            <div>
                                <label
                                    htmlFor="source"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Sumber Data{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="source"
                                    name="source"
                                    value={data.source}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "source",
                                            e.target.value
                                        )
                                    }
                                    className={`w-full px-3 py-2 border rounded-md ${
                                        fieldErrors.source
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                >
                                    <option value="">Pilih Sumber Data</option>
                                    <option value="Kementerian Agama">
                                        Kementerian Agama
                                    </option>
                                    <option value="Provinsi Jawa Timur">
                                        Provinsi Jawa Timur
                                    </option>
                                </select>
                                {(fieldErrors.source || errors.source) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.source || errors.source}
                                    </p>
                                )}
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
                                {(fieldErrors.no_school ||
                                    errors.no_school) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.no_school ||
                                            errors.no_school}
                                    </p>
                                )}
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
                                {(fieldErrors.sd || errors.sd) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.sd || errors.sd}
                                    </p>
                                )}
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
                                {(fieldErrors.smp || errors.smp) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.smp || errors.smp}
                                    </p>
                                )}
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
                                {(fieldErrors.sma || errors.sma) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.sma || errors.sma}
                                    </p>
                                )}
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
                                {(fieldErrors.less_than_15 ||
                                    errors.less_than_15) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.less_than_15 ||
                                            errors.less_than_15}
                                    </p>
                                )}
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
                                {(fieldErrors.between_15_19 ||
                                    errors.between_15_19) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.between_15_19 ||
                                            errors.between_15_19}
                                    </p>
                                )}
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
                                {(fieldErrors.number_of_men_under_19 ||
                                    errors.number_of_men_under_19) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.number_of_men_under_19 ||
                                            errors.number_of_men_under_19}
                                    </p>
                                )}
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
                                {(fieldErrors.number_of_women_under_19 ||
                                    errors.number_of_women_under_19) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.number_of_women_under_19 ||
                                            errors.number_of_women_under_19}
                                    </p>
                                )}
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
                                {(fieldErrors.pregnant || errors.pregnant) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.pregnant ||
                                            errors.pregnant}
                                    </p>
                                )}
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
                                {(fieldErrors.promiscuity ||
                                    errors.promiscuity) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.promiscuity ||
                                            errors.promiscuity}
                                    </p>
                                )}
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
                                {(fieldErrors.economy || errors.economy) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.economy || errors.economy}
                                    </p>
                                )}
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
                                {(fieldErrors.traditional_culture ||
                                    errors.traditional_culture) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.traditional_culture ||
                                            errors.traditional_culture}
                                    </p>
                                )}
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
                                {(fieldErrors.avoiding_adultery ||
                                    errors.avoiding_adultery) && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {fieldErrors.avoiding_adultery ||
                                            errors.avoiding_adultery}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const navigateToYear = (year) => {
        router.get(
            route("manage.edit", {
                city: city.slug,
                year: year,
            })
        );
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

            {/* Dialog Konfirmasi Hapus */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Konfirmasi Hapus Data
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus data {city?.name}{" "}
                            untuk tahun {data.selected_year}? Tindakan ini tidak
                            dapat dibatalkan.
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
                        <div className="p-6 bg-white">
                            {/* Header Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-6">
                                    <Link
                                        href={route("manage.index")}
                                        className="flex hover:text-indigo-500 items-center transition-colors duration-200"
                                    >
                                        <CircleArrowLeft className="h-6 w-6 mr-2" />
                                    </Link>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Edit Data {city?.name}
                                    </h1>
                                </div>

                                {/* Tambahkan navigasi tahun di header */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-1 w-full">
                                            <MapPin className="h-8 w-8 text-blue-600 mr-2" />
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Kabupaten/Kota
                                                </p>
                                                <p className="font-medium">
                                                    {city?.name} ({city?.code})
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 w-full">
                                            <CalendarClock className="h-8 w-8 text-blue-600 mr-2" />
                                            <div className="w-1/2">
                                                <p className="text-sm text-gray-600">
                                                    Tahun Data
                                                </p>
                                                <div className="flex items-center gap-2 w-full">
                                                    <select
                                                        value={
                                                            data.selected_year
                                                        }
                                                        onChange={(e) =>
                                                            navigateToYear(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="font-medium border rounded px-2 py-1 w-full"
                                                    >
                                                        {years.map((year) => (
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
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                >
                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                                            Informasi Periode
                                        </h3>

                                        <div className="flex items-center justify-between gap-3">
                                            {/* Tahun Data */}
                                            <div className="w-full">
                                                <label
                                                    htmlFor="selected_year"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
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
                                                    className={`w-full px-3 py-2 border rounded-md ${
                                                        fieldErrors.selected_year
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    }`}
                                                    required
                                                >
                                                    <option value="">
                                                        Pilih Tahun
                                                    </option>
                                                    {Array.from(
                                                        { length: 11 },
                                                        (_, i) =>
                                                            new Date().getFullYear() -
                                                            5 +
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
                                                {(fieldErrors.selected_year ||
                                                    errors.selected_year) && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                        {fieldErrors.selected_year ||
                                                            errors.selected_year}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Periode */}
                                            <div className="w-full">
                                                <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                                    <div className="">
                                                        Periode{" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </div>
                                                    {!showManualPeriod ? (
                                                        <button
                                                            type="button"
                                                            className="px-3 py-1 mb-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                                                            onClick={() =>
                                                                setShowManualPeriod(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            Buat Baru
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="mb-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                                                            onClick={() => {
                                                                setShowManualPeriod(
                                                                    false
                                                                );
                                                                setData(
                                                                    "period_id",
                                                                    ""
                                                                );
                                                                setData(
                                                                    "manual_period_name",
                                                                    ""
                                                                );
                                                                setFieldErrors(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        manual_period_name:
                                                                            "",
                                                                        period_id:
                                                                            "",
                                                                    })
                                                                );
                                                            }}
                                                        >
                                                            Batal Buat
                                                        </button>
                                                    )}
                                                </label>
                                                {!showManualPeriod ? (
                                                    <>
                                                        {availablePeriods.length >
                                                        0 ? (
                                                            <div>
                                                                <select
                                                                    id="period_id"
                                                                    name="period_id"
                                                                    value={
                                                                        data.period_id
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleInputChange(
                                                                            "period_id",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className={`w-full px-3 py-2 border rounded-md ${
                                                                        fieldErrors.period_id
                                                                            ? "border-red-500"
                                                                            : "border-gray-300"
                                                                    }`}
                                                                    required={
                                                                        !showManualPeriod
                                                                    }
                                                                >
                                                                    <option value="">
                                                                        Pilih
                                                                        Periode
                                                                    </option>
                                                                    {availablePeriods.map(
                                                                        (
                                                                            period
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    period.id
                                                                                }
                                                                                value={
                                                                                    period.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    period.name
                                                                                }{" "}
                                                                                {
                                                                                    period.year
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                                {(fieldErrors.period_id ||
                                                                    errors.period_id) && (
                                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                                        <AlertCircle className="h-4 w-4 mr-1" />
                                                                        {fieldErrors.period_id ||
                                                                            errors.period_id}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-gray-500 py-2">
                                                                Tidak ada
                                                                periode tersedia
                                                                untuk tahun{" "}
                                                                {
                                                                    data.selected_year
                                                                }
                                                                . Silakan buat
                                                                periode baru.
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div>
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
                                                            className={`w-full px-3 py-2 border rounded-md ${
                                                                fieldErrors.manual_period_name
                                                                    ? "border-red-500"
                                                                    : "border-gray-300"
                                                            }`}
                                                            required={
                                                                showManualPeriod
                                                            }
                                                        >
                                                            <option value="">
                                                                Pilih Nama
                                                                Periode
                                                            </option>
                                                            <option value="Triwulan I">
                                                                Triwulan I
                                                            </option>
                                                            <option value="Triwulan II">
                                                                Triwulan II
                                                            </option>
                                                            <option value="Triwulan III">
                                                                Triwulan III
                                                            </option>
                                                            <option value="Triwulan IV">
                                                                Triwulan IV
                                                            </option>
                                                            <option value="Setahun">
                                                                Setahun
                                                            </option>
                                                        </select>
                                                        {(fieldErrors.manual_period_name ||
                                                            errors.manual_period_name) && (
                                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                                {fieldErrors.manual_period_name ||
                                                                    errors.manual_period_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
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
                                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                                        activeTab === tab.id
                                                            ? "border-blue-500 text-blue-600"
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
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                            >
                                                <Save className="h-5 w-5 mr-2" />
                                                {processing
                                                    ? "Menyimpan..."
                                                    : "Simpan Perubahan"}
                                            </button>
                                            <div>
                                                {existingData && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowDeleteConfirm(
                                                                true
                                                            )
                                                        }
                                                        className="flex items-center px-4 py-2.5 text-sm text-white bg-red-700 rounded-md hover:opacity-90 transition-colors"
                                                    >
                                                        <Trash2 className="h-5 w-5 mr-2" />
                                                        Hapus Data
                                                    </button>
                                                )}
                                            </div>
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

export default Edit;
