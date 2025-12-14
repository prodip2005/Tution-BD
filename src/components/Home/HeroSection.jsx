// src/components/HeroSection.jsx
import React from "react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";

/**
 * Replace slideData image URLs with your own images.
 * Swiper autoplay will pause on mouse enter and resume on leave.
 */
const slideData = [
    {
        image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1600&auto=format&fit=crop",
        title: "Master new skills with TutorOWL",
        subtitle: "Expert tutors • Flexible schedules • Personalised lessons",
        cta: { label: "Get Started", href: "/register" },
    },
    {
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop",
        title: "Find Top Tutors Near You",
        subtitle: "Hand-picked experts in math, programming and more.",
        cta: { label: "Find Tutors", href: "/tutors" },
    },
    {
        image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
        title: "Interactive Lessons That Click",
        subtitle: "Engaging lessons with practical projects and feedback.",
        cta: { label: "Find Tutions", href: "/tutions" },
    },
];

const HeroSection = () => {
    return (
        <section className="w-full  mx-auto px-4">
            <div className="rounded-2xl overflow-hidden relative shadow-lg">
                <Swiper
                    modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    navigation
                    pagination={{ clickable: true }}
                    mousewheel
                    keyboard
                    autoplay={{
                        delay: 1500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={true}
                    speed={900}
                    className="w-full h-[520px] md:h-[620px]"
                >
                    {slideData.map((s, i) => (
                        <SwiperSlide key={i}>
                            <div className="relative w-full h-[520px] md:h-[620px]">
                                {/* Background image */}
                                <div
                                    className="absolute inset-0 bg-center bg-cover transition-transform duration-1000"
                                    style={{
                                        backgroundImage: `url("${s.image}")`,
                                        transform: "scale(1.03)",
                                        willChange: "transform, opacity",
                                    }}
                                    aria-hidden
                                />

                                {/* soft overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/45" />

                                {/* Content */}
                                <div className="relative z-10 h-full flex items-center">
                                    <div className="container mx-auto px-6 md:px-12">
                                        <div className="max-w-2xl text-white">
                                            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-md">
                                                {s.title}
                                            </h2>
                                            <p className="mt-3 text-sm md:text-lg text-white/90">{s.subtitle}</p>

                                            <div className="mt-6 flex gap-3">
                                                {s.cta && (
                                                    <a
                                                        href={s.cta.href}
                                                        className="inline-block btn btn-primary px-5 py-3 rounded-lg shadow-lg backdrop-blur-sm"
                                                    >
                                                        {s.cta.label}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* subtle animated vignette to add life */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background:
                                            "radial-gradient(900px 400px at 10% 20%, rgba(255,255,255,0.02), rgba(255,255,255,0) 20%)",
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* small style hack for nav dots/buttons layering */}
                <style>{`
          /* bring navigation buttons and pagination above overlay */
          .swiper-button-next, .swiper-button-prev {
            color: white;
            box-shadow: 0 6px 20px rgba(2,6,23,0.25);
          }
          .swiper-pagination-bullet {
            background: rgba(255,255,255,0.6);
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: white;
            transform: scale(1.1);
          }
        `}</style>
            </div>
        </section>
    );
};

export default HeroSection;
