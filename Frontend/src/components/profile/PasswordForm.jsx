import React, { useState } from 'react';
import InputField from '../shared/InputField';
import Button from '../shared/Button';
import { userService } from '../../api/services/userService';
import { useUIContext } from '../../context/UIContext';

const PasswordForm = () => {
    const { showAlert } = useUIContext();
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.current_password) {
            newErrors.current_password = 'Current password is required';
        }
        if (!formData.password) {
            newErrors.password = 'New password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await userService.changePassword(formData);
            showAlert('Password updated successfully', 'success');
            setFormData({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            showAlert(error.message || 'Failed to update password', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="Current Password"
                name="current_password"
                type="password"
                value={formData.current_password}
                onChange={handleChange}
                error={errors.current_password}
                placeholder="••••••••"
                fullWidth
            />
            <InputField
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                fullWidth
            />
            <InputField
                label="Confirm New Password"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation}
                placeholder="••••••••"
                fullWidth
            />
            <Button
                type="submit"
                variant="secondary"
                fullWidth
                className="mt-4"
                isLoading={isSubmitting}
            >
                Update Password
            </Button>
        </form>
    );
};

export default PasswordForm;
