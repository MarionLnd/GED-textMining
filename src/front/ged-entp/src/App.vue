<template>
  <div id="app">
   
    <Login/>
  </div>
</template>

<script>
import Login from './components/Login.vue'

export default {
  name: 'App',
  components: {
    Login
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #156fc9;
  margin-top: 60px;
 
}
body,html{
background-color: #adc5da;

}
</style>
