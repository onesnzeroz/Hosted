(function () {
  const ROOT_CA_URL = "https://1sn0s-iis01/certs/RootCA.cer";

  // Lightweight loading animation dismissal
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) {
      setTimeout(() => loader.classList.add("loader--hidden"), 450);
    }
  });

  // Mobile menu toggle behavior
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("show");
    });
  }

  // Scroll-spy highlighting
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

  // Section reveal animation
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

  // Animated scroll CTA
  const scrollToServices = document.getElementById("scrollToServices");
  if (scrollToServices) {
    scrollToServices.addEventListener("click", () => {
      const target = document.getElementById("services");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Leadership modal interaction
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

  // Root certificate download
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
        // Fallback for constrained browser/network policies
        window.location.href = ROOT_CA_URL;
      }
    });
  }

  // Front-end-only contact form UX
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        formStatus.textContent = "Please complete all required fields before submitting.";
        return;
      }
      formStatus.textContent = "Thank you. Your message has been captured for follow-up.";
      contactForm.reset();
    });
  }

  // Footer current year
  const yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();
