  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    const root = document.documentElement;
    let theme = root.dataset.theme === "dark" ? "dark" : "light";
    let reveal;
    const waves = [];
    const revealDuration = 680;

    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeToggle.hidden = false;
    themeToggle.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
      try {
        localStorage.setItem("sort-score-theme", theme);
      } catch {}

      if (!document.startViewTransition || reducedMotion.matches || document.body.classList.contains("motion-paused")) {
        root.dataset.theme = theme;
        reveal?.skipTransition();
        return;
      }
      waves.push({ theme, start: performance.now() });
      if (reveal) return;

      const incomingTheme = theme;
      const { left, top, width, height } = themeToggle.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const radius = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)));
      root.classList.add("theme-revealing");
      const transition = document.startViewTransition(() => {
        root.dataset.theme = incomingTheme;
      });
      reveal = transition;

      let frame;
      const animate = (now) => {
        if (now - waves.at(-1).start >= revealDuration) {
          root.dataset.theme = theme;
          transition.skipTransition();
          return;
        }

        // Each newer circle covers the center of the previous one. The mask
        // alternates between the incoming snapshot and the original beneath it.
        const stops = [];
        let inner = 0;
        for (let index = waves.length - 1; index >= 0; index--) {
          const wave = waves[index];
          const progress = Math.max(0, Math.min(1, (now - wave.start) / revealDuration));
          const outer = radius * (1 - (1 - progress) ** 2);
          const color = wave.theme === incomingTheme ? "black" : "transparent";
          stops.push(`${color} ${inner}px ${outer}px`);
          inner = outer;
          if (progress === 1) {
            waves.splice(0, index);
            break;
          }
        }
        stops.push(`transparent ${inner}px`);
        root.style.setProperty("--theme-mask", `radial-gradient(circle at ${x}px ${y}px, ${stops.join(", ")})`);
        frame = requestAnimationFrame(animate);
      };
      const finish = () => {
        cancelAnimationFrame(frame);
        root.dataset.theme = theme;
        reveal = undefined;
        waves.length = 0;
        root.classList.remove("theme-revealing");
        root.style.removeProperty("--theme-mask");
      };
      transition.ready.then(() => { frame = requestAnimationFrame(animate); }, () => {});
      transition.finished.then(finish, finish);
    });

    // During a native reveal, the browser can hit-test the snapshot as the root.
    const hitsThemeSnapshot = (event) => {
      if (!reveal || event.target !== root || event.button !== 0) return false;
      const { left, right, top, bottom } = themeToggle.getBoundingClientRect();
      return event.clientX >= left && event.clientX <= right && event.clientY >= top && event.clientY <= bottom;
    };
    document.addEventListener("mousedown", (event) => {
      if (hitsThemeSnapshot(event)) event.preventDefault();
    });
    document.addEventListener("click", (event) => {
      if (hitsThemeSnapshot(event)) themeToggle.click();
    });
  }

  const motionToggle = document.querySelector(".motion-toggle");
  if (motionToggle) {
    const marqueeTrack = document.querySelector(".marquee-track");
    marqueeTrack.append(marqueeTrack.firstElementChild.cloneNode(true));
    motionToggle.hidden = false;
    motionToggle.addEventListener("click", () => {
      const paused = document.body.classList.toggle("motion-paused");
      motionToggle.textContent = paused ? "Resume motion" : "Pause motion";
    });

    const sectionMotion = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.querySelector("[data-motion]").classList.toggle("motion-visible", entry.isIntersecting);
      }
    });
    document.querySelectorAll("section:has([data-motion])").forEach((section) => sectionMotion.observe(section));
  }

  const branch = document.querySelector("#bin-branch");
  const locationLabel = document.querySelector("#bin-location");
  const button = document.querySelector("#scan-button");
  const stage = document.querySelector("#scan-stage");
  const itemIcon = document.querySelector("#scan-item-icon");
  const screenIcon = document.querySelector("#scan-screen-icon");
  const result = document.querySelector("#scan-result");
  const pointsDialog = document.querySelector("#points-dialog");
  const earnedPoints = document.querySelector("#earned-points");
  const depositDetail = document.querySelector("#deposit-detail");
  const materials = Array.from(document.querySelectorAll("#material-rewards li"), (row) => ({
    name: row.querySelector("b").textContent,
    icon: row.querySelector("svg"),
    points: row.dataset.points
  }));

  branch.addEventListener("change", () => {
    locationLabel.textContent = "Demo location · " + branch.value;
  });
  pointsDialog?.addEventListener("close", () => button.focus({ preventScroll: true }));

  button.addEventListener("click", async () => {
    if (button.getAttribute("aria-disabled") === "true") return;
    const material = materials[Math.floor(Math.random() * materials.length)];
    const bin = branch.selectedOptions[0].textContent.split(" · ")[0];

    button.setAttribute("aria-disabled", "true");
    const item = material.icon.cloneNode(true);
    item.setAttribute("width", "35");
    item.setAttribute("height", "35");
    itemIcon.replaceChildren(item);

    const screenItem = material.icon.cloneNode(true);
    screenItem.setAttribute("width", "21");
    screenItem.setAttribute("height", "21");
    screenIcon.replaceChildren(screenItem);
    result.textContent = "Scanning at " + bin + "…";
    if (!reducedMotion.matches) {
      stage.dataset.state = "scanning";
      await new Promise((resolve) => setTimeout(resolve, 1650));
    }

    stage.dataset.state = "done";
    result.textContent = material.name + " identified at " + bin + ". Sample earnings: " + material.points + " points.";
    button.removeAttribute("aria-disabled");
    if (pointsDialog) {
      earnedPoints.textContent = material.points + " sample points earned";
      depositDetail.textContent = material.name + " identified at " + bin + ". Your demo balance stays the same.";
      pointsDialog.showModal();
    }
  });
