import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
// Lottie import removed as we are using custom loader

import {
    FaUserShield,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaTrash,
    FaEye,
    FaUsersCog,
    FaIdBadge,
    FaUniversity,
    FaPhoneAlt
} from "react-icons/fa";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [activeRole, setActiveRole] = useState("student");
    const [selectedUser, setSelectedUser] = useState(null);

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ["all-users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data.users || [];
        },
    });

    // --- Modern Cyber Loader ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    {/* Outer Orbit */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                    />
                    {/* Middle Dash Orbit */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full"
                    />
                    {/* Pulsing Core */}
                    <motion.div
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.7, 1, 0.7],
                            boxShadow: [
                                "0 0 15px rgba(99, 102, 241, 0.4)",
                                "0 0 35px rgba(99, 102, 241, 0.6)",
                                "0 0 15px rgba(99, 102, 241, 0.4)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-xs font-black tracking-[0.6em] uppercase italic"
                    >
                        Accessing Database
                    </motion.p>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter((user) => user.role === activeRole);

    const handleRoleChange = async (email, role) => {
        const confirm = await Swal.fire({
            title: "Confirm Role Change?",
            text: `Updating user access to ${role}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            background: '#020617',
            color: '#fff',
            confirmButtonColor: "#6366f1"
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/users/role/${email}`, { role });
            if (!res.data.success) {
                Swal.fire({
                    title: "Blocked ❌",
                    text: res.data.message || "Action not allowed",
                    icon: "error",
                    background: '#020617',
                    color: '#fff'
                });
                return;
            }
            Swal.fire({ title: "Updated!", icon: "success", background: '#020617', color: '#fff' });
            refetch();
        } catch (err) {
            Swal.fire({ title: "Error", text: "Update failed", icon: "error", background: '#020617', color: '#fff' });
        }
    };

    const handleDelete = async (email) => {
        const confirm = await Swal.fire({
            title: "Permanent Removal?",
            text: "This user record will be wiped from existence!",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Erase User",
            background: '#020617',
            color: '#fff',
            confirmButtonColor: "#ef4444"
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.delete(`/users/${email}`);
            if (!res.data.success) {
                Swal.fire({ title: "Blocked ❌", text: res.data.message, icon: "error", background: '#020617', color: '#fff' });
                return;
            }
            Swal.fire({ title: "Deleted!", icon: "success", background: '#020617', color: '#fff' });
            refetch();
        } catch (err) {
            Swal.fire({ title: "Error", text: "Delete failed", icon: "error", background: '#020617', color: '#fff' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-10 bg-transparent"
        >
            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl text-indigo-500 shadow-2xl">
                        <FaUsersCog size={35} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-tight">
                            Control <span className="text-indigo-500">Center</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Total Registry: {users.length}</p>
                    </div>
                </div>

                {/* ROLE FILTER SWITCHER */}
                <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md gap-2">
                    {[
                        { id: "admin", icon: <FaUserShield />, label: "Admins" },
                        { id: "tutor", icon: <FaChalkboardTeacher />, label: "Tutors" },
                        { id: "student", icon: <FaUserGraduate />, label: "Students" }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => setActiveRole(btn.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black uppercase text-[9px] tracking-[0.15em] transition-all duration-300 ${activeRole === btn.id
                                ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            {btn.icon} {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN TABLE AREA */}
            <div className="overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <table className="table w-full border-separate border-spacing-y-3 px-6 pb-4">
                    <thead>
                        <tr className="text-slate-600 border-none uppercase text-[10px] tracking-[0.3em]">
                            <th className="bg-transparent pl-8">#</th>
                            <th className="bg-transparent">Identity</th>
                            <th className="bg-transparent">Contact Details</th>
                            <th className="bg-transparent">Access Level</th>
                            <th className="bg-transparent text-right pr-8">Operations</th>
                        </tr>
                    </thead>

                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {filteredUsers.map((user, i) => (
                                <motion.tr
                                    key={user._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white/[0.03] hover:bg-white/[0.07] transition-all group"
                                >
                                    <td className="rounded-l-2xl pl-8 font-mono text-slate-600 italic">{i + 1}</td>

                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="relative size-12">
                                                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
                                                <img src={user.image || "https://i.ibb.co/2FsfXqM/avatar.png"} alt="user" className="relative w-full h-full object-cover rounded-2xl border border-white/10 group-hover:border-indigo-500 transition-colors" />
                                            </div>
                                            <span className="font-black text-white tracking-wide uppercase italic text-sm group-hover:text-indigo-400 transition-colors">{user.name || "UNNAMED"}</span>
                                        </div>
                                    </td>

                                    <td className="text-slate-400 font-medium lowercase text-[11px] tracking-wider">{user.email}</td>

                                    <td>
                                        <span className={`px-4 py-1.5 rounded-lg font-black uppercase text-[9px] tracking-widest border border-white/5 ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            user.role === 'tutor' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="rounded-r-2xl pr-8">
                                        <div className="flex gap-2 justify-end items-center">
                                            <button onClick={() => setSelectedUser(user)} className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl" title="View Profile">
                                                <FaEye />
                                            </button>

                                            <div className="h-6 w-[1px] bg-white/5 mx-1" />

                                            {/* ROLE ACTION BUTTONS */}
                                            {user.role !== "admin" && (
                                                <button onClick={() => handleRoleChange(user.email, "admin")} className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all">
                                                    + Admin
                                                </button>
                                            )}
                                            {user.role !== "tutor" && (
                                                <button onClick={() => handleRoleChange(user.email, "tutor")} className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-green-500 hover:text-white transition-all">
                                                    + Tutor
                                                </button>
                                            )}
                                            {user.role !== "student" && (
                                                <button onClick={() => handleRoleChange(user.email, "student")} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all">
                                                    + Student
                                                </button>
                                            )}

                                            <button onClick={() => handleDelete(user.email)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl" title="Delete User">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="inline-block p-6 bg-white/5 rounded-full border border-white/5 mb-6 text-slate-700">
                            <FaUsersCog size={40} />
                        </div>
                        <p className="text-slate-600 font-black uppercase tracking-[0.5em] italic text-[10px]">
                            Empty Sector: No {activeRole} units found.
                        </p>
                    </div>
                )}
            </div>

            {/* USER PROFILE MODAL */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#020617] border border-white/10 p-10 rounded-[3.5rem] w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-white rotate-12"><FaIdBadge size={180} /></div>

                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-8 relative z-10">User <span className="text-indigo-500">File</span></h3>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-center mb-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                                        <img src={selectedUser.image || "https://i.ibb.co/2FsfXqM/avatar.png"} alt="" className="relative size-28 rounded-[2rem] border-2 border-white/10 shadow-2xl object-cover" />
                                    </div>
                                </div>

                                <DetailItem icon={<FaIdBadge />} label="Full Identity" value={selectedUser.name} />
                                <DetailItem icon={<FaUniversity />} label="Academic Institution" value={selectedUser.institution} />
                                <DetailItem icon={<FaPhoneAlt />} label="Secure Contact" value={selectedUser.phone} />
                                <DetailItem icon={<FaUserShield />} label="Clearance Level" value={selectedUser.role} />
                            </div>

                            <button onClick={() => setSelectedUser(null)} className="mt-10 w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] uppercase tracking-[0.2em] text-[10px]">Terminate View</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Helper Component for Modal
const DetailItem = ({ icon, label, value }) => (
    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
        <div className="text-indigo-500 bg-indigo-500/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-0.5">{label}</p>
            <p className="text-white font-bold text-sm tracking-wide">{value || "ACCESS DENIED / NULL"}</p>
        </div>
    </div>
);

export default AllUsers;