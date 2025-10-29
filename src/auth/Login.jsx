// import { useState } from 'react';
// import { useAuth } from './AuthContext';

// export default function Login({ onClose, switchToRegister }) {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const { login } = useAuth();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         const result = await login(email, password);

//         if (result.success) {
//             onClose();
//         } else {
//             setError(result.error);
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-96">
//                 <h2 className="text-2xl font-bold mb-4">Login</h2>

//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//                         >
//                             {loading ? 'Logging in...' : 'Login'}
//                         </button>

//                         <button
//                             type="button"
//                             onClick={switchToRegister}
//                             className="text-blue-600 hover:text-blue-800"
//                         >
//                             Need an account?
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }



// Login.jsx
import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Login({ onClose, switchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Destructure the new function
    const { login, signInWithGoogle } = useAuth(); // <-- UPDATED

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    // New handler for Google login
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        const result = await signInWithGoogle();

        if (result.success) {
            onClose();
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        <button
                            type="button"
                            onClick={switchToRegister}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Need an account?
                        </button>
                    </div>
                </form>

                {/* New Google Sign-In button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 mb-4 disabled:opacity-50"
                    >
                        {loading ? <><img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                            Signing in with Google...</> : <><img
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Continue with Google</>}
                    </button>
                </div>
            </div>
        </div>
    );
}