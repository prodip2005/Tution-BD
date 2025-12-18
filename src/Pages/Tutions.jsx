import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Providers/AuthContext";
import useRole from "../Hooks/useRole";
import useDebounce from "../Hooks/useDebounce";

// Icons
import {
    Search,
    MapPin,
    BookOpen,
    Send,
    Users,
    X,
    Filter,
    CheckCircle,
    ArrowRight,
    Loader2
} from "lucide-react";

// --- এনিমেটেড ব্যাকগ্রাউন্ড কম্পোনেন্ট ---
const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden bg-[#f8fafc] dark:bg-[#050505] pointer-events-none">
            {/* বড় ডাইনামিক অর্বস */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -80, 0],
                    y: [0, 100, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 50, 0],
                    y: [0, -100, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px]"
            />

            {/* ছোট ভাসমান পার্টিকেলস */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-primary/20 dark:bg-white/5 rounded-full blur-sm"
                    style={{
                        width: Math.random() * 40 + 10,
                        height: Math.random() * 40 + 10,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50, 0],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
};

const Tutions = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { role, isLoading: roleLoading } = useRole();

    const [applyTuition, setApplyTuition] = useState(null);
    const [sortBy, setSortBy] = useState("latest");
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 500);

    const { data: allTuitions = [], isLoading: loadingAll } = useQuery({
        queryKey: ["tuitions", sortBy, debouncedSearch],
        enabled: roleLoading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/tuitions?sortBy=${sortBy}&search=${debouncedSearch}`);
            return res.data || [];
        },
    });

    const { data: myApplications = [], refetch: refetchApplications } = useQuery({
        queryKey: ["my-applications", user?.email],
        enabled: role === "tutor" && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications?email=${user.email}`);
            return res.data || [];
        },
    });

    const tuitions = allTuitions.filter(
        t => t.status !== "booked" && t.tuition_status === "approved"
    );

    const isApplied = (tuitionId) => myApplications.some(app => app.tuitionId === tuitionId);

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const applicationData = {
            tuitionId: applyTuition._id,
            tuitionSubject: applyTuition.subject,
            studentName: applyTuition.studentName,
            studentEmail: applyTuition.email,
            tutorName: user.displayName,
            tutorEmail: user.email,
            qualifications: form.qualifications.value,
            experience: form.experience.value,
            expectedSalary: form.expectedSalary.value,
        };

        const res = await axiosSecure.post("/applications", applicationData);
        if (res.data.success) {
            Swal.fire({
                title: "Success!",
                text: "Your application has been submitted.",
                icon: "success",
                background: '#111827',
                color: '#fff',
                confirmButtonColor: "#3b82f6"
            });
            refetchApplications();
            setApplyTuition(null);
        }
    };

    // --- Modern Cyber Loader Section ---
    if (roleLoading || loadingAll) {
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
                        Fetching Tuitions
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* নতুন এনিমেটেড ব্যাকগ্রাউন্ড */}
            <AnimatedBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* --- Header Section --- */}
                <div className="text-center mb-12 relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-3 bg-primary/10 rounded-2xl mb-4 text-primary"
                    >
                        <BookOpen size={32} />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase tracking-tighter"
                    >
                        Live <span className="text-primary italic underline decoration-wavy underline-offset-8">Tuitions</span>
                    </motion.h2>
                    <p className="mt-6 text-gray-500 dark:text-gray-400 font-bold max-w-xl mx-auto italic text-sm md:text-base">
                        "Find the perfect student and start your teaching journey today."
                    </p>
                </div>

                {/* --- Filter & Search Section --- */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 bg-white/40 dark:bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-white/10 shadow-xl">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input
                            type="text"
                            placeholder="Search by subject or location..."
                            className="w-full pl-12 pr-6 py-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white font-bold transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <select
                            className="w-full lg:w-56 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-4 font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="latest">Latest Posts</option>
                            <option value="location">Location (A-Z)</option>
                            <option value="class">Class Level</option>
                            <option value="subject">Subject Name</option>
                        </select>
                    </div>
                </div>

                {/* --- Grid Layout --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-8">
                    {tuitions.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center py-20 bg-white/10 dark:bg-gray-900/10 rounded-[3rem] border-2 border-dashed border-gray-300 dark:border-gray-800">
                            <p className="text-xl font-black text-gray-400">No opportunities found.</p>
                        </div>
                    ) : (
                        tuitions.map((t, i) => (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="relative group bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-xl hover:shadow-primary/20 transition-all flex flex-col overflow-hidden"
                            >
                                <div className="absolute -right-6 -top-6 w-20 h-20 bg-primary/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                                <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
                                    <div className="p-2 md:p-4 bg-primary text-white rounded-xl md:rounded-2xl shadow-lg shadow-primary/30">
                                        <BookOpen size={18} className="md:w-6 md:h-6" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Budget</p>
                                        <p className="text-sm md:text-2xl font-black text-primary italic font-mono">৳{t.budget}</p>
                                    </div>
                                </div>

                                <h3 className="text-sm md:text-2xl font-black text-gray-900 dark:text-white mb-3 md:mb-6 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                    {t.subject}
                                </h3>

                                <div className="space-y-2 md:space-y-4 mb-4 md:mb-8 flex-1 relative z-10">
                                    <div className="flex items-center gap-2 md:gap-4 text-gray-600 dark:text-gray-400 font-bold">
                                        <Users size={14} className="md:w-5 text-primary" />
                                        <span className="text-[10px] md:text-sm">Class: <span className="text-gray-900 dark:text-white">{t.class}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4 text-gray-600 dark:text-gray-400 font-bold">
                                        <MapPin size={14} className="md:w-5 text-primary" />
                                        <span className="truncate text-[10px] md:text-sm">{t.location}</span>
                                    </div>
                                </div>

                                {role === "tutor" && (
                                    <div className="relative z-10">
                                        {isApplied(t._id) ? (
                                            <div className="w-full py-2 md:py-4 bg-green-500/10 text-green-500 font-black rounded-xl md:rounded-2xl border border-green-500/20 flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-sm uppercase tracking-tighter">
                                                <CheckCircle size={14} className="md:w-5" /> Applied
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setApplyTuition(t)}
                                                className="w-full py-2 md:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl md:rounded-2xl shadow-lg hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1 md:gap-3 uppercase text-[8px] md:text-xs tracking-widest"
                                            >
                                                Apply Now <ArrowRight size={14} className="hidden md:inline" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* --- Apply Modal --- */}
                <AnimatePresence>
                    {applyTuition && (
                        <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyTuition(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                                className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20 dark:border-white/10"
                            >
                                <button onClick={() => setApplyTuition(null)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500">
                                    <X size={24} />
                                </button>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase italic">Apply <span className="text-primary">Now</span></h3>
                                <p className="text-gray-500 font-bold mb-8">Subject: <span className="text-primary">{applyTuition.subject}</span></p>
                                <form onSubmit={handleApplySubmit} className="space-y-5">
                                    <input name="qualifications" required className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none text-gray-900 dark:text-white font-bold" placeholder="Qualifications" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="experience" required className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none text-gray-900 dark:text-white font-bold" placeholder="Exp." />
                                        <input name="expectedSalary" required className="w-full px-5 py-4 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-primary rounded-xl outline-none text-gray-900 dark:text-white font-bold" placeholder="Salary" />
                                    </div>
                                    <button className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl mt-4 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                        Confirm <Send size={18} />
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Tutions;