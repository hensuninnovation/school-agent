'use client';

import React from 'react';
import { Seat, Student, Layout } from '@/types';

interface SeatGridProps {
  seats: Seat[];
  students: Student[];
  layout: Layout;
  onSeatClick: (seatId: number) => void;
  onLockSeat: (seatId: number) => void;
  currentClass: string;
}

export default function SeatGrid({ seats, students, layout, onSeatClick, onLockSeat, currentClass }: SeatGridProps) {
  const getStudentName = (studentId: string | null) => {
    if (!studentId) return null;
    return students.find(s => s.id === studentId)?.name || null;
  };

  const isStudentLocked = (studentId: string | null) => {
    if (!studentId) return false;
    return students.find(s => s.id === studentId)?.isLocked || false;
  };

  if (seats.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">🪑</div>
        <p>Add students and configure your layout to see the seating chart</p>
      </div>
    );
  }

  // Render grid layout
  if (layout.type === 'grid') {
    const rows = layout.rows!;
    const cols = layout.columns!;
    
    return (
      <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h2 className="text-lg font-semibold text-gray-800">Seating Chart - Period {currentClass}</h2>
          <div className="text-sm text-gray-600">{seats.length} seats total</div>
        </div>
        
        {/* Print header */}
        <div className="hidden print:block mb-4">
          <h1 className="text-2xl font-bold text-center">Seating Chart - Period {currentClass}</h1>
          <p className="text-center text-gray-600">{new Date().toLocaleDateString()}</p>
        </div>
        
        <div 
          className="grid gap-2 print:gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))`,
          }}
        >
          {seats.map(seat => {
            const studentName = getStudentName(seat.studentId);
            const locked = seat.isLocked || isStudentLocked(seat.studentId);
            
            return (
              <div
                key={seat.id}
                onClick={() => onSeatClick(seat.id)}
                className={`
                  relative p-3 rounded-lg border-2 min-h-[80px] flex flex-col items-center justify-center text-center cursor-pointer transition print:border-gray-300 print:min-h-[60px]
                  ${seat.isUnavailable 
                    ? 'bg-gray-200 border-gray-300 text-gray-400' 
                    : seat.studentId 
                      ? locked 
                        ? 'bg-orange-100 border-orange-400 text-orange-800' 
                        : 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }
                `}
              >
                {!seat.isUnavailable && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onLockSeat(seat.id); }}
                    className="absolute top-1 right-1 text-xs print:hidden"
                    title={seat.isLocked ? 'Unlock seat' : 'Lock seat'}
                  >
                    {seat.isLocked ? '🔒' : '🔓'}
                  </button>
                )}
                
                <div className="text-xs font-medium text-gray-500 mb-1 print:text-[10px]">{seat.label}</div>
                
                {seat.isUnavailable ? (
                  <div className="text-xs text-gray-400">Unavailable</div>
                ) : studentName ? (
                  <div className="font-semibold text-sm print:text-xs truncate w-full px-1">{studentName}</div>
                ) : (
                  <div className="text-xs text-gray-400">Empty</div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm print:mt-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-100 border border-orange-400 rounded"></div>
            <span>Locked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Empty</span>
          </div>
        </div>
      </div>
    );
  }

  // Render table layout
  if (layout.type === 'tables') {
    const tableCount = layout.tableCount!;
    const seatsPerTable = layout.seatsPerTable!;
    const tables = [];
    
    for (let t = 0; t < tableCount; t++) {
      const tableSeats = seats.slice(t * seatsPerTable, (t + 1) * seatsPerTable);
      tables.push(
        <div key={t} className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
          <div className="text-center text-xs font-medium text-gray-500 mb-2">Table {t + 1}</div>
          <div className={`grid gap-1 ${seatsPerTable <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {tableSeats.map(seat => {
              const studentName = getStudentName(seat.studentId);
              const locked = seat.isLocked || isStudentLocked(seat.studentId);
              
              return (
                <div
                  key={seat.id}
                  onClick={() => onSeatClick(seat.id)}
                  className={`
                    relative p-2 rounded border min-h-[50px] flex flex-col items-center justify-center text-center cursor-pointer transition print:min-h-[40px]
                    ${seat.isUnavailable 
                      ? 'bg-gray-200 border-gray-300 text-gray-400' 
                      : seat.studentId 
                        ? locked 
                          ? 'bg-orange-100 border-orange-400 text-orange-800' 
                          : 'bg-blue-50 border-blue-300 text-blue-900'
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }
                  `}
                >
                  {!seat.isUnavailable && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onLockSeat(seat.id); }}
                      className="absolute top-0.5 right-0.5 text-[10px] print:hidden"
                    >
                      {seat.isLocked ? '🔒' : '🔓'}
                    </button>
                  )}
                  <div className="text-[10px] text-gray-500 print:hidden">{seat.label}</div>
                  {seat.isUnavailable ? (
                    <span className="text-[10px] text-gray-400">—</span>
                  ) : studentName ? (
                    <span className="font-medium text-xs print:text-[10px] text-center leading-tight">{studentName}</span>
                  ) : (
                    <span className="text-[10px] text-gray-400">Empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h2 className="text-lg font-semibold text-gray-800">Table Groups - Period {currentClass}</h2>
          <div className="text-sm text-gray-600">{seats.length} seats across {tableCount} tables</div>
        </div>
        
        <div className="hidden print:block mb-4">
          <h1 className="text-2xl font-bold text-center">Seating Chart - Period {currentClass}</h1>
          <p className="text-center text-gray-600">{new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-2">
          {tables}
        </div>
      </div>
    );
  }

  // Render custom layout (single row/column for simplicity)
  return (
    <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
      <div className="flex items-center justify-between mb-4 print:hidden">
        <h2 className="text-lg font-semibold text-gray-800">Seating Chart - Period {currentClass}</h2>
        <div className="text-sm text-gray-600">{seats.length} seats</div>
      </div>
      
      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-bold text-center">Seating Chart - Period {currentClass}</h1>
        <p className="text-center text-gray-600">{new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {seats.map(seat => {
          const studentName = getStudentName(seat.studentId);
          const locked = seat.isLocked || isStudentLocked(seat.studentId);
          
          return (
            <div
              key={seat.id}
              onClick={() => onSeatClick(seat.id)}
              className={`
                relative p-2 rounded-lg border-2 min-h-[70px] flex flex-col items-center justify-center text-center cursor-pointer transition
                ${seat.isUnavailable 
                  ? 'bg-gray-200 border-gray-300 text-gray-400' 
                  : seat.studentId 
                    ? locked 
                      ? 'bg-orange-100 border-orange-400 text-orange-800' 
                      : 'bg-blue-50 border-blue-300 text-blue-900'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                }
              `}
            >
              {!seat.isUnavailable && (
                <button
                  onClick={(e) => { e.stopPropagation(); onLockSeat(seat.id); }}
                  className="absolute top-1 right-1 text-xs print:hidden"
                >
                  {seat.isLocked ? '🔒' : '🔓'}
                </button>
              )}
              
              <div className="text-xs font-medium text-gray-500">{seat.label}</div>
              
              {seat.isUnavailable ? (
                <div className="text-xs text-gray-400">—</div>
              ) : studentName ? (
                <div className="font-semibold text-sm print:text-xs">{studentName}</div>
              ) : (
                <div className="text-xs text-gray-400">Empty</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
