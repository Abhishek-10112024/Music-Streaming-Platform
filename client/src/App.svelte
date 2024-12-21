<script>
  import { Router, Route } from 'svelte-routing';
  import Login from "./components/Authentication/Login.svelte";
  import Logout from "./components/Authentication/Logout.svelte";
  import Registration from "./components/Authentication/Registration.svelte";
  import UserManagement from './components/UserComponents/UserManagement.svelte';
  import UploadSong from './components/SongComponents/UploadSong.svelte';
  import ReportedSongs from './components/SongComponents/ReportedSongs.svelte';
  import SongManagement from './components/SongComponents/SongManagement.svelte';
  import MySongs from './components/SongComponents/MySongs.svelte';
  import Playlist from './components/PlaylistComponents/Playlist.svelte';
  import LikedSongs from './components/PlaylistComponents/LikedSongs.svelte';
  import Dashboard from './components/BasicComponents/Dashboard.svelte';
</script>

<Router>
  <div>
    <Route path="/" component={Login} />
    <Route path="/logout" component={Logout} />
    <Route path="/register" component={Registration} />
    <Route path="/users" component={UserManagement} />
    <Route path="/upload" component={UploadSong} />
    <Route path="/reportedsongs" component={ReportedSongs} />
    <Route path="/deletesong" component={SongManagement} />
    <Route path="/mysongs" component={MySongs} />
    <Route path="/playlist" component={Playlist} />
    <Route path="/liked" component={LikedSongs} />
    <Route path="/dashboard" component={Dashboard} />
  </div>
</Router>