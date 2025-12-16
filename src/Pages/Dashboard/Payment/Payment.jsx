import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { FaMoneyBillWave, FaUserTie, FaRupeeSign, FaBookOpen, FaShieldAlt, FaIdCardAlt } from "react-icons/fa";
import { motion } from 'framer-motion';

const Payment = () => {
    const { applicationId } = useParams();
    const axiosSecure = useAxiosSecure();

    const { isLoading, data: application } = useQuery({
        queryKey: ['applications', applicationId],
        enabled: !!applicationId,
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/${applicationId}`);
            return res.data;
        }
    });

    if (isLoading || !application) {
        // Full-Page Light-Themed Loading State
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="mt-6 text-xl text-indigo-700 font-semibold">Initiating secure transaction...</p>
            </div>
        );
    }

    // Framer Motion variants for a subtle, elegant fade-in (kept the same structure)
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    // Helper function to format currency
    const formatCurrency = (amount) => `৳ ${new Intl.NumberFormat('en-IN').format(amount)}`;



    const handlePayment = async() => {
        const paymentInfo = {
            expectedSalary: application.expectedSalary,
            applicationId: application._id,
            applicationName:application.studentName,
            studentEmail: application.studentEmail,
            tuitionSubject: application.tuitionSubject
        }

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        console.log(res.data);
        window.location.href = res.data.url
        
    }


    return (
        // Full Page Container with Soft Light Background (Replacing bg-gray-900)
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
            <motion.div
                // Main card is bright white (Replacing bg-gray-800)
                className="w-full max-w-2xl bg-white rounded-3xl shadow-3xl p-6 sm:p-10 border border-indigo-100"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <motion.header
                    className="text-center mb-10"
                    variants={itemVariants}
                >
                    {/* Header Text is Dark/Gradient (Replacing text-white) */}
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-700">
                            Finalize Payment
                        </span>
                    </h1>
                    {/* Subtitle is Darker Gray (Replacing text-gray-400) */}
                    <p className="mt-2 text-lg text-gray-600 flex items-center justify-center gap-2">
                        <FaIdCardAlt className="text-indigo-500" />
                        Billing Details for Application #{applicationId.slice(-6)}
                    </p>
                </motion.header>

                {/* Main Content Area: Centered Details */}
                <div className="space-y-8">

                    {/* Transaction Details (Light Blue/Gray background - Replacing bg-gray-700) */}
                    <motion.div
                        className="bg-indigo-50 p-6 rounded-2xl space-y-4 shadow-sm"
                        variants={itemVariants}
                    >
                        {/* Summary Header (Darker Text - Replacing text-white) */}
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b border-indigo-200 pb-2">
                            Transaction Summary
                        </h2>

                        {/* Subject */}
                        <motion.div
                            className="flex justify-between items-center py-2 border-b border-indigo-200"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-3">
                                {/* Icon Color (Indigo) */}
                                <FaBookOpen className="text-indigo-500" />
                                <span className="font-medium text-gray-600">Tuition Subject:</span>
                            </div>
                            <span className="font-bold text-lg text-gray-900">{application.tuitionSubject}</span>
                        </motion.div>

                        {/* Tutor */}
                        <motion.div
                            className="flex justify-between items-center py-2"
                            variants={itemVariants}
                        >
                            <div className="flex items-center gap-3">
                                {/* Icon Color (Cyan) */}
                                <FaUserTie className="text-cyan-500" />
                                <span className="font-medium text-gray-600">Tutor Name:</span>
                            </div>
                            <span className="font-bold text-lg text-gray-900">{application.tutorName}</span>
                        </motion.div>

                        {/* Tutor Expected (Subtle Info) */}
                        <motion.div
                            className="text-right pt-2 text-sm italic text-gray-500"
                            variants={itemVariants}
                        >
                            <p>Student Demand: {formatCurrency(application.studentDemand)}</p>
                        </motion.div>
                    </motion.div>

                    {/* Final Amount Block - Highly Elevated (Indigo/Cyan Accent) */}
                    <motion.div
                        // Final Block: White background with strong accent border
                        className="p-8 bg-white rounded-2xl shadow-xl border-4 border-indigo-300"
                        variants={itemVariants}
                    >
                        {/* Header Text (Accent Color) */}
                        <h3 className="text-2xl font-semibold text-indigo-600 mb-2">
                            Your Payment Total (Tutor expected salary)
                        </h3>

                        <div className="flex justify-between items-center">
                            <span className="text-xl text-gray-500">Final Agreed Amount:</span>
                            <span className="text-6xl font-black text-cyan-600 tracking-wider animate-pulse-slow">
                                {formatCurrency(application.expectedSalary)}
                            </span>
                        </div>
                    </motion.div>

                    {/* Pay Now Button with High Contrast (Indigo) */}
                    <motion.button
                        // High Contrast Button: Indigo background, White text
                        className="w-full py-5 bg-indigo-600 text-white font-bold text-xl rounded-full shadow-2xl shadow-indigo-300/50 hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center justify-center gap-3"
                        whileHover={{ scale: 1.03, boxShadow: "0 15px 30px -5px rgba(99, 102, 241, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                        variants={itemVariants}
                        // The actual click functionality remains unchanged
                        onClick={handlePayment}
                    >
                        <FaMoneyBillWave className="text-3xl" />
                        CONFIRM AND PAY NOW
                    </motion.button>

                    {/* Security Note Footer (Darker Gray Text) */}
                    <motion.p
                        className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1"
                        variants={itemVariants}
                    >
                        <FaShieldAlt className="text-green-600" />
                        This transaction is protected by our secure, encrypted payment process.
                    </motion.p>

                </div>
            </motion.div>
        </div>
    );
};

export default Payment;