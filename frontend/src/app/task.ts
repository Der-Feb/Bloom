import { IEmployee } from './employee';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABORTED = 'ABORTED'
}

export interface ITask {
  id?: number;
  title: string;
  description: string;
  taskDate: string; // LocalDate in backend maps to string in frontend (ISO)
  status: TaskStatus;
  createdBy: IEmployee;
  assignedEmployees: IEmployee[];
}
