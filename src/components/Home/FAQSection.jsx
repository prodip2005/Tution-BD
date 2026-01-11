import React from 'react';

const FAQSection = () => {
    return (
        <div className="py-20 bg-transparent">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-4 text-base-content uppercase italic tracking-tighter">Frequently Asked <span className="text-primary">Questions</span></h2>
                </div>

                <div className="join join-vertical w-full space-y-4">
                    <div className="collapse collapse-arrow join-item border border-base-300 dark:border-white/5 bg-base-200 dark:bg-white/5 backdrop-blur-md rounded-3xl">
                        <input type="radio" name="my-accordion-4" defaultChecked />
                        <div className="collapse-title text-lg md:text-xl font-black text-base-content uppercase tracking-tight italic">
                            How do I find a tutor?
                        </div>
                        <div className="collapse-content text-base-content/70 font-semibold">
                            <p>Simply browse our tutor listings, filter by subject and location, and book a session directly.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow join-item border border-base-300 dark:border-white/5 bg-base-200 dark:bg-white/5 backdrop-blur-md rounded-3xl">
                        <input type="radio" name="my-accordion-4" />
                        <div className="collapse-title text-lg md:text-xl font-black text-base-content uppercase tracking-tight italic">
                            Is it free to sign up?
                        </div>
                        <div className="collapse-content text-base-content/70 dark:text-white/70 font-semibold">
                            <p>Yes, signing up as a student is completely free. Tutors may have premium options.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow join-item border border-base-300 dark:border-white/5 bg-base-200 dark:bg-white/5 backdrop-blur-md rounded-3xl">
                        <input type="radio" name="my-accordion-4" />
                        <div className="collapse-title text-lg md:text-xl font-black text-base-content uppercase tracking-tight italic">
                            Are the tutors verified?
                        </div>
                        <div className="collapse-content text-base-content/70 dark:text-white/70 font-semibold">
                            <p>Yes, we strictly verify all tutor credentials to ensure quality education.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
