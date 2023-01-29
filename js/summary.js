async function initSummary() {
  await loadAllTasks();
  loadAllCounters();
  activeSummaryNavLink();
}

function goToBoard() {
  window.location.href = "./html/board.html";
}
