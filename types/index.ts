export interface Task {
  id: string;
  title: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
