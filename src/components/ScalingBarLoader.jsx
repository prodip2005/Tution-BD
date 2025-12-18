import React from "react";
import { motion } from "framer-motion";

const ScalingBarLoader = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-[#020617] overflow-hidden">
            <div className="relative flex items-center justify-center">
                {/* Outer Rotating Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 border-t-2 border-b-2 border-indigo-500 rounded-full"
                ></motion.div>

                {/* Inner Pulsing Orb */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                        boxShadow: [
                            "0 0 20px rgba(79, 70, 229, 0.3)",
                            "0 0 50px rgba(79, 70, 229, 0.6)",
                            "0 0 20px rgba(79, 70, 229, 0.3)"
                        ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-10 h-10 bg-indigo-500 rounded-full blur-[2px]"
                ></motion.div>

                {/* Static Center Glow */}
                <div className="absolute w-4 h-4 bg-white rounded-full blur-[1px] shadow-[0_0_15px_white]" />
            </div>

            {/* Loading Text with Glitch/Pulse Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-10 flex flex-col items-center gap-2"
            >
                <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase"
                >
                    System Initializing
                </motion.span>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent overflow-hidden">
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full bg-white shadow-[0_0_10px_white]"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default ScalingBarLoader;