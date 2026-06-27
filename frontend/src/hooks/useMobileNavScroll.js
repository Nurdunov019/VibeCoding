/** Mobile bottom nav stays fixed — no hide-on-scroll (avoids layout jump). */
export function useMobileNavScroll() {
  return { hidden: false, enabled: false }
}
