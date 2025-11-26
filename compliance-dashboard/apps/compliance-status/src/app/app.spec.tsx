import { render, screen } from '@testing-library/react';
import { App } from './app';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';

// Mock Recharts because it relies on DOM dimensions which are tricky in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => <div>Pie Chart</div>,
  Cell: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

// Mock UI library
vi.mock('@compliance-dashboard/ui', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h1>{children}</h1>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

describe('ComplianceStatus App', () => {
  it('should render chart and summary metrics', () => {
    render(<App />);
    expect(screen.getByText('Compliance Status')).toBeTruthy();
    expect(screen.getByText('Overall Compliance')).toBeTruthy();
    expect(screen.getByText('75%')).toBeTruthy();
  });
});

