import React from 'react';

const NewsletterSection = () => {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[3rem] bg-base-200 dark:bg-white/5 backdrop-blur-3xl border border-base-300 dark:border-white/10 shadow-2xl">
                {/* Minimal Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 p-10 md:p-16 text-center text-base-content">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase italic">
                        Stay <span className="text-base-content/80">Updated</span>
                    </h2>
                    <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto opacity-80 font-medium">
                        Join our elite community. Get the best tuition offers and educational tips directly to your inbox.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto bg-base-100 dark:bg-white/10 backdrop-blur-2xl p-2 rounded-3xl border border-base-300 dark:border-white/10">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input bg-transparent border-none text-base-content placeholder:text-base-content/50 w-full focus:outline-none focus:ring-0 font-bold px-6"
                        />
                        <button className="btn bg-primary text-white hover:bg-primary/90 border-none rounded-2xl px-8 font-black uppercase tracking-widest text-xs shadow-xl">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
