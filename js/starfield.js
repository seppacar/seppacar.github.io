(function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 200;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.3 + 0.05,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;
        for (const star of stars) {
            const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${star.opacity * twinkle})`;
            ctx.fill();

            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); createStars(); });
    resize();
    createStars();
    draw();
})();
