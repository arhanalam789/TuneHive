# TuneHive 🎵

A modern, full-stack music streaming application built with React, Node.js, Express, and MongoDB. TuneHive offers a premium music listening experience with playlist management, user authentication, and a beautiful, responsive UI.

![TuneHive](https://i.pinimg.com/originals/91/22/60/912260373c0d9bee4d5bbf80d1af8033.jpg)

## 🌟 Features

### User Features
- **Music Streaming** - Play high-quality audio with a persistent music player
- **Playlist Management** - Browse and play curated playlists
- **Liked Songs** - Save your favorite tracks
- **Search & Filter** - Find songs by title, artist, or album
- **Pagination** - Browse large music libraries efficiently
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Global Music Player** - Persistent player with play/pause, next/previous, volume control, and seek functionality

### Admin Features
- **Song Management** - Upload, edit, and delete songs
- **Playlist Management** - Create, edit, and delete playlists
- **Dashboard Statistics** - View platform analytics
- **AWS S3 Integration** - Cloud storage for audio files and cover images

### Authentication & Security
- **User Registration & Login** - Secure authentication with JWT
- **Password Reset** - Email-based OTP verification
- **Admin Authentication** - Separate admin access control
- **Protected Routes** - Client-side route protection

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **AWS SDK** - S3 file storage
- **Multer** - File upload handling

## 📁 Project Structure

```
TuneHive/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── MusicPlayer.jsx
│   │   ├── context/
│   │   │   └── PlayerContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── UserPlaylistDetails.jsx
│   │   │   ├── Login_page.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── AdminPower/
│   │   │   │   ├── Admin_Home.jsx
│   │   │   │   ├── AddSong.jsx
│   │   │   │   ├── AllSong.jsx
│   │   │   │   ├── AddPlaylist.jsx
│   │   │   │   ├── AllPlaylists.jsx
│   │   │   │   └── PlaylistDetails.jsx
│   │   │   └── components/
│   │   │       └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── Backend/
    ├── controllers/
    │   ├── authController.js
    │   ├── adminAuthController.js
    │   ├── adminPowerController.js
    │   └── userController.js
    ├── models/
    │   ├── userModel.js
    │   ├── adminModel.js
    │   ├── songModel.js
    │   └── playlistModel.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── adminAuthRoutes.js
    │   ├── adminPowerRoutes.js
    │   └── userRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── multerConfig.js
    ├── server.js
    └── package.json
```

## 🔌 API Documentation

### Base URL
```
Production: https://tunehive-nw51.onrender.com
Development: http://localhost:3000
```

### Authentication APIs

#### User Authentication

**POST** `/api/auth/register`
- Register a new user
- Body: `{ username, email, password }`
- Returns: `{ success, message, user }`

**POST** `/api/auth/login`
- User login
- Body: `{ email, password }`
- Returns: `{ success, message, user, token }` (sets HTTP-only cookie)

**POST** `/api/auth/logout`
- User logout
- Returns: `{ success, message }`

**POST** `/api/auth/forgot-password`
- Request password reset OTP
- Body: `{ email }`
- Returns: `{ success, message }`

**POST** `/api/auth/verify-otp`
- Verify OTP code
- Body: `{ email, otp }`
- Returns: `{ success, message }`

**POST** `/api/auth/reset-password`
- Reset password with OTP
- Body: `{ email, otp, newPassword }`
- Returns: `{ success, message }`

#### Admin Authentication

**POST** `/api/adminauth/register`
- Register a new admin
- Body: `{ username, email, password }`
- Returns: `{ success, message, admin }`

**POST** `/api/adminauth/login`
- Admin login
- Body: `{ email, password }`
- Returns: `{ success, message, admin, token }` (sets HTTP-only cookie)

**POST** `/api/adminauth/logout`
- Admin logout
- Returns: `{ success, message }`

### Song Management APIs

**POST** `/api/adminpower/upload-song`
- Upload a new song (Admin only)
- Content-Type: `multipart/form-data`
- Fields: `title, artist, album, audio (file), image (file)`
- Returns: `{ success, message, song }`

**GET** `/api/adminpower/all-songs`
- Get all songs with pagination and search
- Query params: `page, limit, search, sort`
- Returns: `{ success, songs, totalPages, currentPage, totalSongs }`

**PUT** `/api/adminpower/edit-song/:id`
- Edit song details (Admin only)
- Body: `{ title, artist, album }`
- Returns: `{ success, message, song }`

**DELETE** `/api/adminpower/delete-song/:id`
- Delete a song (Admin only)
- Returns: `{ success, message }`

### Playlist Management APIs

**POST** `/api/adminpower/add-playlist`
- Create a new playlist (Admin only)
- Content-Type: `multipart/form-data`
- Fields: `title, description, coverImage (file)`
- Returns: `{ success, message, playlist }`

**GET** `/api/adminpower/all-playlists`
- Get all playlists
- Returns: `{ success, playlists }`

**GET** `/api/adminpower/playlist/:id`
- Get playlist by ID with populated songs
- Returns: `{ success, playlist }`

**PUT** `/api/adminpower/playlist/:id/songs`
- Update songs in a playlist (Admin only)
- Body: `{ songs: [songId1, songId2, ...] }`
- Returns: `{ success, message, playlist }`

**PUT** `/api/adminpower/playlist/:id/edit`
- Edit playlist details (Admin only)
- Content-Type: `multipart/form-data`
- Fields: `title, description, coverImage (file, optional)`
- Returns: `{ success, message, playlist }`

**DELETE** `/api/adminpower/playlist/:id/delete`
- Delete a playlist (Admin only)
- Returns: `{ success, message }`

### User Feature APIs

**POST** `/api/user/toggle-like`
- Like/unlike a song (Authenticated users)
- Body: `{ songId }`
- Returns: `{ success, message, isLiked }`

**GET** `/api/user/liked-songs`
- Get user's liked songs (Authenticated users)
- Returns: `{ success, likedSongs }`

### Admin Dashboard APIs

**GET** `/api/adminpower/stats`
- Get dashboard statistics (Admin only)
- Returns: `{ success, stats: { totalSongs, totalPlaylists, totalUsers } }`

## 🗄️ Database Models

### User Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  likedSongs: [ObjectId] (ref: 'Song'),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  username: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Song Model
```javascript
{
  title: String (required),
  artist: String (required),
  album: String,
  songurl: String (required, S3 URL),
  imageurl: String (S3 URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Playlist Model
```javascript
{
  title: String (required),
  description: String,
  coverImage: String (S3 URL),
  songs: [ObjectId] (ref: 'Song'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- AWS Account (for S3 storage)
- Email service (Brevo/SMTP)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/arhanalam789/TuneHive.git
cd TuneHive
```

2. **Backend Setup**
```bash
cd Backend
npm install
```

Create `.env` file:
```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FROM_EMAIL=noreply@tunehive.com
BREVO_API_KEY=your_brevo_api_key
NODE_ENV=development
```

Start backend server:
```bash
npm run dev
```

3. **Frontend Setup**
```bash
cd Frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

Start frontend:
```bash
npm run dev
```

## 🎨 Key Features Explained

### Global Music Player
- **Persistent Player**: Stays visible across all pages after login
- **Playback Controls**: Play, pause, next, previous, shuffle, repeat
- **Progress Bar**: Visual progress with seek functionality
- **Volume Control**: Adjustable volume slider
- **Queue Management**: Automatically creates playlist queue when playing songs
- **Responsive Design**: Adapts to mobile, tablet, and desktop screens

### Search & Pagination
- **Backend-driven**: Efficient database queries with MongoDB
- **Search**: Filter songs by title, artist, or album
- **Sorting**: Sort by newest, oldest, A-Z, Z-A
- **Pagination**: 10 songs per page by default

### Liked Songs
- **Toggle Like**: Add/remove songs from favorites
- **Dedicated View**: Filter to show only liked songs
- **Persistent Storage**: Saved in user's database record

### Responsive UI
- **Mobile-First**: Optimized for small screens
- **Breakpoints**: 
  - Mobile: < 768px (hides extra controls)
  - Tablet: 768px - 1024px (shows volume control)
  - Desktop: > 1024px (full features)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Password Hashing**: Bcrypt with salt rounds
- **Protected Routes**: Client and server-side protection
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile**: Compact player, essential controls only
- **Tablet**: Medium-sized player with volume control
- **Desktop**: Full-featured player with all controls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Arhan Alam**
- GitHub: [@arhanalam789](https://github.com/arhanalam789)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from Spotify
- Cloud storage by AWS S3

---

**Made with ❤️ by Arhan Alam**


vercel link: https://tunehive.vercel.app
render link: https://tunehive-nw51.onrender.com