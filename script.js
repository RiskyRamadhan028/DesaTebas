/* =========================================================
   Desa Tebas Sungai — interaksi
   Navigasi mobile, animasi muncul saat discroll, efek tilt
   3D ringan pada kartu, dan penghitung statistik berjalan.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Toggle menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Animasi muncul saat discroll ---------- */
  const revealTargets = document.querySelectorAll(
    ".card, .stat, .news-item, .gallery-scene, .section-head, .list-hamlet li, .hero-art"
  );
  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 6) * 60 + "ms";
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("in-view"));
  }

  /* ---------- Efek tilt 3D ringan pada kartu & galeri ---------- */
  const tiltEls = document.querySelectorAll(".card, .gallery-scene");
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (isFinePointer) {
    tiltEls.forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(700px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Penghitung statistik berjalan ---------- */
  const stats = document.querySelectorAll(".stat b[data-count]");
  const animateCount = (el) => {
    const raw = el.getAttribute("data-count");
    const suffix = el.getAttribute("data-suffix") || "";
    const parts = raw.split(",");
    const decimals = parts[1] ? parts[1].length : 0;
    const target = parseFloat(parts[0] + (parts[1] ? "." + parts[1] : ""));
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = decimals
        ? value.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : Math.round(value).toLocaleString("id-ID");
      el.textContent += suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (stats.length && "IntersectionObserver" in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(el => statIo.observe(el));
  }

});
