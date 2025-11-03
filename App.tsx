import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import MyPayroll from './pages/MyPayroll';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import RoleSelection from './pages/RoleSelection';
import Advanced from './pages/Advanced';
import Resignation from './pages/Resignation';
import { User, Role, CompanyInfo, Currency, Resignation as ResignationType } from './types';
import { mockUsers, mockEmployees, mockDepartments, mockLeaveRequests, mockPayroll, mockAttendance, mockAnnouncements, mockCompanyInfo, mockAdvanced, mockResignations } from './mockData';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  login: (email: string, pass: string, role: Role) => boolean;
  signup: (name: string, email: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  updateUserProfile: (id: number, data: { name: string; email: string; avatar: string }) => void;
  updateUserPassword: (id: number, pass: string) => void;
  employees: typeof mockEmployees;
  departments: typeof mockDepartments;
  leaveRequests: typeof mockLeaveRequests;
  payroll: typeof mockPayroll;
  attendance: typeof mockAttendance;
  announcements: typeof mockAnnouncements;
  advanced: typeof mockAdvanced;
  resignations: typeof mockResignations;
  setEmployees: React.Dispatch<React.SetStateAction<typeof mockEmployees>>;
  setDepartments: React.Dispatch<React.SetStateAction<typeof mockDepartments>>;
  setLeaveRequests: React.Dispatch<React.SetStateAction<typeof mockLeaveRequests>>;
  setPayroll: React.Dispatch<React.SetStateAction<typeof mockPayroll>>;
  setAttendance: React.Dispatch<React.SetStateAction<typeof mockAttendance>>;
  setAnnouncements: React.Dispatch<React.SetStateAction<typeof mockAnnouncements>>;
  setAdvanced: React.Dispatch<React.SetStateAction<typeof mockAdvanced>>;
  setResignations: React.Dispatch<React.SetStateAction<typeof mockResignations>>;
  companyInfo: CompanyInfo;
  updateCompanyInfo: (data: CompanyInfo) => void;
  displayCurrency: Currency;
  setDisplayCurrency: React.Dispatch<React.SetStateAction<Currency>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const getInitialState = <T,>(key: string, fallback: T): T => {
  try {
    const storedItem = localStorage.getItem(key);
    return storedItem ? JSON.parse(storedItem) : fallback;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return fallback;
  }
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [user, setUser] = useState<User | null>(() => getInitialState('user', null));
  const [users, setUsers] = useState<User[]>(() => getInitialState('users', mockUsers));
  
  // Mock data states
  const [employees, setEmployees] = useState(() => getInitialState('employees', mockEmployees));
  const [departments, setDepartments] = useState(() => getInitialState('departments', mockDepartments));
  const [leaveRequests, setLeaveRequests] = useState(() => getInitialState('leaveRequests', mockLeaveRequests));
  const [payroll, setPayroll] = useState(() => getInitialState('payroll', mockPayroll));
  const [attendance, setAttendance] = useState(() => getInitialState('attendance', mockAttendance));
  const [announcements, setAnnouncements] = useState(() => getInitialState('announcements', mockAnnouncements));
  const [advanced, setAdvanced] = useState(() => getInitialState('advanced', mockAdvanced));
  const [resignations, setResignations] = useState(() => getInitialState('resignations', mockResignations));
  const [companyInfo, setCompanyInfo] = useState(() => getInitialState('companyInfo', mockCompanyInfo));
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(() => getInitialState('displayCurrency', 'USD'));
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  // Persist state to localStorage
  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('departments', JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests)); }, [leaveRequests]);
  useEffect(() => { localStorage.setItem('payroll', JSON.stringify(payroll)); }, [payroll]);
  useEffect(() => { localStorage.setItem('attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('advanced', JSON.stringify(advanced)); }, [advanced]);
  useEffect(() => { localStorage.setItem('resignations', JSON.stringify(resignations)); }, [resignations]);
  useEffect(() => { localStorage.setItem('companyInfo', JSON.stringify(companyInfo)); }, [companyInfo]);
  useEffect(() => { localStorage.setItem('displayCurrency', JSON.stringify(displayCurrency)); }, [displayCurrency]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = (email: string, pass: string, role: Role): boolean => {
      const foundUser = users.find(u => u.email === email && u.password === pass && u.role === role);
      if (foundUser) {
          setUser(foundUser);
          return true;
      }
      return false;
  };
  
  const signup = (name: string, email: string, pass: string): { success: boolean; message: string } => {
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return { success: false, message: "An account with this email already exists." };
    }
    const newUser: User = {
        id: Date.now(),
        name,
        email,
        password: pass,
        role: Role.User,
        avatar: `https://i.pravatar.cc/150?u=${email}`
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, message: "Account created successfully! You can now log in." };
  };

  const logout = () => {
      setUser(null);
  };

  const updateUserProfile = (id: number, data: { name: string; email: string; avatar: string }) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
    if (user && user.id === id) {
        setUser(currentUser => currentUser ? { ...currentUser, ...data } : null);
    }
  };

  const updateUserPassword = (id: number, pass: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, password: pass } : u));
    if (user && user.id === id) {
        setUser(currentUser => currentUser ? { ...currentUser, password: pass } : null);
    }
  };

  const updateCompanyInfo = (data: CompanyInfo) => {
    setCompanyInfo(data);
  };

  const appContextValue = useMemo(() => ({
    theme,
    toggleTheme,
    user,
    login,
    signup,
    logout,
    updateUserProfile,
    updateUserPassword,
    employees,
    departments,
    leaveRequests,
    payroll,
    attendance,
    announcements,
    advanced,
    resignations,
    setEmployees,
    setDepartments,
    setLeaveRequests,
    setPayroll,
    setAttendance,
    setAnnouncements,
    setAdvanced,
    setResignations,
    companyInfo,
    updateCompanyInfo,
    displayCurrency,
    setDisplayCurrency
  }), [theme, user, employees, departments, leaveRequests, payroll, attendance, announcements, users, companyInfo, displayCurrency, advanced, resignations]);

  return (
    <AppContext.Provider value={appContextValue}>
      <HashRouter>
        <Routes>
          {user ? (
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="departments" element={<Departments />} />
              <Route path="leave" element={<Leave />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="my-payroll" element={<MyPayroll />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="profile" element={<Profile />} />
              <Route path="resignation" element={<Resignation />} />
              {user.role === Role.Admin && <Route path="advanced" element={<Advanced />} />}
              {user.role === Role.Admin && <Route path="settings" element={<Settings />} />}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          ) : (
            <>
              <Route path="/login/:role" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<RoleSelection />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;