import React, { useState } from 'react';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
        <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
            <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 sm:px-6 py-3 border border-gray-200/20" style={{ height: "70px" }}>
                <div className="flex items-center justify-between h-full">

                    <div className="flex items-center">
                        <img src="/assets/dp3ak.png" alt="logo dp3ak" className="w-auto h-8 sm:h-10 md:h-12 object-contain" />
                    </div>
                    
                    <h1 className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-gray-800 hidden md:block uppercase">
                        Siapa Peka
                    </h1>
                    
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium capitalize">
                            summary
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium capitalize">
                            average
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium capitalize">
                            statistik
                        </a>
                    </div>
                    
                    <button 
                        onClick={toggleMenu}
                        className="lg:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
                        aria-label="Toggle menu"
                    >
                        <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                        <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                        <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                    </button>
                </div>
            </div>
            
            <div className={`lg:hidden mt-4 transition-all duration-300 ${isMenuOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4 pointer-events-none'}`}>
                <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-4 border border-gray-200/20">

                    <div className="md:hidden mb-4 pb-4 border-b border-gray-200/30">
                        <h1 className="font-extrabold text-xl text-gray-800 uppercase text-center">
                            Siapa Peka
                        </h1>
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                        <a 
                            href="#" 
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            summary
                        </a>
                        <a 
                            href="#" 
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            average
                        </a>
                        <a 
                            href="#" 
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            statistik
                        </a>
                    </div>
                </div>
            </div>
        </nav>
        </>
    )
}

export default Navbar;