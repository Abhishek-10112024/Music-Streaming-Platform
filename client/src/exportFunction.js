import { users, songs, reports, userSongs, searchResults, playlists, playlistSongs, likes } from "./store";
import { navigate } from 'svelte-routing';


// fetch the users (admin access)
export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          users.set(data.users);
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
        } else {
            console.error('Failed to fetch users:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};


// fetch all songs
export const fetchSongs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/songs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        songs.set(data.songs);
      } else if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
      } else {
          console.error('Failed to fetch songs:', response.status, response.statusText);
      }
  } catch (error) {
      console.error('Fetch error:', error);
  }
};

// Fetch reported songs for admin
export const fetchReportedSongs = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/songs/reports', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
      if (response.ok) {
        const data = await response.json();
        reports.set(data.reports);
      } else if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
      } else {
          console.error('Failed to fetch reported songs:', response.status, response.statusText);
      }
  } catch (error) {
      console.error('Fetch error:', error);
  }
};

// Get user songs
export const getUserSongs = async () => {
    const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }
    try {
        const response = await fetch('http://localhost:5000/api/songs/my-songs', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            userSongs.set(data.songs);
          } else if (response.status === 401) {
              localStorage.removeItem('token');
              navigate('/');
          } else {
              console.error('Failed to fetch my songs:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
    };

// Search songs by title, artist, album, or genre
export const searchSongs = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }
        const response = await fetch(`http://localhost:5000/api/songs/search?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            searchResults.set(data.songs);
          } else if (response.status === 401) {
              localStorage.removeItem('token');
              navigate('/');
          } else {
              console.error('Failed to search songs:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
    };

// Fetch user playlists
export const fetchUserPlaylists = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }
        const response = await fetch('http://localhost:5000/api/playlists/my-playlists', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            playlists.set(data.playlists);
          } else if (response.status === 401) {
              localStorage.removeItem('token');
              navigate('/');
          } else {
              console.error('Failed to fetch my playlists:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
    };

// Fetch songs from a selected playlist
export const fetchPlaylistSongs = async (selectedPlaylist) => {
    const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }
    if (!selectedPlaylist) return;
    try {
        const response = await fetch(`http://localhost:5000/api/playlists/${selectedPlaylist}/songs`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            playlistSongs.set(data.songs);
          } else if (response.status === 401) {
              localStorage.removeItem('token');
              navigate('/');
          } else {
              console.error('Failed to fetch songs:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
    };

// Fetch liked songs
export const fetchLikedSongs = async () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }
        const response = await fetch('http://localhost:5000/api/playlists/liked-songs', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            likes.set(data.songs);
          } else if (response.status === 401) {
              localStorage.removeItem('token');
              navigate('/');
          } else {
              console.error('Failed to fetch liked songs:', response.status, response.statusText);
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
    };

