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
    LuMessageCircle,
    LuUserCheck,
    LuArrowLeft
} from "react-icons/lu";
import { useNavigate } from "react-router";

const InfoCard = ({ label, value, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
        className="p-5 rounded-[2rem] bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4"
    >
        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{label}</p>
            <p className="font-bold text-gray-800 dark:text-white leading-tight">
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

    // --- Modern Cyber Loader ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Loading Profile
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-16 relative">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors group"
            >
                <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Tutors
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] border border-white dark:border-gray-800 overflow-hidden"
            >
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 via-blue-400/10 to-transparent" />

                <div className="p-8 md:p-12 relative z-10">
                    {/* Top Section: Avatar & Basic Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12">
                        <div className="relative">
                            <motion.div
                                initial={{ rotate: -10, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                className="absolute inset-0 bg-primary/20 rounded-[2.5rem] rotate-6"
                            />
                            <img
                                src={data?.image || data?.photoURL || "https://i.ibb.co/2FsfXqM/avatar.png"}
                                alt="Tutor"
                                className="w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] object-cover border-4 border-white dark:border-gray-800 shadow-2xl relative z-10"
                            />
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                                    {data?.name}
                                </h2>
                                <LuUserCheck className="text-blue-500" size={28} />
                            </div>
                            <p className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 font-bold mb-4">
                                <LuMail size={18} className="text-primary" /> {data?.email}
                            </p>
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/30">
                                {data?.role || "Professional Tutor"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Column: Bio */}
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 dark:text-white mb-4">
                                    <LuInfo className="text-primary" /> About Tutor
                                </h3>
                                <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-[2rem] border border-gray-100 dark:border-gray-700 italic text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {data?.bio || "This tutor hasn't shared a bio yet, but their qualifications speak volumes!"}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Info Grid */}
                        <div className="lg:col-span-2">
                            <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 dark:text-white mb-4">
                                <LuBookOpen className="text-primary" /> Qualifications & Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard icon={LuBookOpen} label="Subjects" value={data?.subjects} delay={0.1} />
                                <InfoCard icon={LuGraduationCap} label="Institution" value={data?.institution} delay={0.2} />
                                <InfoCard icon={LuUserCheck} label="Education Level" value={data?.level} delay={0.3} />
                                <InfoCard icon={LuMapPin} label="Location" value={data?.location} delay={0.4} />
                                <InfoCard icon={LuPhone} label="Phone" value={data?.phone} delay={0.5} />
                                <InfoCard
                                    icon={LuCalendar}
                                    label="Member Since"
                                    value={data?.createAt ? new Date(data.createAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}
                                    delay={0.6}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TutorDetails;