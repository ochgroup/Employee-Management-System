import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg p-6 flex justify-between items-start shadow-sm border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="flex flex-col">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
      </div>
      <div className="flex-shrink-0">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;