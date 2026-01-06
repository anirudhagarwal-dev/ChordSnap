type Options = {
  smooth?: number
}

type ElemState = {
  y: number
  targetY: number
  lag: number
  speed: number | 'auto'
  container?: HTMLElement | null
}

let initialized = false
let rafId = 0

export function initScrollEffects(options: Options = {}) {
  if (initialized) return () => {}
  initialized = true

  const smooth = Math.max(0.01, options.smooth ?? 1)
  const wrapper = document.getElementById('smooth-wrapper') as HTMLElement | null
  const content = document.getElementById('smooth-content') as HTMLElement | null
  if (!wrapper || !content) return () => {}

  const body = document.body

  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-speed],[data-lag]'))
  const states = new Map<HTMLElement, ElemState>()
  for (const el of elements) {
    const speedAttr = el.getAttribute('data-speed')
    const lagAttr = el.getAttribute('data-lag')
    const speed: number | 'auto' =
      speedAttr === 'auto' ? 'auto' : speedAttr ? parseFloat(speedAttr) : 1
    const lag = lagAttr ? Math.max(0, parseFloat(lagAttr)) : 0
    const container = el.parentElement
    states.set(el, { y: 0, targetY: 0, lag, speed, container })
    el.style.willChange = 'transform'
  }

  const setBodyHeight = () => {
    body.style.height = `${content.scrollHeight}px`
  }
  setBodyHeight()
  const resizeObserver = new ResizeObserver(() => setBodyHeight())
  resizeObserver.observe(content)

  let targetScroll = window.scrollY
  let currentScroll = targetScroll
  let lastTime = performance.now()

  const onScroll = () => {
    targetScroll = window.scrollY
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const updateElement = (el: HTMLElement, st: ElemState, dt: number) => {
    const vh = window.innerHeight

    if (st.speed === 'auto' && st.container) {
      const ch = el.offsetHeight
      const ph = st.container.offsetHeight
      const moveRange = Math.max(0, ch - ph)
      if (moveRange > 0) {
        const rect = st.container.getBoundingClientRect()
        const containerCenter = rect.top + rect.height / 2
        const ratio =
          (vh / 2 - containerCenter) / (rect.height / 2 + vh / 2)
        st.targetY = clamp(ratio * moveRange, -moveRange / 2, moveRange / 2)
      } else {
        st.targetY = 0
      }
    } else {
      const speed = typeof st.speed === 'number' ? st.speed : 1
      const rect = el.getBoundingClientRect()
      const elementCenter = rect.top + rect.height / 2
      const diff = vh / 2 - elementCenter
      st.targetY = diff * (1 - speed)
    }

    const a = st.lag > 0 ? clamp(dt / st.lag, 0, 1) : 1
    st.y = lerp(st.y, st.targetY, a)
    el.style.transform = `translate3d(0, ${st.y}px, 0)`
  }

  const tick = () => {
    const now = performance.now()
    const dt = (now - lastTime) / 1000
    lastTime = now

    const alpha = clamp(dt / smooth, 0, 1)
    currentScroll = lerp(currentScroll, targetScroll, alpha)
    content.style.transform = `translate3d(0, ${-currentScroll}px, 0)`

    for (const [el, st] of states) {
      updateElement(el, st, dt)
    }

    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('scroll', onScroll)
    resizeObserver.disconnect()
    for (const [el] of states) {
      el.style.transform = ''
      el.style.willChange = ''
    }
    content.style.transform = ''
    body.style.height = ''
    initialized = false
  }
}