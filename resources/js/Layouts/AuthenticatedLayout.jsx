import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Overlay untuk mobile */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            >
                <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow transform
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                transition duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:inset-0`}>

                {/* Logo */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <Link href="/" className="flex items-center">
                        <img src="favicon.png" className="h-8 w-auto fill-current text-gray-800" />
                        <span className="ml-2 text-xl font-semibold text-gray-800">SIAPA PEKA</span>
                    </Link>
                </div>

                {/* Sidebar Nav */}
                <nav className="px-4 py-6 space-y-2">
                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Dashboard
                    </NavLink>
                    <NavLink href="#">
                        Users
                    </NavLink>
                    <NavLink href="#">
                        Settings
                    </NavLink>
                </nav>

                {/* User Dropdown (versi Breeze) */}
                <div className="border-t border-gray-200 p-4">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md w-full">
                                <button
                                    type="button"
                                    className="w-full inline-flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    {user.name}
                                    <svg
                                        className="ml-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* Konten Utama */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar untuk mobile */}
                <header className="bg-white border-b border-gray-200 lg:hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-900"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <ApplicationLogo className="h-6 w-auto fill-current text-gray-800" />
                    </div>
                </header>

                {/* Header dari props */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
