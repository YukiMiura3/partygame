const CUSTOM_GAMES_KEY = "customGames";

function getCustomGames() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_GAMES_KEY)) || []; }
  catch { return []; }
}
function saveCustomGames(arr) {
  localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(arr));
}

document.getElementById("gameForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const g = {
    id: crypto.randomUUID(),
    name: (fd.get("name") || "").trim(),
    people_min: Number(fd.get("people_min")),
    people_max: Number(fd.get("people_max")),
    time_min: Number(fd.get("time_min")),
    tools: (fd.get("tools") || "無").split(",").map(s => s.trim()).filter(Boolean),
    genre: fd.get("genre"),
    description: (fd.get("description") || "").trim(),
    source: "user"
  };

  // バリデーション
  if (!g.name) return alert("ゲーム名は必須です。");
  if (g.people_min > g.people_max) return alert("最小人数は最大人数以下にしてください。");
  if (g.time_min < 1) return alert("時間（分）は1以上を入力してください。");

  // 既存重複チェック（名前＋人数＋時間でざっくり）
  const list = getCustomGames();
  const dup = list.find(x =>
    x.name === g.name &&
    x.people_min === g.people_min &&
    x.people_max === g.people_max &&
    x.time_min === g.time_min
  );
  if (dup) return alert("同じゲームが既に登録されています。");

  list.push(g);
  saveCustomGames(list);
  alert("登録しました！検索画面・結果に反映されます。");
  e.target.reset();
});

// エクスポート
document.getElementById("exportBtn").addEventListener("click", () => {
  const data = JSON.stringify(getCustomGames(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: "custom_games.json" });
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

// インポート
document.getElementById("importFile").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error("invalid");
    const current = getCustomGames();
    // ざっくりマージ（id再発行）
    const merged = [
      ...current,
      ...arr.map(x => ({
        id: crypto.randomUUID(),
        name: x.name, people_min: Number(x.people_min), people_max: Number(x.people_max),
        time_min: Number(x.time_min), tools: (x.tools || []).map(s=>String(s)),
        genre: x.genre || "その他", description: x.description || "", source: "user"
      }))
    ];
    saveCustomGames(merged);
    alert(`インポートしました（${arr.length}件）。`);
  } catch {
    alert("JSONの形式が不正です。");
  } finally {
    e.target.value = "";
  }
});
