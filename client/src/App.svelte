<script>
  import { Router, Route } from 'svelte-routing';
  import Login from "./components/Authentication/Login.svelte";
  import Logout from "./components/Authentication/Logout.svelte";
  import Registration from "./components/Authentication/Registration.svelte";
  let url = '';
</script>

<Router {url}>
  <div>
    <Route path="/" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/register" component={Registration} />
  </div>
</Router>