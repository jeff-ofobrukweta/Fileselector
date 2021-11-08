<template>
  <div id="app">
    <portal-target name="modal-wrapper" />
    <Home />
  </div>
</template>
<style lang="scss">
@import "./app.scss";
</style>
<script>
import { PortalTarget } from "portal-vue";
import Home from "./views/home/index.vue";
export default {
  name: "App",
  components: {
    PortalTarget,
    Home,
  },
};
</script>
