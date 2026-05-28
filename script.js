const header = document.querySelector("[data-header]") || document.querySelector(".site-header");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroText = {
  kicker: document.querySelector("[data-hero-kicker]"),
  title: document.querySelector("[data-hero-title]"),
  copy: document.querySelector("[data-hero-copy]"),
  button: document.querySelector("[data-hero-button]"),
  inner: document.querySelector(".home-hero .hero-inner"),
};

const updateHeader = () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("nav-parent") && window.matchMedia("(max-width: 820px)").matches) {
      return;
    }

    nav?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });

  const linkHref = link.getAttribute("href") || "";
  const [linkPage, linkHash = ""] = linkHref.split("#");
  const isHashLink = linkHref.includes("#");
  if (linkPage === currentPage && (!isHashLink || `#${linkHash}` === window.location.hash)) {
    link.classList.add("active");
  }
});

document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const parent = dropdown.querySelector(".nav-parent");
  const submenuLinks = dropdown.querySelectorAll(".nav-submenu a");

  parent?.addEventListener("click", (event) => {
    if (!window.matchMedia("(max-width: 820px)").matches) return;

    event.preventDefault();
    dropdown.classList.toggle("submenu-open");
  });

  submenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      dropdown.classList.remove("submenu-open");
    });
  });
});

document.querySelectorAll(".contact-form").forEach((form) => {
  const planSelect = form.querySelector("select[name='plan']");
  const selectedPlan = new URLSearchParams(window.location.search).get("plan");

  if (planSelect && selectedPlan) {
    const matchingOption = [...planSelect.options].find((option) => option.value === selectedPlan);
    if (matchingOption) {
      planSelect.value = selectedPlan;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    const status = form.querySelector("[data-form-status]");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (status) {
      status.textContent = "Sending...";
      status.classList.remove("error", "success");
    }
    if (button) button.disabled = true;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Message could not be sent.");
      }

      form.reset();
      const successRedirect = form.dataset.successRedirect;
      if (successRedirect) {
        window.location.assign(successRedirect);
        return;
      }

      if (status) {
        status.textContent =
          result.message ||
          "Thank you. We received your request and sent you a confirmation email. A sales agent will contact you shortly.";
        status.classList.add("success");
      }
    } catch (error) {
      if (status) {
        status.textContent = error.message || "Sorry, the message could not be sent. Please call or WhatsApp us.";
        status.classList.add("error");
      }
    } finally {
      if (button) button.disabled = false;
    }
  });
});

const actionBar = document.createElement("div");
actionBar.className = "floating-actions";
actionBar.innerHTML = `
  <a href="tel:0648778580" aria-label="Call Deni Funerals">Call</a>
  <a href="https://wa.me/27648778580" aria-label="WhatsApp Deni Funerals">WhatsApp</a>
  <a href="quote.html" aria-label="Get a quote">Quote</a>
`;
document.body.append(actionBar);

const socialIcons = `
  <a href="#" aria-label="Deni Funeral on Facebook">
    <svg viewBox="0 0 24 24" aria-hidden="true"><text x="8" y="19">f</text></svg>
  </a>
  <a href="#" aria-label="Deni Funeral on X">
    <svg viewBox="0 0 24 24" aria-hidden="true"><text x="5" y="18">X</text></svg>
  </a>
  <a href="#" aria-label="Deni Funeral on YouTube">
    <svg class="brand-youtube" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3"></rect><path d="M10 9l6 3-6 3z"></path></svg>
  </a>
  <a href="https://www.linkedin.com/company/deni-funeral/about/" aria-label="Deni Funeral on LinkedIn">
    <svg viewBox="0 0 24 24" aria-hidden="true"><text x="4" y="18">in</text></svg>
  </a>
  <a href="#" aria-label="Deni Funeral on Instagram">
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4"></rect><circle cx="12" cy="12" r="3.2"></circle><circle cx="16.5" cy="7.5" r="1"></circle></svg>
  </a>
  <a href="#" aria-label="Deni Funeral on TikTok">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v9.2a4.2 4.2 0 1 1-3.4-4.1v3a1.6 1.6 0 1 0 1.1 1.5V4h2.3c.4 1.7 1.6 3 3.3 3.4v2.7A6.2 6.2 0 0 1 14 8.8z"></path></svg>
  </a>
`;

if (header && !header.querySelector(".social-links-header")) {
  const social = document.createElement("div");
  social.className = "social-links social-links-header";
  social.innerHTML = socialIcons;
  header.append(social);
}

const footer = document.querySelector(".footer");
if (footer && !footer.querySelector(".social-links-footer")) {
  const social = document.createElement("div");
  social.className = "social-links social-links-footer";
  social.innerHTML = `
    <h3>Social media</h3>
    <div>${socialIcons}</div>
  `;
  const copyright = footer.querySelector(".copyright");
  footer.insertBefore(social, copyright);
}

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.type = "button";
backToTop.textContent = "Top";
backToTop.setAttribute("aria-label", "Back to top");
document.body.append(backToTop);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const updateBackToTop = () => {
  backToTop.classList.toggle("visible", window.scrollY > 600);
};

const plansContainer = document.querySelector(".detailed-plans");
if (plansContainer) {
  const filter = document.createElement("section");
  filter.className = "plan-tools";
  filter.innerHTML = `
    <div>
      <h2>Find a plan</h2>
      <p>Search by plan name, benefit, age group, or premium.</p>
    </div>
    <label>
      <span>Search funeral plans</span>
      <input type="search" placeholder="Search Grace, grocery, R95, tombstone..." data-plan-search />
    </label>
  `;
  plansContainer.before(filter);

  const searchInput = filter.querySelector("[data-plan-search]");
  const plans = [...document.querySelectorAll(".detail-plan")];

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    plans.forEach((plan) => {
      plan.hidden = query.length > 0 && !plan.textContent.toLowerCase().includes(query);
    });
  });
}

if (heroSlides.length > 1) {
  let activeSlide = 0;
  const showSlide = (nextSlide) => {
    const slide = heroSlides[nextSlide];
    heroText.inner?.classList.add("changing");

    window.setTimeout(() => {
      if (heroText.kicker) heroText.kicker.textContent = slide.dataset.kicker || "";
      if (heroText.title) heroText.title.textContent = slide.dataset.title || "";
      if (heroText.copy) heroText.copy.textContent = slide.dataset.copy || "";
      if (heroText.button) heroText.button.textContent = slide.dataset.button || "Get Covered";

      heroSlides[activeSlide].classList.remove("active");
      slide.classList.add("active");
      activeSlide = nextSlide;
      heroText.inner?.classList.remove("changing");
    }, 220);
  };

  window.setInterval(() => {
    showSlide((activeSlide + 1) % heroSlides.length);
  }, 5200);
}

updateHeader();
updateBackToTop();
window.addEventListener("scroll", updateHeader);
window.addEventListener("scroll", updateBackToTop);
