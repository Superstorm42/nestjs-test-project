import { TaskStatus } from '../task-status.enum';

export class GetTaskFilter {
  status: TaskStatus;
  search: string;
}
