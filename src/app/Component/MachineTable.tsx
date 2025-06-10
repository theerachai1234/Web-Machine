import React, { useState } from 'react';
import * as machinestatus from '../utils/machineStatus';
import { Machine } from '../Models/machine';
import dayjs from 'dayjs';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

type Props = {
  onSelectMachine: (machine: Machine) => void;
  onDeleteMachine: (name: string) => void;
  machines: Machine[];
};

type SortKey = 'name' | 'typeCheck' | 'lastChecked' | 'maintenanceDate';

export default function MachineTable({
  onSelectMachine,
  onDeleteMachine,
  machines,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedMachines = [...machines].sort((a, b) => {
    let aVal: string | number | undefined;
    let bVal: string | number | undefined;

    if (sortKey === 'maintenanceDate') {
      // สมมติ getMaintenanceDate คืนค่า string (วันที่)
      aVal = machinestatus.getMaintenanceDate(a);
      bVal = machinestatus.getMaintenanceDate(b);
    } else {
      // type-safe access
      aVal = a[sortKey as keyof Machine] as string | number | undefined;
      bVal = b[sortKey as keyof Machine] as string | number | undefined;
    }

    if (!aVal) return 1;
    if (!bVal) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    // สมมติ aVal,bVal เป็น number
    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <FaSort className="inline ml-1" />;
    return sortOrder === 'asc' ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border cursor-pointer" onClick={() => toggleSort('name')}>
            ชื่อเครื่อง {getSortIcon('name')}
          </th>
          <th className="p-2 border w-36 cursor-pointer text-center" onClick={() => toggleSort('typeCheck')}>
            ประเภทการเช็ค {getSortIcon('typeCheck')}
          </th>
          <th className="p-2 border cursor-pointer" onClick={() => toggleSort('lastChecked')}>
            วันที่ตรวจล่าสุด {getSortIcon('lastChecked')}
          </th>
          <th className="p-2 border cursor-pointer" onClick={() => toggleSort('maintenanceDate')}>
            วันที่บำรุง {getSortIcon('maintenanceDate')}
          </th>
          <th className="p-2 border">สถานะ</th>
          <th className="p-2 border w-12">ลบ</th>
        </tr>
      </thead>
      <tbody>
        {sortedMachines.length === 0 ? (
          <tr>
            <td colSpan={6} className="border px-4 py-6 text-center text-gray-500 italic">
              ไม่มีข้อมูล
            </td>
          </tr>
        ) : (
          sortedMachines.map((machine, index) => {
            const maintenanceDate = machinestatus.getMaintenanceDate(machine);
            const status = machinestatus.getStatusFromDate(maintenanceDate);
            const maintenanceInfo = machinestatus.getMaintenanceInfo(maintenanceDate);
            const typecheck = machinestatus.getNameType(machine.typeCheck);

            return (
              <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                <td className="p-2 border">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/img/icon-machine.png"
                      alt="icon"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      onClick={() => onSelectMachine(machine)}
                    />
                    {machine.name}
                  </div>
                </td>
                <td className="p-2 border w-36 text-center">
                  <span className={status.className}>{typecheck}</span>
                </td>
                <td className="p-2 border">{dayjs(machine.lastChecked).format('DD-MM-YYYY')}</td>
                <td className="p-2 border">
                  {maintenanceDate}
                  {maintenanceInfo && <div className="text-sm text-red-600">{maintenanceInfo}</div>}
                </td>
                <td className="p-2 border">
                  <span className={status.className}>{status.label}</span>
                </td>
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
          })
        )}
      </tbody>
    </table>
  );
}
