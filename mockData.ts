import { Role, User, Employee, Department, LeaveRequest, Payroll, Attendance, Announcement, CompanyInfo, Advanced, Resignation } from './types';

export const mockUsers: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', password: 'password', role: Role.Admin, avatar: 'https://i.pravatar.cc/150?u=admin' },
    { id: 2, name: 'John Doe', email: 'user@example.com', password: 'password', role: Role.User, avatar: 'https://i.pravatar.cc/150?u=user' },
    { id: 3, name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password', role: Role.User, avatar: 'https://i.pravatar.cc/150?u=jane' },
    { id: 4, name: 'Och Group', email: 'ochgroup@yahoo.com', password: 'password', role: Role.User, avatar: 'https://i.pravatar.cc/150?u=ochgroup' }
];

export const mockEmployees: Employee[] = [
    { id: 2, username: 'johndoe', password: 'password', firstName: 'John', lastName: 'Doe', email: 'user@example.com', department: 'Engineering', salary: 90000, birthday: '1990-05-15', experience: 8, avatar: 'https://i.pravatar.cc/150?u=user', status: 'Active' },
    { id: 3, username: 'janesmith', password: 'password', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', department: 'Marketing', salary: 75000, birthday: '1992-08-22', experience: 6, avatar: 'https://i.pravatar.cc/150?u=jane', status: 'Active' },
    { id: 4, username: 'bob.j', password: 'password', firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@example.com', department: 'Engineering', salary: 110000, birthday: '1988-02-10', experience: 12, avatar: 'https://i.pravatar.cc/150?u=bob', status: 'Active' },
    { id: 5, username: 'alice.w', password: 'password', firstName: 'Alice', lastName: 'Williams', email: 'alice.w@example.com', department: 'HR', salary: 65000, birthday: '1995-11-30', experience: 4, avatar: 'https://i.pravatar.cc/150?u=alice', status: 'Inactive' },
    { id: 6, username: 'ochgroup', password: 'password', firstName: 'Och', lastName: 'Group', email: 'ochgroup@yahoo.com', department: 'Sales', salary: 70000, birthday: '1993-04-12', experience: 5, avatar: 'https://i.pravatar.cc/150?u=ochgroup', status: 'Active' },
];

export const mockDepartments: Department[] = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'HR' },
    { id: 4, name: 'Sales' },
];

export const mockLeaveRequests: LeaveRequest[] = [
    { id: 1, employeeId: 2, startDate: '2024-08-01', endDate: '2024-08-05', reason: 'Vacation', status: 'Approved' },
    { id: 2, employeeId: 3, startDate: '2024-08-10', endDate: '2024-08-11', reason: 'Sick leave', status: 'Pending' },
    { id: 3, employeeId: 4, startDate: '2024-07-20', endDate: '2024-07-22', reason: 'Personal', status: 'Rejected' },
];

export const mockPayroll: Payroll[] = [
    { id: 1, employeeId: 2, month: 7, year: 2024, basicSalary: 7500, overtime: 250, advanced: 500, offDay: 0, otherDeductions: 0, status: 'Paid' },
    { id: 2, employeeId: 3, month: 7, year: 2024, basicSalary: 6250, overtime: 0, advanced: 0, offDay: 150, otherDeductions: 0, status: 'Paid' },
    { id: 3, employeeId: 4, month: 7, year: 2024, basicSalary: 9167, overtime: 500, advanced: 1000, offDay: 0, otherDeductions: 0, status: 'Paid' },
    { id: 4, employeeId: 2, month: 8, year: 2024, basicSalary: 7500, overtime: 0, advanced: 0, offDay: 0, otherDeductions: 0, status: 'Pending' },
];

export const mockAttendance: Attendance[] = [
    { id: 1, employeeId: 2, date: '2024-07-25', clockIn: '09:05', clockOut: '17:35', overtime: '30m' },
    { id: 2, employeeId: 3, date: '2024-07-25', clockIn: '08:58', clockOut: '17:02' },
    { id: 3, employeeId: 4, date: '2024-07-25', clockIn: '09:00', clockOut: '18:00', overtime: '1h 0m' },
];

export const mockAnnouncements: Announcement[] = [
    { id: 1, title: 'Summer Picnic Announcement', content: 'Join us for our annual summer picnic on August 15th at Central Park. Fun, food, and games for everyone!', date: '2024-07-20' },
    { id: 2, title: 'Q3 Performance Review', content: 'Performance reviews for the third quarter will begin next week. Please schedule a meeting with your manager.', date: '2024-07-18' },
];

export const mockAdvanced: Advanced[] = [
    { id: 1, employeeId: 2, amount: 500, date: '2024-07-15', reason: 'Emergency', status: 'Approved' },
    { id: 2, employeeId: 4, amount: 1000, date: '2024-07-20', reason: 'Travel', status: 'Repaid' },
    { id: 3, employeeId: 3, amount: 200, date: '2024-08-01', reason: 'Personal', status: 'Pending' },
];

export const mockResignations: Resignation[] = [
    { id: 1, employeeId: 5, resignationDate: '2024-07-15', lastWorkingDay: '2024-08-15', reason: 'Found a new opportunity', status: 'Approved' },
    { id: 2, employeeId: 3, resignationDate: '2024-08-01', lastWorkingDay: '2024-08-31', reason: 'Personal reasons', status: 'Pending' },
];

export const mockCompanyInfo: CompanyInfo = {
    name: 'HR-Portal',
    address: '123 Tech Avenue, Silicon Valley, CA 94000',
    logo: '', // Let user upload one
    baseCurrency: 'USD',
};