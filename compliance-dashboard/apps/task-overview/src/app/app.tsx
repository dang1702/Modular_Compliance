import { create } from 'zustand';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@compliance-dashboard/ui';

/**
 * Represents a single compliance task entity.
 */
interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
}

/**
 * Zustand store definition for Task Overview Module.
 * We use Zustand for state management because it's lightweight and perfect for
 * isolated microfrontends, avoiding the boilerplate of Redux.
 */
interface TaskStore {
  tasks: Task[];
  filter: string;
  setFilter: (filter: string) => void;
  completeTask: (id: string) => void;
}

/**
 * Global Store Implementation
 * This store is LOCAL to the Task Overview microfrontend.
 * It does not leak state to the Shell or other remotes, ensuring isolation.
 */
export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [
    { id: '1', title: 'Review AML Policy', dueDate: '2023-12-01', assignedTo: 'Alice Smith', status: 'In Progress' },
    { id: '2', title: 'KYC Verification - Batch A', dueDate: '2023-11-25', assignedTo: 'Bob Jones', status: 'Overdue' },
    { id: '3', title: 'Quarterly Audit Report', dueDate: '2023-12-15', assignedTo: 'Charlie Day', status: 'Pending' },
    { id: '4', title: 'GDPR Compliance Check', dueDate: '2023-11-30', assignedTo: 'Alice Smith', status: 'Completed' },
    { id: '5', title: 'Update Risk Assessment', dueDate: '2023-12-10', assignedTo: 'David Lee', status: 'Pending' },
  ],
  filter: 'All',
  setFilter: (filter) => set({ filter }),
  // Optimistic update: Update UI immediately when task is completed
  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t)
  }))
}));

export function App() {
  const { tasks, filter, setFilter, completeTask } = useTaskStore();

  // Client-side filtering logic
  const filteredTasks = tasks.filter(t => filter === 'All' || t.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Overview</CardTitle>
        {/* Filter Dropdown */}
        <select
          className="px-3 py-1 border rounded text-sm text-gray-600"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter tasks by status"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Task Title</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                  <td className="px-6 py-4">{task.dueDate}</td>
                  <td className="px-6 py-4">{task.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.status !== 'Completed' && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;
