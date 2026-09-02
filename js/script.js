/**
 * Vivek H - Personal Portfolio Script (23CSB40B Module 2)
 * Features:
 *  - Dynamic DOM Rendering of Projects from JavaScript Object Array (B1)
 *  - Interactive UI Event Handlers (Theme Switch, Hamburger, Modal Lightbox, Filter, Search) (B2)
 *  - Client-Side Form Validation using Regular Expressions (B3)
 *  - Browser Storage Persistence (localStorage for Theme & Bookmarks, sessionStorage for Greeting) (B4)
 *  - Clean Modern ES6+ JavaScript (B5)
 */

// ==========================================================================
// 1. DATA SOURCE: Projects Array of Objects (B1)
// ==========================================================================
const projectsData = [
  {
    id: "sentry-iot",
    title: "SENTRY-IoT: Risk-Adaptive Security Framework",
    subtitle: "Software-Defined IoT Networks (Undergoing Project)",
    category: "Cybersecurity",
    badge: "Ongoing Research",
    icon: "&#128737;",
    mentor: "Department of Computer Science & Engineering, MBCET",
    teamSize: "Individual / Research Team",
    duration: "2025 - Present",
    description: "Architecting a risk-adaptive security framework for Software-Defined IoT Networks. Designed to dynamically monitor network traffic anomalies, adapt OpenFlow routing policies in real time, and protect resource-constrained IoT nodes against distributed threats and flow table saturation.",
    tags: ["SDN", "IoT Security", "OpenFlow", "Python", "Risk-Adaptive AI", "Threat Modeling"],
    githubUrl: "https://github.com/VIveK23434",
    demoUrl: "https://github.com/VIveK23434"
  },
  {
    id: "find-my-spot",
    title: "Find My Spot: Smart Parking System",
    subtitle: "IoT Hardware & Cloud Architecture",
    category: "IoT",
    badge: "Hardware & Cloud",
    icon: "&#128663;",
    mentor: "Mr. Shon J Das",
    teamSize: "4 Members",
    duration: "09 Sep, 2025 - 27 Oct, 2025",
    description: "Designed and implemented an end-to-end IoT-based Smart Parking System. Utilized ESP32 microcontrollers with ultrasonic distance sensors for real-time slot occupancy tracking. Integrated AWS Lambda, DynamoDB, API Gateway, and S3, accompanied by a dynamic React dashboard for live slot visualization and automated barrier gates.",
    tags: ["ESP32", "AWS Lambda", "DynamoDB", "API Gateway", "React.js", "Ultrasonic Sensors"],
    githubUrl: "https://github.com/VIveK23434",
    demoUrl: "https://github.com/VIveK23434"
  },
  {
    id: "alumni-management",
    title: "Alumni-Student Ecosystem Platform",
    subtitle: "Full-Stack Collaborative Web Portal",
    category: "Web",
    badge: "Full Stack",
    icon: "&#127891;",
    mentor: "Mr. Shon J Das",
    teamSize: "3 Members",
    duration: "17 Jan, 2025 - 29 Jan, 2025",
    description: "Developed a comprehensive collaborative platform bridging university alumni, current students, and administration. Features structured alumni profiles, university event scheduling, a job/internship opportunity portal, mentorship coordination workflows, and real-time communication channels.",
    tags: ["React.js", "Node.js", "MongoDB", "Express.js", "REST APIs", "TailwindCSS"],
    githubUrl: "https://github.com/VIveK23434",
    demoUrl: "https://github.com/VIveK23434"
  }
];

// ==========================================================================
// 2. BROWSER STORAGE HELPERS (B4)
// ==========================================================================
const Storage = {
  // Theme Management (localStorage)
  getTheme: () => localStorage.getItem("vivek-portfolio-theme") || "light",
  setTheme: (theme) => localStorage.setItem("vivek-portfolio-theme", theme),

  // Favorites / Bookmarks (localStorage)
  getFavorites: () => JSON.parse(localStorage.getItem("vivek-portfolio-favs") || "[]"),
  toggleFavorite: (id) => {
    const favs = Storage.getFavorites();
    const index = favs.indexOf(id);
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(id);
    }
    localStorage.setItem("vivek-portfolio-favs", JSON.stringify(favs));
    return favs;
  },
  isFavorite: (id) => Storage.getFavorites().includes(id),

  // Session Greeting Flag (sessionStorage)
  isBannerClosed: () => sessionStorage.getItem("vivek-banner-closed") === "true",
  setBannerClosed: () => sessionStorage.setItem("vivek-banner-closed", "true")
};

// ==========================================================================
// 3. DOM RENDERING: Project Cards (B1 & B5)
// ==========================================================================
const projectsGrid = document.getElementById("projects-grid");
const favCountEl = document.getElementById("fav-count");
let currentCategoryFilter = "all";
let currentSearchQuery = "";
let showOnlyFavorites = false;

/**
 * Dynamically constructs and injects project cards into the DOM
 * @param {Array} projects - Array of project objects to render
 */
const renderProjects = (projects) => {
  if (!projectsGrid) return;

  // Filter based on active category, search query, and favorites toggle
  const filtered = projects.filter(project => {
    const matchesCategory = currentCategoryFilter === "all" || project.category === currentCategoryFilter;
    const query = currentSearchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || 
      project.title.toLowerCase().includes(query) || 
      project.description.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query));
    
    const matchesFav = !showOnlyFavorites || Storage.isFavorite(project.id);

    return matchesCategory && matchesSearch && matchesFav;
  });

  // Empty state handling
  if (filtered.length === 0) {
    projectsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--bg-secondary); border-radius: var(--radius-lg); border: 1px dashed var(--surface-border);">
        <p style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</p>
        <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">No Projects Found</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Try adjusting your search query or filter criteria.</p>
        <button class="btn btn-outline" style="margin-top: 1rem;" onclick="resetProjectFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  // Map projects data array to HTML template literals
  projectsGrid.innerHTML = filtered.map(project => {
    const isFav = Storage.isFavorite(project.id);
    const starIcon = isFav ? "★" : "☆";
    const starTitle = isFav ? "Remove from bookmarks" : "Bookmark this project";

    return `
      <article class="project-card" data-id="${project.id}">
        <div class="project-thumbnail-wrapper">
          <span class="project-category-badge">${project.badge || project.category}</span>
          <button class="project-fav-btn" onclick="handleFavoriteClick('${project.id}', event)" title="${starTitle}" aria-label="${starTitle}">
            <span style="color: ${isFav ? '#eab308' : 'inherit'}; font-size: 1.2rem;">${starIcon}</span>
          </button>
          <div class="project-icon-visual">${project.icon}</div>
        </div>

        <div class="project-content">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join("")}
          </div>

          <div class="project-actions">
            <button class="btn btn-primary btn-card" onclick="openProjectModal('${project.id}')">
              View Details &rarr;
            </button>
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-card">
              GitHub
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  updateFavoritesCounter();
};

/**
 * Updates bookmark count badge
 */
const updateFavoritesCounter = () => {
  const count = Storage.getFavorites().length;
  if (favCountEl) {
    favCountEl.textContent = count;
  }
};

/**
 * Handles bookmark button click
 */
window.handleFavoriteClick = (id, event) => {
  event.stopPropagation();
  Storage.toggleFavorite(id);
  renderProjects(projectsData);
};

/**
 * Resets search and category filters
 */
window.resetProjectFilters = () => {
  currentCategoryFilter = "all";
  currentSearchQuery = "";
  showOnlyFavorites = false;
  
  const searchInput = document.getElementById("project-search");
  if (searchInput) searchInput.value = "";
  
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.category === "all");
  });

  const showFavBtn = document.getElementById("show-favorites-btn");
  if (showFavBtn) showFavBtn.textContent = "Toggle Bookmarks View";

  renderProjects(projectsData);
};

// ==========================================================================
// 4. INTERACTIVE UI: Filter & Search Events (B2)
// ==========================================================================
// Category Filter Chips
document.querySelectorAll(".filter-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentCategoryFilter = button.dataset.category || "all";
    renderProjects(projectsData);
  });
});

// Live Search Input (Real-time filtering)
const searchInput = document.getElementById("project-search");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;
    renderProjects(projectsData);
  });
}

// Show Favorites Toggle Button
const showFavoritesBtn = document.getElementById("show-favorites-btn");
if (showFavoritesBtn) {
  showFavoritesBtn.addEventListener("click", () => {
    showOnlyFavorites = !showOnlyFavorites;
    showFavoritesBtn.textContent = showOnlyFavorites ? "Show All Projects" : "Toggle Bookmarks View";
    renderProjects(projectsData);
  });
}

// ==========================================================================
// 5. INTERACTIVE UI: Modal / Lightbox Dialog (B2)
// ==========================================================================
const projectModal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");
const modalCloseBtn = document.getElementById("modal-close");

/**
 * Opens detailed project lightbox modal
 * @param {string} projectId 
 */
window.openProjectModal = (projectId) => {
  const project = projectsData.find(p => p.id === projectId);
  if (!project || !projectModal || !modalBody) return;

  modalBody.innerHTML = `
    <span class="modal-header-tag">${project.category} &bull; ${project.badge}</span>
    <h3 class="modal-title">${project.title}</h3>
    
    <div class="modal-meta">
      <div><strong>Mentor:</strong> ${project.mentor}</div>
      <div><strong>Team:</strong> ${project.teamSize}</div>
      <div><strong>Timeline:</strong> ${project.duration}</div>
    </div>

    <p class="modal-desc">${project.description}</p>
    
    <div class="modal-tech-header">Technologies &amp; Architecture:</div>
    <div class="project-tags" style="margin-bottom: 1.5rem;">
      ${project.tags.map(t => `<span class="tech-tag" style="font-size: 0.85rem; padding: 0.25rem 0.65rem;">${t}</span>`).join("")}
    </div>

    <div class="modal-actions">
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        Explore GitHub Repository &rarr;
      </a>
      <button class="btn btn-outline" onclick="closeProjectModal()">Close</button>
    </div>
  `;

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent background scroll
};

/**
 * Closes the active modal
 */
window.closeProjectModal = () => {
  if (!projectModal) return;
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeProjectModal);
}

// Close on backdrop click
if (projectModal) {
  projectModal.addEventListener("click", (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });
}

// Close on Escape key press
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && projectModal && projectModal.classList.contains("open")) {
    closeProjectModal();
  }
});

// ==========================================================================
// 6. THEME TOGGLE WITH LOCALSTORAGE (B2 & B4)
// ==========================================================================
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

/**
 * Applies selected theme and synchronizes with localStorage
 * @param {string} theme - "light" or "dark"
 */
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  Storage.setTheme(theme);
  if (themeIcon) {
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  }
};

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });
}

// ==========================================================================
// 7. RESPONSIVE MOBILE NAVIGATION (B2)
// ==========================================================================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close mobile drawer when any link is clicked
  document.querySelectorAll(".nav-item").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================================================================
// 8. SCROLL-TO-TOP BUTTON (A9 Positioning)
// ==========================================================================
const scrollTopBtn = document.getElementById("scroll-top");

window.addEventListener("scroll", () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==========================================================================
// 9. CLIENT-SIDE FORM VALIDATION WITH REGEX (B3)
// ==========================================================================
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const phoneInput = document.getElementById("contact-phone");
const messageInput = document.getElementById("contact-message");
const formAlert = document.getElementById("form-alert");

// Regular Expressions
const REGEX = {
  // Letters and spaces only, 3 to 50 characters
  name: /^[a-zA-Z\s]{3,50}$/,
  // Standard RFC-compliant email address pattern
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 10-digit Indian Mobile number starting with 6, 7, 8, or 9
  phone: /^[6-9]\d{9}$/
};

/**
 * Validates a single input field against rule and updates visual state
 * @param {HTMLInputElement} input 
 * @param {Function} validatorFn 
 * @param {string} feedbackId 
 * @param {string} errorMsg 
 * @returns {boolean}
 */
const validateField = (input, validatorFn, feedbackId, errorMsg) => {
  const feedbackEl = document.getElementById(feedbackId);
  const val = input.value.trim();
  const isValid = validatorFn(val);

  if (val === "") {
    input.classList.remove("is-valid", "is-invalid");
    if (feedbackEl) {
      feedbackEl.textContent = "This field is required.";
      feedbackEl.className = "validation-message error";
    }
    return false;
  }

  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (feedbackEl) {
      feedbackEl.textContent = "✓ Looks good!";
      feedbackEl.className = "validation-message success";
    }
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    if (feedbackEl) {
      feedbackEl.textContent = errorMsg;
      feedbackEl.className = "validation-message error";
    }
    return false;
  }
};

// Real-time Event Listeners for Validation
if (nameInput) {
  nameInput.addEventListener("input", () => {
    validateField(nameInput, val => REGEX.name.test(val), "name-feedback", "Please enter a valid name (3-50 letters only).");
  });
  nameInput.addEventListener("blur", () => {
    validateField(nameInput, val => REGEX.name.test(val), "name-feedback", "Please enter a valid name (3-50 letters only).");
  });
}

if (emailInput) {
  emailInput.addEventListener("input", () => {
    validateField(emailInput, val => REGEX.email.test(val), "email-feedback", "Please enter a valid email address (e.g. name@domain.com).");
  });
  emailInput.addEventListener("blur", () => {
    validateField(emailInput, val => REGEX.email.test(val), "email-feedback", "Please enter a valid email address.");
  });
}

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    validateField(phoneInput, val => REGEX.phone.test(val), "phone-feedback", "Enter a valid 10-digit mobile number starting with 6-9.");
  });
  phoneInput.addEventListener("blur", () => {
    validateField(phoneInput, val => REGEX.phone.test(val), "phone-feedback", "Enter a valid 10-digit mobile number.");
  });
}

if (messageInput) {
  messageInput.addEventListener("input", () => {
    validateField(messageInput, val => val.length >= 10, "message-feedback", "Message must be at least 10 characters long.");
  });
  messageInput.addEventListener("blur", () => {
    validateField(messageInput, val => val.length >= 10, "message-feedback", "Message must be at least 10 characters long.");
  });
}

// Form Submission Handler
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default page refresh

    const isNameValid = validateField(nameInput, val => REGEX.name.test(val), "name-feedback", "Please enter a valid name (3-50 letters only).");
    const isEmailValid = validateField(emailInput, val => REGEX.email.test(val), "email-feedback", "Please enter a valid email address.");
    const isPhoneValid = validateField(phoneInput, val => REGEX.phone.test(val), "phone-feedback", "Enter a valid 10-digit mobile number.");
    const isMessageValid = validateField(messageInput, val => val.length >= 10, "message-feedback", "Message must be at least 10 characters long.");

    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
      // Record submission details to localStorage
      const submission = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        message: messageInput.value.trim(),
        submittedAt: new Date().toISOString()
      };
      
      const previousInquiries = JSON.parse(localStorage.getItem("contact_inquiries") || "[]");
      previousInquiries.push(submission);
      localStorage.setItem("contact_inquiries", JSON.stringify(previousInquiries));

      // Show animated success alert
      if (formAlert) {
        formAlert.style.display = "block";
        formAlert.className = "form-alert success";
        formAlert.innerHTML = `✓ Thank you <strong>${submission.name}</strong>! Your message has been validated and recorded successfully.`;
      }

      // Reset form and visual field classes
      contactForm.reset();
      document.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid", "is-invalid"));
      document.querySelectorAll(".validation-message").forEach(el => el.textContent = "");

      // Auto-hide alert after 6 seconds
      setTimeout(() => {
        if (formAlert) formAlert.style.display = "none";
      }, 6000);

    } else {
      if (formAlert) {
        formAlert.style.display = "block";
        formAlert.className = "form-alert error";
        formAlert.textContent = "Please resolve the highlighted errors before submitting.";
      }
    }
  });
}

// ==========================================================================
// 10. SESSION GREETING BANNER (sessionStorage)
// ==========================================================================
const greetingBanner = document.getElementById("greeting-banner");
const closeBannerBtn = document.getElementById("close-banner");

if (closeBannerBtn && greetingBanner) {
  if (Storage.isBannerClosed()) {
    greetingBanner.style.display = "none";
  }

  closeBannerBtn.addEventListener("click", () => {
    greetingBanner.style.display = "none";
    Storage.setBannerClosed();
  });
}

// ==========================================================================
// 11. INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Apply persisted theme
  const savedTheme = Storage.getTheme();
  applyTheme(savedTheme);

  // Initial dynamic render of projects
  renderProjects(projectsData);

  console.log("Vivek H Portfolio loaded successfully with Vanilla JS & DOM Interactivity.");
});