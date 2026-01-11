import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-950 text-base-content relative overflow-hidden font-sans">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

            <section className="py-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-4">
                            Get in <span className="text-primary italic">Touch</span>
                        </h1>
                        <p className="text-lg text-base-content/60">We'd love to hear from you. Drop us a line!</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            {[
                                { icon: FaPhone, title: "Call Us", info: "+880 123 456 7890", sub: "Mon-Fri from 8am to 5pm" },
                                { icon: FaEnvelope, title: "Email Us", info: "hello@tutorowl.com", sub: "Online support 24/7" },
                                { icon: FaMapMarkerAlt, title: "Visit Us", info: "Dhaka, Bangladesh", sub: "Main Office HQ" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-6 p-6 rounded-3xl bg-base-100/50 dark:bg-white/[0.02] border border-base-200 dark:border-white/5 shadow-lg group hover:border-primary/30 transition-colors">
                                    <div className="p-4 bg-primary/10 rounded-2xl text-primary text-xl group-hover:scale-110 transition-transform">
                                        <item.icon />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                                        <p className="text-lg font-medium">{item.info}</p>
                                        <p className="text-sm text-base-content/50 uppercase tracking-wider font-bold mt-1">{item.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-base-100/60 dark:bg-base-200/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-base-200 dark:border-white/10 shadow-2xl"
                        >
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-base-content/50 ml-2">Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full p-4 rounded-2xl bg-base-200/50 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary outline-none transition-all placeholder:text-base-content/30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-base-content/50 ml-2">Email</label>
                                        <input type="email" placeholder="john@example.com" className="w-full p-4 rounded-2xl bg-base-200/50 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary outline-none transition-all placeholder:text-base-content/30" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-base-content/50 ml-2">Message</label>
                                    <textarea rows="4" placeholder="How can we help you?" className="w-full p-4 rounded-2xl bg-base-200/50 dark:bg-white/5 border border-base-300 dark:border-white/10 focus:border-primary outline-none transition-all placeholder:text-base-content/30 resize-none"></textarea>
                                </div>
                                <button type="button" className="w-full py-4 btn btn-primary text-primary-content font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                    Send Message <FaPaperPlane className="ml-2" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;