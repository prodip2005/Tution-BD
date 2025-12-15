import React from 'react';
import { Link } from 'react-router';

const Payment_Cancelled = () => {
    return (
        <div>
            <h2>Payment Cancelled. Please Try Again</h2>
            <Link to={'/dashboard/applied-tutions'}>
            <button className='btn btn-primary text-white'>Try again</button>
            </Link>
        </div>
    );
};

export default Payment_Cancelled;