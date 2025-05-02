import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

type Machine = {
  name: string;
  lastChecked: string;
};

type Props = {
  machine: Machine;
  dateValue: string;
  onDateChange: (value: string) => void;
  onClose: () => void;
  onSave: (updatedMachine: Machine, maintenanceDate: string) => void; // ส่งวันที่บำรุงไปด้วย
};

export default function MachineModal({
  machine,
  dateValue,
  onDateChange,
  onClose,
  onSave,
}: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // ตรวจสอบว่า dateValue เป็นวันที่ที่ valid หรือไม่
  const parsedDate = dayjs(dateValue, 'DD-MM-YYYY', true);
  const fallbackDate = dayjs();  // วันปัจจุบัน
  const selectedDate = parsedDate.isValid() ? parsedDate.toDate() : fallbackDate.toDate();  // ใช้วันปัจจุบันหากไม่มีวันที่ valid

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatted = dayjs(date).format('DD-MM-YYYY');
      onDateChange(formatted); // ส่งวันที่ที่เลือกกลับไป
    }
  };

  const handleSave = () => {
    const parsed = dayjs(dateValue, 'DD-MM-YYYY', true);
    const safeDateValue = parsed.isValid()
      ? dateValue
      : fallbackDate.format('DD-MM-YYYY'); // fallback เป็นวันปัจจุบัน

    // คำนวณวันที่บำรุง (วันที่ตรวจล่าสุด + 30 วัน)
    const maintenanceDate = dayjs(safeDateValue, 'DD-MM-YYYY').add(30, 'day').format('DD-MM-YYYY');

    const updatedMachine = {
      ...machine,
      lastChecked: safeDateValue,
    };

    onSave(updatedMachine, maintenanceDate); // ส่งข้อมูลทั้งวันที่ตรวจล่าสุดและวันที่บำรุง
    onClose(); // ปิด modal
  };

  // คำนวณวันที่บำรุง (หากยังไม่มีการเลือกวันที่ ตรวจล่าสุดให้ใช้วันปัจจุบัน)
  const maintenanceDate = dayjs().add(30, 'day').format('DD-MM-YYYY');

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">รายละเอียดเครื่อง</h2>
        <p><strong>ชื่อเครื่อง:</strong> {machine.name}</p>

        <div className="flex items-center gap-4 mt-5">
          <label className="block text-sm font-medium w-full flex flex-col">
            วันที่ตรวจล่าสุด:
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}  // กำหนดให้เลือกได้แค่วันที่ปัจจุบันหรือในอนาคต
              dateFormat="dd-MM-yyyy"
              className="border mt-1 p-1 w-full rounded"
              popperPlacement="top"
            />
          </label>
        </div>

        <div className="flex items-center gap-4 mt-5">
          <label className="block text-sm font-medium w-full flex flex-col">
            วันที่บำรุง:
            <input
              type="text"
              className="border mt-1 p-1 w-full rounded bg-gray-100"
              value={maintenanceDate} // แสดงวันที่บำรุง
              readOnly
            />
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
