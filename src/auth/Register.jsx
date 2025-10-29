// import { useState } from 'react';
// import { useAuth } from './AuthContext';

// export default function Register({ onClose, switchToLogin }) {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const { register } = useAuth();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match');
//             setLoading(false);
//             return;
//         }

//         if (formData.password.length < 6) {
//             setError('Password must be at least 6 characters');
//             setLoading(false);
//             return;
//         }

//         const result = await register(formData.email, formData.password, formData.name);

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
//                 <h2 className="text-2xl font-bold mb-4">Register</h2>

//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Full Name
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                             required
//                             minLength={6}
//                         />
//                     </div>

//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">
//                             Confirm Password
//                         </label>
//                         <input
//                             type="password"
//                             name="confirmPassword"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                             className="w-full p-2 border rounded"
//                             required
//                         />
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
//                         >
//                             {loading ? 'Creating account...' : 'Register'}
//                         </button>

//                         <button
//                             type="button"
//                             onClick={switchToLogin}
//                             className="text-blue-600 hover:text-blue-800"
//                         >
//                             Already have an account?
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }


// Register.jsx
import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Register({ onClose, switchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Destructure the new function
    const { register, signInWithGoogle } = useAuth(); // <-- UPDATED

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }
        
        // Now calls Firebase-backed register
        const result = await register(formData.email, formData.password, formData.name);

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
                <h2 className="text-2xl font-bold mb-4">Register</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating account...' : 'Register'}
                        </button>

                        <button
                            type="button"
                            onClick={switchToLogin}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Already have an account?
                        </button>
                    </div>
                </form>

                {/* New Google Sign-Up button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
                    >
                        {loading ? 'Signing up with Google...' : 'Sign up with Google'}
                    </button>
                </div>
            </div>
        </div>
    );
}