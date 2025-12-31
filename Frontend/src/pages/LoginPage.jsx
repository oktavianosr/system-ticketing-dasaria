import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/shared/InputField';
import Button from '../components/shared/Button';
import Loading from '../components/shared/LoadingSpinner';
import { useUIContext } from '../context/UIContext';

const LoginPage = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const { showAlert } = useUIContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!password) {
            newErrors.password = 'Password wajib diisi';
        } else if (password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setFormError('');

        try {
            const data = await login(email, password);
            if (data) {
                showAlert(data.message, 'success');
                setTimeout(() => {
                    navigate('/tickets');
                }, 1500);
            }
        } catch (error) {
            showAlert(error.message || 'Login gagal. Cek kembali email dan password Anda.');
        }
    };

    if (isLoading) {
        return <Loading fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4 border">
            <div className="w-full max-w-md ">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        Sign in to your Ticketing System account
                    </p>
                </div>

                {/* Login Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-black-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <InputField
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors(prev => ({ ...prev, email: '' }));
                                    }
                                }}
                                error={errors.email}
                                fullWidth
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <InputField
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors(prev => ({ ...prev, password: '' }));
                                    }
                                }}
                                error={errors.password}
                                fullWidth
                            />
                        </div>

                        {formError && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{formError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            className="mt-2"
                        >
                            Sign In
                        </Button>
                    </form>

                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Ticketing System. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;