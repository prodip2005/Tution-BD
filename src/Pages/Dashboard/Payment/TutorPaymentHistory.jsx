import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react';
import { AuthContext } from '../../../Providers/AuthContext';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaUserGraduate, FaHashtag, FaCalendarAlt, FaCheckCircle, FaReceipt } from 'react-icons/fa';

const TutorPaymentHistory = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { isLoading, data: payments = [] } = useQuery({
        queryKey: ['tutor-payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
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
                        Loading Ledger
                    </motion.p>
                </div>
            </div>
        );
    }

    const tutorPayments = payments.filter(
        payment => payment.tutorEmail === user.email
    );

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 py-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/20 rounded-3xl text-primary shadow-lg shadow-primary/10">
                        <FaWallet size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                            Earnings <span className="text-primary">History</span>
                        </h2>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">
                            Summary of your successful transactions
                        </p>
                    </div>
                </div>

                {/* Total Earnings Badge (Simple Calc) */}
                <div className="px-8 py-4 bg-white/[0.03] border border-white/10 rounded-[2rem] flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Received</span>
                    <span className="text-2xl font-black text-white italic">৳ {tutorPayments.reduce((acc, curr) => acc + curr.amount, 0)}</span>
                </div>
            </div>

            {/* Glassy Data Table */}
            <div className="overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl">
                <table className="table w-full border-separate border-spacing-y-3 px-6 pb-6">
                    <thead>
                        <tr className="text-gray-500 border-none uppercase text-[9px] tracking-[0.2em]">
                            <th className="bg-transparent pl-8">#</th>
                            <th className="bg-transparent">Subject & Student</th>
                            <th className="bg-transparent text-center">Amount</th>
                            <th className="bg-transparent text-center">Transaction IDs</th>
                            <th className="bg-transparent text-center">Date</th>
                            <th className="bg-transparent text-right pr-8">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {tutorPayments.map((payment, index) => (
                                <motion.tr
                                    key={payment._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/[0.03] hover:bg-white/[0.08] transition-all group"
                                >
                                    <td className="rounded-l-2xl pl-8 font-mono text-gray-600 italic">{index + 1}</td>

                                    {/* Subject & Student Info */}
                                    <td>
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:rotate-12 transition-transform">
                                                <FaReceipt />
                                            </div>
                                            <div>
                                                <p className="font-black text-white italic tracking-wide">{payment.subjectName}</p>
                                                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                    <FaUserGraduate className="text-primary/50" /> {payment.studentName || 'N/A'} ({payment.customerEmail})
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="text-center">
                                        <span className="text-xl font-black text-white tracking-tighter italic">৳ {payment.amount}</span>
                                    </td>

                                    {/* IDs */}
                                    <td className="text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                <FaHashtag size={8} className="text-primary/50" /> TXN: {payment.transectionId}
                                            </div>
                                            <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                                                TRACK: {payment.trackingId}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[11px] text-gray-300 font-bold">{formatDateTime(payment.paidAt).split(',')[0]}</span>
                                            <span className="text-[9px] text-gray-500 flex items-center gap-1">
                                                <FaCalendarAlt size={8} /> {formatDateTime(payment.paidAt).split(',')[1]}
                                            </span>
                                        </div>
                                    </td>

                            {/* Status */}
                                    <td className="rounded-r-2xl text-right pr-8">
                                        <span className="badge border-none bg-green-500/10 text-green-400 font-black text-[10px] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ml-auto w-fit uppercase">
                                            <FaCheckCircle className="animate-pulse" /> {payment.paymentStatus}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {tutorPayments.length === 0 && (
                    <div className="py-24 text-center flex flex-col items-center">
                        <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <FaWallet className="text-gray-700" size={30} />
                        </div>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.4em] italic text-sm">No payment records found yet.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TutorPaymentHistory;