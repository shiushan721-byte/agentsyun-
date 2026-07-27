(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  document.body.appendChild(toastEl);
  let toastTimer;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  // Mobile menu
  const toggle = $(".menu-toggle");
  const mobileNav = $("#mobile-nav");
  function closeMenu() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  }
  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    mobileNav.hidden = false;
  }
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      open ? closeMenu() : openMenu();
    });
    $$("a", mobileNav).forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Active nav by scroll
  const sections = ["product", "desktop", "cases", "enterprise", "download"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = $$('.topbar nav a[href^="#"]');

  function syncActiveNav() {
    const y = window.scrollY + 120;
    let current = "top";
    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", href === current);
    });
  }
  window.addEventListener("scroll", syncActiveNav, { passive: true });
  syncActiveNav();

  // Smooth anchor focus
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      closeMenu();
    });
  });

  // Capability selection
  const caps = $$("[data-capability]");
  caps.forEach((item) => {
    const activate = () => {
      caps.forEach((c) => c.classList.remove("is-active"));
      item.classList.add("is-active");
      const title = $("h3", item)?.textContent?.trim();
      if (title) toast(`已选择能力：${title}`);
    };
    item.addEventListener("click", activate);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  // Clickable grids → scroll to download / highlight
  $$("[data-clickable-grid] article").forEach((card) => {
    card.setAttribute("tabindex", "0");
    const go = () => {
      const title = $("h3", card)?.textContent?.trim() || "该功能";
      const link = $("a[href]", card);
      if (link) {
        link.click();
        return;
      }
      toast(`${title} · 前往下载体验`);
      document.getElementById("download")?.scrollIntoView({ behavior: "smooth" });
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      go();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
  });

  // Sidebar demo
  $$(".app-sidebar .side-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".app-sidebar .side-item").forEach((b) => {
        b.classList.remove("side-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("side-active");
      btn.setAttribute("aria-pressed", "true");
      toast(`切换到：${btn.getAttribute("aria-label")}`);
    });
  });

  // Demo prompt
  const input = $("#demo-prompt");
  const send = $("#demo-send");
  function sendDemo() {
    const text = (input?.value || "").trim();
    if (!text) {
      toast("先输入你想让 Hz-Hermes 做的事");
      input?.focus();
      return;
    }
    toast("任务已提交，演示界面开始执行…");
    input.value = "";
    const running = $(".running");
    if (running) {
      running.innerHTML = "<i></i> 正在执行";
    }
  }
  send?.addEventListener("click", sendDemo);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendDemo();
  });

  // Download / mailto buttons feedback
  $$('a[href^="mailto:"]').forEach((a) => {
    a.addEventListener("click", () => {
      toast("正在打开邮件客户端…");
    });
  });
})();
