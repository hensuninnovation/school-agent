'use client';

import React from 'react';
import { Layout } from '@/types';

interface LayoutSelectorProps {
  layout: Layout;
  setLayout: React.Dispatch<React.SetStateAction<Layout>>;
}

const LAYOUT_TYPES = [
  { id: 'grid', name: 'Grid (Rows & Columns)', icon: '⊞' },
  { id: 'tables', name: 'Table Groups', icon: '🪑' },
  { id: 'custom', name: 'Custom Total Seats', icon: '⚙️' },
] as const;

export default function LayoutSelector({ layout, setLayout }: LayoutSelectorProps) {
  const handleTypeChange = (type: Layout['type']) => {
    if (type === 'grid') {
      setLayout({ type, rows: 5, columns: 6 });
    } else if (type === 'tables') {
      setLayout({ type, tableCount: 6, seatsPerTable: 4 });
    } else {
      setLayout({ type, totalSeats: 30 });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">📐 Classroom Layout</h2>
      
      <div className="space-y-4">
        {/* Layout Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout Type</label>
          <div className="grid grid-cols-3 gap-2">
            {LAYOUT_TYPES.map(({ id, name, icon }) => (
              <button
                key={id}
                onClick={() => handleTypeChange(id as Layout['type'])}
                className={`p-2 rounded-lg text-center text-sm transition ${
                  layout.type === id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-xs">{name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Grid Options */}
        {layout.type === 'grid' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rows: {layout.rows}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={layout.rows}
                onChange={(e) => setLayout(prev => ({ ...prev, rows: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Columns: {layout.columns}</label>
              <input
                type="range"
                min="1"
                max="12"
                value={layout.columns}
                onChange={(e) => setLayout(prev => ({ ...prev, columns: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="text-sm text-gray-600">
              Total seats: <span className="font-semibold">{layout.rows! * layout.columns!}</span>
            </div>
          </div>
        )}

        {/* Table Options */}
        {layout.type === 'tables' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tables: {layout.tableCount}</label>
              <input
                type="range"
                min="1"
                max="15"
                value={layout.tableCount}
                onChange={(e) => setLayout(prev => ({ ...prev, tableCount: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats per Table: {layout.seatsPerTable}</label>
              <select
                value={layout.seatsPerTable}
                onChange={(e) => setLayout(prev => ({ ...prev, seatsPerTable: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                {[2, 3, 4, 5, 6, 8].map(n => (
                  <option key={n} value={n}>{n} seats</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Total seats: <span className="font-semibold">{layout.tableCount! * layout.seatsPerTable!}</span>
            </div>
          </div>
        )}

        {/* Custom Options */}
        {layout.type === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
            <input
              type="number"
              min="1"
              max="100"
              value={layout.totalSeats}
              onChange={(e) => setLayout(prev => ({ ...prev, totalSeats: parseInt(e.target.value) || 1 }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
