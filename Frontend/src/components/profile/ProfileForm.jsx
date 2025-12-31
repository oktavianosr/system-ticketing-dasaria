import React, { useState, useEffect } from 'react';
import InputField from '../shared/InputField';
import Button from '../shared/Button';
import { userService } from '../../api/services/userService';
import { useUIContext } from '../../context/UIContext';

const ProfileForm = ({ user, onUpdate }) => {
    const { showAlert } = useUIContext();
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                phone: user.phone
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await userService.updateProfile(formData);
            showAlert('Profile updated successfully', 'success');
            if (onUpdate) onUpdate();
        } catch (error) {
            showAlert(error.message || 'Failed to update profile', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                fullWidth
            />
            <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62 812 3456 7890"
                fullWidth
            />
            <Button
                type="submit"
                variant="primary"
                fullWidth
                className="mt-4"
                isLoading={isSubmitting}
            >
                Save Changes
            </Button>
        </form>
    );
};

export default ProfileForm;
