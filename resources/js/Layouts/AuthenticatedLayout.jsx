import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";

import { useState } from "react";
import {
    LayoutDashboard,
    BarChart3,
    Settings,
    SquareKanban,
    User,
    LogOut,
    Menu,
    X,
    User2,
} from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* Sidebar - Fixed height, tidak scroll */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 bg-white shadow-lg h-screen">
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="flex items-center justify-center h-[70.5px] border-b border-gray-200 px-4">
                            <Link href="/" className="flex items-center">
                                <img
                                    src="/assets/dp3ak.png"
                                    className="h-8 w-auto"
                                    alt="Logo DP3AK"
                                />
                                <span className="ml-2 text-xl font-bold text-gray-800 uppercase">
                                    siapa peka
                                </span>
                            </Link>
                        </div>
                        {/* Sidebar */}
                        <div
                            className={`fixed inset-y-0 left-0 z-50 h-full flex flex-col justify-between bg-white shadow transform
                                        ${
                                            sidebarOpen
                                                ? "translate-x-0"
                                                : "-translate-x-full"
                                        }
                                        transition duration-300 ease-in-out
                                        lg:translate-x-0 lg:static lg:inset-0`}
                        >
                            <nav className="flex-1 px-4 py-6 space-y-4">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                    className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <LayoutDashboard className="h-5 w-5 mr-3" />
                                    Beranda
                                </NavLink>

                                <NavLink
                                    href={route("statistic")}
                                    active={route().current("statistic")}
                                    className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <BarChart3 className="h-5 w-5 mr-3" />
                                    Statistik
                                </NavLink>

                                <NavLink
                                    href={route("manage.index")}
                                    active={
                                        route().current("manage.index") ||
                                        route().current("manage.show") ||
                                        route().current("manage.create") ||
                                        route().current("manage.import") ||
                                        route().current("manage.edit")
                                    }
                                    className="flex items-center px-4 py-3 w-full text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <SquareKanban className="h-5 w-5 mr-3 -rotate-90" />
                                    Manajemen
                                </NavLink>
                                <NavLink
                                    href={route("profile.edit")}
                                    active={route().current("profile.edit")}
                                    className="flex items-center px-4 py-3 w-full text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <User className="h-5 w-5 mr-3" />
                                    Profil
                                </NavLink>
                            </nav>
                            <div className="border-t border-gray-200 p-4">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
                                >
                                    <LogOut className="h-4 w-4 mr-3" />
                                    Keluar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden transition-opacity duration-300 ${
                    sidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
                        <Link href="/" className="flex items-center">
                            <img
                                src="/assets/dp3ak.png"
                                className="h-8 w-auto"
                                alt="Logo DP3AK"
                            />
                            <span className="ml-2 text-xl font-bold text-gray-800 uppercase">
                                siapa peka
                            </span>
                        </Link>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        <NavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <LayoutDashboard className="h-5 w-5 mr-3" />
                            Dashboard
                        </NavLink>

                        <NavLink
                            href={route("statistic")}
                            active={route().current("statistic")}
                            className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <BarChart3 className="h-5 w-5 mr-3" />
                            Statistik
                        </NavLink>
                        <NavLink
                            href={route("manage.index")}
                            active={
                                route().current("manage.index") ||
                                route().current("manage.show") ||
                                route().current("manage.create") ||
                                route().current("manage.import") ||
                                route().current("manage.edit")
                            }
                            className="flex items-center px-4 py-3 w-full text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <SquareKanban className="h-5 w-5 mr-3 -rotate-90" />
                            Manajemen
                        </NavLink>
                        <NavLink
                            href={route("profile.edit")}
                            active={route().current("profile.edit")}
                            className="flex items-center px-4 py-3 w-full text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <User className="h-5 w-5 mr-3 -rotate-90" />
                            Profil {user.username}
                        </NavLink>
                    </nav>

                    {/* Mobile User Dropdown */}
                    <div className="border-t border-gray-200 p-4">
                        <Link
                            href={route("profile.edit")}
                            className="flex items-center justify-end rounded-lg p-2 cursor-pointer transition-colors duration-200"
                        >
                            <div className="mr-3 min-w-0 text-right">
                                <h1>{user.username}</h1>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-indigo-600" />
                            </div>
                        </Link>
                        <div className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Konten Utama */}
            <div className="flex-1 min-w-0 flex flex-col h-screen">
                {/* Top bar untuk mobile - Fixed, tidak scroll */}
                <header className="bg-white border-b border-gray-200 lg:hidden flex-shrink-0">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-md"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center">
                            <img
                                src="/assets/dp3ak.png"
                                className="h-6 w-auto mr-2"
                                alt="Logo"
                            />
                            <span className="text-lg font-bold text-gray-800">
                                Siapa Peka
                            </span>
                        </div>
                        <div className="w-6"></div>{" "}
                        {/* Spacer untuk balance layout */}
                    </div>
                </header>

                {/* Header dari props - Fixed, tidak scroll */}
                {header && (
                    <header className="bg-white shadow flex-shrink-0">
                        <div className="px-4 py-3 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {header}
                                </h1>
                                <div className="hidden lg:block">
                                    <Link
                                        href={route("profile.edit")}
                                        className="flex items-center rounded-lg cursor-pointer transition-colors duration-200"
                                    >
                                        <div className="mr-3 min-w-0 text-right">
                                            <h1>{user.username}</h1>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <User className="h-5 w-5 text-indigo-600" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {children}
                    <Toaster position="top-right" reverseOrder={false} />
                </main>
            </div>
        </div>
    );
}
