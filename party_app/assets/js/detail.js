document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(location.search);
    const gameId = params.get("id");

    if (!gameId) {
        alert("ゲームIDが指定されていません。");
        return;
    }

    try {
        const res = await fetch(`api/game_detail.php?id=${gameId}`);
        const data = await res.json();

        if (!data.success) {
            alert("データを取得できませんでした。");
            return;
        }

        const game = data.game;

        document.getElementById("gameName").textContent = game.name;
        document.getElementById("players").textContent = game.players;
        document.getElementById("time").textContent = game.time;
        document.getElementById("items").textContent = game.items ? "有" : "無";
        document.getElementById("genre").textContent = game.genre;
        document.getElementById("detailText").textContent = game.detail ?? "（詳細は準備中）";

        // テストプレイページへ遷移
        document.getElementById("testPlayBtn").onclick = () => {
            location.href = `description.html?id=${game.id}`;
        };

    } catch (e) {
        console.error(e);
        alert("通信エラーが発生しました。");
    }
});
