(function () {
  const ROOT_CA_URL = "https://1sn0s-iis01/certs/RootCA.cer";

  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(() => loader.classList.add("loader--hidden"), 450);
  });

  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("show");
    });
  }

  const navLinks = [...document.querySelectorAll(".nav__link")];
  const sectionMap = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    },
    { threshold: 0.5 }
  );
  sectionMap.forEach((section) => spyObserver.observe(section));

  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  const kpiNodes = document.querySelectorAll(".kpi[data-kpi]");
  function animateKpi(node) {
    const target = Number(node.dataset.kpi || "0");
    const durationMs = 900;
    const stepMs = 16;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += stepMs;
      const progress = Math.min(elapsed / durationMs, 1);
      node.textContent = `${Math.round(target * progress)}%`;
      if (progress >= 1) clearInterval(timer);
    }, stepMs);
  }
  kpiNodes.forEach(animateKpi);

  const scrollToCapabilities = document.getElementById("scrollToCapabilities");
  if (scrollToCapabilities) {
    scrollToCapabilities.addEventListener("click", () => {
      const target = document.getElementById("capabilities");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const modal = document.getElementById("leadershipModal");
  const openModalBtn = document.getElementById("openLeadershipModal");
  const closeModalBtn = document.getElementById("closeLeadershipModal");

  function openModal() {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }

  const downloadRootCA = document.getElementById("downloadRootCA");
  if (downloadRootCA) {
    downloadRootCA.addEventListener("click", async () => {
      try {
        const response = await fetch(ROOT_CA_URL, { mode: "cors" });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = "RootCA.cer";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        window.location.href = ROOT_CA_URL;
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        formStatus.textContent = "Please complete all required fields before submitting.";
        return;
      }
      formStatus.textContent = "Thank you. A leadership representative will follow up shortly.";
      contactForm.reset();
    });
  }

  const yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();
