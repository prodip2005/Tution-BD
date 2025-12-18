import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { MdMoveToInbox, MdOutlinePostAdd } from "react-icons/md";
import useRole from '../../Hooks/useRole';
import { VscGitStashApply } from "react-icons/vsc";
import { FaChalkboardTeacher, FaClipboardList, FaRegCreditCard, FaUserShield, FaGraduationCap, FaChalkboard, FaHome } from 'react-icons/fa';
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// --- এনিমেটেড ব্যাকগ্রাউন্ড অর্বস ---
const BackgroundAnimation = () => (
    <div className="fixed inset-0 -z-10 bg-[#050505] overflow-hidden">
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
            animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -50, 0],
                y: [0, -40, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"
        />
    </div>
);

// --- Overview Component with Glass Effect ---
const DashboardOverview = ({ role }) => {
    const rules = {
        admin: [
            { icon: <FaUserShield />, title: "Authority", text: "Verify identities and monitor system logs." },
            { icon: <FaClipboardList />, title: "Management", text: "Approve tuitions with precision." },
            { icon: <FaUsersBetweenLines />, title: "Integrity", text: "Maintain a safe learning environment." }
        ],
        tutor: [
            { icon: <FaChalkboard />, title: "Precision", text: "Apply to subjects within your expertise." },
            { icon: <MdMoveToInbox />, title: "Response", text: "Stay active to grab the best opportunities." },
            { icon: <FaRegCreditCard />, title: "Growth", text: "Build a top-tier professional profile." }
        ],
        student: [
            { icon: <MdOutlinePostAdd />, title: "Clarity", text: "Define your needs clearly for best matches." },
            { icon: <VscGitStashApply />, title: "Selection", text: "Review tutor credentials thoroughly." },
            { icon: <FaRegCreditCard />, title: "Security", text: "Ensure safe and transparent payments." }
        ]
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 md:p-10 min-h-full flex flex-col items-center justify-center"
        >
            <div className="w-full max-w-6xl space-y-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ y: 30 }} animate={{ y: 0 }}
                    className="relative p-8 md:p-16 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl text-center overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <FaGraduationCap size={200} />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">
                        Welcome, <span className="text-primary italic">{role}</span>
                    </h1>
                    <p className="mt-4 text-gray-400 text-lg md:text-xl font-medium tracking-wide">
                        Your professional control center is ready.
                    </p>
                </motion.div>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {rules[role]?.map((rule, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-md border border-white/5 hover:border-primary/50 transition-all duration-500"
                        >
                            <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                                {rule.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{rule.title}</h3>
                            <p className="text-gray-400 font-medium leading-relaxed">{rule.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { role, isLoading } = useRole();
    const location = useLocation();
    const isDashboardHome = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-[#050505]">
                <Lottie path="https://lottie.host/890453d1-419b-449a-bd9e-269608406180/7eL6R9oV7j.json" className="w-64" loop />
                <h2 className="text-xl font-black text-primary animate-pulse tracking-[0.5em] mt-8 uppercase">Initializing</h2>
            </div>
        );
    }

    return (
        <div className="drawer lg:drawer-open min-h-screen">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col relative">
                <BackgroundAnimation />

                {/* Glassy Navbar */}
                <nav className="navbar w-full bg-black/20 backdrop-blur-xl border-b border-white/5 px-6 sticky top-0 z-40 justify-between">
                    <div className="flex items-center gap-4">
                        <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost lg:hidden text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                        <span className="text-white font-black uppercase tracking-widest text-lg italic">
                            Dashboard <span className="text-primary">.</span>
                        </span>
                    </div>
                    <div className="badge badge-outline border-primary text-primary font-black px-4 py-3 uppercase text-[10px] tracking-[0.2em]">
                        {role} Access
                    </div>
                </nav>

                {/* Main Viewport */}
                <main className="flex-1 relative">
                    <AnimatePresence mode="wait">
                        {isDashboardHome ? (
                            <DashboardOverview role={role} key="home" />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 md:p-8"
                            >
                                <div className="bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] border border-white/5 min-h-[80vh] p-4 md:p-10 shadow-2xl">
                                    <Outlet />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Premium Sidebar */}
            <div className="drawer-side z-[50]">
                <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
                <div className="w-72 min-h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col">

                    {/* Brand */}
                    <div className="p-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                                <FaGraduationCap size={28} className="text-white" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter uppercase italic group-hover:text-primary transition-colors">TutorOWL</span>
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <ul className="menu px-4 py-2 w-full grow gap-2 overflow-y-auto">
                        <li className="menu-title text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-4 mb-2 ml-4">Main Menu</li>
                        <li>
                            <NavLink to={'/'} className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                <FaHome size={20} /> <span>Homepage</span>
                            </NavLink>
                        </li>

                        {/* Student Routes */}
                        {role === 'student' && (
                            <>
                                <li><NavLink to={'post-tutions'} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"><MdOutlinePostAdd size={22} /> Post Tuitions</NavLink></li>
                                <li><NavLink to={'my-tutions'} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"><HiOutlineDocumentText size={22} /> My Tuitions</NavLink></li>
                                <li><NavLink to={'applied-tutions'} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"><VscGitStashApply size={22} /> Applied Tuitions</NavLink></li>
                            </>
                        )}

                        {/* Tutor Routes */}
                        {role === 'tutor' && (
                            <>
                                <li><NavLink to={'applications'} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"><MdMoveToInbox size={22} /> My Applications</NavLink></li>
                            </>
                        )}

                        {/* Admin Routes */}
                        {role === 'admin' && (
                            <>
                                <li><NavLink to={'all-users'} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"><FaUsersBetweenLines size={22} /> Users Control</NavLink></li>
                                <li><NavLink to={'apply-tution'} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"><FaClipboardList size={22} /> Tuition Desk</NavLink></li>
                                <li><NavLink to={'applied-tutor'} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"><FaChalkboardTeacher size={22} /> Tutor Requests</NavLink></li>
                            </>
                        )}

                        {/* Financials Section - Hidden for Admin */}
                        {role !== 'admin' && (
                            <>
                                <li className="menu-title text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-8 mb-2 ml-4">
                                    Financials
                                </li>
                                <li>
                                    <NavLink
                                        to={role === 'tutor' ? 'tutor-payment' : 'payment-history'}
                                        className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        <FaRegCreditCard size={20} /> <span>Payments</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Footer Area */}
                    <div className="p-6 border-t border-white/5">
                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="size-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;