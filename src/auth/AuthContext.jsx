// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [token, setToken] = useState(localStorage.getItem('token'));

//     useEffect(() => {
//         if (token) {
//             verifyToken();
//         } else {
//             setLoading(false);
//         }
//     }, [token]);

//     const verifyToken = async () => {
//         try {
//             // const response = await fetch('https://lexis.ravenex.in/api/me', {
//             const response = await fetch('http://localhost:8000/me', {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (response.ok) {
//                 const userData = await response.json();
//                 setUser(userData);
//             } else {
//                 logout();
//             }
//         } catch (error) {
//             console.error('Token verification failed:', error);
//             logout();
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (email, password) => {
//         try {
//             // const response = await fetch('https://lexis.ravenex.in/api/login', {
//             const response = await fetch('http://localhost:8000/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email, password }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'Login failed');
//             }

//             const data = await response.json();
//             localStorage.setItem('token', data.access_token);
//             setToken(data.access_token);
//             setUser(data.user);
//             return { success: true };
//         } catch (error) {
//             return { success: false, error: error.message };
//         }
//     };

//     const register = async (email, password, name) => {
//         try {
//             // const response = await fetch('https://lexis.ravenex.in/api/register', {
//             const response = await fetch('http://localhost:8000/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email, password, name }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.detail || 'Registration failed');
//             }

//             const data = await response.json();
//             localStorage.setItem('token', data.access_token);
//             setToken(data.access_token);
//             setUser(data.user);
//             return { success: true };
//         } catch (error) {
//             return { success: false, error: error.message };
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         setToken(null);
//         setUser(null);
//     };

//     const value = {
//         user,
//         login,
//         register,
//         logout,
//         token,
//         loading
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// // Create a custom hook for using auth context
// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// }


import { createContext, useContext, useState, useEffect } from 'react';
// Import Firebase functions
import {
    auth,
    googleProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // token now holds the Firebase ID token for backend API access
    const [token, setToken] = useState(null);

    // 1. Firebase Auth State Listener (Replaces token verification)
    useEffect(() => {
        // This listener fires on mount, and whenever a user signs in or out
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email // Use email as fallback
                });

                // 🔥 IMPORTANT: Fetch the Firebase ID Token to secure your custom backend
                firebaseUser.getIdToken().then(idToken => {
                    setToken(idToken); // Set the Firebase ID token
                });

            } else {
                // User is signed out
                setUser(null);
                setToken(null);
                // localStorage.removeItem('token'); // Removed, as we don't rely on localStorage token anymore
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Removed verifyToken function, as onAuthStateChanged handles user state.

    // 2. Firebase Email/Password Login
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged listener handles setting user and token
            return { success: true };
        } catch (error) {
            console.error('Firebase Login Failed:', error);
            const errorMessage = error.code.replace('auth/', '').replace(/-/g, ' ');
            return { success: false, error: errorMessage };
        }
    };

    // 3. Firebase Email/Password Register
    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            const idToken = await userCredential.user.getIdToken();

            // ✅ Better error handling for backend registration
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });

            if (!response.ok) {
                throw new Error('Backend registration failed');
            }

            return { success: true };
        } catch (error) {
            console.error('Firebase Registration Failed:', error);

            // ✅ If Firebase succeeds but backend fails, we have inconsistent state
            // Consider rolling back Firebase user creation
            if (auth.currentUser) {
                await auth.currentUser.delete();
            }

            const errorMessage = error.code?.replace('auth/', '').replace(/-/g, ' ') || error.message;
            return { success: false, error: errorMessage };
        }
    };

    // 4. Firebase Google Sign-In with Popup
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // onAuthStateChanged listener handles setting user and token
            return { success: true };
        } catch (error) {
            console.error('Google Sign-In Failed:', error);
            const errorMessage = error.code.replace('auth/', '').replace(/-/g, ' ');
            return { success: false, error: errorMessage };
        }
    };

    // 5. Firebase Logout
    const logout = async () => {
        try {
            await signOut(auth); // Firebase sign out
        } catch (error) {
            console.error('Firebase Sign Out Failed:', error);
        }
        // onAuthStateChanged will handle state updates (setUser(null), setToken(null))
    };

    const value = {
        user,
        login,
        register,
        logout,
        signInWithGoogle,
        token, // Your Firebase ID token for securing backend calls
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Create a custom hook for using auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}