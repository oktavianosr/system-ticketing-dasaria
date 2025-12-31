import React from 'react';
import { useFormContext } from 'react-hook-form';
import InputField from '../shared/InputField';

const FormInput = ({ name, label, type = 'text', ...props }) => {
    const {
        register,
        formState: { errors }
    } = useFormContext();

    // Check if error exists for this field
    const error = errors[name];

    return (
        <InputField
            label={label}
            type={type}
            error={error?.message}
            {...register(name)}
            {...props}
        />
    );
};

export default FormInput;
