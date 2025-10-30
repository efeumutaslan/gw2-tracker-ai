import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-primary-900/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            GW2 Quest Tracker
          </h1>
          <p className="text-gray-200 mt-2 drop-shadow">
            Track your daily and weekly quests
          </p>
        </div>
        <div className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-2xl p-8 border border-gray-700/50">
          {children}
        </div>
      </div>
    </div>
  );
}
