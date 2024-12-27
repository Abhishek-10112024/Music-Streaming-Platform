<script>
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
  
    const logout = async () => {
      const token = localStorage.getItem('token');

        if (!token) {
            alert('No user is currently logged in.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/', { replace: true });
            } else {
                const { message } = await response.json();
                alert(message || 'Error while logging out');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An unexpected error occurred while logging out.');
        }
    };

    onMount(() => {
        const token = localStorage.getItem('token')
        if (!token)
        navigate ('/')
    });
</script>
  
  <div class="buttonContainer">
    <button class="btn1" on:click={logout}>
      <img src="https://cdn-icons-png.flaticon.com/512/7756/7756285.png" width="24" height="24" alt="Logout Icon" />
    </button>
  </div>
  
  <style>
    .btn1 {
      width: 60px; 
      color: white; 
      border-radius: 8px; 
      cursor: pointer; 
      transition: background 0.3s, transform 0.3s;
    }
  
    .btn1:hover {
      transform: scale(1.05);
    }
  </style>
  