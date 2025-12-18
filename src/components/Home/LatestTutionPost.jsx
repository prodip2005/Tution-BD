import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, BookOpen, MapPin, Users, Flame } from "lucide-react";
import { motion } from "framer-motion";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const LatestTutionPost = () => {
    const axiosSecure = useAxiosSecure();

    const { data: tuitions = [], isLoading } = useQuery({
        queryKey: ["latest-tuitions"],
        queryFn: async () => {
            const res = await axiosSecure.get("/tuitions?sortBy=latest");
            return res.data;
        },
    });

    const latestTuitions = tuitions
        .filter(t => t.tuition_status === "approved" && t.status !== "booked")
        .slice(0, 3);

    // আইকন অ্যানিমেশন ভেরিয়েন্ট
    const iconAnimation = {
        rest: { scale: 1, rotate: 0 },
        hover: {
            scale: 1.2,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5, repeat: Infinity }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20 bg-[#020617]">
                <span className="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
        );
    }

    return (
        <section className="relative py-20 px-4 overflow-hidden bg-[#020617]">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] -z-10 rounded-full" />

            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-indigo-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase border border-indigo-500/20 px-4 py-1.5 rounded-full bg-indigo-500/5 backdrop-blur-md"
                    >
                        Real-time Opportunities
                    </motion.span>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-6 flex items-center justify-center gap-3"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], filter: ["drop-shadow(0 0 0px #f43f5e)", "drop-shadow(0 0 10px #f43f5e)", "drop-shadow(0 0 0px #f43f5e)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Flame className="text-rose-500" size={40} />
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                            Latest <span className="text-indigo-500">Tuition</span> Posts
                        </h2>
                    </motion.div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestTuitions.map((t, index) => (
                        <motion.div
                            key={t._id}
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                            className="group relative bg-white/[0.03] backdrop-blur-[30px] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-indigo-500/40"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <motion.div
                                    variants={iconAnimation}
                                    className="p-4 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg"
                                >
                                    <BookOpen size={28} />
                                </motion.div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Budget</p>
                                    <motion.p
                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="text-2xl font-black text-indigo-400"
                                    >
                                        ৳{t.budget}
                                    </motion.p>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 line-clamp-2 leading-tight italic group-hover:text-indigo-400 transition-colors">
                                {t.subject}
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <motion.div variants={iconAnimation} className="p-2 bg-white/5 rounded-lg border border-white/5">
                                        <Users size={18} className="text-indigo-400" />
                                    </motion.div>
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        Class: <span className="text-white ml-1">{t.class}</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <motion.div variants={iconAnimation} className="p-2 bg-white/5 rounded-lg border border-white/5">
                                        <MapPin size={18} className="text-indigo-400" />
                                    </motion.div>
                                    <span className="text-xs font-bold uppercase tracking-widest truncate">{t.location}</span>
                                </div>
                            </div>

                           
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestTutionPost;