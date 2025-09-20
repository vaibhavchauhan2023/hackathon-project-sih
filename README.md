# 🎮 Pappy Learning Platform

An interactive, gamified learning platform designed specifically for kids aged 6-14. The platform combines education with entertainment through engaging stories, mini-games, and achievement systems.

## 🌟 Features

### 🎯 Core Learning Features
- **5 Learning Worlds**: Science World, History Land, Math Galaxy, Life Skills Village, AI & Future City
- **Interactive Stories**: Choose-your-own-adventure style learning
- **Mini-Games**: Drag & drop, quizzes, motion-based activities
- **Daily Challenges**: Fun brain teasers and activities
- **Progress Tracking**: Detailed analytics for parents and kids

### 🏆 Gamification Elements
- **XP System**: Earn experience points for completing activities
- **Coins & Rewards**: Collect virtual currency for achievements
- **Badges**: Unlock special achievements (Kindness Hero, Math Wizard, etc.)
- **Avatar Customization**: Personalize your character with earned items
- **Leaderboards**: Weekly, monthly, and all-time rankings
- **Level System**: Unlock new content as you progress

### 👨‍👩‍👧‍👦 Parent Features
- **Progress Dashboard**: Track your child's learning journey
- **Activity Reports**: See what your child has been learning
- **Learning Recommendations**: Get suggestions for next activities
- **Safety Controls**: Manage content and time limits
- **Multi-Child Support**: Monitor multiple children from one account

## 🏗️ Project Structure

```
Pappy-app/
├── backend/                    # Backend API Server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── routes/                # API route definitions
│   │   ├── authRoutes.js      # Authentication endpoints
│   │   ├── gameRoutes.js      # Game and learning endpoints
│   │   ├── leaderboardRoutes.js # Leaderboard endpoints
│   │   └── parentRoutes.js    # Parent dashboard endpoints
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # User authentication logic
│   │   ├── gameController.js  # Game and progress logic
│   │   ├── leaderboardController.js # Leaderboard logic
│   │   └── parentController.js # Parent dashboard logic
│   └── models/                # Database connections
│       └── supabaseClient.js  # Supabase configuration
├── public/                    # Frontend Files
│   ├── Frontend/              # Main frontend directory
│   │   ├── web pages/         # HTML pages
│   │   ├── CSS/               # Stylesheets
│   │   ├── JS/                # JavaScript files
│   │   └── Asset/             # Images, GIFs, icons
│   ├── index.html             # Main entry point
│   ├── script.js              # Main JavaScript
│   └── style.css              # Main stylesheet
├── package.json               # Root package configuration
├── server.js                  # Legacy server (can be removed)
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. **Clone or download the project**
   ```bash
   cd /path/to/your/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   ```

4. **Set up Supabase Database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the database schema provided in the project documentation
   - This will create all necessary tables for users, worlds, missions, games, etc.

5. **Start the development server**
   ```bash
   # Start the main server
   npm run dev
   
   # Or start the backend separately
   npm run backend:dev
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The application should be running with all features available

## 🎨 Design System

### Color Palette
- **Background**: `#361169` (Deep Purple)
- **Text**: `#ffffff` (White)
- **Primary**: `#F09738` (Orange)
- **Secondary**: `#532093` (Purple)

### Typography
- **Font**: Feather Bold
- **Usage**: `font-family: "Feather Bold";`

### UI/UX Principles
- **Bright & Playful**: Pastel and vibrant colors
- **Cartoonish Icons**: Friendly mascots and characters
- **Gamified Interface**: Game-like menus and interactions
- **Rounded Elements**: Smooth, safe feel for kids
- **Sound & Feedback**: Audio cues and animations
- **Mobile-First**: Responsive design for all devices

## 🗄️ Database Schema

The platform uses Supabase (PostgreSQL) with the following main tables:

- **users**: Student profiles and progress
- **worlds**: Learning subjects/themes
- **missions**: Individual lessons and activities
- **games**: Interactive mini-games
- **user_progress**: Learning progress tracking
- **game_scores**: Game performance data
- **badges**: Achievement system
- **leaderboards**: Ranking system
- **daily_challenges**: Daily activities
- **avatar_items**: Customization options

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /user` - Get user data
- `PUT /profile/:userId` - Update profile
- `POST /logout` - User logout

### Games & Learning (`/api/games`)
- `POST /progress/mission` - Save mission progress
- `GET /progress/user/:userId` - Get user progress
- `POST /scores/save` - Save game score
- `GET /worlds` - Get all learning worlds
- `GET /worlds/:worldId/missions` - Get world missions
- `GET /badges/user/:userId` - Get user badges
- `GET /daily-challenge` - Get today's challenge

### Leaderboard (`/api/leaderboard`)
- `GET /weekly` - Weekly rankings
- `GET /monthly` - Monthly rankings
- `GET /all-time` - All-time rankings
- `GET /user/:userId/rank` - User's current rank

### Parent Dashboard (`/api/parents`)
- `GET /dashboard/:parentEmail` - Parent dashboard
- `GET /child/:childId/progress` - Child progress summary
- `GET /child/:childId/activity` - Child activity log
- `GET /child/:childId/recommendations` - Learning recommendations

## 🎮 Learning Worlds

### 🌍 Science World
- Space exploration and planets
- Periodic table and chemistry
- Environmental science
- Physics basics

### 📖 History Land
- Ancient civilizations
- Freedom fighters and heroes
- Historical stories and facts
- Geography and cultures

### ➗ Math Galaxy
- Number operations
- Geometry and shapes
- Problem-solving puzzles
- Mathematical concepts

### ❤️ Life Skills Village
- Kindness and empathy
- Personal hygiene
- Safety awareness
- Social skills

### 🤖 AI & Future City
- Basic AI concepts
- Digital citizenship
- Technology awareness
- Future skills

## 🛠️ Development

### Running in Development Mode
```bash
# Install nodemon for auto-restart
npm install -g nodemon

# Start development server
npm run dev
```

### Building for Production
```bash
# The application is ready for production
# Just ensure your .env file has production values
npm start
```

### Adding New Features
1. Create new routes in `backend/routes/`
2. Add controller logic in `backend/controllers/`
3. Update database schema if needed
4. Add frontend pages in `public/Frontend/web pages/`
5. Update navigation and styling

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on Supabase
- **User authentication** with Supabase Auth
- **Protected routes** requiring valid tokens
- **Parent controls** for content filtering
- **Safe user data** (no personal information exposure)

## 📱 Mobile Support

The platform is fully responsive and works on:
- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (iOS, Android)
- Touch-enabled devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Test with the provided sample data
- Ensure Supabase is properly configured

## 🎯 Future Enhancements

- **Multi-language support**
- **Advanced analytics**
- **Teacher dashboard**
- **Classroom management**
- **Offline mode**
- **Voice interactions**
- **AR/VR experiences**

---

**Happy Learning! 🎓✨**
