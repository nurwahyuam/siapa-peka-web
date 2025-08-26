import { Head, usePage, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/Components/Navbar";
import Statistik from "@/Components/Statistik";
import Legenda from "@/Components/Legenda";
import ModalDetail from "@/Components/ModalDetail";

export default function Welcome() {
    const mapRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const { cityFeatures, availableYears, selectedYear } = usePage().props;
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [currentYear, setCurrentYear] = useState(selectedYear);
    const [colorScheme, setColorScheme] = useState("accepted");
    const [showHighRiskOnly, setShowHighRiskOnly] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false); // State untuk
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modalstatistik                                

    // Fungsi untuk mendapatkan warna berdasarkan jumlah accepted
    const getColorByAccepted = (accepted) => {
        if (accepted === 0) return "#FFFFFF"; // putih (no data)
        if (accepted <= 10) return "#FFF4E0"; // beige kuning pucat (lembut)
        if (accepted <= 50) return "#D8A5A5"; // kuning caramel cerah
        if (accepted <= 100) return "#FFDADA"; // coral orange cerah
        if (accepted > 100) return "#924A4A"; // maroon terang cerah
        return "#C94C4C"; // fallback maroon vivid
    };



    // Fungsi untuk mendapatkan warna berdasarkan kategori risiko
    const getColorByCategory = (category) => {
        switch (category) {
            case "Rendah":
                return "#FFF4E0";
            case "Cukup":
                return "#D8A5A5";
            case "Tinggi":
                return "#FFDADA";
            case "Sangat Tinggi":
                return "#924A4A";
            default:
                return "#FFF4E0";
        }
    };

    // Definisikan fungsi getStyle yang konsisten
    const getStyle = (feature, isHovered = false) => {
        const isKabupaten = feature.properties.kind === "City";
        const color =
            colorScheme === "accepted"
                ? getColorByAccepted(feature.properties.total_accepted)
                : getColorByCategory(feature.properties.kategori);

        return {
            fillColor: color,
            color: isHovered ? "#FFFFFF" : "#000000",
            weight: isHovered ? 3 : 1.5,
            fillOpacity: 0.8,
        };
    };

    // Handler functions
    const handleYearChange = (year) => {
        setCurrentYear(year);
        router.get("/", { year }, { preserveState: true, replace: true });
    };

    const handleColorSchemeChange = (scheme) => {
        setColorScheme(scheme);
    };

    const handleHighRiskChange = (checked) => {
        setShowHighRiskOnly(checked);
    };

    const showModal = (feature) => {
        setSelectedFeature(feature);
        setIsModalOpen(true); // Buka modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Tutup modal
        setSelectedFeature(null);
    };

    // Fungsi untuk handle statistik dibuka/ditutup
    const handleStatsToggle = (isOpen) => {
        setIsStatsOpen(isOpen);

        if (mapRef.current) {
            if (isOpen) {
                // Geser peta ke kanan saat statistik dibuka
                mapRef.current.setView([-8, 115], 8, {
                    animate: true,
                    duration: 0.8,
                    easeLinearity: 0.25,
                });
            } else {
                // Kembalikan ke posisi semula saat statistik ditutup
                mapRef.current.setView([-8, 113.2], 8, {
                    animate: true,
                    duration: 0.8,
                    easeLinearity: 0.25,
                });
            }
        }
    };

    useEffect(() => {
        if (!mapRef.current) {
            const mapInstance = L.map("map", {
                zoomControl: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                touchZoom: false,
                boxZoom: false,
                center: [-8, 113.2], // Posisi awal
                zoom: 8,
            });

            mapRef.current = mapInstance;

            // Add tile layer with gray transparent style
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "",
                className: "gray-map-tiles",
                opacity: 0.7,
            }).addTo(mapInstance);
        }

        const mapInstance = mapRef.current;
        if (geoJsonLayerRef.current) {
            geoJsonLayerRef.current.clearLayers();
        } else {
            geoJsonLayerRef.current = L.geoJSON().addTo(mapInstance);
        }

        if (!cityFeatures || !Array.isArray(cityFeatures)) {
            console.error("Invalid cityFeatures data");
            return;
        }

        const featuresToShow = showHighRiskOnly
            ? cityFeatures.filter(
                  (f) =>
                      f.kategori === "Tinggi" || f.kategori === "Sangat Tinggi"
              )
            : cityFeatures;

        const geoJsonData = {
            type: "FeatureCollection",
            features: featuresToShow.map((feature) => ({
                type: "Feature",
                properties: feature,
                geometry: feature.geometry,
            })),
        };

        try {
            geoJsonLayerRef.current.addData(geoJsonData);

            geoJsonLayerRef.current.setStyle((feature) => {
                const color =
                    colorScheme === "accepted"
                        ? getColorByAccepted(feature.properties.total_accepted)
                        : getColorByCategory(feature.properties.kategori);

                return {
                    fillColor: color,
                    color: "#000000",
                    weight: 1.5,
                    fillOpacity: 0.8,
                };
            });

            // Setup interactivity
            geoJsonLayerRef.current.eachLayer((layer) => {
                if (layer.feature) {
                    const feature = layer.feature;

                    const tooltipContent = `
                        <div class="custom-tooltip-left">
                            <b class="capitalize">${
                                feature.properties.name || "N/A"
                            }</b><br/>
                            Provinsi: ${
                                feature.properties.province || "N/A"
                            }<br/>
                            Kode: ${feature.properties.code || "N/A"}<br/>
                        </div>
                    `;

                    layer.bindTooltip(tooltipContent, {
                        className: "custom-tooltip-left",
                        direction: "left",
                        offset: [-15, 0],
                        opacity: 1,
                        permanent: false,
                    });

                    layer.on("mouseover", function (e) {
                        this.bringToFront();
                        this.setStyle(getStyle(feature, true));
                        this.openTooltip(e.latlng);
                    });

                    layer.on("mouseout", function () {
                        this.setStyle(getStyle(feature, false));
                        this.closeTooltip();
                    });

                    layer.on("click", function () {
                        showModal(feature.properties);
                    });
                }
            });
        } catch (error) {
            console.error("Error adding GeoJSON data:", error);
        }
    }, [showHighRiskOnly, cityFeatures, currentYear, colorScheme]);

    return (
        <>
            <Head title="SIAPA PEKA" />
            <div className="min-h-screen bg-white relative">
                <div id="map" className="w-full h-screen z-0"></div>
                <div className="absolute top-0 left-0 w-full z-10">
                    <Navbar />
                    <Statistik
                        year={currentYear}
                        cityFeatures={cityFeatures}
                        onToggle={handleStatsToggle}
                    />
                    <Legenda
                        currentYear={currentYear}
                        availableYears={availableYears}
                        onYearChange={handleYearChange}
                        colorScheme={colorScheme}
                        onColorSchemeChange={handleColorSchemeChange}
                        showHighRiskOnly={showHighRiskOnly}
                        onHighRiskChange={handleHighRiskChange}
                    />
                </div>

                {/* Gunakan Modal Component */}
                <ModalDetail
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    feature={selectedFeature}
                    currentYear={currentYear}
                />
            </div>
        </>
    );
}
