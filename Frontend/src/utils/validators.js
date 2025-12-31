export const validators = {
    required: (value) => !!value || 'Required',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email',
};
