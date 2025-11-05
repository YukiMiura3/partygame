// 大量のデフォルト話題（必要に応じて増やせます）
const defaultTopics = [
    "最近ハマっていることは？","100万円あったら何に使う？","子どものころの夢は？","今行きたい旅行先は？",
    "好きな映画を教えて！","朝型？夜型？理由は？","今年の目標は？","小さい幸せを感じた瞬間は？",
    "気分転換の方法は？","今のスマホのホーム画面はどんな感じ？","人生で一度はやってみたいことは？",
    "最近のベスト買い物は？","好きなYouTube/配信者は？","推しポイントを1分で語って！",
    "学生時代の黒歴史は？","得意料理は？","好きな季節と理由は？","尊敬する人は誰？",
    "今朝なに食べた？","一番使うアプリは？","最近の失敗談は？","子どもの頃の呼び名は？",
    "地元のおすすめスポットは？","もし瞬間移動できたらどこ行く？","無人島に1つ持っていくなら？",
    "最近笑った出来事は？","仕事/勉強での小ワザは？","やめたいけどやめられないことは？",
    "初デートで行きたい場所は？","今年のマイブームは？","小さい頃の将来の夢は？",
    "最近観たアニメ/ドラマで良かったのは？","好きなボードゲームは？","朝起きて最初にすることは？",
    "好きな香りは？","好きなアイスの味は？","今の気分を一言で？","旅行の失敗談は？",
    "もし無限に時間があったら何する？","これだけは譲れないこだわりは？","一番よく使う絵文字は？",
    "最近の学びは？","今週のハイライトは？","最近聞いた名言は？","理想の休日の過ごし方は？",
    "思い出のゲームは？","一番好きな朝ごはんは？","最近のガジェット事情は？","SNSどう使い分けてる？",
    "小さい頃の将来像と今の自分の共通点は？","1日入れ替わるなら誰？"
  ];
  
  // localStorage からユーザー話題を取得/保存
  const USER_TOPICS_KEY = "customTopics";
  
  function getUserTopics() {
    try {
      return JSON.parse(localStorage.getItem(USER_TOPICS_KEY)) || [];
    } catch {
      return [];
    }
  }
  function saveUserTopics(arr) {
    localStorage.setItem(USER_TOPICS_KEY, JSON.stringify(arr));
  }
  
  // ルーレット
  function spinTopic() {
    const all = [...defaultTopics, ...getUserTopics()];
    if (all.length === 0) {
      document.getElementById("topic-box").textContent = "話題がありません。追加してください。";
      return;
    }
    const box = document.getElementById("topic-box");
  
    // ルーレット風アニメ（軽量版）
    let steps = 18; // 回転っぽく数回入れ替える
    const timer = setInterval(() => {
      const random = Math.floor(Math.random() * all.length);
      box.textContent = all[random];
      steps--;
      if (steps <= 0) clearInterval(timer);
    }, 70);
  }
  
  document.getElementById("topic-btn").addEventListener("click", spinTopic);
  
  // 追加フォーム
  document.getElementById("topicAddForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("topicInput");
    const text = (input.value || "").trim();
    if (!text) return;
    const list = getUserTopics();
    if (list.includes(text) || defaultTopics.includes(text)) {
      alert("同じ話題が既にあります。");
      return;
    }
    list.push(text);
    saveUserTopics(list);
    input.value = "";
    alert("話題を追加しました！");
  });
  
  // 全削除
  document.getElementById("topicClear").addEventListener("click", () => {
    if (confirm("ユーザー追加の話題をすべて削除しますか？")) {
      saveUserTopics([]);
      alert("削除しました。");
    }
  });
  
  