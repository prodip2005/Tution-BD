import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
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
    CheckCircle,
    ArrowRight
} from "lucide-react";

// --- এনিমেটেড ব্যাকগ্রাউন্ড কম্পোনেন্ট (ডার্ক থিম ফিক্সড) ---
const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden bg-[#050505] pointer-events-none">
            {/* ডাইনামিক অর্বস */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], x: [0, -80, 0], y: [0, 100, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"
            />

            {/* ছোট ভাসমান পার্টিকেলস */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/5 rounded-full blur-sm"
                    style={{
                        width: Math.random() * 40 + 10,
                        height: Math.random() * 40 + 10,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{ y: [0, -100, 0], x: [0, Math.random() * 50, 0], opacity: [0, 0.4, 0] }}
                    transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5 }}
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
        enabled: true, // roleLoading এর জন্য অপেক্ষা না করে সরাসরি কল করবে
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
                background: '#020617',
                color: '#fff',
                confirmButtonColor: "#6366f1"
            });
            refetchApplications();
            setApplyTuition(null);
        }
    };

    if (roleLoading || loadingAll) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-[#050505]">
                <div className="relative flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                </div>
                <div className="mt-12"><p className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase italic">Accessing Grid</p></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#050505] text-white">
            <AnimatedBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block p-4 bg-indigo-600/10 rounded-3xl mb-6 text-indigo-500">
                        <BookOpen size={40} />
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
                        Live <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8">Tuitions</span>
                    </motion.h2>
                    <p className="mt-6 text-slate-400 font-bold max-w-xl mx-auto italic text-sm md:text-base uppercase tracking-widest opacity-60">
                        "Secure Your Next Teaching Mission"
                    </p>
                </div>

                {/* Filter & Search Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 bg-white/5 backdrop-blur-3xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                        <input
                            type="text"
                            placeholder="Subject or location..."
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-white font-bold transition-all placeholder:text-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <select
                            className="w-full lg:w-56 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option className="bg-[#0f172a]" value="latest">Latest Posts</option>
                            <option className="bg-[#0f172a]" value="location">Location (A-Z)</option>
                            <option className="bg-[#0f172a]" value="class">Class Level</option>
                            <option className="bg-[#0f172a]" value="subject">Subject Name</option>
                        </select>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                    {tuitions.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center py-20 bg-white/[0.02] rounded-[3.5rem] border-2 border-dashed border-white/5">
                            <p className="text-xl font-black text-slate-700 uppercase tracking-widest">Empty Registry</p>
                        </div>
                    ) : (
                        tuitions.map((t, i) => (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="relative group bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl hover:bg-white/[0.06] transition-all flex flex-col overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4 md:mb-8 relative z-10">
                                    <div className="p-2 md:p-4 bg-indigo-600/10 text-indigo-500 rounded-xl md:rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <BookOpen size={18} className="md:w-6 md:h-6" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Budget</p>
                                        <p className="text-sm md:text-2xl font-black text-indigo-500 italic font-mono group-hover:text-white transition-colors">৳{t.budget}</p>
                                    </div>
                                </div>

                                <h3 className="text-sm md:text-2xl font-black text-white mb-3 md:mb-6 leading-tight uppercase italic line-clamp-2">
                                    {t.subject}
                                </h3>

                                <div className="space-y-2 md:space-y-4 mb-5 md:mb-10 flex-1 relative z-10">
                                    <div className="flex items-center gap-2 md:gap-4 text-slate-400 font-bold">
                                        <Users size={14} className="md:w-5 text-indigo-500" />
                                        <span className="text-[9px] md:text-sm uppercase tracking-tighter">Class: <span className="text-white">{t.class}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-4 text-slate-400 font-bold">
                                        <MapPin size={14} className="md:w-5 text-indigo-500" />
                                        <span className="truncate text-[9px] md:text-sm uppercase tracking-tighter">{t.location}</span>
                                    </div>
                                </div>

                                {role === "tutor" && (
                                    <div className="relative z-10">
                                        {isApplied(t._id) ? (
                                            <div className="w-full py-2.5 md:py-4 bg-green-500/10 text-green-500 font-black rounded-xl md:rounded-2xl border border-green-500/20 flex items-center justify-center gap-2 text-[9px] md:text-xs uppercase tracking-widest">
                                                <CheckCircle size={14} className="md:w-5" /> Applied
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setApplyTuition(t)}
                                                className="w-full py-2.5 md:py-4 bg-indigo-600 text-white font-black rounded-xl md:rounded-2xl shadow-xl hover:bg-indigo-500 transition-all active:scale-95 flex items-center justify-center gap-1 md:gap-3 uppercase text-[8px] md:text-xs tracking-widest"
                                            >
                                                Apply Mission <ArrowRight size={14} className="hidden md:inline" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Apply Modal (ডার্ক মোড ফিক্সড) */}
                <AnimatePresence>
                    {applyTuition && (
                        <div className="fixed inset-0 flex items-center justify-center z-[200] px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyTuition(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                                className="relative bg-[#020617] p-8 md:p-12 rounded-[3rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                            >
                                <button onClick={() => setApplyTuition(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                                <h3 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Initiate <span className="text-indigo-500">Apply</span></h3>
                                <p className="text-slate-500 font-bold mb-10 text-xs uppercase tracking-widest">Subject: <span className="text-indigo-500">{applyTuition.subject}</span></p>

                                <form onSubmit={handleApplySubmit} className="space-y-5">
                                    <input name="qualifications" required className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:border-indigo-500 rounded-2xl outline-none text-white font-bold placeholder:text-slate-700" placeholder="Your Qualifications" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="experience" required className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:border-indigo-500 rounded-2xl outline-none text-white font-bold placeholder:text-slate-700" placeholder="Experience" />
                                        <input name="expectedSalary" required className="w-full px-6 py-4 bg-white/5 border border-white/5 focus:border-indigo-500 rounded-2xl outline-none text-white font-bold placeholder:text-slate-700" placeholder="Salary" />
                                    </div>
                                    <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-2xl mt-4 uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all text-xs">
                                        Confirm Application <Send size={16} />
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