import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";

// আধুনিক এবং ক্লিন আইকনস
import {
    LuUser,
    LuGraduationCap,
    LuMail,
    LuHash,
    LuArrowRight,
    LuShieldCheck,
    LuUsers,
    LuSearchX
} from "react-icons/lu";

const Tutors = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: tutors = [], isLoading } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users?role=tutor");
            return res.data.users || [];
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 md:w-32 md:h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-8 md:mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-[10px] font-black tracking-[0.4em] uppercase italic px-4 text-center"
                    >
                        Fetching Experts
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-6 md:gap-8">
                <div className="text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center md:justify-start gap-2 mb-2"
                    >
                        <span className="h-[2px] w-6 md:w-8 bg-primary rounded-full inline-block"></span>
                        <span className="text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px]">Professional Network</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-tight"
                    >
                        Our <span className="text-primary not-italic">Elite</span> Tutors
                    </motion.h2>
                    <p className="mt-2 text-gray-500 font-bold italic flex items-center gap-2 justify-center md:justify-start text-xs md:text-base">
                        <LuShieldCheck className="text-primary shrink-0" /> Verified educators ready to guide you.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-6 py-3 md:px-8 md:py-4 rounded-[1.5rem] md:rounded-[2rem] shadow-xl"
                >
                    <div className="p-2 md:p-3 bg-primary/10 text-primary rounded-xl md:rounded-2xl">
                        <LuUsers size={20} />
                    </div>
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Active Mentors</p>
                        <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-none">{tutors.length}</p>
                    </div>
                </motion.div>
            </div>

            {/* --- Table / Card Container --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden md:bg-white/40 md:dark:bg-white/[0.02] md:backdrop-blur-3xl md:rounded-[3rem] md:border md:border-white md:dark:border-white/10 md:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)]"
            >
                <div className="overflow-x-auto hidden md:block">
                    {/* --- DESKTOP TABLE VIEW --- */}
                    <table className="table w-full border-separate border-spacing-y-4 px-6 pb-6">
                        <thead>
                            <tr className="text-gray-400 uppercase text-[10px] tracking-[0.2em] font-black border-none">
                                <th className="bg-transparent pl-8"><div className="flex items-center gap-2"><LuHash size={14} className="text-primary" /> ID</div></th>
                                <th className="bg-transparent"><div className="flex items-center gap-2"><LuUser size={14} className="text-primary" /> Profile</div></th>
                                <th className="bg-transparent"><div className="flex items-center gap-2"><LuMail size={14} className="text-primary" /> Contact</div></th>
                                <th className="bg-transparent"><div className="flex items-center gap-2"><LuGraduationCap size={14} className="text-primary" /> Affiliation</div></th>
                                <th className="bg-transparent text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {tutors.map((tutor, index) => (
                                    <TutorRow key={tutor._id} tutor={tutor} index={index} navigate={navigate} />
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* --- MOBILE CARD VIEW --- */}
                <div className="md:hidden flex flex-col gap-4">
                    <AnimatePresence>
                        {tutors.map((tutor, index) => (
                            <motion.div
                                key={tutor._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => navigate(`/tutors/${tutor.email}`)}
                                className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-5 shadow-sm active:scale-95 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <img
                                            src={tutor.image || "https://i.ibb.co/2FsfXqM/avatar.png"}
                                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/10 shadow-md"
                                            alt=""
                                        />
                                        <div className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900"></span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-gray-900 dark:text-white text-base italic truncate tracking-tight uppercase">
                                            {tutor.name || "Anonymous"}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                                            <LuMail className="text-primary" /> {tutor.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/10">
                                        <LuGraduationCap size={12} /> {tutor.institution ? "Verified Edu" : "Private"}
                                    </div>
                                    <div className="text-primary font-black text-[10px] uppercase flex items-center gap-1">
                                        Details <LuArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {tutors.length === 0 && (
                    <div className="p-20 md:p-32 text-center bg-transparent">
                        <div className="flex flex-col items-center justify-center opacity-40">
                            <LuSearchX size={48} className="mb-4 text-primary" />
                            <p className="text-sm md:text-xl font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic">No Experts Found</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Desktop Row Component
const TutorRow = ({ tutor, index, navigate }) => (
    <motion.tr
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group bg-white dark:bg-white/[0.03] hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] transition-all shadow-sm hover:shadow-md"
    >
        <td className="p-6 pl-8 font-mono text-xs text-gray-400 rounded-l-[2.5rem]">
            {String(index + 1).padStart(2, '0')}
        </td>
        <td className="p-6">
            <div className="flex items-center gap-4">
                <img src={tutor.image || "https://i.ibb.co/2FsfXqM/avatar.png"} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="" />
                <div className="flex flex-col">
                    <span className="font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors text-base italic leading-tight uppercase tracking-tight">
                        {tutor.name || "Anonymous"}
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">Expert Tutor</span>
                </div>
            </div>
        </td>
        <td className="p-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-600 dark:text-gray-400">
                {tutor.email}
            </div>
        </td>
        <td className="p-6">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border shadow-sm ${tutor.institution ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}>
                <LuGraduationCap size={14} /> {tutor.institution || "Private Practice"}
            </div>
        </td>
        <td className="p-6 text-right pr-8 rounded-r-[2.5rem]">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/tutors/${tutor.email}`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-primary transition-all shadow-lg"
            >
                Details <LuArrowRight size={16} />
            </motion.button>
        </td>
    </motion.tr>
);

export default Tutors;