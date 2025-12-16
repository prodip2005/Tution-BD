import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Payment_Success = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo]=useState({})
    const sessionId = searchParams.get('session_id');
    const axiosSecure=useAxiosSecure()
    // console.log(sessionId);
    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`).then(res => {
                console.log(res.data);
                setPaymentInfo({
                    trackingId: res.data.trackingId,
                    transectionId: res.data.transectionId
                })
            })
        }
    },[axiosSecure, sessionId])
    
    return (
        <div>
            <h2 className='text-4xl'>Payment Successful</h2>
            <p>Your Transection ID:{paymentInfo.transectionId}</p>
            <p>Your Tracking ID:{paymentInfo.trackingId}</p>
        </div>
    );
};

export default Payment_Success;