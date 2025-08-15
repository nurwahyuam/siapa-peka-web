import { useState } from "react";
import { X ,ChevronLeft } from "lucide-react";


export default function Avarrage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div className="fixed bottom-10 w-full flex justify-center">
            <div className="w-96 h-auto bg-white shadow-xl rounded-lg px-4 py-3 border border-gray-200 animate-slide-up">
                <h2 className="text-lg font-bold text-center">
                Statistik Provinsi Jawa Timur
                </h2>
                <p className="text-sm p-3 text-gray-600">
                Statistik ini memberikan informasi tentang jumlah penduduk, luas wilayah, dan jumlah desa di Provinsi Jawa Timur.
                </p>
            </div>
        </div>
        </>
    );
}