<script lang="ts">
  import type { Writable } from 'svelte/store'

  import type { WindowComponent } from '$src/routes/page'
  export let title = ''
  export let icon = ''
  export let index: number
  export let windowList: Writable<Array<WindowComponent>>
  export let isActive = false
  export let isMinimized = true
  let lastMouseX = 0
  let lastMouseY = 0
  let lastOffsetX = 0
  let lastOffsetY = 0
  let isMouseDown = false
  let zindex = 100
  windowList.subscribe((w) => {
    const componentIndex = $windowList.findIndex((i) => i.index === index)
    if (componentIndex === -1) return
    isActive = w[componentIndex].isActive
    isMinimized = w[componentIndex].isMinimized
    zindex = w[componentIndex].zindex
  })
  windowList.update((w) => {
    // skip if already exist
    if (w.filter((item) => item.index === index).length !== 0) return w
    const currentWindow: WindowComponent = {
      isActive,
      isMinimized,
      index,
      title,
      icon,
      zindex
    }
    w.push(currentWindow)
    return w
  })

  function activateWindow(windowIndex: number) {
    windowList.update((wl) => {
      const activeWindow = wl.findIndex((i) => i.isActive)
      if (activeWindow >= 0) wl[activeWindow].isActive = false
      const currentWindow = wl.findIndex((i) => i.index === windowIndex)
      if (currentWindow === -1) return wl
      wl[currentWindow].isMinimized = false
      wl[currentWindow].isActive = true
      wl[currentWindow].zindex = Math.max(...wl.map((j) => j.zindex)) + 1
      return wl
    })
  }

  function minimizeWindow(windowIndex: number) {
    windowList.update((wl) => {
      const currentWindow = wl.findIndex((i) => i.index === windowIndex)
      if (currentWindow === -1) return wl
      wl[currentWindow].isMinimized = true
      const availableWindow = wl.findIndex((i) => !i.isMinimized)
      if (availableWindow !== -1) wl[availableWindow].isActive = true
      return wl
    })
  }

  function moveTo(e: MouseEvent) {
    activateWindow(index)
    isMouseDown = true
    lastMouseX = e.screenX
    lastMouseY = e.screenY
  }
  function savePos(e: MouseEvent) {
    isMouseDown = false
    const target = e.target as HTMLElement
    lastOffsetX = parseInt(target.style.left)
    lastOffsetY = parseInt(target.style.top)
  }
  function updatePos(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (isMouseDown) {
      console.log(`isMouseDown ${isMouseDown}`)
      target.style.left = `${lastOffsetX - (lastMouseX - e.screenX)}px`
      target.style.top = `${lastOffsetY - (lastMouseY - e.screenY)}px`
      // lastMouseX = e.clientX
      // lastMouseY = e.clientY
    }
    if (target.offsetLeft + target.offsetWidth > window.innerWidth) {
      target.style.left = `${window.innerWidth / 2 - target.offsetWidth / 2}px`
    }
    if (target.offsetTop + target.offsetHeight > window.innerHeight) {
      target.style.top = `${window.innerHeight / 2 - target.offsetHeight / 2}px`
    }
    if (target.offsetLeft < 0) {
      target.style.left = `${-window.innerWidth / 2 + target.offsetWidth / 2}px`
      lastOffsetX = 0
    }
    if (target.offsetTop < 0) {
      target.style.top = `${-window.innerHeight / 2 + target.offsetHeight / 2}px`
      lastOffsetY = 0
    }
  }
</script>

<div
  class="flex absolute top-0 left-0 items-center w-screen h-screen overflow-hidden select-none pointer-events-none"
  style="z-index: {zindex}; {isMinimized ? 'visibility:hidden' : ''}"
>
  <div
    class="window relative mx-auto p-1 pointer-events-auto w-1/2"
    on:mousemove|stopPropagation={updatePos}
    on:mousedown|stopPropagation={moveTo}
    on:mouseup={savePos}
    on:mouseleave={savePos}
  >
    <div class="header flex inactive pointer-events-none" class:inactive={!isActive}>
      <img class="aspect-square w-4 mr-1" src={icon} alt="Test" />
      <div class="flex-auto pr-8">{title}</div>
      <div class="buttons pointer-events-auto">
        <button on:click|preventDefault={() => minimizeWindow(index)}>
          <span
            style="background-image:url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2aWV3Qm94PScwIDAgOSA5JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIHN0eWxlPSdmaWxsOiMwMDAnIGQ9J00xIDdoNnYySDF6Jy8+PC9zdmc+)"
          /></button
        >
        <button>
          <span
            style="background-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2aWV3Qm94PScwIDAgOSA5JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIHN0eWxlPSdmaWxsOiMwMDAnIGQ9J00wIDBoMXY5SDB6Jy8+PHBhdGggc3R5bGU9J2ZpbGw6IzAwMCcgZD0nTTAgMGg5djJIMHonLz48cGF0aCBzdHlsZT0nZmlsbDojMDAwJyBkPSdNOCAwaDF2OUg4eicvPjxwYXRoIHN0eWxlPSdmaWxsOiMwMDAnIGQ9J00wIDhoOXYxSDB6Jy8+PC9zdmc+)"
          /></button
        >

        <button>
          <span
            style="background-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc5JyBoZWlnaHQ9JzknPjxwYXRoIHN0eWxlPSdzdHJva2U6IzAwMCcgZD0nbTEgMSA3IDdNOCAxIDEgOCcvPjwvc3ZnPg==);"
          />
        </button>
      </div>
    </div>
    <div class="content overflow-y-scroll" style="max-height: 500px;">
      <slot />
    </div>
  </div>
</div>

<style>
  .window {
    background-color: silver;
    /* max-height: 600px; */
    border: 1px solid;
    box-shadow: inset -1px 0 0 0 grey, inset -1px 1px 0 0 #fff, inset -1px -1px 0 0 grey, inset 0 0 0 1px #fff;
    border-bottom-color: #000;
    border-right-color: #000;
    border-left-color: #dfdfdf;
    border-top-color: #dfdfdf;
  }
  .window .header {
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
    margin: 1px;
    padding: 2px;
    background: linear-gradient(90deg, navy, #1084d0);
    color: #fff;
  }

  .header.inactive {
    background: linear-gradient(90deg, grey, silver);
  }

  .buttons button {
    border: 1px solid;
    height: 16px;
    margin: 0;
    padding: 2px;
    width: 16px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    outline: none !important;
    text-align: center;
    text-decoration: none !important;
    background-color: silver;
    border-left-color: #fff;
    border-top-color: #fff;
    border-bottom-color: #000;
    border-right-color: #000;
    box-shadow: inset -1px 0 0 0 grey, inset -1px 1px 0 0 #dfdfdf, inset -1px -1px 0 0 grey, inset 0 0 0 1px #dfdfdf;
  }

  .buttons button span {
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    display: block;
    height: 100%;
    width: 100%;
  }
</style>
