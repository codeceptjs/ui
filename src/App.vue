<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App'
};
</script>

<style lang="scss">
#app {
  box-sizing: border-box;
  -moz-osx-font-smoothing: grayscale;
  font-family: -apple-system,BlinkMacSystemFont,Lato,Helvetica Neue,sans-serif;
  -webkit-font-smoothing: antialiased;
}

@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #6f42c1;
$primary-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

// Global styles
i {
  width: 1em;
}

.ellipsize {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

Header {
  height: 60px;
  padding: 0 5px;
  box-shadow: 0 2px 0 0 #f5f5f5;
}

.Sidebar {
  position: absolute;
  z-index: 10;
  top: 61px;
  left: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 5px 5px 5px 10px;
  width: 33%;  
  background-color: #fafafa;
  @media (max-width: 1024px) { 
    width: 100%;
    position: relative;
    top: 0px;
   }
}

.Content {
  position: absolute;
  z-index: 10;
  top: 61px;
  left: 33%;
  right: 0;
  bottom: 0;
  overflow: hidden;
  @apply p-1 bg-gray-300;
  display: none;
  @media (min-width: 1024px) { 
    display: block;
   }
}

.empty {
  @apply p-20 object-cover text-gray-600 text-center;
}


</style>
