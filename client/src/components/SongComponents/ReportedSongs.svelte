<script>
    import { onMount } from 'svelte';
    import { fetchReportedSongs } from '../../exportFunction';
    import { reports } from '../../store';
    import { navigate } from 'svelte-routing';

    let successMessage = '';
    let errorMessage = '';
    let selectedReportId = null;
    let selectedStatus = 'pending'; 

    // Resolve the report (Accept/Reject)
    const resolveReport = async () => {
        if (!['pending', 'rejected', 'accepted'].includes(selectedStatus)) {
            errorMessage = 'Invalid status selected';
            successMessage = '';
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/songs/reports/resolve/${selectedReportId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: selectedStatus }),
            });

            if (response.ok) {
                const data = await response.json();
                successMessage = data.message || 'Report resolved successfully';
                errorMessage = '';
                fetchReportedSongs(); 
            } else {
                const errorData = await response.json();
                errorMessage = errorData.message || 'Error resolving report';
                successMessage = '';
            }
        } catch (err) {
            console.error('Error resolving report:', err);
            errorMessage = 'An error occurred while resolving the report.';
            successMessage = '';
        }
    };

    // status change (accept/reject)
    const handleStatusChange = (event) => {
        selectedStatus = event.target.value;
    };

    // select the song to report
    const handleReportSelection = (reportId) => {
        selectedReportId = reportId;
    };

    const navigateToDashboard = () => {
    navigate('/dashboard');
    };

    onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        else fetchReportedSongs();
    });
</script>

<div class="resolve-form">
    <h2>🚨 Reported Songs</h2>
  
    {#if $reports.length > 0}
      <div class="reports-list">
        {#each $reports as report}
          <div class="report-item">
            <h4>🎵 {report.Song.title} by {report.Song.artist}</h4>
            <p><strong>Reason:</strong> {report.reason}</p>
            <p><strong>Status:</strong> <span class="status-tag {report.status}">{report.status}</span></p>
  
            <div class="resolve-buttons">
              <button class="select-button" on:click={() => handleReportSelection(report.id)}>
                Select this report
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="no-reports">🎧 No reports available.</p>
    {/if}
  
    {#if selectedReportId}
      <div class="report-status">
        <label for="status">Change Status:</label>
        <select id="status" bind:value={selectedStatus} on:change={handleStatusChange}>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
  
        <button class="resolve-button" on:click={resolveReport}>✅ Resolve Report</button>
      </div>
    {/if}
  
    {#if successMessage}
      <div class="message success">{successMessage}</div>
    {/if}
  
    {#if errorMessage}
      <div class="message error">{errorMessage}</div>
    {/if}
  </div>
  
  <div class="button-container">
    <button class="btn dashboard" on:click={navigateToDashboard}>🏠 Back to Admin Dashboard</button>
  </div>
  
  <style>
    .resolve-form {
      padding: 40px;
      background: linear-gradient(135deg, #ff6f91, #ff9671);
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      max-width: 900px;
      margin: 40px auto;
      color: #333;
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }
  
    h2 {
      font-size: 30px;
      color: #fff;
      text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.2);
      margin-bottom: 25px;
    }

    .message {
      padding: 15px;
      border-radius: 8px;
      font-size: 16px;
      margin-top: 20px;
      text-align: center;
    }
  
    .message.success {
      background-color: #d4edda;
      color: #155724;
    }
  
    .message.error {
      background-color: #f8d7da;
      color: #721c24;
    }
  
    .no-reports {
      font-size: 18px;
      color: #ffe4e1;
    }

    .reports-list {
      margin-top: 20px;
    }
  
    .report-item {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      margin-bottom: 20px;
    }
  
    .report-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
  
    .report-item h4 {
      font-size: 20px;
      margin-bottom: 10px;
    }
  
    .report-item p {
      font-size: 16px;
      margin-bottom: 8px;
    }
  
    .status-tag {
      padding: 4px 10px;
      border-radius: 12px;
      color: white;
      font-size: 14px;
      text-transform: capitalize;
    }
  
    .status-tag.pending {
      background-color: #ffc107;
    }
  
    .status-tag.accepted {
      background-color: #28a745;
    }
  
    .status-tag.rejected {
      background-color: #dc3545;
    }

    .resolve-buttons {
      margin-top: 10px;
    }
  
    .select-button,
    .resolve-button {
      padding: 12px 25px;
      background: #007bff;
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.3s;
    }
  
    .select-button:hover,
    .resolve-button:hover {
      background-color: #0056b3;
      transform: translateY(-3px);
    }

    .report-status {
      margin-top: 30px;
      text-align: center;
    }
  
    .report-status label {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }
  
    .report-status select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
  
    .btn {
      padding: 15px 30px;
      font-size: 16px;
      border-radius: 8px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.3s;
    }
  
    .btn:hover {
      background-color: #0056b3;
      transform: translateY(-3px);
    }
  </style>  