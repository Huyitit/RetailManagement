import React from 'react';

const FormTable = ({ children, className = '' }) => {
  return (
    <div className={`border border-slate-200 rounded-2xl overflow-hidden bg-white ${className}`.trim()}>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {children}
        </tbody>
      </table>
    </div>
  );
};

const FormRow = ({ label, children, labelClassName = '', cellClassName = '' }) => {
  return (
    <tr className="align-top">
      <th className={`w-44 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500 bg-slate-50 ${labelClassName}`.trim()}>
        {label}
      </th>
      <td className={`px-4 py-3 bg-white ${cellClassName}`.trim()}>
        {children}
      </td>
    </tr>
  );
};

export { FormTable, FormRow };
