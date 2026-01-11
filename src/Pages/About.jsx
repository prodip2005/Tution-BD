import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaHandshake } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-950 text-base-content relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

            {/* Hero Section */}
            <section className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-6"
                    >
                        About <span className="text-primary italic">TutorOWL</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-2xl text-base-content/60 max-w-3xl mx-auto leading-relaxed"
                    >
                        We are bridging the gap between knowledge seekers and educators, creating a global classroom accessible to all.
                    </motion.p>
                </div>
            </section>

            {/* Mission/Vision Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: FaUsers, title: "Our Community", desc: "Building a network of trusted educators and eager learners." },
                        { icon: FaLightbulb, title: "Our Vision", desc: "To empower every individual with the knowledge they seek." },
                        { icon: FaHandshake, title: "Our Values", desc: "Integrity, transparency, and excellence in every interaction." }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 rounded-[2.5rem] bg-base-100/40 dark:bg-white/[0.02] border border-base-200 dark:border-white/5 backdrop-blur-md shadow-xl hover:border-primary/30 transition-all text-center group"
                        >
                            <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                                <item.icon />
                            </div>
                            <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                            <p className="text-base-content/60 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-base-200/50 dark:bg-white/[0.02] border-y border-base-200 dark:border-white/5">
                <div className="max-w-6xl mx-auto text-center grid grid-cols-2 md:grid-cols-4 gap-10">
                    {[
                        { num: "5K+", label: "Active Tutors" },
                        { num: "10K+", label: "Students" },
                        { num: "150+", label: "Subjects" },
                        { num: "98%", label: "Satisfaction" }
                    ].map((stat, idx) => (
                        <div key={idx}>
                            <h2 className="text-4xl md:text-6xl font-black text-primary mb-2">{stat.num}</h2>
                            <p className="text-sm font-bold uppercase tracking-widest text-base-content/50">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;