# 🗡️ GW2 Quest Tracker

A comprehensive Guild Wars 2 quest and progress tracking application built with modern web technologies.

## ✨ Features

- **Quest Management** - Track daily, weekly, and custom quests with automatic reset timers
- **Character System** - Sync and manage multiple GW2 characters via API
- **Legendary Tracker** - Track legendary weapon/armor progress with material requirements and TP pricing
- **Achievement System** - Unlock achievements based on your gameplay milestones
- **Analytics Dashboard** - View detailed statistics and weekly performance charts
- **World Boss Timers** - Never miss a world boss with countdown timers
- **Streak Tracking** - Build and maintain daily completion streaks
- **GW2 API Integration** - Automatic sync with official Guild Wars 2 API
- **PWA Support** - Install as a desktop/mobile app

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Authentication:** Supabase Auth
- **API:** GW2 Official API v2

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account
- A Guild Wars 2 API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gw2-tracker-ai.git
cd gw2-tracker-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
- Supabase URL and keys
- Database connection string
- Encryption key (generate with: `openssl rand -hex 32`)
- JWT secret (generate with: `openssl rand -base64 32`)

4. Set up Supabase:
- Create a new Supabase project
- Run the database migrations from the `migrations` folder (available in repository releases)
- Enable Row Level Security (RLS)

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
ENCRYPTION_KEY=
JWT_SECRET=
CRON_SECRET=
NEXT_PUBLIC_APP_URL=
```

## 📖 Usage

1. **Register/Login** - Create an account or sign in
2. **Add API Key** - Add your GW2 API key in Settings
3. **Sync Characters** - Import your characters from GW2
4. **Create Quests** - Add daily/weekly quests to track
5. **Track Progress** - Complete quests and watch your streak grow!
6. **Set Legendary Goals** - Track your legendary crafting progress

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Data from [Guild Wars 2 API](https://wiki.guildwars2.com/wiki/API:Main)

---

**Note:** This is a fan-made project and is not affiliated with ArenaNet or Guild Wars 2.
