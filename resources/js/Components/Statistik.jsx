import { useState } from "react";
import { X ,ChevronLeft } from "lucide-react";

export default function Statistik() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${isOpen ? "hidden" : ""} fixed bottom-48 right-6 lg:top-40 lg:bottom-auto bg-black text-white p-4  rounded-full shadow-lg hover:rotate-180 transition-transform duration-300`}
        >
            <ChevronLeft />
        </button>


        {isOpen && (
            <div className="fixed top-72 sm:top-40 sm:right-10 w-96 h-auto bg-white shadow-xl rounded-lg px-4 py-3 border border-gray-200 animate-slide-up">
                <div className="relative flex items-center justify-center">

                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute left-0 p-2 hover:rotate-90 transition"
                    >
                        <X />
                    </button>

                    <h2 className="text-lg font-bold text-center">
                        Statistik Provinsi Jawa Timur
                    </h2>
                </div>

            <p className="text-sm p-3 text-gray-600">
                Statistik ini memberikan informasi tentang jumlah penduduk, luas wilayah, dan jumlah desa di Provinsi Jawa Timur.
            </p>
            </div>
        )}
        </>
    );
}
