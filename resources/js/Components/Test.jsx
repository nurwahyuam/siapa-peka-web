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
