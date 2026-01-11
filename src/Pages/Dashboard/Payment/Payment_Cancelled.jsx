import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

const Payment_Cancelled = () => {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-600/10 rounded-full blur-[100px] md:blur-[150px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="max-w-md w-full bg-base-100/60 dark:bg-white/3 backdrop-blur-3xl rounded-5xl md:rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-base-200 dark:border-white/10 overflow-hidden relative"
            >
                {/* Top Cancelled Banner */}
                <div className="bg-red-500/5 py-12 flex flex-col items-center relative">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="size-20 md:size-24 bg-red-500 text-white rounded-4xl flex items-center justify-center shadow-2xl shadow-red-500/20"
                    >
                        <FaTimesCircle size={48} />
                    </motion.div>

                    <h2 className="mt-8 text-2xl md:text-4xl font-black text-base-content uppercase italic tracking-tighter">
                        Payment <span className="text-error">Aborted</span>
                    </h2>

                    <div className="mt-3 flex items-center gap-2 px-4 py-1.5 bg-error/10 rounded-full border border-error/20">
                        <FaExclamationTriangle className="text-error text-[10px]" />
                        <p className="text-error/70 text-[9px] font-black uppercase tracking-[0.2em]">Safety Protocol Active</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12 text-center space-y-8">
                    <div className="space-y-3">
                        <p className="text-base-content/60 text-sm md:text-base font-bold leading-relaxed italic opacity-80">
                            "The transaction was terminated. No charges were applied to your secure vault."
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link to={'/dashboard/applied-tutions'} className="block">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-5 bg-error text-error-content font-black rounded-2xl md:rounded-[1.8rem] flex items-center justify-center gap-3 shadow-xl shadow-error/20 hover:opacity-90 transition-all uppercase text-[10px] md:text-xs tracking-[0.3em]"
                            >
                                Re-Initiate Payment
                            </motion.button>
                        </Link>

                        <Link to={'/dashboard'} className="block">
                            <motion.button
                                whileHover={{ x: -2 }}
                                className="w-full py-4 bg-base-200 dark:bg-white/5 text-base-content/40 font-black rounded-2xl flex items-center justify-center gap-2 hover:text-base-content hover:bg-base-300 dark:hover:bg-white/10 transition-all uppercase text-[10px] tracking-[0.2em]"
                            >
                                <FaArrowLeft size={12} /> Return to Dashboard
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Bottom Decorative Line */}
                <div className="h-2 bg-linear-to-r from-transparent via-red-500 to-transparent w-full opacity-40" />
            </motion.div>
        </div>
    );
};

export default Payment_Cancelled;