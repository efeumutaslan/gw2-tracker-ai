import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary-900/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          GW2 Quest Tracker
          <span className="ml-3 text-sm font-normal text-primary-200 opacity-70">
            (lecker lecker version)
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-primary-100">
          Track your daily and weekly Guild Wars 2 quests with ease
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-12">
          <Link 
            href="/login"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition border border-white"
          >
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Character Tracking</h3>
            <p className="text-primary-100">Track quests per character or account-wide</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Auto Reset</h3>
            <p className="text-primary-100">Automatic daily and weekly resets at GW2 times</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">GW2 API Sync</h3>
            <p className="text-primary-100">Sync characters directly from your account</p>
          </div>
        </div>
      </div>
    </div>
  );
}
