import React, { Suspense } from 'react';
import '@aws-amplify/ui-react/styles.css';

// Lazy load remote microfrontends
const TaskOverview = React.lazy(() => import('taskOverview/App'));
const ComplianceStatus = React.lazy(() => import('complianceStatus/App'));
const RecentActivity = React.lazy(() => import('recentActivity/App'));

/**
 * Main Shell Application Component.
 * Acts as the host container for all microfrontends.
 * Handles Authentication and Global Layout.
 * 
 * @returns {JSX.Element} The authenticated dashboard or login screen.
 */
export function App() {
  // Mock authentication state for demonstration purposes
  // In production, this would be handled by AWS Amplify's <Authenticator>
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  /* 
   * REAL IMPLEMENTATION WITH AWS AMPLIFY:
   * 
   * return (
   *   <Authenticator>
   *     {({ signOut, user }) => (
   *       <DashboardLayout user={user} signOut={signOut} />
   *     )}
   *   </Authenticator>
   * );
   */

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Compliance Dashboard</h2>
          <p className="text-center text-gray-600">Protected by AWS Cognito</p>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login (Mock)
          </button>
          <p className="text-xs text-center text-gray-400">
            * In a real scenario, this would use the AWS Amplify Authenticator component (see code comments).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            🛡️ Compliance
          </h1>
        </div>
        <nav className="mt-6 flex-1">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Overview
          </div>
          <a href="#" className="flex items-center px-6 py-3 bg-blue-50 text-blue-700 border-r-2 border-blue-700">
            Dashboard
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            Tasks
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            Reports
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            Settings
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                A
              </div>
              <div>
                 <div className="text-sm font-medium">Admin User</div>
                 <div className="text-xs text-gray-500">admin@biwoco.com</div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
           <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                 Export Report
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                 + New Task
              </button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (Tasks & Activity) */}
          <div className="lg:col-span-2 space-y-6">
             <section>
               <Suspense fallback={<div className="h-64 bg-white rounded-lg animate-pulse"></div>}>
                  <TaskOverview />
               </Suspense>
             </section>
             
             <section>
               <Suspense fallback={<div className="h-64 bg-white rounded-lg animate-pulse"></div>}>
                  <RecentActivity />
               </Suspense>
             </section>
          </div>

          {/* Side Column (Status) */}
          <div className="space-y-6">
            <section>
               <Suspense fallback={<div className="h-64 bg-white rounded-lg animate-pulse"></div>}>
                  <ComplianceStatus />
               </Suspense>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
