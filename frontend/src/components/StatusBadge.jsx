import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor = 'bg-slate-100';
  let textColor = 'text-slate-700';
  let dotColor = 'bg-slate-400';
  let label = status;

  // Map status strings to colors based on DESIGN.MD specs
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'active':
    case 'còn hạn':
      bgColor = 'bg-emerald-50';
      textColor = 'text-emerald-700';
      dotColor = 'bg-emerald-500';
      label = status === 'Completed' ? 'Hoàn tất' : status === 'Active' ? 'Hoạt động' : 'Còn hạn';
      break;
    case 'draft':
    case 'pending':
    case 'warranty':
      bgColor = 'bg-amber-50';
      textColor = 'text-amber-700';
      dotColor = 'bg-amber-500';
      label = status === 'Draft' ? 'Nháp' : status === 'Warranty' ? 'Bảo hành' : 'Chờ xử lý';
      break;
    case 'cancelled':
    case 'discontinued':
    case 'hết hạn':
    case 'deleted':
      bgColor = 'bg-rose-50';
      textColor = 'text-rose-700';
      dotColor = 'bg-rose-500';
      label = status === 'Cancelled' ? 'Đã hủy' : status === 'Discontinued' ? 'Ngừng KD' : status === 'Deleted' ? 'Đã xóa' : 'Hết hạn';
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor.split('-')[1]}-200/50`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5`}></span>
      {label}
    </span>
  );
};

export default StatusBadge;
