import { ChevronDown, Settings, LogOut, Search, Plus } from 'lucide-react';
import { useState } from 'react';

export default function UserHomePage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const playlists = [
    { name: 'Liked Songs', count: '336 songs', icon: '💜', playing: false },
    { name: 'Symmetry - Karan Aujla x Ed Sheeran', count: 'Playlist • Topsify Canada', playing: false },
    { name: 'Top 50 Urdu Qawwalies', count: 'Album • Nusrat Fateh Ali Khan', playing: true },
    { name: 'Weeknd Hours', count: 'Playlist • arkamareeb', playing: false },
    { name: 'Farak', count: 'Artist', playing: false },
    { name: 'Wavy', count: 'Single • Karan Aujla', playing: false },
    { name: 'K', count: 'Playlist • arhanalam', playing: false },
    { name: 'Her', count: 'Playlist • arhanalam', playing: false },
  ];

  const recentPlaylists = [
    { title: 'Top 50 Urdu Qawwalies', image: 'https://i.pinimg.com/originals/91/22/60/912260373c0d9bee4d5bbf80d1af8033.jpg' },
    { title: 'Whiskncriggs', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300' },
    { title: 'P-POP CULTURE', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' },
    { title: 'Symmetry - Karan Aujla x Ed Sheeran', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300' },
    { title: 'HARD DRIVE Vol. 2', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300' },
    { title: 'Different Phase', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300' },
  ];

  const madeForYou = [
    { title: 'Discover Weekly', subtitle: 'Your shortcut to hidden gems & daily vibes.', type: 'Mix' },
    { title: 'Daily Mix 1', subtitle: 'Pritam, Arijit Singh, Vishal–Shekhar & more', type: 'Mix' },
    { title: 'Daily Mix 2', subtitle: 'Karan Aujla, Prem Dhillon, Sunanda Sharma', type: 'Mix' },
    { title: 'Daily Mix 3', subtitle: 'AP Dhillon, Cheema Y, JERRY & others', type: 'Mix' },
  ];

  return (
    <div className="min-h-screen bg-black flex text-white">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-neutral-950 to-black border-r border-neutral-900 flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">Your Library</h2>
            <button className="text-neutral-400 hover:text-white transition">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="px-3 py-1.5 bg-purple-700/30 text-white text-sm rounded-full">Playlists</button>
            <button className="px-3 py-1.5 text-neutral-400 hover:text-white text-sm rounded-full">Albums</button>
            <button className="px-3 py-1.5 text-neutral-400 hover:text-white text-sm rounded-full">Artists</button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search in library"
              className="w-full pl-10 pr-4 py-2 bg-neutral-900/80 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-400 mb-3">
            <span>Recents</span>
            <button className="hover:text-white">⋮</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {playlists.map((playlist, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-900 cursor-pointer transition"
            >
              <div className="w-12 h-12 bg-purple-600/20 rounded flex items-center justify-center text-xl">
                {playlist.icon || '🎵'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{playlist.name}</p>
                <p className="text-neutral-400 text-xs truncate">
                  {playlist.playing && <span className="text-green-500">▶ </span>}
                  {playlist.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900 via-black to-black">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-neutral-900/70 backdrop-blur-lg border-b border-neutral-800">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pinimg.com/originals/91/22/60/912260373c0d9bee4d5bbf80d1af8033.jpg"
                alt="TuneHive"
                className="w-9 h-9 rounded-full object-cover"
              />
              <h1 className="text-lg font-bold">TuneHive</h1>
            </div>

            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="What do you want to play?"
                  className="w-full pl-12 pr-4 py-3 bg-neutral-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-neutral-800 px-3 py-2 rounded-full hover:bg-neutral-700 transition"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  A
                </div>
                <span className="font-medium text-sm">arhanalam</span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-neutral-900 rounded-lg shadow-xl border border-neutral-800 py-2">
                  <a href="/settings" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-neutral-800">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </a>
                  <a href="/logout" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-neutral-800">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Body */}
        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-full">All</button>
            <button className="px-4 py-2 bg-neutral-800 text-white text-sm rounded-full hover:bg-neutral-700">Music</button>
            <button className="px-4 py-2 bg-neutral-800 text-white text-sm rounded-full hover:bg-neutral-700">Podcasts</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {recentPlaylists.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-neutral-800/40 rounded-lg overflow-hidden hover:bg-neutral-700/50 transition cursor-pointer"
              >
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover" />
                <p className="text-white font-medium text-sm flex-1 pr-4 truncate">{item.title}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl font-bold">Made For arhanalam</h2>
              <button className="text-neutral-400 hover:text-white text-sm">Show all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {madeForYou.map((item, index) => (
                <div
                  key={index}
                  className="bg-neutral-900/50 p-4 rounded-lg hover:bg-neutral-800 transition-all cursor-pointer group"
                >
                  <div className="relative mb-4">
                    <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
                    <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{item.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-2">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
