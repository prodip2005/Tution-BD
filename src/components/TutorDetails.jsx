import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAxiosSecure from "../Hooks/useAxiosSecure";

// আধুনিক এবং এনিমেটেড আইকন
import {
    LuMail,
    LuBookOpen,
    LuGraduationCap,
    LuMapPin,
    LuPhone,
    LuCalendar,
    LuInfo,
    LuUserCheck,
    LuArrowLeft
} from "react-icons/lu";
import { useNavigate } from "react-router";

// Force Dark Mode InfoCard
const InfoCard = ({ label, value, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
        className="p-5 rounded-[2rem] bg-base-100 dark:bg-base-200 border border-base-300 dark:border-white/5 shadow-xl flex items-start gap-4 transition-all hover:shadow-2xl hover:border-primary/20"
    >
        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[9px] uppercase font-black text-base-content/60 tracking-[0.2em] mb-1">{label}</p>
            <p className="font-bold text-base-content leading-tight break-words">
                {value || "Not provided"}
            </p>
        </div>
    </motion.div>
);

const TutorDetails = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const decodedEmail = decodeURIComponent(email);

    const { data, isLoading } = useQuery({
        queryKey: ["tutor-details", decodedEmail],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${decodedEmail}`);
            return res.data.user;
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-base-100 dark:bg-gray-950">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-primary/10 border-t-primary rounded-full"
                    />
                    <div className="absolute w-10 h-10 bg-primary rounded-full shadow-[0_0_30px_rgba(var(--p),0.5)]" />
                </div>
                <div className="mt-12">
                    <p className="text-primary text-[10px] font-black tracking-[0.6em] uppercase italic">Loading Profile</p>
                </div>
            </div>
        );
    }

   
    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-950 text-base-content px-4 py-8 md:py-16 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-base-content/60 hover:text-primary font-black uppercase text-[10px] tracking-widest transition-all group"
                >
                    <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Network
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-base-100 dark:bg-base-200/50 backdrop-blur-3xl shadow-2xl rounded-[3rem] border border-base-300 dark:border-white/10 overflow-hidden"
                >
                    {/* Header Decoration Line */}
                    <div className="h-2 w-full bg-linear-to-r from-primary via-secondary to-transparent" />

                    <div className="p-8 md:p-14">
                        {/* Top Section: Avatar & Identity */}
                        <div className="flex flex-col md:flex-row items-center md:items-center gap-10 mb-16">
                            <div className="relative group">
                                <motion.div
                                    animate={{ rotate: [0, 5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                    className="absolute inset-0 bg-primary/20 rounded-[3rem] rotate-6 group-hover:rotate-12 transition-transform"
                                />
                                <img
                                    src={data?.image || data?.photoURL || "https://i.ibb.co/2FsfXqM/avatar.png"}
                                    alt="Tutor"
                                    className="w-44 h-44 md:w-56 md:h-56 rounded-[3rem] object-cover border-4 border-base-100 dark:border-white/5 shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500"
                                />
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                    <h2 className="text-4xl md:text-6xl font-black text-base-content italic tracking-tighter uppercase leading-none">
                                        {data?.name}
                                    </h2>
                                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                        <LuUserCheck size={24} />
                                    </div>
                                </div>

                                <p className="flex items-center justify-center md:justify-start gap-3 text-base-content/70 font-bold mb-6 text-sm md:text-lg italic">
                                    <LuMail size={20} className="text-primary" /> {data?.email}
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="px-6 py-2 bg-primary text-primary-content rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                        {data?.role || "Professional Tutor"}
                                    </span>
                                    <span className="px-6 py-2 bg-base-200/50 text-base-content/60 border border-base-300 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                                        ID: {data?._id?.slice(-6).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left: Bio/Description */}
                            <div className="lg:col-span-5 space-y-8">
                                <div className="relative">
                                    <h3 className="flex items-center gap-3 text-xs font-black text-base-content/50 mb-6 uppercase tracking-[0.4em]">
                                        <LuInfo className="text-primary" /> Description
                                    </h3>
                                    <div className="relative p-8 bg-base-200/30 rounded-[2.5rem] border border-base-300 dark:border-white/5 italic text-base-content/80 leading-relaxed text-sm md:text-base">
                                        <span className="text-4xl text-primary absolute -top-2 left-4 opacity-30 font-serif">"</span>
                                        {data?.bio || "This expert educator is dedicated to empowering students through personalized learning and proven academic strategies."}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Key Information (Credentials) */}
                            <div className="lg:col-span-7">
                                <h3 className="flex items-center gap-3 text-xs font-black text-base-content/50 mb-6 uppercase tracking-[0.4em]">
                                    <LuGraduationCap className="text-primary" /> Key Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoCard icon={LuBookOpen} label="Expertise" value={data?.subjects} delay={0.1} />
                                    <InfoCard icon={LuGraduationCap} label="Institution" value={data?.institution} delay={0.2} />
                                    <InfoCard icon={LuUserCheck} label="Academic Level" value={data?.level} delay={0.3} />
                                    <InfoCard icon={LuMapPin} label="Service Area" value={data?.location} delay={0.4} />
                                    <InfoCard icon={LuPhone} label="Contact Line" value={data?.phone} delay={0.5} />
                                    <InfoCard
                                        icon={LuCalendar}
                                        label="Registered Since"
                                        value={data?.createAt ? new Date(data.createAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Active Member"}
                                        delay={0.6}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-16 pt-16 border-t border-base-300 dark:border-white/5">
                            <h3 className="flex items-center gap-3 text-xs font-black text-base-content/50 mb-8 uppercase tracking-[0.4em]">
                                <LuUserCheck className="text-primary" /> Reviews
                            </h3>
                            <div className="p-8 bg-base-200/30 rounded-[3rem] border border-base-300 dark:border-white/5 text-center">
                                <p className="text-base-content/60 font-medium italic">No reviews yet. Be the first to share your experience!</p>
                            </div>
                        </div>

                    </div>

                    {/* Footer Visual */}
                    <div className="bg-base-200/20 py-6 px-14 border-t border-base-300 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-black text-base-content/50 uppercase tracking-widest italic">Teaching the leaders of tomorrow</p>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 bg-primary/20 rounded-full" />)}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TutorDetails;