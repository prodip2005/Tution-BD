import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { AuthContext } from '../../../Providers/AuthContext';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentHistory = () => {
    const { user } = useContext(AuthContext)
    const axiosSecure = useAxiosSecure()
    const { data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data
        }
    })
    return (
        <div>
            <h2 className="text-5xl">Payment History: {payments.length}</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Subject</th>
                            <th>Amount</th>
                            <th>Transection ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            payments.map((payment,index) =>
                                <tr key={payment._id}>
                                    <th>{index+1}</th>
                                    <td>{payment.subjectName}</td>
                                    <td>${payment.amount}</td>
                                    <td>{payment.transectionId}</td>
                                </tr>
                            )
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;