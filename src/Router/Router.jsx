import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../components/Home/Home";
import Tutions from "../Pages/Tutions";
import Tutors from "../Pages/Tutors";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import Login from "../Pages/Login";
import RegistrationForm from "../Pages/Registration";
import PrivateRoute from "../Private/PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import UpdateUserProfile from "../Pages/UpdateUserProfile";
import PostTutions from "../Pages/Dashboard/PostTutions";
import TutorDetails from "../components/TutorDetails";
import My_Applications from "../Pages/Dashboard/My_Applications";
import Applied_Tutions from "../Pages/Dashboard/Applied_Tutions";
import Payment from "../Pages/Dashboard/Payment/Payment";
import Payment_Success from "../Pages/Dashboard/Payment/Payment_Success";
import Payment_Cancelled from "../Pages/Dashboard/Payment/Payment_Cancelled";
import PaymentHistory from "../Pages/Dashboard/Payment/PaymentHistory";
import TutorPaymentHistory from "../Pages/Dashboard/Payment/TutorPaymentHistory";
import MyTutioins from "../Pages/Dashboard/MyTutioins";
import AllUsers from "../Pages/Dashboard/AllUsers";
import ApplyTutor from "../components/ApplyTutor";
import AppliedTutor from "../Pages/Dashboard/AppliedTutor";
import ApplyTution from "../Pages/Dashboard/ApplyTution";

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/tutions',
                Component: Tutions,
            },
            {
                path: '/tutors',
                Component: Tutors,
            },
            {
                path: '/about',
                Component: About
            },
            {
                path: '/contact',
                element: <Contact></Contact>

            },
            {
                path: '/login',
                Component: Login
            },
            {
                path: '/register',
                Component: RegistrationForm,
            },
            {
                path: '/updateUserProfile',
                Component: UpdateUserProfile
            },
            {
                path: "/tutors/:email",
                element: <TutorDetails />
            },
            {
                path: '/apply-tutor',
                Component:ApplyTutor
            }

        ]
    },
    {
        path: 'dashboard',
        element:
            <PrivateRoute>
                <Dashboard></Dashboard>
            </PrivateRoute>,
        children: [
            {
                path: 'post-tutions',
                Component: PostTutions
            },
            {
                path: 'applications',
                Component:My_Applications
            },
            {
                path: 'applied-tutions',
                Component:Applied_Tutions
            },
            {
                path: 'payment/:applicationId',
                Component:Payment
            },
            {
                path: 'payment-success',
                Component:Payment_Success
            },
            {
                path: 'payment-cancelled',
                Component:Payment_Cancelled
            },
            {
                path: 'payment-history',
                Component:PaymentHistory
            },
            {
                path: 'tutor-payment',
                Component:TutorPaymentHistory
            },
            {
                path: 'my-tutions',
                Component:MyTutioins
            },
            {
                path: 'all-users',
                Component:AllUsers
            },
            {
                path: 'applied-tutor',
                Component:AppliedTutor
            },
            {
                path: 'apply-tution',
                Component:ApplyTution
            }
        ]
    }
])
export default router;

