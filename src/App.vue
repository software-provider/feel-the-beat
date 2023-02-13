<template>
  <div id="app">
    <navbar />
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

/* #app {
} */

html {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  line-height: 1.5;
  font-size: 1rem;
  height: 100vh;
  padding: 0;
}

/* body {
  min-height: 100vh;
  padding: 0;
  background: url('./assets/bg01.png');
  background-size: 50vw;
  font-family: 'Merriweather Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
} */

.home-bg {
  background: url('./assets/bg01.png');
}

@media (min-width: 475px) {
  html {
    scroll-behavior: smooth;
  }
}

.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-container {
  display: flex;
  flex-wrap: nowrap;
  /* background-color: #e7e9eb; */
  justify-content: center;
  align-items: center;
}
.flex-item {
  background-color: #ffffff;
  width: 2.5rem;
  line-height: 2.5rem;
  /* margin: 1px; */
  text-align: center;

  color: #6b7280;
  font-size: 14px;
  border: 1px solid #16a8f0;
  cursor: pointer;
}
</style>
