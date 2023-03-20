<script lang="ts">
  import '$lib/main.css'
</script>

<div class="desktop w-screen h-screen" style="background-image: url('https://gif.plaza.one/71.gif');">
  <slot />
</div>

<style>
  .desktop {
    background-attachment: fixed;
    background-color: teal;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
