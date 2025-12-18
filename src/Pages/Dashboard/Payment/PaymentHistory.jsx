import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaReceipt, FaCalendarAlt, FaFingerprint, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        }
    });

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
                        className="absolute w-24 h-24 border border dashed border-indigo-400/20 rounded-full"
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
                        Syncing Financials
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-2 md:px-4 py-6 md:py-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="p-3 md:p-4 bg-primary/20 rounded-2xl md:rounded-3xl text-primary shadow-lg shadow-primary/10">
                        <FaHistory className="text-2xl md:text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                            Payment <span className="text-primary">History</span>
                        </h2>
                        <p className="text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-1">
                            Total Records: {payments.length}
                        </p>
                    </div>
                </div>

                <div className="px-4 py-2 md:px-6 md:py-3 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl flex items-center gap-3 self-start md:self-center">
                    <div className="size-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">Transactions Verified</span>
                </div>
            </div>

            {/* Table Area for Desktop / Card List for Mobile */}
            <div className="w-full">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl">
                    <table className="table w-full border-separate border-spacing-y-3 px-6 pb-6">
                        <thead>
                            <tr className="text-gray-500 border-none uppercase text-[10px] tracking-[0.25em]">
                                <th className="bg-transparent pl-8">#</th>
                                <th className="bg-transparent">Tuition Subject</th>
                                <th className="bg-transparent">Amount</th>
                                <th className="bg-transparent text-center">Paid Time</th>
                                <th className="bg-transparent text-right pr-8">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {payments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white/[0.03] hover:bg-white/[0.08] transition-all group"
                                    >
                                        <th className="rounded-l-2xl pl-8 text-gray-600 group-hover:text-primary transition-colors italic">
                                            {index + 1}
                                        </th>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                                                    <FaReceipt />
                                                </div>
                                                <span className="font-bold text-white tracking-wide italic">
                                                    {payment.subjectName || "N/A"}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-xl font-black text-primary">৳ {payment.amount}</span>
                                                <span className="text-[10px] text-green-500 flex items-center gap-1 font-bold uppercase tracking-widest">
                                                    <FaCheckCircle size={8} /> Successful
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-2 text-gray-400 font-medium">
                                                <FaCalendarAlt className="text-gray-600" size={12} />
                                                {formatDateTime(payment.paidAt)}
                                            </div>
                                        </td>
                                        <td className="rounded-r-2xl text-right pr-8">
                                            <div className="flex items-center justify-end gap-2 text-xs font-mono text-gray-500 group-hover:text-gray-300">
                                                <FaFingerprint className="text-primary/40" />
                                                <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-tighter">
                                                    {payment.transectionId}
                                                </span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Card Layout */}
                <div className="md:hidden flex flex-col gap-4 w-full">
                    <AnimatePresence>
                        {payments.map((payment, index) => (
                            <motion.div
                                key={payment._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary text-sm">
                                            <FaReceipt />
                                        </div>
                                        <span className="font-bold text-white text-sm italic leading-tight">
                                            {payment.subjectName || "N/A"}
                                        </span>
                                    </div>
                                    <span className="text-xs italic text-gray-600 font-bold">#{index + 1}</span>
                                </div>

                                <div className="h-px bg-white/5 w-full"></div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Amount</span>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-primary leading-none">৳ {payment.amount}</span>
                                            <span className="text-[8px] text-green-500 flex items-center gap-1 font-bold uppercase mt-1">
                                                <FaCheckCircle size={7} /> Successful
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end text-right">
                                        <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Paid At</span>
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            {formatDateTime(payment.paidAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase">
                                        <FaFingerprint className="text-primary/40 text-xs" />
                                        <span>TXID: {payment.transectionId}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {payments.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <FaHistory size={60} className="text-white/5" />
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] italic">No transaction history found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PaymentHistory;