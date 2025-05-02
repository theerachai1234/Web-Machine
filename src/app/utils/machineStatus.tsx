// utils/machineStatus.ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export function getMaintenanceDate(lastChecked: string): string {
  return dayjs(lastChecked).add(30, 'day').format('YYYY-MM-DD');
}

dayjs.extend(customParseFormat);

export function getMaintenanceInfo(maintenanceDate: string): string | null {
    let madate = dayjs(maintenanceDate, 'DD/MM/YYYY');  
    const today = dayjs();
    const diff = madate.diff(today, 'day');
    if (diff < 0) return `⛔ เกินวันบำรุง ${Math.abs(diff)} วัน`;
    if (diff <= 7) return `⚠ เหลือ ${diff} วัน`;
    return null;
}

export function getStatusFromDate(maintenanceDate: string): { label: string; className: string } {
    let madate = dayjs(maintenanceDate, 'DD/MM/YYYY');  
    const today = dayjs();
    const diff = madate.diff(today, 'day');
  if (diff < 0) return { label: 'รอซ่อม', className: 'text-red-600 font-semibold' };
  if (diff <= 7) return { label: 'ต้องบำรุง', className: 'text-yellow-600 font-semibold' };
  return { label: 'พร้อมใช้งาน', className: 'text-green-600 font-semibold' };
}
