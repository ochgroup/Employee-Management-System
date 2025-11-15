
import { Role, User, Employee, Department, LeaveRequest, Payroll, Attendance, Announcement, CompanyInfo, Advanced, Resignation, Levy, SalaryProfile, EmployeeLevy } from './types';

export const mockUsers: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@s7.com', password: 'password', role: Role.Admin, avatar: 'https://i.pravatar.cc/150?u=admin' },
    { id: 2, name: 'John Doe', email: 'employee@s7.com', password: 'password', role: Role.User, avatar: 'https://i.pravatar.cc/150?u=user' },
    { id: 3, name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password', role: Role.User, avatar: 'https://i.pravatar.cc/150?u=jane' },
];

export const mockEmployees: Employee[] = [
    { id: 2, username: 'johndoe', password: 'password', firstName: 'John', lastName: 'Doe', email: 'employee@s7.com', department: 'Engineering', salary: 90000, birthday: '1990-05-15', experience: 8, avatar: 'https://i.pravatar.cc/150?u=user', status: 'Active' },
    { id: 3, username: 'janesmith', password: 'password', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', department: 'Marketing', salary: 75000, birthday: '1992-08-22', experience: 6, avatar: 'https://i.pravatar.cc/150?u=jane', status: 'Active' },
    { id: 4, username: 'bob.j', password: 'password', firstName: 'Bob', lastName: 'Johnson', email: 'bob.j@example.com', department: 'Sales', salary: 110000, birthday: '1988-02-10', experience: 12, avatar: 'https://i.pravatar.cc/150?u=bob', status: 'Inactive' },
    { id: 5, username: 'alice.w', password: 'password', firstName: 'Alice', lastName: 'Williams', email: 'alice.w@example.com', department: 'HR', salary: 65000, birthday: '1995-11-30', experience: 4, avatar: 'https://i.pravatar.cc/150?u=alice', status: 'Inactive' },
];

export const mockDepartments: Department[] = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'HR' },
    { id: 4, name: 'Sales' },
];

export const mockLeaveRequests: LeaveRequest[] = [
    { id: 1, employeeId: 2, startDate: '2024-08-01', endDate: '2024-08-05', reason: 'Vacation', status: 'Approved' },
];

export const mockPayroll: Payroll[] = [
    { id: 1, employeeId: 2, month: 7, year: 2024, basicSalary: 1700, overtime: 0, advanced: 0, offDay: 0, otherDeductions: 0, status: 'Paid' },
];

export const mockAttendance: Attendance[] = [
    { id: 1, employeeId: 2, date: '2024-07-25', clockIn: '09:05', clockOut: '17:35', overtime: '' },
    { id: 2, employeeId: 3, date: '2024-07-25', clockIn: '08:58', clockOut: '17:02' },
];

export const mockAnnouncements: Announcement[] = [
    { id: 1, title: 'Summer Picnic Announcement', content: 'Join us for our annual summer picnic on August 15th...', date: '2024-07-20' },
    { id: 2, title: 'Q3 Performance Review', content: 'Performance reviews for the third quarter will beg...', date: '2024-07-18' },
];

export const mockAdvanced: Advanced[] = [
    { id: 1, employeeId: 2, amount: 300, date: '2024-07-15', reason: 'Emergency', status: 'Approved' },
];

export const mockResignations: Resignation[] = [
    { id: 1, employeeId: 5, resignationDate: '2024-07-15', lastWorkingDay: '2024-08-15', reason: 'Found a new opportunity', status: 'Approved' },
];

export const mockLevies: Levy[] = [
    { id: 1, name: 'Federal Tax', percentage: 5, description: 'Standard federal tax deduction' },
    { id: 2, name: 'Social Security', percentage: 2, description: 'Contribution to social security' },
];

export const mockEmployeeLevies: EmployeeLevy[] = [
    { id: 1, employeeId: 2, levyId: 1, month: 7, year: 2024, amount: 85, status: 'Paid' }
];

export const mockSalaryProfiles: SalaryProfile[] = [
    {
        id: 1,
        name: 'Standard Rate',
        rates: {
            monday: 100,
            tuesday: 100,
            wednesday: 100,
            thursday: 100,
            friday: 100,
            saturday: 150,
            sunday: 200
        }
    }
];

export const mockCompanyInfo: CompanyInfo = {
    name: 'STUDIO SEVEN SDN BHD',
    address: '123 Tech Avenue, Silicon Valley, CA 94000',
    logo: '', // Let user upload one
    baseCurrency: 'MYR',
};