
export interface StudentResult {
  [key: string]: string | number;
}

export interface ResultCollection {
  id: string; // Year_Class_ExamName
  year: string;
  className: string;
  examName: string;
  data: StudentResult[];
  headers?: string[]; // To preserve Excel column sequence
  createdAt: any;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  isApproved: boolean;
}
