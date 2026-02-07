export const validators = {
    required: (value: any): boolean | string => !!value || 'Required',
    email: (value: string): boolean | string => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email',
};
