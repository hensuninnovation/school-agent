'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SeatGrid from '@/components/SeatGrid';
import StudentInput from '@/components/StudentInput';
import LayoutSelector from '@/components/LayoutSelector';
import { Student, Seat, Layout, SeatingArrangement } from '@/types';

const STORAGE_KEY = 'seating-chart-data';
const ARRANGEMENTS_KEY = 'seating-chart-arrangements';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [layout, setLayout] = useState<Layout>({ type: 'grid', rows: 5, columns: 6 });
  const [seats, setSeats] = useState<Seat[]>([]);
  const [currentClass, setCurrentClass] = useState<string>('1');
  const [arrangements, setArrangements] = useState<Record<string, SeatingArrangement>>({});

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStudents(parsed.students || []);
      setLayout(parsed.layout || { type: 'grid', rows: 5, columns: 6 });
      setCurrentClass(parsed.currentClass || '1');
    }
    const savedArrangements = localStorage.getItem(ARRANGEMENTS_KEY);
    if (savedArrangements) {
      setArrangements(JSON.parse(savedArrangements));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      students,
      layout,
      currentClass
    }));
  }, [students, layout, currentClass]);

  useEffect(() => {
    localStorage.setItem(ARRANGEMENTS_KEY, JSON.stringify(arrangements));
  }, [arrangements]);

  // Initialize seats based on layout
  useEffect(() => {
    const newSeats: Seat[] = [];
    const totalSeats = layout.type === 'grid' 
      ? layout.rows! * layout.columns!
      : layout.type === 'tables'
      ? layout.tableCount! * layout.seatsPerTable!
      : layout.totalSeats!;

    for (let i = 0; i < totalSeats; i++) {
      const existingSeat = seats.find(s => s.id === i);
      newSeats.push({
        id: i,
        label: generateSeatLabel(i, layout),
        studentId: existingSeat?.studentId || null,
        isUnavailable: existingSeat?.isUnavailable || false,
        isLocked: existingSeat?.isLocked || false,
      });
    }
    setSeats(newSeats);
  }, [layout]);

  const generateSeatLabel = (index: number, layout: Layout): string => {
    if (layout.type === 'grid') {
      const row = Math.floor(index / layout.columns!) + 1;
      const col = String.fromCharCode(65 + (index % layout.columns!));
      return `${col}${row}`;
    }
    if (layout.type === 'tables') {
      const tableNum = Math.floor(index / layout.seatsPerTable!) + 1;
      const seatNum = (index % layout.seatsPerTable!) + 1;
      return `T${tableNum}-${seatNum}`;
    }
    return `S${index + 1}`;
  };

  const handleRandomize = useCallback(() => {
    const availableStudents = students.filter(s => !s.isLocked);
    const availableSeats = seats.filter(s => !s.isUnavailable && !s.isLocked);
    
    // Shuffle students
    const shuffled = [...availableStudents].sort(() => Math.random() - 0.5);
    
    const newSeats = seats.map(seat => {
      if (seat.isUnavailable || seat.isLocked) return seat;
      
      const studentIndex = availableSeats.findIndex(s => s.id === seat.id);
      const assignedStudent = shuffled[studentIndex] || null;
      
      return {
        ...seat,
        studentId: assignedStudent?.id || null
      };
    });

    setSeats(newSeats);
    
    // Save arrangement for memory feature
    setArrangements(prev => ({
      ...prev,
      [`${currentClass}-${Date.now()}`]: {
        classId: currentClass,
        timestamp: Date.now(),
        seats: newSeats.map(s => ({ seatId: s.id, studentId: s.studentId }))
      }
    }));
  }, [students, seats, currentClass]);

  const handleSeatClick = (seatId: number) => {
    setSeats(prev => prev.map(seat => 
      seat.id === seatId ? { ...seat, isUnavailable: !seat.isUnavailable } : seat
    ));
  };

  const handleLockStudent = (studentId: string) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, isLocked: !s.isLocked } : s
    ));
  };

  const handleLockSeat = (seatId: number) => {
    setSeats(prev => prev.map(seat => 
      seat.id === seatId ? { ...seat, isLocked: !seat.isLocked } : seat
    ));
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      setStudents([]);
      setSeats([]);
      setArrangements({});
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ARRANGEMENTS_KEY);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">🪑 Classroom Seating Chart Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={handleRandomize}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition"
            >
              🎲 Randomize
            </button>
            <button
              onClick={handlePrint}
              className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg font-medium transition"
            >
              🖨️ Print
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
            >
              🗑️ Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 print:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1">
          {/* Sidebar - hidden when printing */}
          <div className="space-y-4 print:hidden">
            {/* Class Selector */}
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Period
              </label>
              <select
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={String(num)}>Period {num}</option>
                ))}
              </select>
            </div>

            <StudentInput students={students} setStudents={setStudents} />
            <LayoutSelector layout={layout} setLayout={setLayout} />

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
              <h3 className="font-semibold mb-2">💡 How to use:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Enter student names (one per line)</li>
                <li>Choose your classroom layout</li>
                <li>Click seats to mark them unavailable</li>
                <li>Lock students or seats by clicking 🔒</li>
                <li>Hit &quot;Randomize&quot; to generate seating</li>
                <li>Print or save your arrangement</li>
              </ul>
            </div>
          </div>

          {/* Main seating chart */}
          <div className="lg:col-span-2 print:col-span-1">
            <SeatGrid
              seats={seats}
              students={students}
              layout={layout}
              onSeatClick={handleSeatClick}
              onLockSeat={handleLockSeat}
              currentClass={currentClass}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
