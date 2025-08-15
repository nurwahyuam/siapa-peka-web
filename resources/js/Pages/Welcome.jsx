import { Head } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Welcome() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const mapInstance = L.map("map").setView([-7.5, 112.5], 7);
    mapRef.current = mapInstance;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance);

    fetch("https://z4nr.github.io/WhatGeo/api/?type=kota&province=35")
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          style: () => ({
            fillColor: "#74c476",
            color: "#238b45",
            weight: 1,
            fillOpacity: 0.6,
          }),
          onEachFeature: (feature, layer) => {
            layer.bindPopup(feature.properties.name || "Wilayah");
          }
        }).addTo(mapInstance);
      });

    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <>
      <Head title="Peta Kota/Kabupaten Jawa Timur" />
      <div className="min-h-screen bg-white">
        <div id="map" className="w-full h-screen"></div>
      </div>
    </>
  );
}
