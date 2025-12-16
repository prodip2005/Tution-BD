import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react';
import { AuthContext } from '../../../Providers/AuthContext';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const TutorPaymentHistory = () => {
    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { isLoading, data: payments = [] } = useQuery({
        queryKey: ['tutor-payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading payment history...</p>;
    }

    const tutorPayments = payments.filter(
        payment => payment.tutorEmail === user.email
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
                💰 Tutor Payment History
            </h2>

            {
                tutorPayments.length === 0 ? (
                    <p className="text-gray-500">No payments found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Subject</th>
                                    <th>Student Name</th> {/* ✅ */}
                                    <th>Student Email</th>
                                    <th>Amount</th>
                                    <th>Transaction ID</th> {/* ✅ */}
                                    <th>Tracking ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tutorPayments.map((payment, index) => (
                                        <tr key={payment._id}>
                                            <td>{index + 1}</td>
                                            <td>{payment.subjectName}</td>
                                            <td>{payment.studentName || 'N/A'}</td> {/* ✅ */}
                                            <td>{payment.customerEmail}</td>
                                            <td>৳ {payment.amount}</td>
                                            <td className="font-mono text-xs">
                                                {payment.transectionId}
                                            </td>
                                            <td className="font-mono text-xs">
                                                {payment.trackingId}
                                            </td>
                                            <td>
                                                {new Date(payment.paidAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <span className="badge badge-success">
                                                    {payment.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
    );
};

export default TutorPaymentHistory;
