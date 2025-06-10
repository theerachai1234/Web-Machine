import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as machinestatus from '../utils/machineStatus';
import dayjs from 'dayjs';
import { Machine } from '../Models/machine';

type Props = {
  onClose: () => void;
  onAdd: (newMachine: Machine) => void;
};

export default function AddMachineModal({ onClose, onAdd }: Props) {
  const today = dayjs();

  const [name, setName] = useState('');
  const [lastChecked, setLastChecked] = useState(today.format('DD-MM-YYYY'));
  const [typeCheck, setTypeCheck] = useState<'B' | 'W' | 'M'>('W');
  const [waitmanage, setWaitmanage] = useState('');

  // แปลง waitmanage เป็น Date สำหรับ DatePicker (กรณี Between)
  const parsedWaitmanage = dayjs(waitmanage, 'DD-MM-YYYY', true);
  const selectedWaitmanageDate = parsedWaitmanage.isValid() ? parsedWaitmanage.toDate() : new Date();

  const parsedLastChecked = dayjs(lastChecked, 'DD-MM-YYYY', true);
  const selectedDate = parsedLastChecked.isValid() ? parsedLastChecked.toDate() : new Date();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatted = dayjs(date).format('DD-MM-YYYY');
      setLastChecked(formatted);
    }
  };

  // ถ้า Between ให้ user แก้ไข waitmanage ได้ (ผ่าน DatePicker)
  const handleWaitmanageChange = (date: Date | null) => {
    if (date) {
      const formatted = dayjs(date).format('DD-MM-YYYY');
      setWaitmanage(formatted);
    }
  };

  useEffect(() => {
    const tempMachine: Machine = {
      name,
      lastChecked,
      waitmanage: '',
      typeCheck,
    };
    const calculatedWaitmanage = machinestatus.getMaintenanceDateFromCustomDate(tempMachine, lastChecked);
    if (typeCheck !== 'B') {
      setWaitmanage(calculatedWaitmanage);
    } 
    // ถ้า Between ให้รอ user แก้เอง ไม่เขียนทับ
  }, [lastChecked, typeCheck, name]);

  useEffect(() => {
    if (typeCheck === 'B') {
      const todayStr = dayjs().format('DD-MM-YYYY');
      setLastChecked(todayStr);
      setWaitmanage(todayStr); // ตั้ง default waitmanage เป็นวันนี้
    }
  }, [typeCheck]);

 const handleSave = async () => {
    if (!name.trim()) {
        alert('กรุณากรอกชื่อเครื่อง');
        return;
    }

    const newMachine: Machine = {
        name: name.trim(),
        lastChecked: dayjs(lastChecked, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        waitmanage: dayjs(waitmanage, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        typeCheck,
    };

    // เพิ่มใน UI ทันที
    onAdd(newMachine);

    try {
        const res = await fetch('/api/AddMachine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMachine),
        });

        if (!res.ok) {
        throw new Error('ไม่สามารถบันทึกลง MongoDB ได้');
        }

        console.log('บันทึกลง MongoDB เรียบร้อย');
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }

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
        <h2 className="text-xl font-bold mb-4">เพิ่มเครื่องจักรใหม่</h2>

        <label className="block mb-4">
          ชื่อเครื่อง:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full p-2 mt-1"
            placeholder="กรอกชื่อเครื่อง"
          />
        </label>

        <label className="block mb-4 mt-5">
          ประเภทการเช็ค:
          <select
            value={typeCheck}
            onChange={(e) => setTypeCheck(e.target.value as 'B' | 'W' | 'M')}
            className="border rounded w-full p-2 mt-1"
          >
            <option value="B">Between</option>
            <option value="W">Week</option>
            <option value="M">Month</option>
          </select>
        </label>

        <div className="flex items-center gap-4 mt-5">
          <label className="block text-sm font-medium w-full flex flex-col">
            วันที่ตรวจล่าสุด:
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={typeCheck === 'B' ? undefined : new Date()}
              dateFormat="dd-MM-yyyy"
              className="border mt-1 p-1 w-full rounded"
              popperPlacement="top"
            />
          </label>
        </div>
        

        <div className="flex items-center gap-4 mb-4 mt-5">
            <label className="block text-sm font-medium w-full flex flex-col">
                วันที่บำรุง (คำนวณอัตโนมัติ):
                <DatePicker
                    selected={selectedWaitmanageDate}
                    onChange={(date: Date | null) => {
                        if (typeCheck === 'B' && date) {
                        const formatted = dayjs(date).format('DD-MM-YYYY');
                        setWaitmanage(formatted);
                        }
                    }}
                    dateFormat="dd-MM-yyyy"
                    className={`border mt-1 p-1 w-full rounded ${
                        typeCheck === 'B' ? 'bg-white' : 'bg-gray-100'
                    }`}
                    popperPlacement="top"
                    readOnly={typeCheck !== 'B'}
                />
            </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            เพิ่มเครื่อง
          </button>
        </div>
      </div>
    </div>
  );
}
