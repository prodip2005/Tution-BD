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
import TutorRoute from "../Private/TutorRoute";
import StudentRoute from "../Private/StudentRoute";
import AdminRoute from "../Private/AdminRoute";

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
                element:
                    <PrivateRoute>
                        <UpdateUserProfile></UpdateUserProfile>
                </PrivateRoute>
            },
            {
                path: "/tutors/:email",
                element: <TutorDetails />
            },
            {
                path: '/apply-tutor',
                element:
                    <StudentRoute>
                        <ApplyTutor></ApplyTutor>
                </StudentRoute>
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
                element:
                    <StudentRoute>
                        <PostTutions></PostTutions>
                    </StudentRoute>
            },
            {
                path: 'applications',
                element:
                    <TutorRoute>
                        <My_Applications></My_Applications>
                    </TutorRoute>
            },
            {
                path: 'applied-tutions',
                element:
                    <StudentRoute>
                        <Applied_Tutions></Applied_Tutions>
                    </StudentRoute>
            },
            {
                path: 'payment/:applicationId',
                Component: Payment
            },
            {
                path: 'payment-success',
                Component: Payment_Success
            },
            {
                path: 'payment-cancelled',
                Component: Payment_Cancelled
            },
            {
                path: 'payment-history',
                element:
                    <StudentRoute>
                        <PaymentHistory></PaymentHistory>
                    </StudentRoute>
            },
            {
                path: 'tutor-payment',
                element:
                    <TutorRoute>
                        <TutorPaymentHistory></TutorPaymentHistory>
                </TutorRoute>
            },
            {
                path: 'my-tutions',
                element:
                    <StudentRoute>
                        <MyTutioins></MyTutioins>
                    </StudentRoute>
            },
            {
                path: 'all-users',
                element:
                    <AdminRoute>
                        <AllUsers></AllUsers>
                    </AdminRoute>
               
            },
            {
                path: 'applied-tutor',
                element:
                    <AdminRoute>
                        <AppliedTutor></AppliedTutor>
                    </AdminRoute>
            },
            {
                path: 'apply-tution',
                element:
                    <AdminRoute>
                        <ApplyTution></ApplyTution>
                    </AdminRoute>
            }
        ]
    }
])
export default router;

