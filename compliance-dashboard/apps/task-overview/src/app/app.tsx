import { create } from 'zustand';

/**
 * Represents a single compliance task within the system.
 * @property {string} id - Unique identifier for the task.
 * @property {string} title - Descriptive title of the task.
 * @property {string} dueDate - Due date in YYYY-MM-DD format.
 * @property {string} assignedTo - Name of the person responsible.
 * @property {'Pending' | 'In Progress' | 'Completed' | 'Overdue'} status - Current workflow status.
 */
interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
}

/**
 * Zustand store interface for managing task state.
 */
interface TaskStore {
  /** List of all compliance tasks */
  tasks: Task[];
  /** Current active filter for task list */
  filter: string;
  /**
   * Updates the current filter state.
   * @param {string} filter - The status string to filter by (e.g., 'Pending', 'All').
   */
  setFilter: (filter: string) => void;
  /**
   * Marks a specific task as completed.
   * @param {string} id - The unique ID of the task to update.
   */
  completeTask: (id: string) => void;
}

/**
 * Global state store for Task Overview module.
 * Uses Zustand for lightweight state management without prop drilling.
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
  completeTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t)
  }))
}));

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@compliance-dashboard/ui';

/**
 * Task Overview Module Entry Point.
 * Displays a filterable data table of compliance tasks.
 * Allows users to filter by status and mark tasks as complete.
 * 
 * @returns {JSX.Element} The rendered Task Overview component.
 */
export function App() {
  const { tasks, filter, setFilter, completeTask } = useTaskStore();

  const filteredTasks = tasks.filter(t => filter === 'All' || t.status === filter);

  /**
   * Helper function to determine the badge color based on task status.
   * @param {string} status - The status of the task.
   * @returns {string} Tailwind CSS class string.
   */
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
        <select
          className="px-3 py-1 border rounded text-sm text-gray-600"
          aria-label="Filter tasks by status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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
                <th className="px-6 py-3" scope="col">Task Title</th>
                <th className="px-6 py-3" scope="col">Due Date</th>
                <th className="px-6 py-3" scope="col">Assigned To</th>
                <th className="px-6 py-3" scope="col">Status</th>
                <th className="px-6 py-3" scope="col">Actions</th>
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
