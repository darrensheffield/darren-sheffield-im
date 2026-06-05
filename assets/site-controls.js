(function () {
  const STORAGE_KEY = "site-controls-state-v1";
  const EVENT_NAME = "site-controls:statechange";

  const defaults = {
    motionPaused: false,
    largerText: false,
    highContrast: false,
    underlineLinks: false,
    calmMotion: false,
    increasedSpacing: false,
    dyslexiaFont: false,
    focusMode: false
  };

  const state = { ...defaults };
  const optionButtons = {};
  const iconPaths = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="18" cy="12" r="1.6"></circle></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14"></path><path d="M15 5v14"></path></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l10 6-10 6z"></path></svg>',
    text: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18l5-12h2l5 12"></path><path d="M7 14h8"></path><path d="M18 10h4"></path><path d="M20 8v4"></path></svg>',
    contrast: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M12 4v16"></path><path d="M12 20a8 8 0 0 0 0-16"></path></svg>',
    links: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12h8"></path><path d="M9 16h6"></path><path d="M7 8h10"></path><path d="M5 20h14"></path></svg>',
    motion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12c3-5 6 5 9 0s5-2 7 0"></path><path d="M4 18h16"></path></svg>',
    spacing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12"></path><path d="M6 12h12"></path><path d="M6 18h12"></path><path d="M3 8l3-3 3 3"></path><path d="M3 16l3 3 3-3"></path></svg>',
    font: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18V6h5a5 5 0 0 1 0 10H6"></path><path d="M12 18h6"></path></svg>',
    focus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7V5h4"></path><path d="M15 5h4v2"></path><path d="M19 17v2h-4"></path><path d="M9 19H5v-2"></path><path d="M8 12h8"></path></svg>'
  };
  const settings = [
    { key: "largerText", label: "Text size", icon: "text" },
    { key: "highContrast", label: "Contrast", icon: "contrast" },
    { key: "underlineLinks", label: "Links", icon: "links" },
    { key: "calmMotion", label: "Motion", icon: "motion" },
    { key: "increasedSpacing", label: "Spacing", icon: "spacing" },
    { key: "dyslexiaFont", label: "Readable font", icon: "font" },
    { key: "focusMode", label: "Reading width", icon: "focus" }
  ];

  const root = document.documentElement;
  let cluster;
  let motionButton;
  let motionIcon;
  let motionLabel;
  let menuButton;
  let popover;
  let menuOpen = false;
  let motionControlEnabled = false;

  const readSettings = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw);
      const next = {};

      Object.keys(defaults).forEach((key) => {
        next[key] = typeof parsed[key] === "boolean" ? parsed[key] : defaults[key];
      });

      return next;
    } catch {
      return {};
    }
  };

  const writeSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota/private-mode failures
    }
  };

  const applyState = () => {
    const {
      motionPaused,
      largerText,
      highContrast,
      underlineLinks,
      calmMotion,
      increasedSpacing,
      dyslexiaFont,
      focusMode
    } = state;

    const effectiveMotionPaused = motionControlEnabled && motionPaused;

    root.classList.toggle("site-controls-motion-paused", effectiveMotionPaused);
    root.classList.toggle("site-controls-large-text", largerText);
    root.classList.toggle("site-controls-high-contrast", highContrast);
    root.classList.toggle("site-controls-underline-links", underlineLinks);
    root.classList.toggle("site-controls-calm-motion", calmMotion);
    root.classList.toggle("site-controls-increased-spacing", increasedSpacing);
    root.classList.toggle("site-controls-dyslexia-font", dyslexiaFont);
    root.classList.toggle("site-controls-focus-mode", focusMode);

    if (motionButton) {
      const label = motionPaused ? "Resume motion" : "Pause motion";
      motionButton.setAttribute("aria-pressed", String(Boolean(effectiveMotionPaused)));
      motionButton.setAttribute("aria-label", label + ", animation controls");
      motionIcon.innerHTML = motionPaused ? iconPaths.play : iconPaths.pause;
      motionLabel.textContent = motionPaused ? "Resume" : "Pause";
    }

    if (menuButton) {
      menuButton.setAttribute("aria-label", "Accessibility settings" + (menuOpen ? ", open" : ", closed"));
      menuButton.setAttribute("aria-expanded", String(Boolean(menuOpen)));
    }

    Object.keys(optionButtons).forEach((key) => {
      const button = optionButtons[key];
      if (button) {
        button.setAttribute("aria-pressed", String(Boolean(state[key])));
      }
    });

    window.dispatchEvent(new CustomEvent(EVENT_NAME, {
      detail: { ...state, motionPaused: effectiveMotionPaused }
    }));
  };

  const setState = (key, value) => {
    if (typeof state[key] === "undefined" || typeof value !== "boolean") {
      return;
    }

    if (state[key] === value) {
      return;
    }

    state[key] = value;
    writeSettings();
    applyState();
  };

  const openMenu = () => {
    menuOpen = true;
    popover.hidden = false;
    applyState();
    popover.focus();
  };

  const closeMenu = () => {
    if (!menuOpen) {
      return;
    }
    menuOpen = false;
    popover.hidden = true;
    applyState();
  };

  const createOptionButton = ({ key, label, icon }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "site-controls-option";
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-pressed", String(Boolean(state[key])));

    const iconWrap = document.createElement("span");
    iconWrap.className = "site-controls-option-icon";
    iconWrap.innerHTML = iconPaths[icon];

    const text = document.createElement("span");
    text.className = "site-controls-option-label";
    text.textContent = label;

    button.appendChild(iconWrap);
    button.appendChild(text);
    button.addEventListener("click", () => {
      setState(key, !state[key]);
    });

    optionButtons[key] = button;
    return button;
  };

  const createCluster = () => {
    cluster = document.createElement("div");
    cluster.className = "site-controls-cluster";

    const actions = document.createElement("div");
    actions.className = "site-controls-actions";

    if (motionControlEnabled) {
      motionButton = document.createElement("button");
      motionButton.type = "button";
      motionButton.className = "site-controls-btn site-controls-motion-btn";

      motionIcon = document.createElement("span");
      motionIcon.className = "site-controls-icon";
      motionIcon.setAttribute("aria-hidden", "true");

      motionLabel = document.createElement("span");
      motionLabel.className = "site-controls-label site-controls-btn-text";

      const motionHelp = document.createElement("span");
      motionHelp.className = "site-controls-visually-hidden";
      motionHelp.textContent = "Pause or resume motion";

      motionButton.appendChild(motionIcon);
      motionButton.appendChild(motionLabel);
      motionButton.appendChild(motionHelp);
      motionButton.addEventListener("click", () => {
        setState("motionPaused", !state.motionPaused);
      });
    }

    menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "site-controls-btn site-controls-menu-btn";
    menuButton.setAttribute("aria-haspopup", "dialog");
    menuButton.setAttribute("aria-controls", "site-controls-popover");

    const menuIcon = document.createElement("span");
    menuIcon.className = "site-controls-icon";
    menuIcon.innerHTML = iconPaths.menu;
    menuIcon.setAttribute("aria-hidden", "true");

    const menuText = document.createElement("span");
    menuText.className = "site-controls-label site-controls-btn-text";
    menuText.textContent = "A11y";

    const menuHelp = document.createElement("span");
    menuHelp.className = "site-controls-visually-hidden";
    menuHelp.textContent = "Open accessibility settings";

    menuButton.appendChild(menuIcon);
    menuButton.appendChild(menuText);
    menuButton.appendChild(menuHelp);
    menuButton.addEventListener("click", () => {
      if (menuOpen) {
        closeMenu();
        menuButton.focus();
      } else {
        openMenu();
      }
    });

    actions.appendChild(menuButton);
    if (motionButton) {
      actions.appendChild(motionButton);
    }

    popover = document.createElement("section");
    popover.id = "site-controls-popover";
    popover.className = "site-controls-popover";
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-label", "Accessibility settings");
    popover.setAttribute("tabindex", "-1");
    popover.hidden = true;

    const head = document.createElement("div");
    head.className = "site-controls-popover-head";

    const title = document.createElement("p");
    title.className = "site-controls-popover-title";
    title.textContent = "Accessibility";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "site-controls-close";
    close.textContent = "x";
    close.setAttribute("aria-label", "Close accessibility settings");
    close.addEventListener("click", closeMenu);

    head.appendChild(title);
    head.appendChild(close);

    const options = document.createElement("div");
    options.className = "site-controls-options";
    options.setAttribute("role", "group");
    options.setAttribute("aria-label", "Accessibility options");
    settings.forEach((setting) => {
      options.appendChild(createOptionButton(setting));
    });

    popover.appendChild(head);
    popover.appendChild(options);

    cluster.appendChild(actions);
    cluster.appendChild(popover);
    document.body.appendChild(cluster);
  };

  const handleOutsideAndEscape = () => {
    document.addEventListener("pointerdown", (event) => {
      if (!menuOpen || !cluster) {
        return;
      }
      if (!cluster.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menuOpen) {
        return;
      }
      event.preventDefault();
      closeMenu();
      if (menuButton) {
        menuButton.focus();
      }
    });
  };

  const init = () => {
    Object.assign(state, readSettings());
    motionControlEnabled = Boolean(document.getElementById("experienceCanvas"));
    createCluster();
    applyState();
    handleOutsideAndEscape();
  };

  window.siteControls = {
    getState: () => ({ ...state, motionPaused: Boolean(motionControlEnabled && state.motionPaused) }),
    isMotionPaused: () => Boolean(motionControlEnabled && state.motionPaused)
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
