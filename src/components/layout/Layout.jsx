import BottomNav from '@/components/navigation/BottomNav'

/**
 * Layout — App Shell
 *
 * Structure:
 *   [Viewport]
 *   └── [Mobile shell — max-w-[430px] centered]
 *       ├── Ambient background glows  (aria-hidden)
 *       ├── <main>  scrollable content area
 *       └── [BottomNav slot — fixed, aligned to shell]
 *
 * max-w-[430px] = standard iPhone 15 Pro Max width.
 * On desktop the app stays centered like a mobile PWA.
 */
export default function Layout({ children }) {
  return (
    /* Full viewport background */
    <div className="min-h-dvh bg-canvas">

      {/* Mobile shell — centered on desktop */}
      <div className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-canvas overflow-x-hidden">

        {/* ── Ambient gradient blobs ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Top-left purple glow */}
          <div className="
            absolute -top-32 -left-24
            w-80 h-80 rounded-full
            bg-purple/[0.07] blur-3xl
          " />
          {/* Middle-right cyan glow */}
          <div className="
            absolute top-[35%] -right-20
            w-72 h-72 rounded-full
            bg-cyan/[0.05] blur-3xl
          " />
          {/* Bottom-center subtle glow */}
          <div className="
            absolute bottom-20 left-1/2 -translate-x-1/2
            w-64 h-48 rounded-full
            bg-violet/[0.04] blur-3xl
          " />
        </div>

        {/* ── Scrollable page content ── */}
        {/*
          pb-24 ensures content isn't hidden behind the BottomNav.
          overflow-y-auto enables independent page scrolling.
        */}
        <main className="relative min-h-dvh pb-24 overflow-y-auto overflow-x-hidden">
          {children}
        </main>

        {/* ── Bottom Navigation slot ── */}
        {/*
          Fixed position, aligned to the mobile shell width.
          left-1/2 + -translate-x-1/2 + max-w-[430px] keeps
          the nav bar locked to the app container even on wide screens.
        */}
        <div className="
          fixed bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-[430px]
          z-50
        ">
          <BottomNav />
        </div>

      </div>
    </div>
  )
}
