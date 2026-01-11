import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaChalkboardTeacher, FaCheckCircle, FaStar } from 'react-icons/fa';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

const StatsSection = () => {
    const axiosPublic = useAxiosPublic();
    const [statsData, setStatsData] = useState({
        students: 0,
        tutors: 0,
        successRate: '98%',
        rating: '4.9'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axiosPublic.get('/users');
                const students = data.users?.filter(u => u.role === 'student').length || 0;
                const tutors = data.users?.filter(u => u.role === 'tutor').length || 0;
                setStatsData(prev => ({
                    ...prev,
                    students: students > 0 ? `${students}+` : '0',
                    tutors: tutors > 0 ? `${tutors}+` : '0'
                }));
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [axiosPublic]);

    const stats = [
        { icon: <FaUserGraduate />, count: statsData.students, label: 'Active Students' },
        { icon: <FaChalkboardTeacher />, count: statsData.tutors, label: 'Expert Tutors' },
        { icon: <FaCheckCircle />, count: statsData.successRate, label: 'Success Rate' },
        { icon: <FaStar />, count: statsData.rating, label: 'Average Rating' },
    ];

    return (
        <div className="py-16 bg-transparent">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center p-6 rounded-3xl bg-base-200 dark:bg-white/5 backdrop-blur-sm border border-base-300 dark:border-white/5 hover:border-primary/50 transition-all hover:-translate-y-1"
                        >
                            <div className="text-4xl text-primary mb-4 flex justify-center">{stat.icon}</div>
                            <h3 className="text-3xl font-black mb-2 text-base-content">
                                {loading ? <span className="loading loading-spinner text-primary loading-md"></span> : stat.count}
                            </h3>
                            <p className="text-base-content/60 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
