import React from "react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slideData = [
    {
        image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1600&auto=format&fit=crop",
        tag: "SKILL DEVELOPMENT",
        title: "Master New Skills with TutorOWL",
        subtitle: "Expert tutors • Flexible schedules",
        cta: { label: "Get Started", href: "/register" },
    },
    {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
        tag: "EXPERT GUIDANCE",
        title: "Find Top Tutors Near You",
        subtitle: "Hand-picked experts in math and more.",
        cta: { label: "Find Tutors", href: "/tutors" },
    },
    {
        image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
        tag: "PRACTICAL LEARNING",
        title: "Interactive Lessons That Click",
        subtitle: "Engaging lessons with practical projects.",
        cta: { label: "Explore Lessons", href: "/tutions" },
    },
];

const HeroSection = () => {
    return (
        <section className="w-full lg:px-8 sm:px-5 -mt-4 md:-mt-8">
            <div className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden md:rounded-3xl shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <Swiper
                    modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    navigation={true}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    loop={true}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                    }}
                    speed={1500}
                    className="w-full h-full"
                >
                    {slideData.map((s, i) => (
                        <SwiperSlide key={i}>
                            <div className="relative w-full h-full">
                                {/* Enhanced Zoom Background Image */}
                                <motion.div
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 10 }}
                                    className="absolute inset-0 bg-center bg-cover"
                                    style={{ backgroundImage: `url("${s.image}")` }}
                                />

                                {/* Multi-layer Overlays for Glassy Look */}
                                <div className="absolute inset-0 bg-linear-to-r from-base-100 dark:from-[#020617] via-base-100/40 dark:via-[#020617]/40 to-transparent" />
                                <div className="absolute inset-0 bg-linear-to-t from-base-100 dark:from-[#020617] via-transparent to-transparent" />

                                {/* Content Container */}
                                <div className="relative z-10 h-full max-w-[1440px] mx-auto flex items-center px-8 sm:px-12 md:px-20">
                                    <div className="max-w-4xl">
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        >
                                            {/* Top Tagline */}
                                            <span className="inline-block text-[10px] md:text-xs font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full tracking-[0.3em] uppercase mb-4 border border-primary/20 backdrop-blur-md">
                                                {s.tag}
                                            </span>

                                            <h2 className="text-2xl sm:text-5xl md:text-8xl font-black text-base-content leading-[1.1] italic uppercase tracking-tighter">
                                                {s.title.split(' ').map((word, index) => (
                                                    <span key={index} className={index % 2 !== 0 ? "text-primary" : ""}>{word} </span>
                                                ))}
                                            </h2>

                                            <p className="mt-3 md:mt-8 text-xs sm:text-lg md:text-2xl text-base-content/70 font-medium max-w-xl line-clamp-2 uppercase tracking-wide opacity-80">
                                                {s.subtitle}
                                            </p>

                                            <div className="mt-6 md:mt-12 flex items-center gap-4">
                                                <Link
                                                    to={s.cta.href}
                                                    className="group relative px-6 md:px-12 py-3 md:py-5 bg-primary text-primary-content rounded-2xl font-black shadow-[0_10px_30px_rgba(124,58,237,0.3)] text-[10px] md:text-sm uppercase tracking-[0.2em] flex items-center gap-3 overflow-hidden transition-all hover:bg-primary/90"
                                                >
                                                    <span className="relative z-10">{s.cta.label}</span>
                                                    <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                </Link>

                                                <div className="hidden md:flex items-center gap-2 opacity-30">
                                                    <div className="w-12 h-px bg-base-content"></div>
                                                    <span className="text-[10px] font-black text-base-content uppercase tracking-widest">Scroll</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Cyber Styling for Swiper */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .swiper-button-next, .swiper-button-prev {
                        width: 50px;
                        height: 50px;
                        background: rgba(255, 255, 255, 0.03);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 18px;
                        color: oklch(var(--p)) !important;
                        transition: all 0.3s ease;
                    }
                    .swiper-button-next:after, .swiper-button-prev:after {
                        font-size: 18px;
                        font-weight: bold;
                    }
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        background: oklch(var(--p));
                        color: white !important;
                        box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
                    }
                    .swiper-pagination-bullet {
                        background: rgba(255, 255, 255, 0.2) !important;
                        width: 12px;
                        height: 12px;
                        opacity: 1;
                    }
                    .swiper-pagination-bullet-active {
                        background: oklch(var(--p)) !important;
                        width: 30px;
                        border-radius: 6px;
                    }
                    @media (max-width: 768px) {
                        .swiper-button-next, .swiper-button-prev {
                            display: none;
                        }
                    }
                `}} />
            </div>
        </section>
    );
};

export default HeroSection;