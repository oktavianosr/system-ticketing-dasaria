export const formatters = {
    date: (date) => new Date(date).toLocaleDateString(),
    currency: (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount),
};
