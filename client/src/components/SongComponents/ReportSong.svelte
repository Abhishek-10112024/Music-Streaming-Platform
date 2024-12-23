<script>
  export let selectedSongId; // Receive the selected song ID from the parent
  export let close; // Close function passed from the parent
  import { fetchSongs } from "../../exportFunction";
  let reason = ''; 
  let errorMessage = '';
  let successMessage = '';

  // report a song
  const reportSong = async () => {
      if (!reason.trim()) {
          errorMessage = 'Please provide a reason for reporting.';
          successMessage = '';
          return;
      }

      try {
          const response = await fetch(`http://localhost:5000/api/songs/report/${selectedSongId}`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reason }),
          });

          if (response.ok) {
              successMessage = 'Song reported successfully.';
              errorMessage = '';
              reason = ''; 
              close();
              fetchSongs(); 
          } else {
              const errorData = await response.json();
              errorMessage = errorData.message || 'Error reporting song';
              successMessage = '';
          }
      } catch (err) {
          console.error('Error reporting song:', err);
          errorMessage = 'An error occurred. Please try again later.';
          successMessage = '';
      }
  };

  const reportingReason = (event) => {
      reason = event.target.value;
  };
</script>

<div class="modal-overlay">
    <div class="modal-content">
        <button class="close-button" on:click={close}>×</button>
        <h3>🎶 Report Song</h3>
  
        <label for="reason">Reason for Reporting:</label>
        <textarea
            id="reason"
            bind:value={reason}
            on:input={reportingReason}
            rows="4"
            placeholder="Please provide a reason for reporting this song..."
        ></textarea>
  
        <button on:click={reportSong} class="report-button">Report Song</button>
  
        {#if successMessage}
            <div class="message success">{successMessage}</div>
        {/if}
  
        {#if errorMessage}
            <div class="message error">{errorMessage}</div>
        {/if}
    </div>
</div>
  
<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        animation: fadeIn 0.3s forwards;
    }

    .modal-content {
        background-color: #fff;
        padding: 40px;
        border-radius: 15px;
        width: 500px;
        max-width: 90%;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        transform: translateY(-30px);
        animation: slideIn 0.3s ease-out forwards;
        position: relative;
    }

    .modal-content h3 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 25px;
        color: #333;
        text-align: center;
        text-transform: capitalize;
    }

    .modal-content label {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
    }

    .modal-content textarea {
        width: 100%;
        padding: 12px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin-bottom: 20px;
        resize: vertical;
        transition: border-color 0.3s ease;
    }
  
    .modal-content textarea:focus {
        border-color: #007bff;
        outline: none;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: transparent;
        border: none;
        font-size: 18px;
        color: #888;
        cursor: pointer;
        transition: color 0.3s ease;
    }
  
    .close-button:hover {
        color: #ff4c4c;
    }

    .message {
        margin-top: 15px;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        text-align: center;
        transition: background-color 0.3s ease;
    }
  
    .message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
  
    .message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .report-button {
        padding: 14px 22px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
        width: 100%;
        transition: background-color 0.3s, transform 0.2s;
    }
  
    .report-button:hover {
        background-color: #0056b3;
        transform: translateY(-2px);
    }
  
    /* Keyframe Animations */
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
  
    @keyframes slideIn {
        0% {
            transform: translateY(-30px);
        }
        100% {
            transform: translateY(0);
        }
    }
</style>  