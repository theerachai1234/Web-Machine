'use client';
import { useState } from 'react';
import MachineTable from '../app/Component/MachineTable';
import MachineModal from '../app/Component/MachineModal';
import TopBar from '../app/Component/Topbar'; 
import dayjs from 'dayjs';

type Machine = {
  name: string;
  lastChecked: string;
};

export default function Page() {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedDate, setSelectedDate] = useState(''); // เริ่มต้นไม่มีกำหนดวันที่
  const [machines, setMachines] = useState<Machine[]>([
    { name: 'เครื่อง A', lastChecked: '2025-04-15' },
    { name: 'เครื่อง B', lastChecked: '2025-04-10' },
    { name: 'เครื่อง C', lastChecked: '2025-04-01' },
  ]);

  return (
    <div>
      {/* แสดง TopBar ด้านบน */}
      <TopBar />

      <main className="p-4 pt-16"> {/* เพิ่ม padding-top เพื่อให้เนื้อหาหลักไม่ทับกับ TopBar */}
        <h1 className="text-2xl font-bold mb-4">รายการเครื่องจักร</h1>
        <MachineTable
          machines={machines}
          onSelectMachine={(machine) => {
            setSelectedMachine(machine);
            setSelectedDate(machine.lastChecked); // กำหนดวันที่ตรวจล่าสุด
          }}
        />

        {/* แสดง Modal เมื่อมีการเลือกเครื่อง */}
        {selectedMachine && (
          <MachineModal
            machine={selectedMachine}
            dateValue={selectedDate}
            onDateChange={setSelectedDate} // ส่งฟังก์ชันให้เปลี่ยนวันที่
            onClose={() => setSelectedMachine(null)} // ปิด modal
            onSave={(updatedMachine) => {
              // อัปเดตเครื่องจักรเมื่อกด "บันทึก"
              const updatedMachines = machines.map((m) =>
                m.name === updatedMachine.name
                  ? { ...m, lastChecked: dayjs(updatedMachine.lastChecked, 'DD-MM-YYYY').format('YYYY-MM-DD') }
                  : m
              );
              setMachines(updatedMachines);
              setSelectedMachine(null); // ปิด modal
            }}
          />
        )}
      </main>
    </div>
  );
}
