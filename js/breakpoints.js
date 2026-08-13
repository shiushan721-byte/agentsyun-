(() => {
  /**
   * Breakpoint contract — keep in sync with css/breakpoints.css
   * Mobile ≤767 | Tablet 768–1023 | Desktop ≥1024
   */
  const MOBILE_MAX = 767;
  const TABLET_MIN = 768;
  const TABLET_MAX = 1023;
  const DESKTOP_MIN = 1024;

  const mobileMq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
  const tabletMq = window.matchMedia(
    `(min-width: ${TABLET_MIN}px) and (max-width: ${TABLET_MAX}px)`
  );
  const desktopMq = window.matchMedia(`(min-width: ${DESKTOP_MIN}px)`);

  const isMobile = () => mobileMq.matches;
  const isTablet = () => tabletMq.matches;
  const isDesktop = () => desktopMq.matches;
  const isCompact = () => isMobile() || isTablet();

  const current = () => {
    if (isMobile()) return "mobile";
    if (isTablet()) return "tablet";
    return "desktop";
  };

  const syncDocumentLayout = () => {
    const tier = current();
    const root = document.documentElement;
    if (root.getAttribute("data-layout") !== tier) {
      root.setAttribute("data-layout", tier);
    }
    root.style.setProperty("--layout-tier-js", tier);
  };

  const bindMq = (mq, handler) => {
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", handler);
    else if (typeof mq.addListener === "function") mq.addListener(handler);
  };

  const onChange = (handler) => {
    const wrap = () => {
      const tier = current();
      syncDocumentLayout();
      handler(tier);
    };
    bindMq(mobileMq, wrap);
    bindMq(tabletMq, wrap);
    bindMq(desktopMq, wrap);
    return () => {
      /* no-op unsubscribe for static site simplicity */
    };
  };

  syncDocumentLayout();
  bindMq(mobileMq, syncDocumentLayout);
  bindMq(tabletMq, syncDocumentLayout);
  bindMq(desktopMq, syncDocumentLayout);

  window.AgentsyunBP = {
    MOBILE_MAX,
    TABLET_MIN,
    TABLET_MAX,
    DESKTOP_MIN,
    mobileMq,
    tabletMq,
    desktopMq,
    isMobile,
    isTablet,
    isDesktop,
    isCompact,
    current,
    syncDocumentLayout,
    onChange,
  };
})();
