import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { motion } from 'framer-motion';
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

    // --- ডার্ক মোড লোডার ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[80vh] bg-base-100">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-success/10 border-t-success rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-success rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(var(--s),0.5)]"
                    >
                        <div className="w-1.5 h-1.5 bg-success-content rounded-full" />
                    </motion.div>
                </div>
                <div className="mt-12 text-center">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-success text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Securing Transaction
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4 py-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-base-100/60 dark:bg-white/3 backdrop-blur-3xl rounded-5xl md:rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-base-200 dark:border-white/10 overflow-hidden relative"
            >
                {/* Top Success Banner */}
                <div className="bg-green-500/5 py-10 md:py-14 flex flex-col items-center relative">
                    <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="size-20 md:size-24 bg-green-500 text-white rounded-4xl flex items-center justify-center shadow-2xl shadow-green-500/20"
                    >
                        <FaCheckCircle className="text-4xl md:text-5xl" />
                    </motion.div>

                    <h2 className="mt-6 md:mt-8 text-2xl md:text-4xl font-black text-base-content uppercase italic tracking-tighter">
                        Success <span className="text-success">Fixed</span>
                    </h2>

                    <div className="mt-2 flex items-center gap-2 px-4 py-1.5 bg-success/10 rounded-full border border-success/20">
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                        <p className="text-success/70 text-[9px] font-black uppercase tracking-[0.2em]">Validated by System</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-10 space-y-6 text-base-content">
                    <div className="p-6 bg-base-200/50 dark:bg-white/2 rounded-4xl border border-base-300 dark:border-white/5 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                <FaReceipt size={14} />
                            </div>
                            <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">Digital Receipt</span>
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <p className="text-[8px] font-black text-base-content/30 uppercase tracking-widest mb-2 flex items-center gap-2 italic">
                                    <FaHashtag size={8} className="text-success" /> Transaction ID
                                </p>
                                <div className="font-mono text-[11px] md:text-sm font-bold text-base-content/80 bg-base-300/40 dark:bg-black/40 p-4 rounded-2xl border border-base-300 dark:border-white/5 break-all leading-relaxed group-hover:border-success/30 transition-colors">
                                    {paymentInfo?.transectionId || "N/A"}
                                </div>
                            </div>

                            <div className="group">
                                <p className="text-[8px] font-black text-base-content/30 uppercase tracking-widest mb-2 flex items-center gap-2 italic">
                                    <FaHashtag size={8} className="text-success" /> Internal Tracking
                                </p>
                                <div className="font-mono text-[11px] md:text-sm font-bold text-base-content/80 bg-base-300/40 dark:bg-black/40 p-4 rounded-2xl border border-base-300 dark:border-white/5 break-all leading-relaxed group-hover:border-success/30 transition-colors">
                                    {paymentInfo?.trackingId || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-5 bg-base-content text-base-100 font-black rounded-2xl md:rounded-[1.8rem] flex items-center justify-center gap-3 hover:bg-success hover:text-success-content transition-all uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-2xl active:scale-95"
                        >
                            Return to HQ <FaArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Decorative Bottom Line */}
                <div className="h-2 bg-linear-to-r from-transparent via-green-500 to-transparent w-full opacity-50" />
            </motion.div>
        </div>
    );
};

export default Payment_Success;