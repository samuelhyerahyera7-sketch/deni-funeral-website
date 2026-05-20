const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

const updateHeader = () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => nav?.classList.remove("open"));

  const linkPage = link.getAttribute("href")?.split("#")[0];
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});

document.querySelectorAll(".contact-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you. Deni Funeral will contact you shortly.");
  });
});

const actionBar = document.createElement("div");
actionBar.className = "floating-actions";
actionBar.innerHTML = `
  <a href="tel:0102269149" aria-label="Call Deni Funerals">Call</a>
  <a href="https://wa.me/27000000000" aria-label="WhatsApp Deni Funerals">WhatsApp</a>
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
      <input type="search" placeholder="Search Grace, grocery, R95, repatriation..." data-plan-search />
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

updateHeader();
updateBackToTop();
window.addEventListener("scroll", updateHeader);
window.addEventListener("scroll", updateBackToTop);
