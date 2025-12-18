import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../Providers/AuthContext";
import useRole from "../Hooks/useRole";

// Icons
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { FiHome, FiBookOpen, FiUsers, FiLayout, FiLogOut, FiUserPlus } from "react-icons/fi";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, LogOut } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const { role } = useRole();

    const handleLogOut = async () => {
        try {
            await LogOut();
            navigate("/");
        } catch (err) {

        }
    };

    const menuItems = [
        { to: "/", label: "Home", icon: <FiHome /> },
        { to: "/tutions", label: "Tutions", icon: <FiBookOpen /> },
        { to: "/tutors", label: "Tutors", icon: <FiUsers /> },
        ...(user ? [{ to: "/dashboard", label: "Dashboard", icon: <FiLayout /> }] : []),
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-[100] px-2 py-3 md:px-8 md:py-5">
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="max-w-7xl mx-auto
                            backdrop-blur-2xl
                            bg-gray-900/70
                            border border-white/10
                            shadow-[0_8px_40px_rgba(0,0,0,0.45)]
                            rounded-3xl md:rounded-4xl
                            px-4 py-2.5 md:px-6 md:py-3
                            flex items-center justify-between"
            >
                {/* --- Left: Brand Section --- */}
                <div className="flex items-center gap-1 md:gap-3">
                    <button
                        onClick={() => setOpen(!open)}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-200"
                    >
                        {open ? <HiOutlineX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
                    </button>

                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl shadow-md group-hover:rotate-6 transition-transform duration-300"
                            src="https://images-platform.99static.com/DVETQ4KXxNUWF1Q-k4ASnnzl9LY=/112x112:2365x2365/fit-in/99designs-work-samples/work-sample-designs/1039810/842795fa-0320-4287-baac-22e221a46d34"
                            alt="Logo"
                        />
                        <span className="text-lg md:text-xl font-extrabold tracking-tight text-gray-100">
                            Tutor<span className="text-primary">OWL</span>
                        </span>
                    </Link>
                </div>

                {/* --- Center: Desktop Menu --- */}
                <div className="hidden lg:block">
                    <ul className="flex items-center gap-1 bg-gray-800/60 backdrop-blur-xl p-1 rounded-2xl">
                        {menuItems.map((item) => (
                            <li key={item.to} className="relative">
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `relative px-4 py-2.5 flex items-center gap-2 text-sm font-bold transition-all duration-300 rounded-xl ${isActive ? "text-white" : "text-gray-300 hover:text-primary"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-pill-active"
                                                    className="absolute inset-0 bg-primary rounded-xl shadow-md"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center gap-2">
                                                {item.icon} {item.label}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Right: User & Auth --- */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Updated: Added flex (removed hidden sm:flex) and Emerald Green color */}
                    {user && role === "student" && (
                        <Link to="/apply-tutor" className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl font-bold text-[9px] md:text-xs hover:bg-emerald-500 hover:text-white transition-all">
                            <FiUserPlus /> <span className="inline">BE A TUTOR</span>
                        </Link>
                    )}

                    {!user ? (
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-2 md:px-6 md:py-2.5 bg-primary text-white text-xs md:text-sm font-bold rounded-xl shadow-lg shadow-primary/20"
                            >
                                Login
                            </motion.button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-700">
                            <div className="hidden sm:flex flex-col items-end leading-tight">
                                <span className="text-[13px] font-bold text-gray-100 truncate max-w-[100px]">
                                    {user?.displayName || "User"}
                                </span>
                                <span className="text-[10px] font-medium text-primary uppercase tracking-wider">{role || "Member"}</span>
                            </div>

                            <Link to="/updateUserProfile" className="relative group">
                                <img
                                    src={user.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                                    className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-primary/20 group-hover:border-primary transition-all object-cover shadow-sm"
                                    alt="Profile"
                                />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                            </Link>

                            <button
                                onClick={handleLogOut}
                                className="hidden md:flex p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </motion.nav>

            {/* --- Mobile Sidebar/Drawer --- */}
            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm lg:hidden z-[-1]"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-screen w-[280px] bg-gray-900/90 backdrop-blur-2xl border-r border-white/10 shadow-2xl p-6 lg:hidden z-[110] flex flex-col"
                        >
                            <div className="mb-8 pt-4">
                                {user ? (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                        <img src={user.photoURL} className="w-12 h-12 rounded-full border-2 border-primary" alt="" />
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-gray-100 truncate">{user?.displayName}</p>
                                            <p className="text-xs text-primary font-semibold uppercase">{role}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <img className="w-10 h-10 rounded-lg" src="https://images-platform.99static.com/DVETQ4KXxNUWF1Q-k4ASnnzl9LY=/112x112:2365x2365/fit-in/99designs-work-samples/work-sample-designs/1039810/842795fa-0320-4287-baac-22e221a46d34" alt="Logo" />
                                        <span className="text-xl font-bold dark:text-white italic">TutorOWL</span>
                                    </div>
                                )}
                            </div>

                            <nav className="flex-1 overflow-y-auto">
                                <ul className="space-y-2">
                                    {menuItems.map((item) => (
                                        <li key={item.to}>
                                            <NavLink
                                                to={item.to}
                                                onClick={() => setOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-4 p-4 rounded-xl font-bold transition-all ${isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:bg-white/5"
                                                    }`
                                                }
                                            >
                                                <span className="text-xl">{item.icon}</span> {item.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                                {user ? (
                                    <button onClick={handleLogOut} className="flex items-center gap-3 w-full p-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all">
                                        <FiLogOut size={20} /> Logout
                                    </button>
                                ) : (
                                    <Link to="/login" onClick={() => setOpen(false)} className="block w-full p-4 bg-primary text-white text-center font-bold rounded-xl shadow-lg shadow-primary/20">
                                        Login / Register
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;