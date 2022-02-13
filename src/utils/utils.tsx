export const formatCurrency = (currency: number): string => {
    return `$${currency.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
}