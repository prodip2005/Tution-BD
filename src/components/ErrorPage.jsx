import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { FiHome, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

const ErrorPage = () => {
    const navigate = useNavigate();

    // কন্টেইনার এনিমেশন (একটির পর একটি এলিমেন্ট আসবে)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-4 overflow-hidden relative">

            {/* ১. ব্যাকগ্রাউন্ডে এনিমেটেড পার্টিকেলস (Floating Orbs) */}
            <div className="absolute inset-0 z-0">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [0, 100, -100, 0],
                            y: [0, -100, 100, 0],
                            scale: [1, 1.2, 0.8, 1],
                        }}
                        transition={{
                            duration: 15 + i * 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className={`absolute w-96 h-96 rounded-full blur-[120px] opacity-20 
                            ${i === 0 ? 'bg-primary top-[-10%] left-[-5%]' :
                                i === 1 ? 'bg-indigo-600 bottom-[-10%] right-[-5%]' :
                                    'bg-purple-600 top-[30%] left-[40%]'}`}
                    />
                ))}
            </div>

            {/* ২. মেইন কন্টেন্ট কন্টেইনার */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-3xl w-full text-center relative z-10"
            >

                {/* ৩. ৩ডি ফ্লোটিং ৪-০-৪ টেক্সট */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex justify-center mb-10"
                >
                    <h1 className="text-[12rem] md:text-[20rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent italic select-none">
                        404
                    </h1>

                    {/* মাঝখানের এনিমেটেড আইকন */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="relative group">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-primary/30 rounded-full blur-2xl group-hover:bg-primary/50 transition-all"
                            />
                            <div className="relative bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white/20 shadow-2xl overflow-hidden">
                                <motion.div
                                    animate={{ rotateY: [0, 360] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <FiAlertTriangle size={80} className="text-primary" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* ৪. টেক্সট সেকশন (Staggered) */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
                        Dimension <span className="text-primary">Mismatch</span>
                    </h2>
                    <p className="text-gray-400 font-medium max-w-lg mx-auto leading-relaxed text-sm md:text-base">
                        The page you are looking for has slipped through a wormhole.
                        It doesn't exist in this coordinate of the web.
                    </p>
                </motion.div>

                {/* ৫. প্রফেশনাল কন্ট্রোল বাটনস */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 px-6"
                >
                    <motion.button
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-bold text-xs uppercase tracking-[0.3em] rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                    >
                        <FiArrowLeft className="text-primary" /> Go Back
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-[0_15px_30px_-10px_rgba(var(--p),0.5)] transition-all flex items-center justify-center gap-3"
                    >
                        <FiHome /> Return Core
                    </motion.button>
                </motion.div>

                {/* ৬. মেকানিকাল ডিটেইল (Footer) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.5 }}
                    className="mt-20 flex flex-col items-center gap-2"
                >
                    <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[1em] pl-[1em]">
                        Error ID: 404-STX
                    </span>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default ErrorPage;