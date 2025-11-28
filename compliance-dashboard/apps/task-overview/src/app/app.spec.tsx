import { render, screen, fireEvent } from '@testing-library/react';
import { App, useTaskStore } from './app';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

// Mock UI components since they are not the focus of this unit test
vi.mock('@compliance-dashboard/ui', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardTitle: ({ children }: any) => <h1>{children}</h1>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

describe('TaskOverview App', () => {
  const originalState = useTaskStore.getState();

  beforeEach(() => {
    useTaskStore.setState(originalState);
  });

  it('should render task list correctly', () => {
    render(<App />);
    expect(screen.getByText('Task Overview')).toBeTruthy();
    expect(screen.getByText('Review AML Policy')).toBeTruthy();
    expect(screen.getByText('Alice Smith')).toBeTruthy();
  });

  it('should filter tasks when a status is selected', () => {
    render(<App />);
    
    // Initial state has tasks of mixed statuses
    expect(screen.getByText('Review AML Policy')).toBeTruthy(); // In Progress
    
    // Select 'Completed' filter
    const select = screen.getByLabelText('Filter tasks by status');
    fireEvent.change(select, { target: { value: 'Completed' } });

    // 'Review AML Policy' (In Progress) should disappear
    expect(screen.queryByText('Review AML Policy')).toBeNull();
    // 'GDPR Compliance Check' (Completed) should remain
    expect(screen.getByText('GDPR Compliance Check')).toBeTruthy();
  });

  it('should mark a task as completed', () => {
    render(<App />);
    
    // Find a task that is In Progress
    const taskTitle = screen.getByText('Review AML Policy');
    const row = taskTitle.closest('tr');
    const completeButton = row?.querySelector('button');
    
    expect(completeButton).toBeTruthy();
    if (completeButton) {
      fireEvent.click(completeButton);
    }

    // The task status should update to 'Completed' visually (button disappears)
    expect(row?.querySelector('button')).toBeNull();
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
  });
});

