import { Currency } from '../types';
import { currencies } from './currency';

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function numberToWords(num: number, currency: Currency): string {
    if (num === 0) return `Zero ${currencies[currency].plural} Only`;
    
    const numToWords = (n: number): string => {
        if (n < 20) return ones[n];
        const digit = n % 10;
        if (n < 100) return tens[Math.floor(n / 10)] + (digit ? ' ' + ones[digit] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 === 0 ? '' : ' ' + numToWords(n % 100));
        if (n < 1000000) return numToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 === 0 ? '' : ' ' + numToWords(n % 1000));
        return '';
    };

    const words = numToWords(Math.floor(num));
    const currencyName = currencies[currency].plural;

    return words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ` ${currencyName} Only`;
}