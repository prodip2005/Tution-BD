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
        .slice(0, 8); // ৮টি আইটেম নেওয়া হয়েছে যাতে ৪-কলাম গ্রিডে ব্যালেন্স থাকে

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
            <div className="flex justify-center py-20 bg-base-100 dark:bg-[#020617]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <section className="relative py-12 md:py-20 px-2 md:px-4 overflow-hidden bg-base-100 dark:bg-[#020617]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[150px] -z-10 rounded-full" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-primary text-[9px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.4em] uppercase border border-primary/20 px-3 py-1.5 rounded-full bg-primary/5 backdrop-blur-md"
                    >
                        Real-time Opportunities
                    </motion.span>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-4 md:mt-6 flex items-center justify-center gap-2 md:gap-3"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], filter: ["drop-shadow(0 0 0px #f43f5e)", "drop-shadow(0 0 10px #f43f5e)", "drop-shadow(0 0 0px #f43f5e)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Flame className="text-accent w-6 h-6 md:w-10 md:h-10" />
                        </motion.div>
                        <h2 className="text-2xl md:text-5xl font-black text-base-content italic uppercase tracking-tighter">
                            Latest <span className="text-primary">Tuition</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Grid Layout: grid-cols-2 for mobile, grid-cols-4 for large screen */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {latestTuitions.map((t) => (
                        <motion.div
                            key={t._id}
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                            className="group relative bg-base-200 dark:bg-white/5 backdrop-blur-[30px] border border-base-300 dark:border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl transition-all hover:border-primary/40"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3">
                                <motion.div
                                    variants={iconAnimation}
                                    className="p-2 md:p-4 bg-primary/20 text-primary rounded-xl md:rounded-2xl border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all"
                                >
                                    <BookOpen size={20} className="md:w-7 md:h-7" />
                                </motion.div>
                                <div className="text-left md:text-right">
                                    <p className="text-[8px] md:text-[10px] text-base-content/50 font-black tracking-widest uppercase">Budget</p>
                                    <motion.p
                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="text-lg md:text-2xl font-black text-primary"
                                    >
                                        ৳{t.budget}
                                    </motion.p>
                                </div>
                            </div>

                            <h3 className="text-xs md:text-xl font-black text-base-content uppercase tracking-tight mb-4 line-clamp-2 leading-tight italic group-hover:text-primary transition-colors h-8 md:h-auto">
                                {t.subject}
                            </h3>

                            <div className="space-y-2 md:space-y-4 mb-2 md:mb-8">
                                <div className="flex items-center gap-2 md:gap-3 text-base-content/60">
                                    <Users size={14} className="text-primary shrink-0" />
                                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest">
                                        <span className="hidden md:inline">Class:</span> {t.class}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 md:gap-3 text-base-content/60">
                                    <MapPin size={14} className="text-primary shrink-0" />
                                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider truncate max-w-full">
                                        {t.location}
                                    </span>
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