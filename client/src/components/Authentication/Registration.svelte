<script>
    import { navigate } from 'svelte-routing';
  
    let username = '';
    let email = '';
    let password = '';
    let errorMessage = '';
    let successMessage = '';
  
    const handleSignUp = async () => {
          try {
              const response = await fetch('http://localhost:5000/api/auth/register', {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, email, password }) //// converts text into JSON string for request payload
              });
  
              const data = await response.json();
                      if (response.ok) {
                          alert('Signup successful! Welcome to the platform. Please log in to your account');
                          successMessage = data.message;
                      } else {
                          errorMessage = data.message;
                      }
          } catch (error) {
              console.error('Error during signup:', error);
              errorMessage = 'An unexpected error occurred';
          }
      };
  
    const handleLogin = () => {
        navigate('/');
    };
  </script>

<section class="vh-100" style="background-color: #9A616D;">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col col-xl-10">
          <div class="card" style="border-radius: 1rem;">
            <div class="row g-0">
              <div class="col-md-6 col-lg-5 d-none d-md-block">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                  alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem;" />
              </div>
              <div class="col-md-6 col-lg-7 d-flex align-items-center">
                <div class="card-body p-4 p-lg-5 text-black">
  
                  <form>
  
                    <div class="d-flex align-items-center mb-3 pb-1">
                      <img src="https://cdn-icons-png.flaticon.com/512/3820/3820321.png" alt="Logo" class="me-3" style="width: 40px; height: 40px;">
                      <span class="h1 fw-bold mb-0">SoulPlay</span>
                    </div> 
  
                    <h5 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">SignUp to create an account</h5>

                    <div data-mdb-input-init class="form-outline mb-4">
                        <input type="email" id="form2Example17" class="form-control form-control-lg" placeholder="User Name" bind:value={username} required/>
                    </div>
  
                    <div data-mdb-input-init class="form-outline mb-4">
                      <input type="email" id="form2Example17" class="form-control form-control-lg" placeholder="email address" bind:value={email} required/>
                    </div>
  
                    <div data-mdb-input-init class="form-outline mb-4">
                      <input type="password" id="form2Example27" class="form-control form-control-lg" placeholder="Password" bind:value={password} required/>
                    </div>
  
                    <div class="pt-1 mb-4">
                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-dark btn-lg btn-block" type="button" on:click={handleSignUp}>Register</button>
                    </div>
                    <p class="mb-5 pb-lg-2" style="color: #393f81;">Already have an account? <a href="#!"
                      on:click={handleLogin}  style="color: #393f81;">Login here</a></p>
                    <a href="#!" class="small text-muted">Terms of use.</a>
                    <a href="#!" class="small text-muted">Privacy policy</a>
                  </form>
  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  
<style>
  .card-body{
    line-height: 0vh;
  }
</style>