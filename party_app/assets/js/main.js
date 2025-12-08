const CUSTOM_GAMES_KEY = "customGames";
function getCustomGames() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_GAMES_KEY)) || []; }
  catch { return []; }
}

function matchByPeople(g, peopleVal) {
  if (!peopleVal) return true;
  // 例：peopleVal "2-3" → 数字範囲
  const [min, max] = peopleVal.split("-").map(Number);
  // g.people_min/max が数値（ユーザー登録） or 文字列（デフォルトJSON）の両対応
  const pmin = Number(g.people_min ?? (g.people?.min ?? 1));
  const pmax = Number(g.people_max ?? (g.people?.max ?? 99));
  return !(pmax < min || pmin > max); // 範囲が重なればOK
}

function matchByTime(g, timeVal) {
  if (!timeVal) return true;
  const limit = Number(timeVal); // 分
  const t = Number(g.time_min ?? g.time?.min ?? 9999);
  return t <= limit;
}

function matchByGenre(g, genreVal) {
  if (!genreVal) return true;
  const gen = (g.genre || "").toString();
  return gen === genreVal;
}

function toCardHTML(g) {
  // 文字列データ（既存games.json）と数値データ（ユーザー登録）をうまく表示
  const name = g.name;
  const people = (g.people)
    ? (typeof g.people === "string" ? g.people : `${g.people.min}〜${g.people.max}人`)
    : `${g.people_min}〜${g.people_max}人`;
  const time = g.time ? g.time : `${g.time_min}分`;
  const tools = Array.isArray(g.tools) ? (g.tools.length ? g.tools.join(", ") : "無") : (g.tools || "無");
  const desc = g.desc || g.description || "";
  const badge = g.source === "user" ? `<span style="font-size:.75rem;opacity:.7">（ユーザー登録）</span>` : "";

  return `<div class="game-card">
    <h2>${name} ${badge}</h2>
    <p>人数: ${people}</p>
    <p>時間: ${time}</p>
    <p>道具: ${tools}</p>
    <p>${desc}</p>
  </div>`;
}

async function loadGames() {
  // デフォルト（data/games.json）は既存形式：
  // [{"name":"ワードウルフ","people":"3〜5人","time":"約5分","genre":"心理","desc":"..."}]
  const res = await fetch("data/games.json");
  const defaults = await res.json();

  // ユーザー登録データ
  const customs = getCustomGames();

  const all = [
    ...defaults.map(d => ({
      ...d,
      // 検索用の内部正規化（人/時間をざっくり数値化）
      people_min: Number((d.people || "").match(/\d+/)?.[0] ?? 1),
      people_max: Number((d.people || "").match(/(\d+)[^\d]*$/)?.[1] ?? 99),
      time_min: Number((d.time || "").match(/\d+/)?.[0] ?? 9999),
      source: "default"
    })),
    ...customs
  ];

  const url = new URLSearchParams(location.search);
  const people = url.get("people"); // 例: "2-3"
  const time = url.get("time");     // 例: "5"（分以内）
  const genre = url.get("genre");

  const result = all.filter(g =>
    matchByPeople(g, people) &&
    matchByTime(g, time) &&
    matchByGenre(g, genre)
  );

  const box = document.getElementById("result-box");
  box.innerHTML = result.length
    ? result.map(toCardHTML).join("")
    : `<p>条件に合うゲームが見つかりませんでした。</p>`;
}

window.onload = loadGames;

  