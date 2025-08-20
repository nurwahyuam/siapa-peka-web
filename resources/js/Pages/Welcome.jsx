import { Head, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "@/Components/Navbar";
import Statistik from "@/Components/Statistik";
import Avarrage from "@/Components/Avarrage";

export default function Welcome() {
    const mapRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const { cityFeatures } = usePage().props;
    const [showHighRiskOnly, setShowHighRiskOnly] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);

    const getColor = (category) => {
        switch (category) {
            case "Rendah":
                return "#00FF00";
            case "Cukup":
                return "#FFFF00";
            case "Tinggi":
                return "#FFA500";
            case "Sangat Tinggi":
                return "#FF0000";
            default:
                return "#808080";
        }
    };

    const showModal = (feature) => {
        setSelectedFeature(feature);
    };

    const closeModal = () => {
        setSelectedFeature(null);
    };

    useEffect(() => {
        if (!mapRef.current) {
            const mapInstance = L.map("map", {
                zoomControl: false, // Disable default zoom control
                scrollWheelZoom: false, // Disable mouse wheel zoom
                doubleClickZoom: false, // Disable double click zoom
                touchZoom: false, // Disable touch zoom
                boxZoom: false // Disable box zoom
            }).setView([-7.5, 112.5], 7);

            mapRef.current = mapInstance;

            // Add tile layer without attribution
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "" // Empty attribution
            }).addTo(mapInstance);

            // Add custom zoom control
            L.control.zoom({
                position: "topright"
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
                      f.properties?.kategori === "Tinggi" ||
                      f.properties?.kategori === "Sangat Tinggi"
              )
            : cityFeatures;

        const geoJsonData = {
            type: "FeatureCollection",
            features: featuresToShow.map(feature => ({
                type: "Feature",
                properties: feature || {},
                geometry: feature.geometry || feature
            }))
        };

        try {
            geoJsonLayerRef.current.addData(geoJsonData);

            geoJsonLayerRef.current.setStyle((feature) => {
                const isKabupaten = feature.properties.kind === "City";

                return {
                    fillColor: getColor(feature.properties?.kategori),
                    color: isKabupaten ? "#006400" : "#00008B",
                    weight: 1.5,
                    fillOpacity: 0.8,
                };
            });

            geoJsonLayerRef.current.eachLayer((layer) => {
                if (layer.feature) {
                    const feature = layer.feature;
                    const jenis = feature.properties.kind === "City" ? "Kabupaten" : "Kota";

                    // Hover popup
                    layer.on('mouseover', function() {
                        this.bindPopup(
                            `<b className="capitalize">${jenis} ${feature.properties.name || 'N/A'}</b><br/>
                            Provinsi: ${feature.properties.province || 'N/A'}<br/>
                            Kode: ${feature.properties.code || "N/A"}`
                        ).openPopup();
                    });

                    // Click modal
                    layer.on('click', function() {
                        showModal(feature.properties);
                    });
                }
            });
        } catch (error) {
            console.error("Error adding GeoJSON data:", error);
        }
    }, [showHighRiskOnly, cityFeatures]);

    return (
        <>
            <Head title="Peta Kota/Kabupaten Jawa Timur" />
            <div className="min-h-screen bg-white relative">
                <div id="map" className="w-full h-screen z-0"></div>
                <div className="absolute top-0 left-0 w-full z-10">
                    <Navbar />
                    <Statistik />
                    <Avarrage />
                </div>

                {/* Modal */}
                {selectedFeature && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                            <h3 className="text-xl font-bold capitalize">
                                {selectedFeature.kind === "City" ? "Kabupaten" : "Kota"} {selectedFeature.name || 'N/A'}
                            </h3>
                            <div className="mt-4 space-y-2">
                                <p><span className="font-semibold">Provinsi:</span> {selectedFeature.province || 'N/A'}</p>
                                <p><span className="font-semibold">Kode:</span> {selectedFeature.code || "N/A"}</p>
                                <p><span className="font-semibold">Kategori:</span> {selectedFeature.kategori || "N/A"}</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
