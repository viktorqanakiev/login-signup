//import React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Signup from './views/Signup';
import Users from './views/Users';
import Login from './views/Login';
import UserNotFound from './views/UserNotFound';
import DefaultLayout from './assets/components/DefaultLayout';
import GuestLayout from './assets/components/GuestLayout';
import DashBoard from './views/Dashboard';
const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to={"/users"} />
            },

            {
                path: '/users',
                element: <Users />
            },
            {
                path: '/dashboard',
                element: <DashBoard />
            },    
        ]
    },

    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    },
   
    {
        path: '/*',
        element: <UserNotFound />
    }

])

export default router;

