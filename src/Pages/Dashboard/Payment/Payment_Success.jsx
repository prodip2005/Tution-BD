import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaHashtag, FaArrowRight, FaReceipt } from 'react-icons/fa';

const Payment_Success = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    setPaymentInfo({
                        trackingId: res.data.trackingId,
                        transectionId: res.data.transectionId
                    });
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [axiosSecure, sessionId]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[80vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-green-500/10 border-t-green-500 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-green-400/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-12 text-center">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-green-500 text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Verifying Payment
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-[#0f1115] rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden relative"
            >
                {/* Top Success Banner */}
                <div className="bg-green-500/10 py-10 flex flex-col items-center relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="size-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                    >
                        <FaCheckCircle size={40} />
                    </motion.div>
                    <h2 className="mt-6 text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                        Payment <span className="text-green-500">Successful</span>
                    </h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Transaction Completed</p>
                </div>

                {/* Details Section */}
                <div className="p-8 space-y-4">
                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                <FaReceipt size={14} />
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Billing Summary</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <FaHashtag size={8} className="text-green-500" /> Transaction ID
                                </p>
                                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-black/20 p-2 rounded-xl border border-gray-200 dark:border-white/5">
                                    {paymentInfo?.transectionId}
                                </p>
                            </div>

                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <FaHashtag size={8} className="text-green-500" /> Tracking ID
                                </p>
                                <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-black/20 p-2 rounded-xl border border-gray-200 dark:border-white/5">
                                    {paymentInfo?.trackingId}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all uppercase text-xs tracking-[0.2em] shadow-xl"
                    >
                        Go to Dashboard <FaArrowRight />
                    </button>
                </div>

                {/* Decorative Bottom Line */}
                <div className="h-2 bg-green-500 w-full" />
            </motion.div>
        </div>
    );
};

export default Payment_Success;