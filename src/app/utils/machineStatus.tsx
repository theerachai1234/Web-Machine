// utils/machineStatus.ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Machine } from '../Models/machine';

export function getMaintenanceDate(machine: Machine): string {
  const lastChecked = dayjs(machine.lastChecked);

  if (machine.typeCheck === 'B') {
    return dayjs(machine.waitmanage).format('DD-MM-YYYY');
  }

  if (machine.typeCheck === 'W') {
    // หาเสาร์ถัดไปจาก lastChecked (ไม่รวมวันเดียวกัน)
    let nextSaturday = lastChecked.add(1, 'day');
    while (nextSaturday.day() !== 6) {
      nextSaturday = nextSaturday.add(1, 'day');
    }
    return nextSaturday.format('DD-MM-YYYY');
  }

  if (machine.typeCheck === 'M') {
    // เสาร์แรกของเดือนถัดไป (ต้องเป็น "ถัดไป" จริงๆ)
    const firstDayNextMonth = lastChecked.add(1, 'month').startOf('month');
    let firstSaturday = firstDayNextMonth;
    while (firstSaturday.day() !== 6) {
      firstSaturday = firstSaturday.add(1, 'day');
    }
    return firstSaturday.format('DD-MM-YYYY');
  }

  // fallback
  return lastChecked.add(30, 'day').format('DD-MM-YYYY');
}

export function getMaintenanceDateFromCustomDate(machine: Machine, baseDate: string): string {
  const lastChecked = dayjs(baseDate, 'DD-MM-YYYY', true);
  if (!lastChecked.isValid()) return dayjs(baseDate).format('DD-MM-YYYY');

  if (machine.typeCheck === 'B') {
    return dayjs(machine.waitmanage).format('DD-MM-YYYY');
  }

  if (machine.typeCheck === 'W') {
    let nextSaturday = lastChecked.add(1, 'day');
    let safety = 0;
    while (nextSaturday.day() !== 6 && safety < 10) {
      nextSaturday = nextSaturday.add(1, 'day');
      safety++;
    }
    return nextSaturday.format('DD-MM-YYYY');
  }

  if (machine.typeCheck === 'M') {
    let firstSaturday = lastChecked.add(1, 'month').startOf('month');
    let safety = 0;
    while (firstSaturday.day() !== 6 && safety < 10) {
      firstSaturday = firstSaturday.add(1, 'day');
      safety++;
    }
    return firstSaturday.format('DD-MM-YYYY');
  }

  return lastChecked.add(30, 'day').format('DD-MM-YYYY');
}

dayjs.extend(customParseFormat);

export function getMaintenanceInfo(maintenanceDate: string): string | null {
  const madate = dayjs(maintenanceDate, 'DD/MM/YYYY');  
    const today = dayjs();
    const diff = madate.diff(today, 'day');
    if (diff < 0) return `⛔ เกินวันบำรุง ${Math.abs(diff)} วัน`;
    if (diff <= 7) return `⚠ เหลือ ${diff} วัน`;
    return null;
}

export function getStatusFromDate(maintenanceDate: string): { label: string; className: string } {
  const madate = dayjs(maintenanceDate, 'DD/MM/YYYY');  
    const today = dayjs();
    const diff = madate.diff(today, 'day');
  if (diff < 0) return { label: 'รอซ่อม', className: 'text-red-600 font-semibold' };
  if (diff <= 7) return { label: 'ต้องบำรุง', className: 'text-yellow-600 font-semibold' };
  return { label: 'พร้อมใช้งาน', className: 'text-green-600 font-semibold' };
}

export function getNameType(maintenancetpe: string): string | null {
  if(maintenancetpe == 'B') return 'Between';
  if(maintenancetpe == 'W') return 'Week';
  if(maintenancetpe == 'M') return 'Month';
  return null;
}
