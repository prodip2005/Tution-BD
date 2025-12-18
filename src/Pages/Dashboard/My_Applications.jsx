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
            Swal.fire({ title: "Updated!", icon: "success", background: '#111827', color: '#fff' });
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
            background: '#111827',
            color: '#fff',
            confirmButtonColor: "#ef4444"
        });

        if (!confirm.isConfirmed) return;

        const res = await axiosSecure.delete(`/applications/${id}?email=${user.email}`);
        if (res.data.success) {
            Swal.fire({ title: "Deleted!", icon: "success", background: '#111827', color: '#fff' });
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
                    <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                        My <span className="text-primary">Applications</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 md:mt-2">
                        Manage your tuition requests
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl">
                    <table className="table w-full border-separate border-spacing-y-3 px-6 pb-4">
                        <thead>
                            <tr className="text-gray-500 border-none uppercase text-[10px] tracking-[0.25em]">
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
                                        className="bg-white/[0.03] hover:bg-white/[0.08] transition-all group"
                                    >
                                        <td className="rounded-l-2xl pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                                                    <FaUserGraduate size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white italic">{app.studentName || "N/A"}</p>
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                        <FaEnvelope size={8} /> {app.studentEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center font-bold text-gray-300">
                                            <span className="flex items-center justify-center gap-2">
                                                <FaBook className="text-primary/40" /> {app.tuitionSubject}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="text-lg font-black text-white">৳ {app.expectedSalary}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge border-none font-bold uppercase text-[10px] py-3 px-4 rounded-lg shadow-lg flex gap-2 mx-auto w-fit ${app.status === "pending" ? "bg-orange-500/20 text-orange-400" :
                                                app.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                                    "bg-green-500/20 text-green-400"
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
                                                        className="p-3 bg-yellow-500/20 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-black transition-all"
                                                    >
                                                        <FaEdit size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(app._id)}
                                                    className="p-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
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
                                className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <FaUserGraduate size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm italic">{app.studentName || "N/A"}</p>
                                            <p className="text-[9px] text-gray-500 uppercase tracking-widest">{app.studentEmail}</p>
                                        </div>
                                    </div>
                                    <span className={`badge border-none font-black uppercase text-[8px] py-1.5 px-3 rounded-md ${app.status === "pending" ? "bg-orange-500/20 text-orange-400" :
                                        app.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                            "bg-green-500/20 text-green-400"
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                                    <div>
                                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Subject</p>
                                        <p className="text-xs font-bold text-gray-300 flex items-center gap-2">
                                            <FaBook size={10} className="text-primary/40" /> {app.tuitionSubject}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Expected Salary</p>
                                        <p className="text-lg font-black text-white leading-none">৳ {app.expectedSalary}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    {app.status === "pending" && (
                                        <button
                                            onClick={() => setEditApp(app)}
                                            className="flex-1 py-3 bg-yellow-500/10 text-yellow-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaEdit size={12} /> Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(app._id)}
                                        className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
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
                        <FaInbox size={60} className="text-white/5" />
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] italic">No applications found</p>
                    </div>
                )}
            </div>

            {/* Modal remains the same but with mobile-friendly padding */}
            <AnimatePresence>
                {editApp && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0f1115] border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] w-full max-w-md shadow-2xl"
                        >
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic mb-6 md:mb-8">
                                Edit <span className="text-primary">Application</span>
                            </h3>

                            <form onSubmit={handleUpdate} className="space-y-4 md:space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Qualifications</label>
                                    <input name="qualifications" defaultValue={editApp.qualifications} className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 focus:border-primary rounded-xl md:rounded-2xl outline-none text-white text-sm md:text-base font-bold transition-all" placeholder="e.g. BSc in Math" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Experience</label>
                                    <input name="experience" defaultValue={editApp.experience} className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 focus:border-primary rounded-xl md:rounded-2xl outline-none text-white text-sm md:text-base font-bold transition-all" placeholder="e.g. 2 Years" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] md:text-[10px] uppercase font-black text-gray-500 ml-1 tracking-widest">Expected Salary (৳)</label>
                                    <input name="salary" defaultValue={editApp.expectedSalary} className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 focus:border-primary rounded-xl md:rounded-2xl outline-none text-white text-sm md:text-base font-bold transition-all" />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 md:pt-6">
                                    <button type="button" onClick={() => setEditApp(null)} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all text-xs md:text-sm">Cancel</button>
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