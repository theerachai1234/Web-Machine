import React from 'react';
import * as machinestatus from '../utils/machineStatus';
import dayjs from 'dayjs';

type Machine = {
  name: string;
  lastChecked: string;
};

type Props = {
  onSelectMachine: (machine: Machine) => void;
  machines: Machine[];
  onUpdateMachine: (updatedMachine: Machine) => void;
};

export default function MachineTable({
  onSelectMachine,
  machines,
  onUpdateMachine,
}: Props) {
  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">ชื่อเครื่อง</th>
          <th className="p-2 border">วันที่ตรวจล่าสุด</th>
          <th className="p-2 border">วันที่บำรุง</th>
          <th className="p-2 border">สถานะ</th>
        </tr>
      </thead>
      <tbody>
        {machines.map((machine, index) => {
          const maintenanceDate = dayjs(machine.lastChecked).add(30, 'day').format('DD-MM-YYYY');
          const status = machinestatus.getStatusFromDate(maintenanceDate);
          const maintenanceInfo = machinestatus.getMaintenanceInfo(maintenanceDate);

          return (
            <tr key={index}>
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
              <td className="p-2 border">{dayjs(machine.lastChecked).format('DD-MM-YYYY')}</td>
              <td className="p-2 border">
                {maintenanceDate}
                {maintenanceInfo && <div className="text-sm text-red-600">{maintenanceInfo}</div>}
              </td>
              <td className="p-2 border">
                <span className={status.className}>{status.label}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
