export interface Student {
  id: string;
  name: string;
  isLocked: boolean;
}

export interface Seat {
  id: number;
  label: string;
  studentId: string | null;
  isUnavailable: boolean;
  isLocked: boolean;
}

export interface Layout {
  type: 'grid' | 'tables' | 'custom';
  rows?: number;
  columns?: number;
  tableCount?: number;
  seatsPerTable?: number;
  totalSeats?: number;
}

export interface SeatingArrangement {
  classId: string;
  timestamp: number;
  seats: { seatId: number; studentId: string | null }[];
}
