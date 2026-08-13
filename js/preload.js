(() => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (!window.location.hash) {
    const resetScroll = () => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      root.style.scrollBehavior = previousBehavior;
    };

    resetScroll();
    window.addEventListener("pageshow", resetScroll);
  }
})();
