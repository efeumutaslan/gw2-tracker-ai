'use client';

export default function AchievementsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          🏆 Achievements
        </h1>
        <p className="text-gray-400 mb-8">
          Coming soon - Track your quest achievements and milestones
        </p>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-xl font-semibold text-white mb-2">Under Development</h2>
          <p className="text-gray-400">
            Achievement tracking system is being rebuilt for better performance.
          </p>
        </div>
      </div>
    </div>
  );
}
