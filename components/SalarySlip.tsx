import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Payroll, Employee, CompanyInfo } from '../types';
import { formatCurrency } from '../utils/currency';
import { numberToWords } from '../utils/numberToWords';

interface SalarySlipProps {
    payroll: Payroll;
    employee: Employee;
    companyInfo: CompanyInfo;
}

const SalarySlip: React.FC<SalarySlipProps> = ({ payroll, employee, companyInfo }) => {

    const earnings = {
        'Basic Salary': payroll.basicSalary,
        'Over Time': payroll.overtime,
    };
    const totalEarnings = Object.values(earnings).reduce((acc, val) => acc + val, 0);

    const deductions = {
        'Advanced': payroll.advanced,
        'Off Day': payroll.offDay,
        'Other Deductions': payroll.otherDeductions,
    };
    const totalDeductions = Object.values(deductions).reduce((acc, val) => acc + val, 0);

    const netSalary = totalEarnings - totalDeductions;
    
    const salaryInWords = numberToWords(netSalary, companyInfo.baseCurrency);
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const payrollMonth = `${monthNames[payroll.month - 1]} ${payroll.year}`;

    const handleDownloadPdf = () => {
        const slipContent = document.getElementById('salary-slip-content');
        if (!slipContent) {
            console.error("Salary slip content element not found!");
            return;
        }

        const buttonContainer = slipContent.querySelector('.no-print');

        // Temporarily hide the button container
        if (buttonContainer instanceof HTMLElement) {
            buttonContainer.style.display = 'none';
        }

        // Handle dark theme for consistent PDF
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
        }

        html2canvas(slipContent, { scale: 2, useCORS: true })
            .then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                // Maintain aspect ratio
                const canvasAspectRatio = canvas.height / canvas.width;
                
                // Set width to fit A4 with margins, this will make the content larger
                const contentWidth = pdfWidth - 20; // 10mm margin on each side
                const contentHeight = contentWidth * canvasAspectRatio;
                
                // Center vertically if it fits, otherwise align to top
                const topMargin = contentHeight < pdfHeight - 20 ? (pdfHeight - contentHeight) / 2 : 10;

                pdf.addImage(imgData, 'JPEG', 10, topMargin, contentWidth, contentHeight);
                const payrollMonthForFile = `${monthNames[payroll.month - 1]}_${payroll.year}`;
                pdf.save(`SalarySlip_${employee.firstName}_${employee.lastName}_${payrollMonthForFile}.pdf`);
            })
            .catch(err => {
                console.error("Failed to generate PDF:", err);
            })
            .finally(() => {
                // Restore button container visibility
                if (buttonContainer instanceof HTMLElement) {
                    buttonContainer.style.display = 'block';
                }
                // Restore theme
                if (isDark) {
                    document.documentElement.classList.add('dark');
                }
            });
    };

    return (
        <div id="salary-slip-content" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-6 printable-content">
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .printable-content, .printable-content * {
                        visibility: visible;
                    }
                    .printable-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none;
                    }
                }
                `}
            </style>
            <div className="text-center mb-6">
                 {companyInfo.logo && <img src={companyInfo.logo} alt="Company Logo" className="w-20 h-20 mx-auto mb-2 object-contain" />}
                <h2 className="text-2xl font-bold">{companyInfo.name}</h2>
                <p className="text-sm">{companyInfo.address}</p>
                <h3 className="text-lg font-semibold mt-4">Payslip for {payrollMonth}</h3>
            </div>
            
            <div className="border-y border-slate-300 dark:border-slate-600 py-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p><strong>Employee ID:</strong> {employee.id.toString().padStart(4, '0')}</p>
                    <p><strong>Employee Name:</strong> {employee.firstName} {employee.lastName}</p>
                </div>
                 <div>
                    <p><strong>Department:</strong> {employee.department}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-lg mb-2 border-b pb-1 border-slate-300 dark:border-slate-600">Earnings</h4>
                    <ul className="space-y-1 text-sm">
                        {Object.entries(earnings).filter(([, value]) => value > 0).map(([key, value]) => (
                             <li key={key} className="flex justify-between">
                                <span>{key}</span>
                                <span>{formatCurrency(value, companyInfo.baseCurrency, companyInfo.baseCurrency)}</span>
                             </li>
                        ))}
                    </ul>
                     <div className="font-bold flex justify-between mt-2 pt-2 border-t border-slate-300 dark:border-slate-600">
                        <span>Total Earnings</span>
                        <span>{formatCurrency(totalEarnings, companyInfo.baseCurrency, companyInfo.baseCurrency)}</span>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2 border-b pb-1 border-slate-300 dark:border-slate-600">Deductions</h4>
                    <ul className="space-y-1 text-sm">
                        {Object.entries(deductions).filter(([, value]) => value > 0).map(([key, value]) => (
                             <li key={key} className="flex justify-between">
                                <span>{key}</span>
                                <span>{formatCurrency(value, companyInfo.baseCurrency, companyInfo.baseCurrency)}</span>
                             </li>
                        ))}
                    </ul>
                     <div className="font-bold flex justify-between mt-2 pt-2 border-t border-slate-300 dark:border-slate-600">
                        <span>Total Deductions</span>
                        <span>{formatCurrency(totalDeductions, companyInfo.baseCurrency, companyInfo.baseCurrency)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Net Salary</span>
                    <span>{formatCurrency(netSalary, companyInfo.baseCurrency, companyInfo.baseCurrency)}</span>
                </div>
                <p className="text-sm mt-1"><strong>In Words:</strong> {salaryInWords}</p>
            </div>
            
             <div className="mt-8 text-center no-print">
                <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default SalarySlip;