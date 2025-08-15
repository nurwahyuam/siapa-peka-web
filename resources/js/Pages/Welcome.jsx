import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Welcome({ auth }) {
    useEffect(() => {
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const cities = [
            { name: "Jakarta", coords: [-6.200000, 106.816666] },
            { name: "Surabaya", coords: [-7.257472, 112.752090] },
            { name: "Bandung", coords: [-6.917464, 107.619125] },
            { name: "Yogyakarta", coords: [-7.795580, 110.369492] },
        ];

        cities.forEach((city) => {
            L.marker(city.coords)
                .addTo(map)
                .bindPopup(`<b>${city.name}</b>`);
        });

        return () => {
            map.remove();
        };
    }, []);

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-white w-full flex flex-col items-center justify-center">
                <div id="map" className="w-full h-screen rounded-lg shadow-lg"></div>
            </div>
        </>
    );
}
