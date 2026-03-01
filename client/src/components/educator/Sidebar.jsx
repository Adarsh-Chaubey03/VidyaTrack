import React from 'react'
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BookOpen, Users, X } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: LayoutDashboard },
    { name: 'Add Course', path: '/educator/add-courses', icon: PlusCircle },
    { name: 'My Courses', path: '/educator/my-courses', icon: BookOpen },
    { name: 'Students', path: '/educator/student-enrolled', icon: Users },
];

function Sidebar({ isOpen, onClose }) {
    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r border-slate-200 bg-white">
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                to={item.path}
                                key={item.name}
                                end={item.path === '/educator'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                    ${isActive
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:hidden
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-800">Menu</span>
                    <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="py-3 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                to={item.path}
                                key={item.name}
                                end={item.path === '/educator'}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                    ${isActive
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
