window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);
    const query = params.toString();

    fetch(`/api/search_games.php?${query}`)
        .then(res => res.json())
        .then(data => {
            const area = document.getElementById("resultsArea");

            if (data.status !== "success" || data.count === 0) {
                area.innerHTML = "<p>該当するゲームはありません。</p>";
                return;
            }

            // 結果一覧を表示
            area.innerHTML = data.results
                .map(game => `
                <div class="game-item" onclick="location.href='detail.html?id=${game.id}'">
                  <img src="assets/images/banners/${game.banner_image}" class="banner">
                  <p>${game.name}</p>
                </div>
              `)
                .join("");
        })
        .catch(err => {
            console.error(err);
            document.getElementById("resultsArea").innerHTML =
                "<p>エラーが発生しました。</p>";
        });
});
