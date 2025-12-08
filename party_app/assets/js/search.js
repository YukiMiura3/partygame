document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const params = new URLSearchParams(new FormData(e.target));
  location.href = `result.html?${params.toString()}`;
});
