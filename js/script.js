let currentLang = localStorage.getItem("app_lang") || "uz";
let currentTheme = localStorage.getItem("app_theme") || "light";

function getNestedTranslation(obj, path) {
  return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem("app_lang", lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translation = getNestedTranslation(translations[lang], key);
    if (translation) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("app_theme", theme);

  const themeBtn = document.getElementById("theme-toggle");
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.classList.remove("dark-theme");
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations(currentLang);
  applyTheme(currentTheme);

  const hamburgerBtn = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      hamburgerBtn.innerHTML = navMenu.classList.contains("open") 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll("#nav-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        hamburgerBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedLang = e.target.dataset.lang || e.target.closest(".lang-btn").dataset.lang;
      if (selectedLang) applyTranslations(selectedLang);
    });
  });

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(newTheme);
    });
  }
});

const form = document.getElementById("lead-form");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const phoneInput = document.getElementById("phone").value.trim();
    const nameInput = document.getElementById("name").value.trim();
    const t = translations[currentLang]?.form || {};

    if (phoneInput.length < 13) {
      alert(t.alertPhone || "Telefon raqamingizni to'liq kiriting!");
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        alert((t.alertSuccess || "Rahmat {name}!").replace("{name}", nameInput));
        form.reset();
        document.getElementById("phone").value = "+998";
      } else {
        alert(t.alertError || "Xatolik yuz berdi.");
      }
    } catch (error) {
      alert(t.alertNetwork || "Tarmoq xatosi.");
    }
  });

  const phoneEl = document.getElementById("phone");
  if (phoneEl) {
    phoneEl.addEventListener("input", function () {
      if (!this.value.startsWith("+998")) {
        this.value = "+998";
      }
    });
  }
}