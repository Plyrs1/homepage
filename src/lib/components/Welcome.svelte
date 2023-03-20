<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { WindowComponent } from '$src/routes/page'

  import Window from './Window.svelte'
  export let index: number
  export let windowList: Writable<Array<WindowComponent>>
  const title = "Welcome to Plyrs' site"
  const icon = 'https://plaza.one/img/win/ball.png'
</script>

<Window {title} {icon} {windowList} {index} isActive={true} isMinimized={false}>
  <div class="grid grid-cols-2 grid-flow-row w-full h-full">
    <div class="col-span-2">Logo</div>
    <div>
      <ul>
        <li>Introduction</li>
        <li>Hobby</li>
        <li>Likes</li>
        <li>Dislikes</li>
        <li>Ask Me Anything</li>
      </ul>
    </div>
    <div>Content</div>
  </div>
</Window>
