<script lang="ts">
  import { type Writable, writable } from 'svelte/store'

  import About from '$src/lib/components/About.svelte'
  import Taskbar from '$src/lib/components/Taskbar.svelte'
  import Welcome from '$src/lib/components/Welcome.svelte'

  import type { WindowComponent } from './page'
  let windowList: Writable<Array<WindowComponent>> = writable([])
</script>

<Welcome index={0} {windowList} />
<About index={1} {windowList} />
<!-- <Welcome index={2} {windowList} />
<Welcome index={3} {windowList} /> -->
<Taskbar {windowList} />
