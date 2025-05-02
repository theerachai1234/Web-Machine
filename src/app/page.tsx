'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ใช้สำหรับ redirect
import MachineTable from '../app/Component/MachineTable';
import MachineModal from '../app/Component/MachineModal';
import TopBar from '../app/Component/Topbar'; 
import dayjs from 'dayjs';

type Machine = {
  name: string;
  lastChecked: string;
};

export default function Page() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, []);

  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [machines, setMachines] = useState<Machine[]>([
    { name: 'เครื่อง A', lastChecked: '2025-04-15' },
    { name: 'เครื่อง B', lastChecked: '2025-04-10' },
    { name: 'เครื่อง C', lastChecked: '2025-04-01' },
  ]);

  if (!authorized) return null; // ไม่แสดงอะไรถ้ายังไม่ได้ login

  return (
    <div>
      <TopBar />

      <main className="p-4 pt-16">
        <h1 className="text-2xl font-bold mb-4">รายการเครื่องจักร</h1>
        <MachineTable
          machines={machines}
          onSelectMachine={(machine) => {
            setSelectedMachine(machine);
            setSelectedDate(machine.lastChecked);
          }}
        />

        {selectedMachine && (
          <MachineModal
            machine={selectedMachine}
            dateValue={selectedDate}
            onDateChange={setSelectedDate}
            onClose={() => setSelectedMachine(null)}
            onSave={(updatedMachine) => {
              const updatedMachines = machines.map((m) =>
                m.name === updatedMachine.name
                  ? {
                      ...m,
                      lastChecked: dayjs(updatedMachine.lastChecked, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    }
                  : m
              );
              setMachines(updatedMachines);
              setSelectedMachine(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
