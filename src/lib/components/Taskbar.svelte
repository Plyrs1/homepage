<script lang="ts">
  import { onMount } from 'svelte'
  import type { Writable } from 'svelte/store'

  import type { WindowComponent } from '$src/routes/page'

  export let windowList: Writable<Array<WindowComponent>>
  let time = new Date()
  $: currentTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

  function activateWindow(windowIndex: number) {
    windowList.update((wl) => {
      const currentWindow = wl.findIndex((i) => i.index === windowIndex)
      if (currentWindow === -1) return wl
      if (wl[currentWindow].isActive && !wl[currentWindow].isMinimized) {
        wl[currentWindow].isMinimized = true
        wl[currentWindow].isActive = false
        const availableWindow = wl.findIndex((i) => !i.isMinimized)
        if (availableWindow !== -1) wl[availableWindow].isActive = true
        return wl
      }
      const activeWindow = wl.findIndex((i) => i.isActive)
      if (activeWindow >= 0) wl[activeWindow].isActive = false
      wl[currentWindow].isMinimized = false
      wl[currentWindow].isActive = true
      wl[currentWindow].zindex = Math.max(...wl.map((j) => j.zindex)) + 1
      return wl
    })
  }
  onMount(() => {
    const interval = setInterval(() => {
      time = new Date()
    }, 1000)

    return () => clearInterval(interval)
  })
</script>

<div class="taskbar flex flex-nowrap bottom-0 left-0 right-0 absolute text-xs px-0 py-1">
  <div class="flex-[0_0_10px]" />
  {#each $windowList as wnd}
    <button class="flex flex-auto select-none mr-1 {wnd.isActive && !wnd.isMinimized ? 'active' : ''}" on:click={() => activateWindow(wnd.index)}
      ><img class="aspect-square w-4 mr-1" src={wnd.icon} alt={wnd.title} />
      <div class="overflow-hidden text-ellipsis whitespace-nowrap">{wnd.title}</div></button
    >
  {/each}
  <div class="time ml-auto">{currentTime}</div>
</div>

<style>
  .taskbar {
    box-shadow: inset 0 1px 0 0 #fff;
    border-color: #dfdfdf;
    background-color: silver;
    border-top: 1px solid;
    position: absolute;
  }
  .taskbar button {
    cursor: pointer;
    max-width: 150px;
    overflow: hidden;
    padding-left: 0;
    padding-right: 0;
    position: relative;
    text-align: left;
    background-color: silver;
    box-shadow: inset -1px 0 0 0 grey, inset -1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 grey, inset 0 0 0 1px #dfdfdf;
    border: 1px solid;
    box-sizing: border-box;
    padding: 4px;
    border-bottom-color: black;
    border-right-color: black;
    border-left-color: white;
    border-top-color: white;
  }
  .taskbar button.active {
    font-weight: 700;
    border-bottom-color: #fff;
    border-right-color: #fff;
    border-left-color: #000;
    border-top-color: #000;
    box-shadow: inset -1px 0 0 0 #dfdfdf, inset -1px 1px 0 0 grey, inset -1px -1px 0 0 #dfdfdf, inset 0 0 0 1px grey;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEyLTA4VDE1OjMyOjA5KzExOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEyLTA4VDE1OjMyOjA5KzExOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMi0wOFQxNTozMjowOSsxMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplNjVhYWI3Yi0zMGJiLWNiNDUtYmY0OS1mNzFjNjBkMjJmZGMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5ZDZjZjFiNi03NzJiLTA1NDMtYTM5Yy03Y2EzYjJmM2UzNzYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMTRjMjg1OC0yYjc3LTM2NGUtYmIzZC0zODY1ODg5NmU0NmIiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTRjMjg1OC0yYjc3LTM2NGUtYmIzZC0zODY1ODg5NmU0NmIiIHN0RXZ0OndoZW49IjIwMjAtMTItMDhUMTU6MzI6MDkrMTE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTY1YWFiN2ItMzBiYi1jYjQ1LWJmNDktZjcxYzYwZDIyZmRjIiBzdEV2dDp3aGVuPSIyMDIwLTEyLTA4VDE1OjMyOjA5KzExOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+tcRUTQAAABRJREFUCB1jOHDgwP///xmAGMgCAElkCnv8jfX4AAAAAElFTkSuQmCC);
  }
  .taskbar .time {
    flex: 0 0 70px;
    border: 1px solid;
    margin-right: 2px;
    padding: 4px 0;
    text-align: center;
    border-bottom-color: #fff;
    border-right-color: #fff;
    border-left-color: grey;
    border-top-color: grey;
  }
</style>
