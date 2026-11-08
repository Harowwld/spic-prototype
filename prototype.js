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
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
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
