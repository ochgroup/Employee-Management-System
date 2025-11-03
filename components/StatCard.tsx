
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  borderColorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, borderColorClass }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow p-6 border-t-4 ${borderColorClass} border border-slate-200 dark:border-slate-700`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
    </div>
  );
};

export default StatCard;