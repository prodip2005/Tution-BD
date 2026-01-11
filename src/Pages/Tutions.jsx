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
        <div className="fixed inset-0 -z-20 overflow-hidden bg-base-100 pointer-events-none">
            {/* ডাইনামিক অর্বস */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], x: [0, -80, 0], y: [0, 100, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-secondary/10 rounded-full blur-[120px]"
            />

            {/* ছোট ভাসমান পার্টিকেলস */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-base-content/5 rounded-full blur-sm"
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // User requested 2 cards per page

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

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedTuitions = tuitions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tuitions.length / itemsPerPage);

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
                background: 'var(--color-base-100, #020617)',
                color: 'var(--color-base-content, #fff)',
                confirmButtonColor: "var(--color-primary, #6366f1)"
            });
            refetchApplications();
            setApplyTuition(null);
        }
    };

    if (roleLoading || loadingAll) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-base-100">
                <div className="relative flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                </div>
                <div className="mt-12"><p className="text-primary text-[10px] font-black tracking-[0.6em] uppercase italic">Accessing Grid</p></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-base-100 text-base-content">
            <AnimatedBackground />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block p-4 bg-indigo-600/10 rounded-3xl mb-6 text-indigo-500">
                        <BookOpen size={40} />
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-black text-base-content uppercase tracking-tighter italic">
                        Live <span className="text-primary underline decoration-primary/30 underline-offset-8">Tuitions</span>
                    </motion.h2>
                    <p className="mt-6 text-slate-400 font-bold max-w-xl mx-auto italic text-sm md:text-base uppercase tracking-widest opacity-60">
                        "Secure Your Next Teaching Mission"
                    </p>
                </div>

                {/* Filter & Search Section */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 bg-base-200/50 dark:bg-white/5 backdrop-blur-3xl p-4 rounded-3xl border border-base-300 dark:border-white/10 shadow-2xl">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input
                            type="text"
                            placeholder="Subject or location..."
                            className="w-full pl-12 pr-6 py-4 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-base-content font-bold transition-all placeholder:text-base-content/30"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <select
                            className="w-full lg:w-56 bg-base-100 dark:bg-white/5 border border-base-300 dark:border-white/5 rounded-2xl px-6 py-4 font-bold text-base-content outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option className="bg-base-200 text-base-content" value="latest">Latest Posts</option>
                            <option className="bg-base-200 text-base-content" value="location">Location (A-Z)</option>
                            <option className="bg-base-200 text-base-content" value="class">Class Level</option>
                            <option className="bg-base-200 text-base-content" value="subject">Subject Name</option>
                        </select>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {displayedTuitions.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center py-20 bg-base-100/50 rounded-[3.5rem] border-2 border-dashed border-base-300 dark:border-white/5">
                            <p className="text-xl font-black text-base-content/60 uppercase tracking-widest">Empty Registry</p>
                        </div>
                    ) : (
                        displayedTuitions.map((t, i) => (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="relative group bg-base-100 dark:bg-base-200/40 backdrop-blur-md border border-base-200 dark:border-white/5 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col h-full overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-primary-content transition-all shadow-sm">
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-base-content/60 uppercase tracking-widest">Budget</p>
                                        <p className="text-lg font-black text-primary italic font-mono">৳{t.budget}</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-base-content mb-3 leading-tight line-clamp-2 min-h-12">
                                    {t.subject}
                                </h3>

                                <div className="space-y-2 mb-6 flex-1 relative z-10">
                                    <div className="flex items-center gap-2 text-base-content/70 font-bold text-xs bg-base-200/50 dark:bg-white/5 p-2 rounded-xl">
                                        <Users size={14} className="text-primary shrink-0" />
                                        <span className="uppercase tracking-tight truncate">Class: <span className="text-base-content">{t.class}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-base-content/70 font-bold text-xs bg-base-200/50 dark:bg-white/5 p-2 rounded-xl">
                                        <MapPin size={14} className="text-primary shrink-0" />
                                        <span className="truncate uppercase tracking-tight">{t.location}</span>
                                    </div>
                                </div>

                                {role === "tutor" && (
                                    <div className="relative z-10 mt-auto pt-4 border-t border-base-200 dark:border-white/5">
                                        {isApplied(t._id) ? (
                                            <div className="w-full py-3 bg-success/10 text-success font-bold rounded-xl border border-success/20 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
                                                <CheckCircle size={14} /> Applied
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setApplyTuition(t)}
                                                className="btn btn-primary w-full rounded-xl uppercase tracking-widest text-[10px] font-black h-auto py-3 min-h-0"
                                            >
                                                Apply <ArrowRight size={14} className="hidden md:inline" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-6 py-2 bg-indigo-600/10 text-indigo-500 rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${currentPage === i + 1
                                        ? "bg-primary text-white shadow-lg scale-110"
                                        : "bg-base-200 text-base-content/50 hover:bg-base-300"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-6 py-2 bg-indigo-600/10 text-indigo-500 rounded-xl font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Apply Modal (ডার্ক মোড ফিক্সড) */}
                <AnimatePresence>
                    {applyTuition && (
                        <div className="fixed inset-0 flex items-center justify-center z-200 px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setApplyTuition(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                                className="relative bg-base-100 p-8 md:p-12 rounded-[3rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-base-300 dark:border-white/10"
                            >
                                <button onClick={() => setApplyTuition(null)} className="absolute top-8 right-8 text-base-content/40 hover:text-primary transition-colors">
                                    <X size={24} />
                                </button>
                                <h3 className="text-3xl font-black text-base-content mb-2 uppercase italic tracking-tighter">Initiate <span className="text-primary">Apply</span></h3>
                                <p className="text-base-content/50 font-bold mb-10 text-xs uppercase tracking-widest">Subject: <span className="text-primary">{applyTuition.subject}</span></p>

                                <form onSubmit={handleApplySubmit} className="space-y-5">
                                    <input name="qualifications" required className="w-full px-6 py-4 bg-base-200 border border-base-300 focus:border-primary rounded-2xl outline-none text-base-content font-bold placeholder:text-base-content/30" placeholder="Your Qualifications" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="experience" required className="w-full px-6 py-4 bg-base-200 border border-base-300 focus:border-primary rounded-2xl outline-none text-base-content font-bold placeholder:text-base-content/30" placeholder="Experience" />
                                        <input name="expectedSalary" required className="w-full px-6 py-4 bg-base-200 border border-base-300 focus:border-primary rounded-2xl outline-none text-base-content font-bold placeholder:text-base-content/30" placeholder="Salary" />
                                    </div>
                                    <button className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-2xl mt-4 uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary/90 transition-all text-xs">
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