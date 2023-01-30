async function initSummary() {
  await includeHTML();
  setURL(
    "https://kai-beckmann.developerakademie.net/Join-Javascript/smallest_backend_ever"
  );
  await loadAllTasks();
  loadAllCounters();
  activeSummaryNavLink();
}
