<script>
    import { navigate } from 'svelte-routing'; 
    import { jwtDecode } from "jwt-decode";
    import Logout from '../Authentication/Logout.svelte';
    let token = localStorage.getItem('token');
    let username = null;
    const decodedToken = jwtDecode(token);
    // @ts-ignore
    username = decodedToken.username;
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
      <a href="#!" on:click={() => navigate('/my-playlists')}>My Playlists</a>
      <a href="#!">Hello, {username}</a>
      <Logout/>
    </div>
  </header>

  
  <style>
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #333;
      color: white;
    }
  
    .logo-container {
      display: flex;
      align-items: center;
    }
  
    .logo {
      width: 40px;
      height: 40px;
    }
  
    .logo-text {
      font-size: 1.5rem;
      font-weight: bold;
      margin-left: 0.5rem;
    }
  
    .nav-links {
      display: flex;
      gap: 1rem;
    }
  
    .nav-links a {
      color: white;
      text-decoration: none;
      font-size: 1rem;
    }
  
    .nav-links a:hover {
      text-decoration: underline;
    }
  </style>
  
  