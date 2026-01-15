// topic.js（完成版）
// - ルーレット回転（CSS変数 --rot を更新）
// - セグメント文字は「中心に向かう放射状」配置（画像イメージ）
// - API(get_random.php) から topic を取得して表示
// - API失敗時も回転だけはして、メッセージ表示

"use strict";

/* =========================
 * 1) 設定
 * ========================= */

const CATEGORIES = [
  "恋愛・人間関係",
  "自己紹介・価値観系",
  "日常・生活習慣",
  "生活・ライフスタイル",
  "仕事・勉強・工夫",
  "趣味・エンタメ",
  "食べ物・料理",
  "子ども時代・過去エピソード",
  "旅行・おでかけ",
  "おもしろ発想",
  "ガジェット・デジタル",
  "フリートーク",
];

// 針（ポインタ）が「上（12時）」にある前提。
// もし針の位置を変えたらここだけ調整（例：右=0, 下=90, 左=180, 上=270 など）
const POINTER_DEG = 0;

// 回転演出
const EXTRA_SPINS = 6;     // 追加回転数
const DURATION_MS = 2600;  // CSS transition と揃える

/* =========================
 * 2) 要素取得
 * ========================= */

const wheel = document.getElementById("wheel");
const btn = document.getElementById("topic-btn");
const box = document.getElementById("topic-box");

if (!wheel || !btn || !box) {
  console.error("必要な要素 (#wheel, #topic-btn, #topic-box) が見つかりません");
}

/* =========================
 * 3) ラベルを「中心に向かう放射状」に配置
 *    - 上は縦、左右は横、斜めは斜め
 *    - 下半分は逆さにならないように 180° 反転
 * ========================= */

function layoutWheelLabels() {
    const labels = wheel.querySelectorAll(".seg-label");
    const n = labels.length;
    if (!n) return;
  
    const rect = wheel.getBoundingClientRect();
    const radius = rect.width / 2 - 90;
  
    const seg = 360 / n;
  
    labels.forEach((el, i) => {
      const mid = i * seg + seg / 2; // 0=上
      const isBottom = (mid > 90 && mid < 270);
  
      // 下半分だけ縦書き方向を変える（下→上）
      el.classList.toggle("bottom", isBottom);
  
      // ★重要：下半分でも 180°回転しない
      // 位置は常に mid で決める
      el.style.transform =
        `translate(-50%, -50%) rotate(${mid}deg) translateY(${-radius}px)`;
    });
  }
  
  window.addEventListener("load", layoutWheelLabels);
  window.addEventListener("resize", layoutWheelLabels);
  
  
  
  
  

/* =========================
 * 4) 回転ロジック
 * ========================= */

let spinning = false;
let currentRotation = 0; // deg

function normalizeDeg(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// 指定カテゴリがポインタ位置に来る回転量（deg）を返す
function targetRotationForCategory(category) {
  const n = CATEGORIES.length;
  const seg = 360 / n;

  const idx = CATEGORIES.indexOf(category);
  // 見つからない場合は 0 扱い
  const safeIdx = idx >= 0 ? idx : 0;

  // カテゴリ中心角
  const centerAngle = safeIdx * seg + seg / 2;

  // 「centerAngle が POINTER_DEG に一致」するように回す
  return POINTER_DEG - centerAngle;
}

async function fetchTopic() {
  const res = await fetch("api/get_random.php", { cache: "no-store" });
  // PHP 側がエラーで HTML を返すことがあるので、json() で落ちたら catch へ
  return await res.json();
}

btn?.addEventListener("click", async () => {
  if (!wheel || !btn || !box) return;
  if (spinning) return;

  spinning = true;
  btn.disabled = true;
  btn.textContent = "回転中…";
  box.textContent = "抽選中… 🎡";

  // API取得
  let data;
  try {
    data = await fetchTopic();
  } catch (e) {
    data = { success: false, message: "API取得に失敗" };
  }

  const n = CATEGORIES.length;
  const seg = 360 / n;

  // 結果カテゴリ：API成功ならそのcategory、失敗ならランダム
  const resultCategory =
    (data && data.success && typeof data.category === "string" && data.category.trim() !== "")
      ? data.category.trim()
      : CATEGORIES[Math.floor(Math.random() * n)];

  // 目標角度（カテゴリ中心をポインタ位置へ）
  const baseTarget = targetRotationForCategory(resultCategory);

  // セグメント内の微ブレ（見た目の自然さ）
  const jitter = (Math.random() * 0.6 - 0.3) * seg; // ±30% セグメント幅
  const target = baseTarget + jitter;

  // 現在角から自然につながるよう補正
  const start = currentRotation;
  const end = start + EXTRA_SPINS * 360 + (target - normalizeDeg(start));

  // 回転開始
  wheel.style.setProperty("--rot", `${end}deg`);
  wheel.classList.add("spinning");

  // 停止後
  window.setTimeout(() => {
    wheel.classList.remove("spinning");
    currentRotation = end;

    if (data && data.success) {
      box.innerHTML = `<strong>【${data.category}】</strong><br>${data.theme}`;
    } else {
      // 失敗理由があれば出す（なければ固定文）
      const msg = data?.message ? `（${data.message}）` : "（API取得に失敗）";
      box.textContent = `話題がありません ${msg}`;
    }

    btn.disabled = false;
    btn.textContent = "回す🎡";
    spinning = false;
  }, DURATION_MS);
});
