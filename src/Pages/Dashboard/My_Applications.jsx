import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { AuthContext } from "../../Providers/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaInbox, FaUserGraduate, FaEnvelope, FaBook, FaMoneyBillWave, FaEdit, FaTrashAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const My_Applications = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const [editApp, setEditApp] = useState(null);

    const { data = [], refetch, isLoading } = useQuery({
        queryKey: ["my-applications", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications?email=${user.email}`);
            return res.data;
        },
    });

    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;

        const res = await axiosSecure.put(`/applications/${editApp._id}`, {
            tutorEmail: user.email,
            qualifications: form.qualifications.value,
            experience: form.experience.value,
            expectedSalary: form.salary.value,
        });

        if (res.data.success) {
            Swal.fire({ title: "Updated!", icon: "success", background: 'var(--color-base-100, #111827)', color: 'var(--color-base-content, #fff)' });
            setEditApp(null);
            refetch();
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This application will be removed!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            background: 'var(--color-base-100, #111827)',
            color: 'var(--color-base-content, #fff)',
            confirmButtonColor: "var(--color-error, #ef4444)"
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(`/applications/${id}?email=${user.email}`);
        if (res.data.success) {
            Swal.fire({ title: "Deleted!", icon: "success", background: 'var(--color-base-100, #111827)', color: 'var(--color-base-content, #fff)' });
            refetch();
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-primary/10 border-t-primary rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-primary/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(var(--color-primary),0.5)]"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-primary text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Syncing Applications
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 py-6 md:py-10"
        >
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="p-3 md:p-4 bg-primary/20 rounded-2xl md:rounded-3xl text-primary">
                    <FaInbox className="text-2xl md:text-4xl" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-5xl font-black text-base-content uppercase tracking-tighter italic leading-none">
                        My <span className="text-primary">Applications</span>
                    </h2>
                    <p className="text-base-content/40 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 md:mt-2">
                        Manage your tuition requests
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto bg-base-100 dark:bg-white/2 backdrop-blur-3xl border border-base-300 dark:border-white/5 rounded-4xl shadow-2xl">
                    <table className="table w-full border-separate border-spacing-y-3 px-6 pb-4">
                        <thead>
                            <tr className="text-base-content/40 border-none uppercase text-[10px] tracking-[0.25em]">
                                <th className="bg-transparent pl-8">Student</th>
                                <th className="bg-transparent text-center">Subject</th>
                                <th className="bg-transparent text-center">Expected Salary</th>
                                <th className="bg-transparent text-center">Status</th>
                                <th className="bg-transparent text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {data.map((app, index) => (
                                    <motion.tr
                                        key={app._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-base-200/50 dark:bg-white/3 hover:bg-base-200 dark:hover:bg-white/8 transition-all group"
                                    >
                                        <td className="rounded-l-2xl pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                                                    <FaUserGraduate size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base-content italic">{app.studentName || "N/A"}</p>
                                                    <p className="text-[10px] text-base-content/40 flex items-center gap-1">
                                                        <FaEnvelope size={8} /> {app.studentEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center font-bold text-base-content/60">
                                            <span className="flex items-center justify-center gap-2">
                                                <FaBook className="text-primary/40" /> {app.tuitionSubject}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-lg font-black text-base-content">৳ {app.expectedSalary}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge border-none font-bold uppercase text-[10px] py-3 px-4 rounded-lg shadow-lg flex gap-2 mx-auto w-fit ${app.status === "pending" ? "bg-warning/20 text-warning" :
                                                app.status === "rejected" ? "bg-error/20 text-error" :
                                                    "bg-success/20 text-success"
                                                }`}>
                                                {app.status === "pending" && <FaHourglassHalf className="animate-spin" />}
                                                {app.status === "rejected" && <FaTimesCircle />}
                                                {app.status === "approved" && <FaCheckCircle />}
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="rounded-r-2xl text-right pr-8">
                                            <div className="flex justify-end gap-3">
                                                {app.status === "pending" && (
                                                    <button
                                                        onClick={() => setEditApp(app)}
                                                        className="p-3 bg-warning/20 text-warning rounded-xl hover:bg-warning hover:text-warning-content transition-all shadow-lg shadow-warning/10"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(app._id)}
                                                    className="p-3 bg-error/20 text-error rounded-xl hover:bg-error hover:text-white transition-all shadow-lg shadow-error/10"
                                                >
                                                    <FaTrashAlt size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Card Layout */}
                <div className="md:hidden flex flex-col gap-4">
                    <AnimatePresence>
                        {data.map((app, index) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/3 border border-white/5 rounded-3xl p-5 shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <FaUserGraduate size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-base-content text-sm italic">{app.studentName || "N/A"}</p>
                                            <p className="text-[9px] text-base-content/40 uppercase tracking-widest">{app.studentEmail}</p>
                                        </div>
                                    </div>
                                    <span className={`badge border-none font-black uppercase text-[8px] py-1.5 px-3 rounded-md ${app.status === "pending" ? "bg-warning/20 text-warning" :
                                        app.status === "rejected" ? "bg-error/20 text-error" :
                                            "bg-success/20 text-success"
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-base-content/5">
                                    <div>
                                        <p className="text-[8px] text-base-content/30 uppercase font-black tracking-widest mb-1">Subject</p>
                                        <p className="text-xs font-bold text-base-content/70 flex items-center gap-2">
                                            <FaBook size={10} className="text-primary/40" /> {app.tuitionSubject}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-base-content/30 uppercase font-black tracking-widest mb-1">Expected Salary</p>
                                        <p className="text-lg font-black text-base-content leading-none">৳ {app.expectedSalary}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    {app.status === "pending" && (
                                        <button
                                            onClick={() => setEditApp(app)}
                                            className="flex-1 py-3 bg-warning/10 text-warning rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-warning hover:text-warning-content transition-all flex items-center justify-center gap-2 border border-warning/10"
                                        >
                                            <FaEdit size={12} /> Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="flex-1 py-3 bg-error/10 text-error rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2 border border-error/10"
                                    >
                                        <FaTrashAlt size={12} /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {data.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <FaInbox size={60} className="text-base-content/5" />
                        <p className="text-base-content/40 font-bold uppercase tracking-[0.3em] italic">No applications found</p>
                    </div>
                )}
            </div>

            {/* Modal remains the same but with mobile-friendly padding */}
            <AnimatePresence>
                {editApp && (
                    <div className="fixed inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-base-100 border border-base-300 dark:border-white/10 rounded-4xl md:rounded-[3rem] w-full max-w-md shadow-2xl"
                        >
                            <h3 className="text-xl md:text-2xl font-black text-base-content uppercase tracking-tighter italic mb-6 md:mb-8">
                                Edit <span className="text-primary">Application</span>
                            </h3>

                            <form onSubmit={handleUpdate} className="space-y-4 md:space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] uppercase font-black text-base-content/40 ml-1 tracking-widest">Qualifications</label>
                                    <input name="qualifications" defaultValue={editApp.qualifications} className="w-full px-4 md:px-5 py-3 md:py-4 bg-base-200 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-2xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30" placeholder="e.g. BSc in Math" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] uppercase font-black text-base-content/40 ml-1 tracking-widest">Experience</label>
                                    <input name="experience" defaultValue={editApp.experience} className="w-full px-4 md:px-5 py-3 md:py-4 bg-base-200 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-2xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30" placeholder="e.g. 2 Years" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] uppercase font-black text-base-content/40 ml-1 tracking-widest">Expected Salary (৳)</label>
                                    <input name="salary" defaultValue={editApp.expectedSalary} className="w-full px-4 md:px-5 py-3 md:py-4 bg-base-200 border border-base-300 dark:border-white/10 focus:border-primary rounded-xl md:rounded-2xl outline-none text-base-content text-sm md:text-base font-bold transition-all placeholder:text-base-content/30" />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 md:pt-6">
                                    <button type="button" onClick={() => setEditApp(null)} className="px-5 py-2.5 rounded-xl font-bold text-base-content/40 hover:bg-base-200 transition-all text-xs md:text-sm">Cancel</button>
                                    <button className="px-6 py-2.5 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all uppercase text-[10px] md:text-xs tracking-widest">Update Now</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default My_Applications;