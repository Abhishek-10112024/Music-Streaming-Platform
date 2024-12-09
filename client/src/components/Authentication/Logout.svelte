<script>
    import { navigate } from 'svelte-routing';
  
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
                localStorage.removeItem('userRole');
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
</script>
  
  <div class="buttonContainer">
    <button class="btn1" on:click={logout}>Log Out</button>
  </div>
  
  <style>
    .buttonContainer {
      display: flex;
      justify-content: center; /* Center align the button */
      margin-top: 20px; /* Space above the button */
    }
  
    .btn1 {
      width: 120px; /* Increased width for better visibility */
      padding: 10px 20px; /* Padding for a larger clickable area */
      background: linear-gradient(45deg, #007bff, #0056b3); /* Gradient background */
      color: white; /* White text color */
      border: none; /* Remove default border */
      border-radius: 8px; /* More rounded corners for a modern look */
      font-size: 16px; /* Font size for the text */
      cursor: pointer; /* Pointer cursor on hover */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */
      transition: background 0.3s, transform 0.3s; /* Smooth transition for background and scale */
      outline: none; /* Remove default focus outline */
    }
  
    .btn1:hover {
      background: linear-gradient(45deg, #0056b3, #003d7a); /* Darker gradient on hover */
      transform: scale(1.05); /* Slightly enlarge on hover */
    }
  
    .btn1:active {
      transform: scale(0.98); /* Slightly shrink on click */
    }
  
    .btn1:focus {
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5); /* Focus outline for accessibility */
    }
  </style>
  