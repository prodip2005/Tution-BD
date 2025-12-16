import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase/firebase.init';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();

    const Register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }


    const LogOut = () => {
        return signOut(auth)
    }

    const SignIn = (email, password) => {
        return signInWithEmailAndPassword(auth,email,password)
    }

    const GoogleSignIn = () => {
        return signInWithPopup(auth, googleProvider);
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false)
            console.log(currentUser);
            
        })

        return () => {
            unsubscribe()
        }
    }, [])

    const authInfo = {
        user,
        loading,
        Register,
        LogOut,
        SignIn,
        GoogleSignIn,
    }


    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    )

};

export default AuthProvider;