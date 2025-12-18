import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LuMail, LuGraduationCap, LuShieldCheck, LuArrowRight, LuStar } from "react-icons/lu";
import { motion } from "framer-motion";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const LatestTutors = () => {
    const axiosSecure = useAxiosSecure();

    const { data: tutors = [], isLoading } = useQuery({
        queryKey: ["latest-tutors"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users?role=tutor");
            return res.data.users || [];
        },
    });

    const latestTutors = [...tutors]
        .sort((a, b) => new Date(b.createdAt || b.createAt) - new Date(a.createdAt || a.createAt))
        .slice(0, 3);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20 bg-[#020617]">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
        );
    }

    return (
        <section className="relative py-24 px-4 overflow-hidden bg-[#020617]">
            {/* --- Background Ambient Glow --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] -z-10 rounded-full" />

            <div className="max-w-7xl mx-auto">
                {/* --- Section Header --- */}
                <div className="text-center mb-20 flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-indigo-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase border border-indigo-500/20 px-4 py-1.5 rounded-full bg-indigo-500/5 backdrop-blur-md mb-8"
                    >
                        Verified Instructors
                    </motion.span>

                    {/* Animated Heading Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        className="relative mb-6"
                    >
                        {/* Glow Behind Icon */}
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative bg-white/5 p-5 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl"
                        >
                            <LuStar className="text-indigo-500 shadow-indigo-500" size={42} fill="currentColor" fillOpacity={0.2} />
                        </motion.div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none"
                    >
                        Latest <span className="text-indigo-500">Registered</span> Tutors
                    </motion.h2>
                </div>

                {/* --- Tutors Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestTutors.map((tutor, index) => (
                        <motion.div
                            key={tutor._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-white/[0.02] backdrop-blur-[30px] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-indigo-500/40"
                        >
                            {/* Inner Card Glow on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] -z-10" />

                            {/* Profile Header */}
                            <div className="flex items-center gap-5 mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-2xl" />
                                    <img
                                        src={tutor.image || "https://i.ibb.co/2FsfXqM/avatar.png"}
                                        alt="tutor"
                                        className="relative w-20 h-20 rounded-2xl object-cover border-2 border-white/10 group-hover:border-indigo-500 transition-all duration-500 shadow-xl"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-white italic tracking-tight uppercase group-hover:text-indigo-400 transition-colors">
                                        {tutor.name || "Unnamed Tutor"}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <LuShieldCheck className="text-indigo-400" size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
                                            Registry Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <motion.div
                                        whileHover={{ rotate: 15 }}
                                        className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center"
                                    >
                                        <LuMail size={18} className="text-indigo-400" />
                                    </motion.div>
                                    <span className="text-[11px] font-bold tracking-wide truncate">{tutor.email}</span>
                                </div>

                                <div className="flex items-center gap-4 text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <motion.div
                                        whileHover={{ rotate: -15 }}
                                        className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center"
                                    >
                                        <LuGraduationCap size={18} className="text-indigo-400" />
                                    </motion.div>
                                    <span className="text-[11px] font-bold tracking-wide uppercase truncate">
                                        {tutor.institution || "Registry Pending"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:shadow-[0_10px_30px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3"
                            >
                                Open Profile <LuArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {latestTutors.length === 0 && (
                    <p className="text-center text-slate-600 font-black uppercase tracking-[0.5em] text-[10px] mt-20">
                        --- Database currently empty ---
                    </p>
                )}
            </div>
        </section>
    );
};

export default LatestTutors;