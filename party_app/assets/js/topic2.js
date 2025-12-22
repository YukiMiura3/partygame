// ランダム話題を取得
document.getElementById("topic-btn").addEventListener("click", async () => {
    const box = document.getElementById("topic-box");
    box.textContent = "抽選中… 🎡";

    const res = await fetch("api/get_random.php");
    const data = await res.json();

    if (data.success) {
        box.innerHTML =
            `<strong>【${data.category}】</strong><br>${data.theme}`;
    } else {
        box.textContent = "話題がありません";
    }
});

// 話題追加フォーム
document.getElementById("topicAddForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const category = document.getElementById("categorySelect").value;
    const theme = document.getElementById("topicInput").value;

    if (!category || !theme) return alert("ジャンルとテーマを入力してください");

    const res = await fetch("api/add_topic.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, theme })
    });

    const data = await res.json();

    if (data.success) {
        alert("追加しました！");
        document.getElementById("topicInput").value = "";
    } else {
        alert("エラー：" + data.message);
    }
});

/*
// 全削除
document.getElementById("topicClear").addEventListener("click", async () => {
    if (!confirm("本当に全て削除しますか？")) return;

    const res = await fetch("api/clear_all.php");
    const data = await res.json();

    if (data.success) {
        alert("削除しました");
    }
});
*/
