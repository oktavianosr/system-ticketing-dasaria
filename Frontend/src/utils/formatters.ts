export const formatters = {
    date: (date: string | Date): string => new Date(date).toLocaleDateString(),
    currency: (amount: number): string => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount),
};
