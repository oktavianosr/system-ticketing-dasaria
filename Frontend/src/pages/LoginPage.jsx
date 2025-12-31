import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/shared/InputField';
import Button from '../components/shared/Button';
import { useUIContext } from '../context/UIContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showAlert } = useUIContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email must be filled';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Format email is not valid';
        }

        if (!password) {
            newErrors.password = 'Password must be filled';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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

        setIsLoading(true);
        setErrors({});
        setFormError('');

        try {
            const data = await login(email, password);
            if (data) {
                showAlert(data.message, 'success');
                navigate('/tickets');
            }
        } catch (error) {
            showAlert(error.message || 'Login failed. Please check your email and password.', 'error');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4 border" style={{ backgroundImage: 'url("https://wallpaperaccess.com/full/656665.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            className="mt-2"
                            isLoading={isLoading}
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