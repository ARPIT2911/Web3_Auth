<template>
  <div id="app">
      <Web3auth/>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Web3auth from './components/Web3auth.vue';

export default {
  name: 'App',
  components: {
    Web3auth,
}
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

