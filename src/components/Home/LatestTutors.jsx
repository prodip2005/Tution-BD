import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LuMail, LuGraduationCap, LuShieldCheck, LuStar } from "react-icons/lu";
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

    // ৪টি টিউটর নেওয়া হয়েছে যাতে গ্রিড ব্যালেন্স থাকে
    const latestTutors = [...tutors]
        .sort((a, b) => new Date(b.createdAt || b.createAt) - new Date(a.createdAt || a.createAt))
        .slice(0, 4);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20 bg-base-100 dark:bg-[#020617]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section className="relative py-12 md:py-24 px-2 md:px-4 overflow-hidden bg-base-100 dark:bg-[#020617]">
            {/* --- Background Ambient Glow --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 blur-[120px] -z-10 rounded-full" />

            <div className="max-w-7xl mx-auto">
                {/* --- Section Header --- */}
                <div className="text-center mb-10 md:mb-20 flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-primary text-[8px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.4em] uppercase border border-primary/20 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/5 backdrop-blur-md mb-4 md:mb-8"
                    >
                        Verified Instructors
                    </motion.span>

                    {/* Animated Heading Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        className="relative mb-4 md:mb-6"
                    >
                        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse" />
                        <motion.div
                            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative bg-base-200 dark:bg-white/5 p-3 md:p-5 rounded-2xl md:rounded-4xl border border-base-300 dark:border-white/10 backdrop-blur-xl shadow-2xl"
                        >
                            <LuStar className="text-primary" size={24} md:size={42} fill="currentColor" fillOpacity={0.2} />
                        </motion.div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-6xl font-black text-base-content leading-none italic uppercase tracking-tighter"
                    >
                        Latest <span className="text-primary">Tutors</span>
                    </motion.h2>
                </div>

                {/* --- Tutors Grid: grid-cols-2 for phone --- */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {latestTutors.map((tutor, index) => (
                        <motion.div
                            key={tutor._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative bg-base-200 dark:bg-white/5 backdrop-blur-[30px] border border-base-300 dark:border-white/10 rounded-3xl md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl transition-all hover:border-primary/40 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-5 mb-4 md:mb-8">
                                <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-xl" />
                                    <img
                                        src={tutor.image || "https://i.ibb.co/2FsfXqM/avatar.png"}
                                        alt="tutor"
                                        className="relative w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover border-2 border-base-content/10 group-hover:border-primary transition-all duration-500"
                                    />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <h3 className="font-black text-xs md:text-xl text-base-content italic tracking-tight uppercase group-hover:text-primary transition-colors truncate">
                                        {tutor.name?.split(' ')[0] || "Unnamed"}
                                    </h3>
                                    <div className="flex items-center justify-center md:justify-start gap-1 mt-1">
                                        <LuShieldCheck className="text-primary" size={10} />
                                        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-wider text-primary/80">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-2 md:space-y-4">
                                <div className="flex items-center gap-2 md:gap-4 text-base-content/60">
                                    <LuMail size={12} className="text-primary shrink-0" />
                                    <span className="text-[8px] md:text-[11px] font-bold truncate">{tutor.email}</span>
                                </div>

                                <div className="flex items-center gap-2 md:gap-4 text-base-content/60">
                                    <LuGraduationCap size={12} className="text-primary shrink-0" />
                                    <span className="text-[8px] md:text-[11px] font-bold uppercase truncate">
                                        {tutor.institution || "Registry Pending"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {latestTutors.length === 0 && (
                    <p className="text-center text-base-content/40 font-black uppercase tracking-[0.5em] text-[10px] mt-20">
                        --- Database Empty ---
                    </p>
                )}
            </div>
        </section>
    );
};

export default LatestTutors;