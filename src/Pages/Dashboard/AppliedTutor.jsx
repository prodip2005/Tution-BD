import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";
import { FaUserCheck, FaUserTimes, FaUniversity, FaMapMarkerAlt, FaBook, FaUserShield, FaEnvelope } from 'react-icons/fa';

const emptyAnim = "https://lottie.host/81e59267-3a13-431d-8547-49d3298c4d62/X6YxX8rS2S.json";

const AppliedTutor = () => {
    const axiosSecure = useAxiosSecure();
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTutors = async () => {
        try {
            const res = await axiosSecure.get('/tutors?status=pending');
            setTutors(res.data.tutors || []);
        } catch (err) {
            // error handling
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutors();
    }, []);

    const handleAction = async (id, status) => {
        const confirm = await Swal.fire({
            title: status === 'approved' ? 'Approve Tutor?' : 'Reject Tutor?',
            text: `This tutor will be marked as ${status}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Proceed',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: status === 'approved' ? '#22c55e' : '#ef4444'
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await axiosSecure.patch(`/tutors/admin-approval/${id}`, { status });
            if (res.data.success) {
                Swal.fire({ title: 'Action Successful', icon: 'success', background: '#0f172a', color: '#fff' });
                fetchTutors();
            }
        } catch (err) {
            Swal.fire({ title: 'Error', icon: 'error', background: '#0f172a', color: '#fff' });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-10 h-10 bg-indigo-500 rounded-full" />
                </div>
                <div className="mt-12 text-center">
                    <p className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase italic">Syncing Applications</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-[100px] md:blur-[120px] pointer-events-none"></div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-6 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] text-primary shadow-2xl">
                            <FaUserShield className="text-2xl md:text-4xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                                Tutor <span className="text-primary">Requests</span>
                            </h2>
                            <p className="text-gray-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2">
                                Pending Approval: {tutors.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl">
                    <table className="table w-full border-separate border-spacing-y-3 px-6 pb-6">
                        <thead>
                            <tr className="text-gray-600 uppercase text-[10px] tracking-[0.3em]">
                                <th className="bg-transparent pl-8">#</th>
                                <th className="bg-transparent">Tutor Profile</th>
                                <th className="bg-transparent">Academic Info</th>
                                <th className="bg-transparent text-center">Location</th>
                                <th className="bg-transparent text-center">Status</th>
                                <th className="bg-transparent text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {tutors.map((tutor, index) => (
                                    <motion.tr key={tutor._id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
                                        <td className="rounded-l-2xl pl-8 font-mono text-gray-600 italic">{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20">{tutor.name.charAt(0)}</div>
                                                <div>
                                                    <p className="font-bold text-white italic">{tutor.name}</p>
                                                    <p className="text-[10px] text-gray-500 lowercase">{tutor.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-gray-300 flex items-center gap-2"><FaUniversity className="text-primary/40" /> {tutor.institution}</span>
                                                <span className="text-[10px] text-gray-500 flex items-center gap-2 uppercase tracking-tighter"><FaBook className="text-primary/40" /> {tutor.subjects}</span>
                                            </div>
                                        </td>
                                        <td className="text-center italic text-xs text-gray-400">{tutor.location}</td>
                                        <td className="text-center"><span className="badge bg-orange-500/10 text-orange-400 font-black text-[9px] px-3 py-3 border-none">{tutor.status}</span></td>
                                        <td className="rounded-r-2xl pr-8 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleAction(tutor._id, 'approved')} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><FaUserCheck /></button>
                                                <button onClick={() => handleAction(tutor._id, 'rejected')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FaUserTimes /></button>
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
                    <AnimatePresence mode="popLayout">
                        {tutors.map((tutor, index) => (
                            <motion.div
                                key={tutor._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 shadow-xl"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black border border-primary/20 text-xl">
                                            {tutor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white italic uppercase text-sm">{tutor.name}</h4>
                                            <p className="text-[10px] text-gray-500 flex items-center gap-1"><FaEnvelope size={8} /> {tutor.email}</p>
                                        </div>
                                    </div>
                                    <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md font-black text-[8px] uppercase tracking-tighter">
                                        {tutor.status}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3 text-xs text-gray-300">
                                        <FaUniversity className="text-primary shrink-0" />
                                        <span className="truncate">{tutor.institution}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-300">
                                        <FaBook className="text-primary shrink-0" />
                                        <span className="truncate">{tutor.subjects}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-300">
                                        <FaMapMarkerAlt className="text-primary shrink-0" />
                                        <span>{tutor.location}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleAction(tutor._id, 'approved')}
                                        className="flex items-center justify-center gap-2 py-3.5 bg-green-500/10 text-green-500 rounded-xl font-black uppercase text-[10px] tracking-widest border border-green-500/10 active:scale-95 transition-transform"
                                    >
                                        <FaUserCheck /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(tutor._id, 'rejected')}
                                        className="flex items-center justify-center gap-2 py-3.5 bg-red-500/10 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest border border-red-500/10 active:scale-95 transition-transform"
                                    >
                                        <FaUserTimes /> Reject
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Empty State */}
                {tutors.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <Lottie animationData={null} path={emptyAnim} loop className="w-48 opacity-20" />
                        <p className="text-gray-600 font-bold uppercase tracking-[0.3em] italic mt-6 px-4 text-xs">
                            Excellent! No pending tutor reviews.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AppliedTutor;