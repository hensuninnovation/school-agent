'use client';

import React from 'react';
import { Student } from '@/types';

interface StudentInputProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function StudentInput({ students, setStudents }: StudentInputProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const names = e.target.value
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    const newStudents = names.map((name, index) => {
      const existing = students.find(s => s.name === name);
      return {
        id: existing?.id || `student-${Date.now()}-${index}`,
        name,
        isLocked: existing?.isLocked || false,
      };
    });
    
    setStudents(newStudents);
  };

  const toggleLock = (studentId: string) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, isLocked: !s.isLocked } : s
    ));
  };

  const removeStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">👥 Students</h2>
      
      <textarea
        value={students.map(s => s.name).join('\n')}
        onChange={handleTextChange}
        placeholder="Paste student names (one per line)..."
        className="w-full h-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      
      <div className="mt-2 text-sm text-gray-600">
        {students.length} student{students.length !== 1 ? 's' : ''}
      </div>
      
      {students.length > 0 && (
        <div className="mt-3 max-h-40 overflow-y-auto">
          <div className="text-xs font-medium text-gray-500 mb-2">Click 🔒 to lock a student in place:</div>
          <div className="space-y-1">
            {students.map(student => (
              <div key={student.id} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                <span className="text-sm truncate">{student.name}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleLock(student.id)}
                    className={`p-1 rounded ${student.isLocked ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                    title={student.isLocked ? 'Unlock student' : 'Lock student in place'}
                  >
                    {student.isLocked ? '🔒' : '🔓'}
                  </button>
                  <button
                    onClick={() => removeStudent(student.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Remove student"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
