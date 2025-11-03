import { Currency } from '../types';

export const currencies: { [key in Currency]: { symbol: string, name: string, plural: string } } = {
    AED: { symbol: 'AED', name: 'UAE Dirham', plural: 'Dirhams' },
    ARS: { symbol: 'ARS$', name: 'Argentine Peso', plural: 'Pesos' },
    AUD: { symbol: 'A$', name: 'Australian Dollar', plural: 'Dollars' },
    BDT: { symbol: '৳', name: 'Bangladeshi Taka', plural: 'Taka' },
    BRL: { symbol: 'R$', name: 'Brazilian Real', plural: 'Reais' },
    CAD: { symbol: 'CA$', name: 'Canadian Dollar', plural: 'Dollars' },
    CHF: { symbol: 'CHF', name: 'Swiss Franc', plural: 'Francs' },
    CLP: { symbol: 'CLP$', name: 'Chilean Peso', plural: 'Pesos' },
    CNY: { symbol: '¥', name: 'Chinese Yuan', plural: 'Yuan' },
    COP: { symbol: 'COP$', name: 'Colombian Peso', plural: 'Pesos' },
    CZK: { symbol: 'Kč', name: 'Czech Koruna', plural: 'Koruny' },
    DKK: { symbol: 'kr', name: 'Danish Krone', plural: 'Kroner' },
    EGP: { symbol: 'E£', name: 'Egyptian Pound', plural: 'Pounds' },
    EUR: { symbol: '€', name: 'Euro', plural: 'Euros' },
    GBP: { symbol: '£', name: 'British Pound', plural: 'Pounds' },
    GHS: { symbol: 'GH₵', name: 'Ghanaian Cedi', plural: 'Cedis' },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', plural: 'Dollars' },
    HUF: { symbol: 'Ft', name: 'Hungarian Forint', plural: 'Forint' },
    IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', plural: 'Rupiah' },
    ILS: { symbol: '₪', name: 'Israeli New Shekel', plural: 'Shekels' },
    INR: { symbol: '₹', name: 'Indian Rupee', plural: 'Rupees' },
    JPY: { symbol: '¥', name: 'Japanese Yen', plural: 'Yen' },
    KES: { symbol: 'KSh', name: 'Kenyan Shilling', plural: 'Shillings' },
    KRW: { symbol: '₩', name: 'South Korean Won', plural: 'Won' },
    LKR: { symbol: 'Rs', name: 'Sri Lankan Rupee', plural: 'Rupees' },
    MXN: { symbol: 'MX$', name: 'Mexican Peso', plural: 'Pesos' },
    MYR: { symbol: 'RM', name: 'Malaysian Ringgit', plural: 'Ringgit' },
    NGN: { symbol: '₦', name: 'Nigerian Naira', plural: 'Naira' },
    NOK: { symbol: 'kr', name: 'Norwegian Krone', plural: 'Kroner' },
    NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', plural: 'Dollars' },
    OMR: { symbol: 'OMR', name: 'Omani Rial', plural: 'Rials' },
    PEN: { symbol: 'S/', name: 'Peruvian Sol', plural: 'Soles' },
    PHP: { symbol: '₱', name: 'Philippine Peso', plural: 'Pesos' },
    PKR: { symbol: '₨', name: 'Pakistani Rupee', plural: 'Rupees' },
    PLN: { symbol: 'zł', name: 'Polish Złoty', plural: 'Złoty' },
    QAR: { symbol: 'QR', name: 'Qatari Riyal', plural: 'Riyals' },
    RON: { symbol: 'lei', name: 'Romanian Leu', plural: 'Lei' },
    RUB: { symbol: '₽', name: 'Russian Ruble', plural: 'Rubles' },
    SAR: { symbol: 'SAR', name: 'Saudi Riyal', plural: 'Riyals' },
    SEK: { symbol: 'kr', name: 'Swedish Krona', plural: 'Kronor' },
    SGD: { symbol: 'S$', name: 'Singapore Dollar', plural: 'Dollars' },
    THB: { symbol: '฿', name: 'Thai Baht', plural: 'Baht' },
    TRY: { symbol: '₺', name: 'Turkish Lira', plural: 'Lira' },
    UAH: { symbol: '₴', name: 'Ukrainian Hryvnia', plural: 'Hryvnias' },
    USD: { symbol: '$', name: 'US Dollar', plural: 'Dollars' },
    VND: { symbol: '₫', name: 'Vietnamese Dong', plural: 'Dong' },
    ZAR: { symbol: 'R', name: 'South African Rand', plural: 'Rand' },
};

// Approximate conversion rates relative to USD (as of a recent date)
const conversionRates: { [key in Currency]: number } = {
    AED: 3.67,
    ARS: 905,
    AUD: 1.50,
    BDT: 117,
    BRL: 5.4,
    CAD: 1.37,
    CHF: 0.90,
    CLP: 925,
    CNY: 7.25,
    COP: 4100,
    CZK: 23.0,
    DKK: 6.8,
    EGP: 47.5,
    EUR: 0.92,
    GBP: 0.79,
    GHS: 15,
    HKD: 7.8,
    HUF: 365,
    IDR: 16250,
    ILS: 3.7,
    INR: 83.4,
    JPY: 157,
    KES: 130,
    KRW: 1380,
    LKR: 300,
    MXN: 18.5,
    MYR: 4.7,
    NGN: 1480,
    NOK: 10.5,
    NZD: 1.63,
    OMR: 0.38,
    PEN: 3.75,
    PHP: 58.7,
    PKR: 278,
    PLN: 3.95,
    QAR: 3.64,
    RON: 4.6,
    RUB: 88,
    SAR: 3.75,
    SEK: 10.45,
    SGD: 1.35,
    THB: 36.7,
    TRY: 32.8,
    UAH: 40,
    USD: 1,
    VND: 25450,
    ZAR: 18.8,
};

export const availableCurrencies = (Object.keys(currencies) as Currency[]).sort();

export const formatCurrency = (
    amount: number, 
    baseCurrency: Currency, 
    displayCurrency: Currency
) => {
    const amountInBase = amount;
    const baseToUsdRate = 1 / conversionRates[baseCurrency];
    const amountInUsd = amountInBase * baseToUsdRate;
    const amountInDisplay = amountInUsd * conversionRates[displayCurrency];

    const { symbol } = currencies[displayCurrency];
    
    return `${symbol}${amountInDisplay.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const convertCurrency = (amount: number, from: Currency, to: Currency) => {
    const amountInUsd = amount / conversionRates[from];
    return amountInUsd * conversionRates[to];
};