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
    nav?.classList.remove("open");
    navToggle?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });

  const linkPage = link.getAttribute("href")?.split("#")[0];
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});

document.querySelectorAll(".contact-form").forEach((form) => {
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
      if (status) {
        status.textContent = "Thank you. Deni Funeral will contact you shortly.";
        status.classList.add("success");
      }
    } catch (error) {
      if (status) {
        status.textContent = "Sorry, the message could not be sent. Please call or WhatsApp us.";
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
