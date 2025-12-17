import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router'; 
import Footer from '../components/Footer';
import ScrollProgress from '../Animation/ScrollProgress';

const RootLayout = () => {
   
    return (
        <div className='min-h-screen flex flex-col overflow-x-hidden'>
            <div className='sticky top-0 z-50'>
                <ScrollProgress />
                <Navbar />
            </div>

            <div className='flex-1'>
                <Outlet />
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default RootLayout;
