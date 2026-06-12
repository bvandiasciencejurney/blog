/**
 * =============================================
 *  BVANDIA PAGE TRANSITION
 *  Cara pakai: tambahkan <script src="transition.js"></script>
 *  di bagian bawah <body> di semua halaman HTML
 * =============================================
 */

(function () {

  /* ── 1. Inject CSS overlay ── */
  const style = document.createElement("style");
  style.textContent = `
    #bv-transition {
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      opacity: 0;
      transition: opacity 0.38s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #bv-transition.fade-in  { opacity: 1; pointer-events: all; }
    #bv-transition.fade-out { opacity: 0; pointer-events: none; }

    /* Logo kecil di tengah overlay */
    #bv-transition .bv-logo {
      width: 52px;
      opacity: 0;
      transform: scale(0.8);
      filter: drop-shadow(0 0 18px rgba(242,169,0,0.55));
      transition: opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s;
    }
    #bv-transition.fade-in .bv-logo {
      opacity: 1;
      transform: scale(1);
    }

    /* Garis progres emas di bawah */
    #bv-transition .bv-bar-wrap {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: rgba(255,255,255,0.07);
      overflow: hidden;
    }
    #bv-transition .bv-bar {
      height: 100%;
      width: 0%;
      background: #f2a900;
      border-radius: 2px;
      transition: width 0.55s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bv-transition.fade-in .bv-bar { width: 100%; }
  `;
  document.head.appendChild(style);

  /* ── 2. Buat elemen overlay ── */
  const overlay = document.createElement("div");
  overlay.id = "bv-transition";
  overlay.innerHTML = `
    <img class="bv-logo" src="logo.svg" alt="">
    <div class="bv-bar-wrap"><div class="bv-bar"></div></div>
  `;
  document.body.appendChild(overlay);

  /* ── 3. Fungsi helpers ── */
  function fadeIn(cb) {
    overlay.classList.add("fade-in");
    overlay.classList.remove("fade-out");
    // Tunggu animasi selesai (logo + bar ~550ms), lalu jalankan callback
    setTimeout(cb, 580);
  }

  function fadeOut() {
    overlay.classList.remove("fade-in");
    overlay.classList.add("fade-out");
  }

  /* ── 4. Saat halaman pertama kali dimuat → fade OUT overlay ── */
  window.addEventListener("pageshow", () => {
    // Kalau kembali dari cache (tombol back), tetap fade out
    requestAnimationFrame(() => {
      overlay.classList.remove("fade-in");
      overlay.classList.add("fade-out");
    });
  });

  /* ── 5. Intercept semua klik link internal ── */
  document.addEventListener("click", function (e) {
    const anchor = e.target.closest("a[href]");
    if (!anchor) return;

    const href = anchor.getAttribute("href");

    // Abaikan: link eksternal, anchor (#), mailto, tel, target=_blank
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      href.startsWith("mailto") ||
      href.startsWith("tel") ||
      anchor.target === "_blank"
    ) return;

    e.preventDefault();

    fadeIn(() => {
      window.location.href = href;
    });
  });

  /* ── 6. Tombol Back/Forward browser ── */
  window.addEventListener("popstate", () => {
    fadeOut();
  });

})();
