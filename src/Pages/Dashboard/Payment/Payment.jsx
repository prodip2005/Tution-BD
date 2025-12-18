import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FaMoneyBillWave, FaUserTie, FaBookOpen, FaShieldAlt, FaIdCardAlt, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";

const Payment = () => {
    const { applicationId } = useParams();
    const axiosSecure = useAxiosSecure();

    const { isLoading, data: application } = useQuery({
        queryKey: ['applications', applicationId],
        enabled: !!applicationId,
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/${applicationId}`);
            return res.data;
        }
    });

    if (isLoading || !application) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#050505] p-6">
                <Lottie
                    path="https://lottie.host/890453d1-419b-449a-bd9e-269608406180/7eL6R9oV7j.json"
                    className="w-48 md:w-64"
                    loop
                />
                <h2 className="text-lg md:text-xl font-black text-primary animate-pulse tracking-[0.3em] md:tracking-[0.5em] mt-8 uppercase text-center">
                    Securing Connection
                </h2>
            </div>
        );
    }

    const formatCurrency = (amount) => `৳${new Intl.NumberFormat('en-IN').format(amount)}`;

    const handlePayment = async () => {
        const paymentInfo = {
            expectedSalary: application.expectedSalary,
            applicationId: application._id,
            applicationName: application.studentName,
            studentEmail: application.studentEmail,
            tuitionSubject: application.tuitionSubject
        }
        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        window.location.href = res.data.url;
    }

    return (
        <div className="min-h-full py-6 md:py-10 flex items-center justify-center px-4 overflow-hidden relative">

            {/* Background Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] p-5 md:p-12 border border-white/10 shadow-2xl relative"
            >
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8 md:mb-10"
                >
                    <div className="inline-flex items-center justify-center p-3 md:p-4 bg-primary/20 rounded-xl md:rounded-2xl text-primary mb-4 md:mb-6">
                        <FaMoneyBillWave className="text-3xl md:text-4xl animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-tight">
                        Finalize <span className="text-primary">Payment</span>
                    </h1>
                    <p className="mt-2 md:mt-4 text-gray-500 font-bold flex items-center justify-center gap-2 uppercase text-[9px] md:text-[10px] tracking-widest">
                        <FaIdCardAlt className="text-primary" />
                        ID: {applicationId.slice(-8)}
                    </p>
                </motion.div>

                {/* Summary Info Grid */}
                <div className="space-y-4 md:space-y-6">
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                    >
                        <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
                            <p className="text-[9px] md:text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] mb-1 md:mb-2">Subject</p>
                            <div className="flex items-center gap-3">
                                <FaBookOpen className="text-primary text-sm md:text-base group-hover:scale-125 transition-transform" />
                                <span className="text-lg md:text-xl font-bold text-white italic">{application.tuitionSubject}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
                            <p className="text-[9px] md:text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] mb-1 md:mb-2">Tutor Name</p>
                            <div className="flex items-center gap-3">
                                <FaUserTie className="text-primary text-sm md:text-base group-hover:scale-125 transition-transform" />
                                <span className="text-lg md:text-xl font-bold text-white italic truncate">{application.tutorName}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Final Amount Display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/5 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-primary/20 text-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <p className="text-[10px] md:text-xs uppercase font-black text-primary tracking-[0.4em] mb-2 md:mb-4">Amount to Pay</p>
                        <div className="flex flex-col items-center">
                            <span className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(var(--p),0.3)]">
                                {formatCurrency(application.expectedSalary)}
                            </span>
                            <div className="mt-3 md:mt-4 flex items-center gap-2 text-gray-500 font-bold text-[10px] md:text-sm bg-white/5 px-3 md:px-4 py-1 rounded-full border border-white/5">
                                <s>{formatCurrency(application.studentDemand)}</s>
                                <FaArrowRight size={10} className="text-primary" />
                                <span className="text-gray-300 italic">Agreed Deal</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Call to Action */}
                    <div className="space-y-5 md:space-y-6">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePayment}
                            className="w-full py-4 md:py-6 bg-primary text-white font-black text-lg md:text-xl rounded-xl md:rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-3 md:gap-4 uppercase tracking-[0.15em] md:tracking-[0.2em]"
                        >
                            Confirm & Pay Now <FaMoneyBillWave className="text-xl md:text-2xl" />
                        </motion.button>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1">
                            <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                <FaShieldAlt className="text-green-500" />
                                Secure Encrypted Transaction
                            </div>
                            <div className="flex gap-1.5 md:gap-2 opacity-50">
                                <div className="w-6 md:w-8 h-4 md:h-5 bg-white/10 rounded"></div>
                                <div className="w-6 md:w-8 h-4 md:h-5 bg-white/10 rounded"></div>
                                <div className="w-6 md:w-8 h-4 md:h-5 bg-white/10 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Corner Decorative */}
                <div className="absolute -bottom-4 -right-4 size-16 md:size-24 bg-primary/10 rounded-full blur-2xl md:blur-3xl"></div>
            </motion.div>
        </div>
    );
};

export default Payment;