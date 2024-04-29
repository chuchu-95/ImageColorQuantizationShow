<template>
  <div id="app">
    <nav>
      <router-link to="/home" class="nav-link">Home</router-link>
      |
      <a class="nav-link" @click.prevent="logout">Logout</a>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      sessionStorage.removeItem('loggedIn');
      this.$router.push('/login');
    }
  }
}
</script>


