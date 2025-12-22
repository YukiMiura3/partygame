document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const params = new URLSearchParams(new FormData(e.target));
  location.href = `result.html?${params.toString()}`;
});

document.querySelectorAll(".icon-group").forEach(group => {
  const select = document.getElementById(group.dataset.target);
  const items = group.querySelectorAll(".icon-item");

  items.forEach(item => {
    item.addEventListener("click", () => {

      // すでに選択されていれば解除
      if (item.classList.contains("active")) {
        item.classList.remove("active");
        select.value = "";
        return;
      }

      // 他の選択解除
      items.forEach(i => i.classList.remove("active"));

      // 選択
      item.classList.add("active");
      select.value = item.dataset.value;
    });
  });
});
