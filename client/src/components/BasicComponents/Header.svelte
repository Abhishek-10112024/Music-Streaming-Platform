<script>
  import { navigate } from 'svelte-routing'; 
  import { jwtDecode } from "jwt-decode";
  import Logout from '../Authentication/Logout.svelte';
  import { onMount } from 'svelte';

  let token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  // @ts-ignore
  let username = decodedToken.username;
  // @ts-ignore
  let role = decodedToken.role;

  onMount(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/');
  });
</script>

<header>
  <div class="logo-container">
    <img 
      src="https://cdn-icons-png.flaticon.com/512/3820/3820321.png" 
      alt="Logo" 
      class="logo"
    />
    <span class="logo-text">SoulPlay</span>
  </div>

  <div class="nav-links">
    <a href="#!" on:click={() => navigate('/playlist')}>My Playlists</a>
    <a href="#!" on:click={() => navigate('/upload')}>Upload Song</a>
    <a href="#!" on:click={() => navigate('/mysongs')}>My Uploaded Songs</a>
    {#if role === 'admin'}
    <a href="#!" on:click={() => navigate('/reportedsongs')}>Reported Songs</a>
    <a href="#!" on:click={() => navigate('/users')}>User Management</a>
    <a href="#!" on:click={() => navigate('/deletesong')}>Song Management</a>
    {/if}
    <a href="#!" class="welcome-text">Hello, {username}</a>
    <Logout />
  </div>
</header>

<style>
  header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: #1a1a1a;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 2rem; 
}

.logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: bold;
  margin-left: 0.75rem;
  color: #00bcd4;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.3s ease, transform 0.2s ease;
}

.nav-links a:hover {
  color: #00bcd4;
  transform: translateY(-2px);
}

.nav-links a.welcome-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.nav-links a.welcome-text:hover {
  color: #00bcd4;
  transform: none;
}
</style>
