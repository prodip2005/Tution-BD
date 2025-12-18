import React from "react";
import { motion } from "framer-motion";
import {
    LuShieldCheck,
    LuZap,
    LuCreditCard,
    LuBadgeCheck,
    LuGem
} from "react-icons/lu";

const features = [
    {
        title: "Verified Tutors",
        desc: "Every tutor goes through a strict verification process for quality.",
        icon: <LuBadgeCheck size={32} />,
        color: "group-hover:text-emerald-400"
    },
    {
        title: "Fast Matching",
        desc: "Find the perfect tutor quickly with our smart matching system.",
        icon: <LuZap size={32} />,
        color: "group-hover:text-yellow-400"
    },
    {
        title: "Secure Payments",
        desc: "100% secure payments with full transparency and safety.",
        icon: <LuCreditCard size={32} />,
        color: "group-hover:text-cyan-400"
    },
    {
        title: "Trusted Platform",
        desc: "Used by hundreds of students and tutors nationwide every day.",
        icon: <LuShieldCheck size={32} />,
        color: "group-hover:text-indigo-400"
    },
];

const WhyChooseUs = () => {
    return (
        <section className="relative py-28 overflow-hidden bg-[#020617]">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6">

                {/* --- Section Header --- */}
                <div className="text-center mb-20 flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-indigo-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase border border-indigo-500/20 px-4 py-1.5 rounded-full bg-indigo-500/5 backdrop-blur-md mb-8"
                    >
                        Quality Assurance
                    </motion.span>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-4 text-indigo-500"
                    >
                        <LuGem className="animate-bounce" size={40} />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter"
                    >
                        Why <span className="text-indigo-500">Choose Us</span>
                    </motion.h2>
                </div>

                {/* --- Features Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -15 }}
                            className="group relative h-full"
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute inset-0 bg-indigo-600/20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-[2.5rem]" />

                            <div className="relative h-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 text-center flex flex-col items-center transition-all duration-500 group-hover:border-indigo-500/50 group-hover:bg-white/[0.04]">

                                {/* Icon Container with Moving Border */}
                                <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                                    <div className="relative z-10 text-white group-hover:scale-110 transition-transform duration-500">
                                        <div className={`${feature.color} transition-colors duration-300`}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black mb-4 text-white uppercase italic tracking-tight">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {feature.desc}
                                </p>

                                {/* Bottom Decorative Line */}
                                <div className="absolute bottom-6 w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        whileInView={{ width: "100%" }}
                                        transition={{ duration: 1.5, delay: index * 0.2 }}
                                        className="w-0 h-full bg-indigo-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;