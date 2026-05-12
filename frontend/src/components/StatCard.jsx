import React from 'react';

const StatCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            {icon}
          </div>
        )}
      </div>
      
      {(subtitle || trend) && (
        <div className="flex items-center mt-4 relative z-10">
          {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-md mr-2 ${
              trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
          {subtitle && <span className="text-sm text-slate-500">{subtitle}</span>}
        </div>
      )}

      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
    </div>
  );
};

export default StatCard;
