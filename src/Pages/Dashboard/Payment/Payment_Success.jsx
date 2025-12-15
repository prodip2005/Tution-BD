import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Payment_Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure=useAxiosSecure()
    // console.log(sessionId);
    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`).then(res => {
                console.log(res.data);
                
            })
        }
    },[axiosSecure, sessionId])
    
    return (
        <div>
            <h2 className='text-4xl'>Payment Successful</h2>
        </div>
    );
};

export default Payment_Success;