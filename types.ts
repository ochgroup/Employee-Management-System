export enum Role {
    Admin = 'Admin',
    User = 'User',
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: Role;
    avatar: string;
}

export type Currency =
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'INR'
  | 'BRL' | 'RUB' | 'ZAR' | 'MXN' | 'SGD' | 'HKD' | 'NOK' | 'SEK' | 'KRW'
  | 'TRY' | 'NZD' | 'IDR' | 'THB' | 'PHP' | 'DKK' | 'PLN' | 'HUF' | 'CZK'
  | 'ILS' | 'CLP' | 'ARS' | 'COP' | 'SAR' | 'AED' | 'MYR' | 'VND' | 'NGN'
  | 'EGP' | 'PKR' | 'BDT' | 'LKR' | 'UAH' | 'RON' | 'KES' | 'GHS' | 'PEN'
  | 'QAR' | 'OMR';


export interface CompanyInfo {
    name: string;
    address: string;
    logo: string;
    baseCurrency: Currency;
}

export interface Employee {
    id: number;
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    salary: number; // Annual
    birthday: string;
    experience: number;
    avatar: string;
    status: 'Active' | 'Inactive' | 'Pending';
}

export interface Department {
    id: number;
    name: string;
}

export interface LeaveRequest {
    id: number;
    employeeId: number;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Payroll {
    id: number;
    employeeId: number;
    month: number;
    year: number;
    // Earnings
    basicSalary: number;
    overtime: number;
    // Deductions
    advanced: number;
    offDay: number;
    otherDeductions: number;
    status: 'Pending' | 'Paid';
}

export interface Attendance {
    id: number;
    employeeId: number;
    date: string;
    clockIn: string;
    clockOut: string;
    overtime?: string;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
}

export interface Advanced {
    id: number;
    employeeId: number;
    amount: number;
    date: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Repaid' | 'Rejected';
}

export interface Resignation {
    id: number;
    employeeId: number;
    resignationDate: string;
    lastWorkingDay: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}