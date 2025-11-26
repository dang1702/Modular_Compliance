import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@compliance-dashboard/ui';
import { CheckCircle, AlertTriangle, Clock, User } from 'lucide-react';

const activities = [
  { id: 1, user: 'Alice Smith', action: 'Completed task "GDPR Check"', time: '10 mins ago', icon: CheckCircle, color: 'text-green-500' },
  { id: 2, user: 'System', action: 'Alert: Policy #404 Overdue', time: '1 hour ago', icon: AlertTriangle, color: 'text-red-500' },
  { id: 3, user: 'Bob Jones', action: 'Updated "KYC Verification"', time: '2 hours ago', icon: Clock, color: 'text-blue-500' },
  { id: 4, user: 'Admin', action: 'Added new user "Sarah"', time: '1 day ago', icon: User, color: 'text-gray-500' },
];

export function App() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
              <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default App;
