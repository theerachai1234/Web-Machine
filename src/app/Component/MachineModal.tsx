import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as machinestatus from '../utils/machineStatus';
import dayjs from 'dayjs';
import { Machine } from '../Models/machine';

type Props = {
  machine: Machine;
  onClose: () => void;
  onSave: (updatedMachine: Machine, maintenanceDate: string) => void;
};

export default function MachineModal({
  machine,
  onClose,
  onSave,
}: Props) {
  const today = dayjs().format('DD-MM-YYYY');

  const [selectedTypeCheck, setSelectedTypeCheck] = useState<'B' | 'W' | 'M'>(machine.typeCheck as 'B' | 'W' | 'M');
  const [localDate, setLocalDate] = useState('');  // วันที่ตรวจล่าสุดที่เลือก
  const [maintenanceDate, setMaintenanceDate] = useState('');

  // ตั้งค่า localDate เป็นวันนี้แค่ครั้งแรกเมื่อ modal เปิด
  useEffect(() => {
    if (!localDate) {
      setLocalDate(today);
    }
  }, [localDate, today]);

  // อัปเดต maintenanceDate เมื่อ selectedTypeCheck, machine หรือ localDate เปลี่ยน
  useEffect(() => {
    if (selectedTypeCheck === 'B' && machine.waitmanage) {
      const parsedWaitManage = dayjs(machine.waitmanage); // ISO 8601 format
      if (parsedWaitManage.isValid()) {
        setMaintenanceDate(parsedWaitManage.format('DD-MM-YYYY'));
      } else {
        setMaintenanceDate(machine.waitmanage);
      }
    } else {
      const baseDate = localDate || today;
      const updatedMachine = { ...machine, typeCheck: selectedTypeCheck };
      const newMaintenanceDate = machinestatus.getMaintenanceDateFromCustomDate(
        updatedMachine,
        baseDate
      );
      setMaintenanceDate(newMaintenanceDate);
    }
  }, [selectedTypeCheck, machine, localDate, today]);

  // parse localDate เป็น Date สำหรับ DatePicker
  const parsedDate = dayjs(localDate, 'DD-MM-YYYY', true);
  const fallbackDate = dayjs();
  const selectedDate = parsedDate.isValid() ? parsedDate.toDate() : fallbackDate.toDate();

  // parse maintenanceDate สำหรับ DatePicker (กรณี Between)
  const parsedMaintenanceDate = dayjs(maintenanceDate, 'DD-MM-YYYY', true);
  const maintenanceSelectedDate = parsedMaintenanceDate.isValid()
    ? parsedMaintenanceDate.toDate()
    : null;

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatted = dayjs(date).format('DD-MM-YYYY');
      setLocalDate(formatted);
    }
  };

  const handleTypeCheckChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'B' | 'W' | 'M';
    setSelectedTypeCheck(value);
  };

  const handleMaintenanceDateChange = (date: Date | null) => {
    if (date) {
      const formatted = dayjs(date).format('DD-MM-YYYY');
      setMaintenanceDate(formatted);
    }
  };

  const handleSave = async () => {
    const parsed = dayjs(localDate, 'DD-MM-YYYY', true);
    const safeDateValue = parsed.isValid() ? localDate : fallbackDate.format('DD-MM-YYYY');

    // แปลง lastChecked และ maintenanceDate เป็น YYYY-MM-DD ก่อนส่ง
    const lastCheckedISO = dayjs(safeDateValue, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const maintenanceDateISO = selectedTypeCheck === 'B' && maintenanceDate
      ? dayjs(maintenanceDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      : dayjs(
          machinestatus.getMaintenanceDateFromCustomDate(
            { ...machine, typeCheck: selectedTypeCheck },
            safeDateValue
          ),
          'DD-MM-YYYY'
        ).format('YYYY-MM-DD');

    const updatedMachine = {
      ...machine,
      lastChecked: lastCheckedISO,
      typeCheck: selectedTypeCheck,
      waitmanage: maintenanceDateISO,
    };

    try {
      const res = await fetch('/api/updateMachine', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMachine),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('อัปเดตข้อมูลไม่สำเร็จ: ' + errorData.error);
        return;
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดขณะอัปเดตข้อมูล');
      console.error(error);
    }

    onSave(updatedMachine, maintenanceDateISO);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">รายละเอียดเครื่อง</h2>
        <p><strong>ชื่อเครื่อง:</strong> {machine.name}</p>

        <div className="flex items-center gap-4 mt-5">
          <label className="block text-sm font-medium w-full flex flex-col">
            วันที่ตรวจล่าสุด:
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              dateFormat="dd-MM-yyyy"
              className="border mt-1 p-1 w-full rounded"
              popperPlacement="top"
            />
          </label>
        </div>

        {selectedTypeCheck === 'B' ? (
          <div className="flex items-center gap-4 mt-5">
            <label className="block text-sm font-medium w-full flex flex-col">
              วันที่บำรุง:
              <DatePicker
                selected={maintenanceSelectedDate}
                onChange={handleMaintenanceDateChange}
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                className="border mt-1 p-1 w-full rounded"
                popperPlacement="top"
              />
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-4 mt-5">
            <label className="block text-sm font-medium w-full flex flex-col">
              วันที่บำรุง:
              <input
                type="text"
                className="border mt-1 p-1 w-full rounded bg-gray-100"
                value={maintenanceDate}
                readOnly
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-4 mt-5">
          <label className="block text-sm font-medium w-full flex flex-col">
            ประเภทการเช็ค:
            <select
              className="border mt-1 p-1 w-full rounded"
              value={selectedTypeCheck}
              onChange={handleTypeCheckChange}
            >
              <option value="W">Week</option>
              <option value="M">Month</option>
              <option value="B">Between</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">ยกเลิก</button>
          <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">บันทึก</button>
        </div>
      </div>
    </div>
  );
}
