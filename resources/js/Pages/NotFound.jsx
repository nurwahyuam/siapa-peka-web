import React from "react";

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gradient-to-br from-indigo-400 via-indigo-300 to-indigo-200">
                <h1 className="font-bold text-[150px] leading-none text-white">
                    404
                </h1>
                <p className="text-[20px] leading-tight text-white">
                    Halaman yang anda cari tidak ada!
                </p>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                    }}
                    className="bg-white mt-5 text-sm px-5 py-3 rounded-full
             hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-400
             hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
                >
                    kembali ke halaman sebelumnya
                </a>
            </div>
        </>
    );
}
