<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { WindowComponent } from '$src/routes/page'

  import Window from './Window.svelte'
  export let index: number
  export let windowList: Writable<Array<WindowComponent>>
  const title = 'About me'
  const icon = 'https://plaza.one/img/win/ball.png'
</script>

<Window {title} {icon} {windowList} {index}>I have nothing to show yet</Window>
