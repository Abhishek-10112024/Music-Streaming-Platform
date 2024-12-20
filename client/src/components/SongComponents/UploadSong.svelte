<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  let title = '';
  let artist = '';
  let album = '';
  let genre = '';
  let duration = '';
  let songFile = null;
  let successMessage = '';
  let errorMessage = '';

  // Handle song file change
  const handleFileChange = (event) => {
    songFile = event.target.files[0]; // Set the file from the input
  };

  // Upload song to backend
  const uploadSong = async (event) => {
    event.preventDefault();

    if (!title || !artist || !album || !genre || !duration || !songFile) {
      errorMessage = 'All fields are required!';
      successMessage = ''; 
      return;
    }

    // Create FormData object and append form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('genre', genre);
    formData.append('duration', duration);
    formData.append('song', songFile);

    try {
      const response = await fetch('http://localhost:5000/api/songs/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        successMessage = 'Song uploaded successfully!';
        errorMessage = ''; 
        title = '';
        artist = '';
        album = '';
        genre = '';
        duration = '';
        songFile = null;
      } else {
        const data = await response.json();
        errorMessage = data.message || 'Error uploading song';
        successMessage = ''; 
      }
    } catch (err) {
      console.error('Error uploading song:', err);
      errorMessage = 'Error uploading song';
      successMessage = ''; 
    }
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  onMount(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  });
</script>

<h2>Upload a Song</h2>

<div class="form-container">
  {#if successMessage}
    <div class="success">{successMessage}</div>
  {/if}
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}

  <form on:submit={uploadSong}>
    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={title} required />

    <label for="artist">Artist:</label>
    <input type="text" id="artist" bind:value={artist} required />

    <label for="album">Album:</label>
    <input type="text" id="album" bind:value={album} required />

    <label for="genre">Genre:</label>
    <input type="text" id="genre" bind:value={genre} required />

    <label for="duration">Duration:</label>
    <input type="text" id="duration" bind:value={duration} required />

    <label for="song">Song File:</label>
    <input type="file" id="song" accept=".mp3" on:change={handleFileChange} required />

    <button type="submit">Upload Song</button>
  </form>
</div>

<div class="button-container">
      <button class="btn dashboard" on:click={navigateToDashboard}>Back to Dashboard</button>
</div>

<style>
  .form-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 30px;
    background: url(https://cdn-icons-png.flaticon.com/512/3820/3820321.png);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h2 {
    text-align: center;
    color: #333;
    font-size: 24px;
    margin-bottom: -20px;
  }

  .form-container label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 16px;
    color: #555;
  }

  .form-container input[type="text"] {
    width: 100%;
    padding: 12px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 10px;
    color: #333;
    box-sizing: border-box;
  }

  .form-container input[type="file"] {
    font-size: 13px;
    width: 100%;
    padding: 12px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    color: #333;
    box-sizing: border-box;
  }

  .form-container input[type="text"]:focus,
  .form-container input[type="file"]:focus {
    border-color: #4CAF50;
    outline: none;
    box-shadow: 0 0 5px rgba(72, 212, 103, 0.4);
  }

  .form-container button {
    padding: 12px 20px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    width: 100%;
  }

  .form-container button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  .button-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;
  }

  .btn {
      padding: 12px 25px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease, transform 0.3s;
      margin: 0 15px;
      background-color: #007bff;
      color: white;
  }

  .btn:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
  }

  .success {
    color: green;
    background-color: #d4edda;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
  }

  .error {
    color: red;
    background-color: #f8d7da;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
  }
</style>
