import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@compliance-dashboard/ui';

const data = [
  { name: 'Completed', value: 400 },
  { name: 'In Progress', value: 300 },
  { name: 'Pending', value: 300 },
  { name: 'Overdue', value: 100 },
];

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export function App() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
           <div className="flex justify-between text-sm">
              <span className="text-gray-500">Overall Compliance</span>
              <span className="font-bold text-green-600">75%</span>
           </div>
           <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default App;
