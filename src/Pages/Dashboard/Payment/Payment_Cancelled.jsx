import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const Payment_Cancelled = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-500/10 rounded-full blur-[80px] md:blur-[120px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-[#0f1115] rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden relative"
            >
                {/* Top Cancelled Banner */}
                <div className="bg-red-500/10 py-10 flex flex-col items-center relative">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="size-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                    >
                        <FaTimesCircle size={40} />
                    </motion.div>

                    <h2 className="mt-6 text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                        Payment <span className="text-red-500">Cancelled</span>
                    </h2>

                    <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-red-500/5 rounded-full border border-red-500/10">
                        <FaExclamationTriangle className="text-red-500 text-[10px]" />
                        <p className="text-red-400 text-[9px] font-black uppercase tracking-widest">Transaction Aborted</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            The payment process was interrupted or cancelled. Don't worry, no funds were deducted from your account.
                        </p>
                    </div>

                    <div className="pt-4 space-y-3">
                        <Link to={'/dashboard/applied-tutions'} className="block">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-red-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all uppercase text-xs tracking-[0.2em]"
                            >
                                Try Again Now
                            </motion.button>
                        </Link>

                        <Link to={'/dashboard'} className="block">
                            <motion.button
                                whileHover={{ x: -5 }}
                                className="w-full py-4 bg-transparent text-gray-500 dark:text-gray-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:text-gray-800 dark:hover:text-white transition-all uppercase text-[10px] tracking-widest"
                            >
                                <FaArrowLeft size={10} /> Back to Dashboard
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Decorative Line */}
                <div className="h-2 bg-red-500 w-full opacity-50" />
            </motion.div>
        </div>
    );
};

export default Payment_Cancelled;