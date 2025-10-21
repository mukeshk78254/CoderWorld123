import { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import axiosClient from '../utils/axiosClient';
import { motion } from 'framer-motion';


function getDifficultyColor(difficulty) {
  const normalizedDifficulty = difficulty ? String(difficulty).toLowerCase().trim() : '';
  switch (normalizedDifficulty) {
    case 'easy': return 'text-emerald-400'; 
    case 'medium': return 'text-amber-400'; 
    case 'hard': return 'text-red-400';     
    default: return 'text-gray-400';
  }
}

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth); 

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardSearchTerm, setLeaderboardSearchTerm] = useState(''); // New state for leaderboard search
  const [problems, setProblems] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
       
        const mockData = [
          { id: 'u1', username: 'ProCoderX', solvedProblems: 150, easy: 50, medium: 60, hard: 40, rank: 1, profilePic: 'https://i.pravatar.cc/150?img=68' },
          { id: 'u2', username: 'AlgoMaster', solvedProblems: 145, easy: 60, medium: 50, hard: 35, rank: 2, profilePic: 'https://i.pravatar.cc/150?img=60' },
          { id: 'u3', username: 'CodeNinja', solvedProblems: 130, easy: 45, medium: 55, hard: 30, rank: 3, profilePic: 'https://i.pravatar.cc/150?img=47' },
          { id: 'u4', username: 'SyntaxSorcerer', solvedProblems: 110, easy: 40, medium: 40, hard: 30, rank: 4, profilePic: 'https://i.pravatar.cc/150?img=33' },
          { id: 'u5', username: 'BugBuster', solvedProblems: 98, easy: 30, medium: 40, hard: 28, rank: 5, profilePic: 'https://i.pravatar.cc/150?img=25' },
          { id: 'u6', username: 'DevStrategist', solvedProblems: 90, easy: 35, medium: 35, hard: 20, rank: 6, profilePic: 'https://i.pravatar.cc/150?img=19' },
          { id: 'u7', username: 'LogicWizard', solvedProblems: 85, easy: 28, medium: 37, hard: 20, rank: 7, profilePic: 'https://i.pravatar.cc/150?img=11' },
          { id: 'u8', username: 'ByteBard', solvedProblems: 75, easy: 25, medium: 30, hard: 20, rank: 8, profilePic: 'https://i.pravatar.cc/150?img=5' },
          { id: 'u9', username: 'PixelPilot', solvedProblems: 60, easy: 20, medium: 25, hard: 15, rank: 9, profilePic: 'https://i.pravatar.cc/150?img=70' },
          { id: 'u10', username: 'CtrlAltDefeat', solvedProblems: 55, easy: 18, medium: 22, hard: 15, rank: 10, profilePic: 'https://i.pravatar.cc/150?img=65' },
        ];
        mockData.sort((a, b) => b.solvedProblems - a.solvedProblems);
        mockData.forEach((user, index) => user.rank = index + 1); 
        setLeaderboardData(mockData);

       
        const probRes = await axiosClient.get('/problem/getallproblem');
        setProblems(probRes.data || []);

        await new Promise(resolve => setTimeout(resolve, 800)); 
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filteredLeaderboardData = useMemo(() => {
    if (!leaderboardSearchTerm) {
      return leaderboardData;
    }
    const lowerCaseSearchTerm = leaderboardSearchTerm.toLowerCase();
    return leaderboardData.filter(user => 
      user.username.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [leaderboardData, leaderboardSearchTerm]);

  const handleLogout = () => {
    dispatch(logoutUser());
 
  };

  return (
    <div
      className="min-h-screen text-slate-200 bg-slate-950 font-sans p-8 animate-fade-in"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 90%, rgba(99, 102, 241, 0.05), transparent 60%),
          radial-gradient(circle at 90% 10%, rgba(139, 92, 246, 0.04), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.01), transparent 80%)
        `,
        backgroundAttachment: 'fixed',
      }}
    >
      
      <style>
        {`
        /* General fade-in for page loading */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in forwards;
        }

        /* For elements fading in from bottom */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Spinner animation (for loading states) */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 0.8s linear infinite;
        }

        /* Custom scrollbar for dropdown (re-using from ProblemPage) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b; /* slate-800 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569; /* slate-600 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b; /* slate-500 */
        }
        `}
      </style>

    
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-[0.015] select-none pointer-events-none font-extrabold tracking-widest text-gray-700 z-0">
        CoderWorld
      </div>

   
      <nav className="navbar sticky top-0 z-50 backdrop-blur-lg bg-gray-900/70 px-6 border-b border-gray-700 shadow-md animate-fade-in-down">
        
        <div className="flex-1">
          <NavLink to="/" className="flex items-center gap-3 group">
           
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/20 group-hover:shadow-cyan-500/40 transition-all duration-300"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-9 h-9"
              >
                <img 
                  src="/src/pages/2896418.png" 
                  alt="CoderWorld Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>
            
           
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:from-cyan-300 group-hover:to-purple-400 transition-all duration-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                CoderWorld
              </span>
              <span className="text-xs text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" style={{ fontFamily: "'Source Code Pro', monospace" }}>
                Code • Learn • Solve
              </span>
            </div>
          </NavLink>
        </div>

       
        <div className="flex-none hidden md:flex flex-grow justify-center">
          <ul className="menu menu-horizontal px-1 text-lg font-semibold">
            
            <li className="dropdown dropdown-hover">
              <div tabIndex={0} role="button" className="hover:text-indigo-400 transition-colors cursor-pointer py-2 px-3">
                Problems
              </div>
              <ul tabIndex={0} className="dropdown-content mt-3 p-2 shadow-xl menu bg-gray-800 rounded-box w-64 z-[60] border border-gray-700 backdrop-blur-md max-h-80 overflow-y-auto custom-scrollbar">
                {problems.length > 0 ? (
                  problems.map(p => (
                    <li key={p._id}>
                      <NavLink to={`/problem/${p._id}`} className="hover:bg-indigo-500/20 py-2 text-base text-gray-300">
                        {p.title}
                        <span className={`ml-auto badge badge-outline text-xs font-semibold`}
                              style={{borderColor: getDifficultyColor(p.difficulty).replace('text-', ''), color: getDifficultyColor(p.difficulty).replace('text-', '')}}>
                          {String(p.difficulty).toUpperCase()}
                        </span>
                      </NavLink>
                    </li>
                  ))
                ) : (
                  <li><span className="text-gray-500 italic py-2 px-4">No problems available</span></li>
                )}
              </ul>
            </li>
            <li><NavLink to="/contests" className="hover:text-indigo-400 transition-colors">Contests</NavLink></li>
            <li><NavLink to="/leaderboard" className="hover:text-indigo-400 transition-colors">Leaderboard</NavLink></li>
          </ul>
        </div>

      
        <div className="flex-none">
          <div className="dropdown dropdown-end ml-4">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-indigo-500 ring-offset-gray-900 ring-offset-2 hover:scale-105 transition-transform duration-200 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold"
                   style={{ boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}> {/* Subtle glow for avatar */}
                <span className="text-lg font-bold">{user?.firstname?.charAt(0).toUpperCase() || '?'}</span>
              </div>
            </div>
            <div tabIndex={0} className="dropdown-content mt-4 z-[60] w-64 overflow-hidden rounded-2xl bg-gray-800/80 backdrop-blur-md border border-gray-700 shadow-2xl shadow-black/30 animate-scale-in">
              <div className="p-4 bg-white/5">
                <p className="font-bold text-white text-lg truncate">
                  {user?.firstname || 'Valued'} {user?.lastname}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {user?.email || 'Welcome!'}
                </p>
              </div>
              <div className="h-px bg-gray-700" />
              <div className="p-2 space-y-1">
                <NavLink to="/profile" className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-indigo-500/20 hover:text-white transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  <span>Profile</span>
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/admin" className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-indigo-500/20 hover:text-white transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8a1 1 0 00-1 1v1h14V9a1 1 0 00-1-1H5z" /><path fillRule="evenodd" d="M3 11v5a2 2 0 002 2h10a2 2 0 002-2v-5H3zm3 2a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    <span>Admin Panel</span>
                  </NavLink>
                )}
                <NavLink to="/dashboard" className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-gray-300 hover:bg-indigo-500/20 hover:text-white transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                  <span>Dashboard</span>
                </NavLink>
                <div className="h-px bg-gray-700/50 my-1" />
                <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-5xl bg-gray-900/60 p-8 rounded-xl shadow-2xl border border-gray-700 animate-fade-in-up relative z-10" style={{ animationDelay: '0.3s' }}>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text mb-8 text-center"
            style={{ backgroundImage: 'linear-gradient(to right, #60A5FA, #8B5CF6)', textShadow: '0 0 15px rgba(96,165,250,0.4)' }}>
            CoderWorld Leaderboard
        </h1>

       
        <div className="form-control mb-8">
          <label className="label">
            <span className="label-text text-gray-300 font-semibold">Search Users</span>
          </label>
          <input
            type="text"
            placeholder="Search by username..."
            className="input input-bordered w-full bg-gray-800 border-gray-700 text-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
            value={leaderboardSearchTerm}
            onChange={(e) => setLeaderboardSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-10">
            <span className="loading loading-spinner loading-lg text-indigo-500 animate-spin-slow"></span>
            <p className="mt-4 text-gray-400 text-lg">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 text-lg">{error}</div>
        ) : (
          <>
            
            {filteredLeaderboardData.slice(0, 3).length > 0 && ( // Only show top 3 if there are matching users
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {filteredLeaderboardData.slice(0, 3).map((user, index) => (
                  <div key={user.id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                       style={{ borderColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                                boxShadow: index === 0 ? '0 0px 20px rgba(255,215,0,0.3)' : index === 1 ? '0 0px 15px rgba(192,192,192,0.2)' : '0 0px 10px rgba(205,127,50,0.2)' }}>
                    <div className="absolute inset-0 opacity-5 blur-xl" style={{ backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}></div>
                    <div className="relative z-10 flex flex-col items-center">
                      {user.profilePic && (
                        <img src={user.profilePic} alt={user.username} className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-indigo-500 shadow-md" />
                      )}
                      <span className={`text-5xl font-extrabold mb-2 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-amber-600'}`}
                            style={{ textShadow: `0 0 10px ${index === 0 ? 'rgba(255,215,0,0.7)' : index === 1 ? 'rgba(192,192,192,0.7)' : 'rgba(205,127,50,0.7)'}` }}>
                        #{user.rank}
                      </span>
                      <h3 className="text-2xl font-bold text-white mt-1">{user.username}</h3>
                      <p className="text-gray-400 mt-2">Problems Solved: <span className="font-mono text-white text-xl">{user.solvedProblems}</span></p>
                      <div className="mt-4 text-sm text-gray-400 grid grid-cols-3 gap-x-2 w-full">
                        <div className="text-center">Easy: <span className="font-mono text-emerald-400 font-bold">{user.easy}</span></div>
                        <div className="text-center">Medium: <span className="font-mono text-amber-400 font-bold">{user.medium}</span></div>
                        <div className="text-center">Hard: <span className="font-mono text-red-400 font-bold">{user.hard}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            
            <div className="overflow-x-auto bg-gray-800/40 rounded-xl border border-gray-700 shadow-xl">
              <table className="table w-full text-slate-200">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-700/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 rounded-tl-xl">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-300">User</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Total Solved</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Easy</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Medium</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-300">Hard</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboardData.length > 0 ? (
                    filteredLeaderboardData.map((user, index) => (
                      <tr key={user.id} className="hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-none">
                        <td className="px-6 py-4 font-bold text-lg">{user.rank}</td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          {user.profilePic && (
                            <img src={user.profilePic} alt={user.username} className="w-8 h-8 rounded-full object-cover border border-gray-600" />
                          )}
                          <NavLink to={`/profile/${user.id}`} className="link link-hover text-lg font-medium text-white hover:text-indigo-500 transition-colors">{user.username}</NavLink>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-xl">{user.solvedProblems}</td>
                        <td className="px-6 py-4 text-center font-mono text-emerald-400">{user.easy}</td>
                        <td className="px-6 py-4 text-center font-mono text-amber-400">{user.medium}</td>
                        <td className="px-6 py-4 text-center font-mono text-red-400">{user.hard}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10 opacity-70 text-lg">No users match the search criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;