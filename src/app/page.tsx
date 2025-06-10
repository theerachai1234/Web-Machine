'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MachineTable from '../app/Component/MachineTable';
import MachineModal from '../app/Component/MachineModal';
import AddMachineModal from '../app/Component/AddMachineModal';
import TopBar from '../app/Component/Topbar'; 
import { Machine } from '../app/Models/machine';
import dayjs from 'dayjs';

export default function Page() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      router.push('/login');
    } else {
      setAuthorized(true);

      fetch('/api/GetMachine')
        .then((res) => {
          if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');
          return res.json();
        })
        .then((data) => {
          setMachines(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'โหลดข้อมูลล้มเหลว');
          setLoading(false);
        });
    }
  }, [router]);

  const handleAddMachine = (newMachine: Machine) => {
    setMachines((prev) => [...prev, newMachine]);
    setShowAddModal(false);
  };

  // ฟังก์ชันลบเครื่องจักร
  const handleDeleteMachine = async (name: string) => {
    try {
      const res = await fetch('/api/DeleteMachine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'ลบเครื่องจักรไม่สำเร็จ');
      }

      // ลบจาก state
      setMachines((prev) => prev.filter((m) => m.name !== name));
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบเครื่องจักร: ' + (error instanceof Error ? error.message : ''));
      console.error(error);
    }
  };

  if (!authorized) return null;

  return (
    <div>
      <TopBar />

      <main className="p-4 pt-16">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">รายการเครื่องจักร</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            เพิ่มเครื่องจักรใหม่
          </button>
        </div>

        {loading && <p>กำลังโหลดข้อมูล...</p>}
        {error && <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>}

        {!loading && !error && (
          <>
            {machines.length === 0 ? (
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">ชื่อเครื่อง</th>
                    <th className="p-2 border w-36">ประเภทการเช็ค</th>
                    <th className="p-2 border">วันที่ตรวจล่าสุด</th>
                    <th className="p-2 border">วันที่บำรุง</th>
                    <th className="p-2 border">สถานะ</th>
                    <th className="p-2 border w-12">ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="border px-4 py-6 text-center text-gray-500 italic">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <>
                <MachineTable
                  machines={machines}
                  onSelectMachine={(machine) => {
                    setSelectedMachine(machine);
                  }}
                  onDeleteMachine={handleDeleteMachine} // ส่งฟังก์ชันลบเข้าไป
                />

                {selectedMachine && (
                  <MachineModal
                    machine={selectedMachine}
                    onClose={() => setSelectedMachine(null)}
                    onSave={(updatedMachine) => {
                      const updatedMachines = machines.map((m) =>
                        m.name === updatedMachine.name
                          ? {
                              ...m,
                              lastChecked: dayjs(updatedMachine.lastChecked).format('YYYY-MM-DD'),
                              waitmanage: dayjs(updatedMachine.waitmanage).format('YYYY-MM-DD'),
                              typeCheck: updatedMachine.typeCheck,
                            }
                          : m
                      );
                      setMachines(updatedMachines);
                      setSelectedMachine(null);
                    }}
                  />
                )}
              </>
            )}

            {showAddModal && (
              <AddMachineModal
                onAdd={handleAddMachine}
                onClose={() => setShowAddModal(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
