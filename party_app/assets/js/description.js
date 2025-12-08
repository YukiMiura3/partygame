const params = new URLSearchParams(location.search);
const id = params.get("id");

// スライド画像を格納する変数
let slides = [];
let currentIndex = 0;

// 初期化
fetch(`api/get_slides.php?id=${id}`)
    .then(res => res.json())
    .then(data => {
        slides = data.slides;
        setupSlides();
    })
    .catch(err => console.error(err));

function setupSlides() {
    if (slides.length === 0) return;

    updateSlide();

    // ページネーション生成
    const dots = document.getElementById("dots");
    dots.innerHTML = "";
    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.addEventListener("click", () => {
            currentIndex = i;
            updateSlide();
        });
        dots.appendChild(dot);
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateSlide();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateSlide();
    });

    // キーボード矢印操作
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSlide();
        }
        if (e.key === "ArrowRight") {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSlide();
        }
    });
}

function updateSlide() {
    const img = document.getElementById("slideImage");
    img.src = `assets/images/slides/word_wolf/${slides[currentIndex]}`;

    // ページネーション反映
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
    });
}
