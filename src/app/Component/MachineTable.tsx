import React from 'react';
import * as machinestatus from '../utils/machineStatus';
import { Machine } from '../Models/machine';
import dayjs from 'dayjs';
import { FaTrash } from 'react-icons/fa';

type Props = {
  onSelectMachine: (machine: Machine) => void;
  onDeleteMachine: (name: string) => void;
  machines: Machine[];
};

export default function MachineTable({
  onSelectMachine,
  onDeleteMachine,
  machines,
}: Props) {
  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">ชื่อเครื่อง</th><th className="p-2 border w-36">ประเภทการเช็ค</th><th className="p-2 border">วันที่ตรวจล่าสุด</th><th className="p-2 border">วันที่บำรุง</th><th className="p-2 border">สถานะ</th><th className="p-2 border w-12">ลบ</th>
        </tr>
      </thead>
      <tbody>
        {machines.length === 0 ? (
          <tr>
            <td colSpan={6} className="border px-4 py-6 text-center text-gray-500 italic">ไม่มีข้อมูล</td>
          </tr>
        ) : machines.map((machine, index) => {
          const maintenanceDate = machinestatus.getMaintenanceDate(machine);
          const status = machinestatus.getStatusFromDate(maintenanceDate);
          const maintenanceInfo = machinestatus.getMaintenanceInfo(maintenanceDate);
          const typecheck = machinestatus.getNameType(machine.typeCheck);

          return (
            <tr key={index} className="hover:bg-gray-100 cursor-pointer">
              <td className="p-2 border">
                <div className="flex items-center gap-2">
                  <img
                    src="/img/icon-machine.png"
                    alt="icon"
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => onSelectMachine(machine)}
                  />
                  {machine.name}
                </div>
              </td>
              <td className="p-2 border w-36 text-center"><span className={status.className}>{typecheck}</span></td>
              <td className="p-2 border">{dayjs(machine.lastChecked).format('DD-MM-YYYY')}</td>
              <td className="p-2 border">
                {maintenanceDate}
                {maintenanceInfo && <div className="text-sm text-red-600">{maintenanceInfo}</div>}
              </td>
              <td className="p-2 border"><span className={status.className}>{status.label}</span></td>
              <td className="p-2 border text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`คุณต้องการลบเครื่องจักร "${machine.name}" ใช่หรือไม่?`)) {
                      onDeleteMachine(machine.name);
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                  aria-label={`ลบเครื่องจักร ${machine.name}`}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
