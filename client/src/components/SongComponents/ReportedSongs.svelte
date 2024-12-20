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

    const handleStatusChange = (event) => {
        selectedStatus = event.target.value;
    };

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
    <h2>Reported Songs</h2>

    {#if $reports.length === 0}
    <p class="no-reports">No reports available.</p>
    {:else}
    <div class="reports-list">
        {#each $reports as report}
            <div class="report-item">
                <h4>{report.Song.title} by {report.Song.artist}</h4>
                <p><strong>Reason:</strong> {report.reason}</p>
                <p><strong>Status:</strong> {report.status}</p>

                <div class="resolve-buttons">
                    <button class="select-button" on:click={() => handleReportSelection(report.id)}>
                        Select this report
                    </button>
                </div>
            </div>
        {/each}
    </div>
    {/if}

    {#if selectedReportId}
        <div class="report-status">
            <label for="status">Change Status:</label>
            <select id="status" bind:value={selectedStatus} on:change={handleStatusChange}>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
            </select>

            <button class="resolve-button" on:click={resolveReport}>Resolve Report</button>
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
      <button class="btn dashboard" on:click={navigateToDashboard}>Back to Admin Dashboard</button>
</div>

<style>
  .resolve-form {
      padding: 30px;
      background-color: #f8f9fa;
      border-radius: 12px;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
      max-width: 1200px;
      margin: 30px auto;
      color: #333;
  }

  h2 {
      font-family: 'Roboto', sans-serif;
      margin-bottom: 25px;
      color: #333;
      text-align: center;
      font-size: 26px;
      font-weight: 600;
  }

  .message {
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
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
      text-align: center;
      color: #6c757d;
      font-size: 18px;
  }

  .reports-list {
      margin-top: 20px;
  }

  .report-item {
      padding: 15px;
      border: 1px solid #ddd;
      margin-bottom: 15px;
      border-radius: 8px;
      background-color: #fff;
      transition: box-shadow 0.3s ease;
  }

  .report-item:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .report-item h4 {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 10px;
  }

  .report-item p {
      font-size: 14px;
      margin-bottom: 8px;
  }

  .resolve-buttons {
      margin-top: 10px;
  }

  .select-button,
  .resolve-button {
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      transition: background-color 0.3s, transform 0.3s;
  }

  .select-button:hover,
  .resolve-button:hover {
      background-color: #0056b3;
      transform: translateY(-2px);
  }

  .report-status {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
  }

  .report-status label {
      font-size: 16px;
      margin-bottom: 8px;
      font-weight: 600;
  }

  .report-status select {
      padding: 10px;
      font-size: 14px;
      margin-bottom: 20px;
      border-radius: 5px;
      border: 1px solid #ccc;
      width: 200px;
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
</style>
