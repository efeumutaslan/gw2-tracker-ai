import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            GW2 Quest Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your daily and weekly quests
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
