import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, PieChart, Users, Calendar, Award } from 'lucide-react';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const openModal = (modalType) => {
        setActiveModal(modalType);
        setIsMenuOpen(false);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const modalContent = {
        summary: {
            title: "Summary Report",
            icon: <BarChart3 className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Total Users</p>
                                    <p className="text-2xl font-bold text-blue-800">1,247</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-3">
                                <Award className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Active Today</p>
                                    <p className="text-2xl font-bold text-green-800">856</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">This Month</p>
                                    <p className="text-2xl font-bold text-purple-800">23.4k</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-3">Recent Activity</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">New user registered</span>
                                <span className="text-sm text-gray-500">2 min ago</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">Survey completed</span>
                                <span className="text-sm text-gray-500">15 min ago</span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                                <span className="text-gray-700">Data exported</span>
                                <span className="text-sm text-gray-500">1 hour ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        average: {
            title: "Average Analysis",
            icon: <TrendingUp className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                        <h4 className="font-semibold text-gray-800 mb-4">Performance Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-600">78.5%</p>
                                <p className="text-sm text-gray-600">Completion Rate</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-red-600">4.2</p>
                                <p className="text-sm text-gray-600">Average Rating</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Category Breakdown</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Kepa Assessment</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-4/5 h-full bg-blue-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">80%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Awareness Level</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-3/5 h-full bg-green-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">60%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Knowledge Score</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="w-full h-full bg-purple-500"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600">95%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        statistik: {
            title: "Detailed Statistics",
            icon: <PieChart className="w-6 h-6" />,
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                            <h4 className="font-semibold text-indigo-800 mb-3">User Demographics</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Age 18-25</span>
                                    <span className="text-sm font-medium">35%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Age 26-35</span>
                                    <span className="text-sm font-medium">40%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Age 36+</span>
                                    <span className="text-sm font-medium">25%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                            <h4 className="font-semibold text-teal-800 mb-3">Response Time</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">kurang 5 minutes</span>
                                    <span className="text-sm font-medium">45%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">5-15 minutes</span>
                                    <span className="text-sm font-medium">30%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">lebih 15 minutes</span>
                                    <span className="text-sm font-medium">25%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <h4 className="font-semibold text-gray-800 mb-4">Weekly Trends</h4>
                        <div className="grid grid-cols-7 gap-2 text-center">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                <div key={day} className="bg-white p-2 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">{day}</p>
                                    <div className={`h-12 rounded ${
                                        index === 2 ? 'bg-blue-500' : 
                                        index === 4 ? 'bg-green-500' : 
                                        index === 0 ? 'bg-purple-500' : 'bg-gray-300'
                                    }`}></div>
                                    <p className="text-xs font-medium mt-1">{Math.floor(Math.random() * 200) + 50}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }
    };

    return (
        <>
<<<<<<< HEAD
        <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
            <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 sm:px-6 py-3 border border-gray-200/20" style={{ height: "70px" }}>
                <div className="flex items-center justify-between h-full">

                    <div className="flex items-center">
                        <img src="/assets/dp3ak.png" alt="logo dp3ak" className="w-auto h-8 sm:h-10 md:h-12 object-contain" />
                    </div>

                    <h1 className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-indigo-700 hidden md:block uppercase">
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
=======
            {/* Navbar */}
            <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
                <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 sm:px-6 py-3 border border-gray-200/20" style={{ height: "70px" }}>
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center">
                            <img src="/assets/dp3ak.png" alt="logo dp3ak" className="w-auto h-8 sm:h-10 md:h-12 object-contain" />
                        </div>
                        
                        <h1 className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-gray-800 md:block uppercase">
                            Siapa Peka
                        </h1>
                        
                        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                            <button 
                                onClick={() => openModal('summary')}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium capitalize hover:scale-105 transform"
                            >
                                summary
                            </button>
                            <button 
                                onClick={() => openModal('average')}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium capitalize hover:scale-105 transform"
                            >
                                average
                            </button>
                            <button 
                                onClick={() => openModal('statistik')}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium capitalize hover:scale-105 transform"
                            >
                                statistik
                            </button>
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
>>>>>>> ca244eddf9d16999c693dd38b5bb970b6755a4f4
                    </div>
                </div>
                
                {/* Mobile Menu */}
                <div className={`lg:hidden mt-4 transition-all duration-300 ${isMenuOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4 pointer-events-none'}`}>
                    <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-4 border border-gray-200/20">
                        <div className="flex flex-col space-y-3">
                            <button 
                                onClick={() => openModal('summary')}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50 text-left"
                            >
                                summary
                            </button>
                            <button 
                                onClick={() => openModal('average')}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50 text-left"
                            >
                                average
                            </button>
                            <button 
                                onClick={() => openModal('statistik')}
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-base font-medium capitalize py-2 px-3 rounded-lg hover:bg-gray-100/50 text-left"
                            >
                                statistik
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modal Backdrop */}
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={closeModal}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/20 max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    {modalContent[activeModal].icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {modalContent[activeModal].title}
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                            >
                                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                            {modalContent[activeModal].content}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end p-6 border-t border-gray-200/50">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
