import React from "react";
import { motion } from "framer-motion";
import { LuUpload, LuUsers, LuBadgeCheck, LuZap } from "react-icons/lu";

const steps = [
    {
        id: "01",
        title: "Post Tuition",
        desc: "Students post tuition requirements with subject, class & budget.",
        icon: <LuUpload size={32} />,
        color: "from-primary to-primary/80"
    },
    {
        id: "02",
        title: "Tutors Apply",
        desc: "Qualified tutors apply with experience & expected salary.",
        icon: <LuUsers size={32} />,
        color: "from-secondary to-secondary/80"
    },
    {
        id: "03",
        title: "Select & Start",
        desc: "Choose the best tutor and start learning immediately.",
        icon: <LuBadgeCheck size={32} />,
        color: "from-accent to-accent/80"
    },
];

const HowItWorks = () => {
    return (
        <section className="relative py-24 px-4 overflow-hidden bg-base-100 dark:bg-[#020617]">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full" />

            <div className="max-w-7xl mx-auto relative">

                {/* --- Section Header --- */}
                <div className="text-center mb-20 flex flex-col items-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-primary text-[10px] md:text-xs font-black tracking-[0.4em] uppercase border border-primary/20 px-4 py-1.5 rounded-full bg-primary/5 backdrop-blur-md mb-8"
                    >
                        Process Workflow
                    </motion.span>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="mb-6 bg-base-200 dark:bg-white/5 p-4 rounded-2xl border border-base-300 dark:border-white/10"
                    >
                        <LuZap className="text-secondary animate-pulse" size={32} fill="currentColor" fillOpacity={0.2} />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-6xl font-black text-base-content italic uppercase tracking-tighter leading-none"
                    >
                        How the <span className="text-primary">Platform</span> Works
                    </motion.h2>
                </div>

                {/* --- Steps Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">

                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-1/3 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -12 }}
                            className="group relative"
                        >
                            {/* Card Body */}
                            <div className="bg-base-200 dark:bg-white/2 backdrop-blur-xl border border-base-300 dark:border-white/10 rounded-[3rem] p-10 text-center transition-all duration-500 group-hover:border-primary/40 shadow-2xl relative overflow-hidden">

                                {/* Hover Glow Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Step Number Badge */}
                                <div className="absolute top-6 right-8 text-4xl font-black text-base-content/5 dark:text-white/5 group-hover:text-primary/10 transition-colors">
                                    {step.id}
                                </div>

                                {/* Icon Container */}
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.8 }}
                                    className={`w-20 h-20 mx-auto flex items-center justify-center bg-gradient-to-br ${step.color} text-white rounded-[2rem] mb-8 shadow-xl shadow-primary/20 relative z-10`}
                                >
                                    {step.icon}
                                </motion.div>

                                <h3 className="text-2xl font-black mb-4 text-base-content uppercase italic tracking-tight group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>

                                <p className="text-base-content/60 font-medium leading-relaxed text-sm md:text-base">
                                    {step.desc}
                                </p>

                                {/* Bottom Indicator */}
                                <div className="mt-8 flex justify-center">
                                    <div className="w-12 h-1 bg-base-content/10 dark:bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            whileInView={{ x: "0%" }}
                                            transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                                            className={`w-full h-full bg-gradient-to-r ${step.color}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Arrow for Desktop */}
                            {index < 2 && (
                                <div className="hidden md:flex absolute -right-6 top-1/3 z-20 items-center justify-center text-primary/30">
                                    <LuZap size={24} className="animate-bounce" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;