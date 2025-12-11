import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../components/Home/Home";
import Tutions from "../Pages/Tutions";
import Tutors from "../Pages/Tutors";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import Login from "../Pages/Login";
import RegistrationForm from "../Pages/Registration";

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component:Home
            },
            {
                path: '/tutions',
                Component:Tutions,
            },
            {
                path: '/tutors',
                Component:Tutors,
            },
            {
                path: '/about',
                Component:About
            },
            {
                path: '/contact',
                Component:Contact
            },
            {
                path: '/login',
                Component:Login
            },
            {
                path: '/register',
                Component:RegistrationForm,
            }
        ]
    }
])
export default router;

