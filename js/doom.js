const DoomGame = (function () {
    let canvas, ctx, container, hud;
    let running = false;
    let animFrame = null;
    let audioCtx = null;

    const MAP_W = 16;
    const MAP_H = 16;
    const MAP = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,2,2,0,0,0,0,0,3,3,0,0,0,1,
        1,0,0,2,0,0,0,0,0,0,0,3,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,2,2,2,0,0,0,0,0,0,1,
        1,0,0,0,0,0,2,0,2,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,3,0,0,0,0,0,0,0,2,0,0,0,1,
        1,0,0,3,3,0,0,0,0,0,2,2,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    ];

    function getMap(x, y) {
        if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return 1;
        return MAP[Math.floor(y) * MAP_W + Math.floor(x)];
    }

    let player = {
        x: 2.5,
        y: 2.5,
        angle: 0,
        health: 100,
        ammo: 50,
        score: 0,
        bobPhase: 0,
        shooting: false,
        shootTimer: 0,
    };

    let enemies = [];

    function spawnEnemies() {
        enemies = [
            { x: 5.5,  y: 5.5,  health: 30, speed: 0.015, type: 0, alive: true, hurtTimer: 0 },
            { x: 10.5, y: 3.5,  health: 30, speed: 0.012, type: 1, alive: true, hurtTimer: 0 },
            { x: 7.5,  y: 12.5, health: 50, speed: 0.01,  type: 0, alive: true, hurtTimer: 0 },
            { x: 13.5, y: 10.5, health: 30, speed: 0.018, type: 1, alive: true, hurtTimer: 0 },
            { x: 4.5,  y: 10.5, health: 40, speed: 0.014, type: 0, alive: true, hurtTimer: 0 },
            { x: 12.5, y: 6.5,  health: 30, speed: 0.016, type: 1, alive: true, hurtTimer: 0 },
        ];
    }

    const RES_SCALE = 2;
    const FOV = Math.PI / 3;
    const MAX_DEPTH = 20;
    const WALL_COLORS = {
        1: { r: 90,  g: 40,  b: 130 },
        2: { r: 40,  g: 110, b: 90  },
        3: { r: 130, g: 50,  b: 50  },
    };

    const keys = {};
    let mouseLocked = false;

    function playSoundEffect() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        } catch(e) {}
    }

    function onKeyDown(e) {
        keys[e.key.toLowerCase()] = true;
        if (e.key === 'Escape' || e.key === 'F10') {
            stop();
        }
        if (e.key === ' ' && running) {
            e.preventDefault();
            triggerShoot();
        }
    }

    function onKeyUp(e) {
        keys[e.key.toLowerCase()] = false;
    }

    function onMouseMove(e) {
        if (mouseLocked) {
            player.angle += e.movementX * 0.003;
        }
    }

    function triggerShoot() {
        if (player.ammo > 0 && player.shootTimer <= 0) {
            player.shooting = true;
            player.shootTimer = 12;
            player.ammo--;
            playSoundEffect();
            shootRay();
        }
    }

    function onClick(e) {
        if (!running) return;
        if (!mouseLocked) {
            canvas.requestPointerLock();
            return;
        }
        triggerShoot();
    }

    function onPointerLockChange() {
        mouseLocked = document.pointerLockElement === canvas;
    }

    function shootRay() {
        const rayAngle = player.angle;
        const rayDirX = Math.cos(rayAngle);
        const rayDirY = Math.sin(rayAngle);

        let closestHit = null;
        let closestDist = Infinity;

        for (const enemy of enemies) {
            if (!enemy.alive) continue;

            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const dot = dx * rayDirX + dy * rayDirY;
            if (dot < 0) continue;

            const perpDist = Math.abs(dx * rayDirY - dy * rayDirX);
            const hitRadius = 0.45 + (0.3 / (dist + 0.1));

            if (perpDist < hitRadius && dist < closestDist) {
                closestDist = dist;
                closestHit = enemy;
            }
        }

        if (closestHit) {
            closestHit.health -= 15;
            closestHit.hurtTimer = 10;
            if (closestHit.health <= 0) {
                closestHit.alive = false;
                player.score += 100;
            }
        }
    }

    function update() {
        const moveSpeed = 0.06;
        const rotSpeed = 0.04;

        if (keys['arrowleft'])  player.angle -= rotSpeed;
        if (keys['arrowright']) player.angle += rotSpeed;

        let dx = 0, dy = 0;
        if (keys['w'] || keys['arrowup']) {
            dx += Math.cos(player.angle) * moveSpeed;
            dy += Math.sin(player.angle) * moveSpeed;
        }
        if (keys['s'] || keys['arrowdown']) {
            dx -= Math.cos(player.angle) * moveSpeed;
            dy -= Math.sin(player.angle) * moveSpeed;
        }
        if (keys['a']) {
            dx += Math.cos(player.angle - Math.PI / 2) * moveSpeed;
            dy += Math.sin(player.angle - Math.PI / 2) * moveSpeed;
        }
        if (keys['d']) {
            dx += Math.cos(player.angle + Math.PI / 2) * moveSpeed;
            dy += Math.sin(player.angle + Math.PI / 2) * moveSpeed;
        }

        const margin = 0.2;
        if (!getMap(player.x + dx + Math.sign(dx) * margin, player.y)) player.x += dx;
        if (!getMap(player.x, player.y + dy + Math.sign(dy) * margin)) player.y += dy;

        if (dx !== 0 || dy !== 0) player.bobPhase += 0.15;

        if (player.shootTimer > 0) player.shootTimer--;
        if (player.shootTimer <= 4) player.shooting = false;

        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            if (enemy.hurtTimer > 0) enemy.hurtTimer--;

            const edx = player.x - enemy.x;
            const edy = player.y - enemy.y;
            const eDist = Math.sqrt(edx * edx + edy * edy);
            if (eDist > 0.8) {
                const moveX = (edx / eDist) * enemy.speed;
                const moveY = (edy / eDist) * enemy.speed;
                if (!getMap(enemy.x + moveX, enemy.y)) enemy.x += moveX;
                if (!getMap(enemy.x, enemy.y + moveY)) enemy.y += moveY;
            } else {
                player.health -= 0.15;
            }
        }
    }

    function render() {
        const w = Math.floor(canvas.width / RES_SCALE);
        const h = Math.floor(canvas.height / RES_SCALE);

        const offCanvas = document.createElement('canvas');
        offCanvas.width = w;
        offCanvas.height = h;
        const off = offCanvas.getContext('2d');

        const skyGrad = off.createLinearGradient(0, 0, 0, h / 2);
        skyGrad.addColorStop(0, '#0a0e17');
        skyGrad.addColorStop(1, '#1a1a3e');
        off.fillStyle = skyGrad;
        off.fillRect(0, 0, w, h / 2);

        const floorGrad = off.createLinearGradient(0, h / 2, 0, h);
        floorGrad.addColorStop(0, '#1a1a2e');
        floorGrad.addColorStop(1, '#0a0e17');
        off.fillStyle = floorGrad;
        off.fillRect(0, h / 2, w, h / 2);

        const bobY = Math.sin(player.bobPhase) * 3;
        const zBuffer = new Float32Array(w);

        for (let x = 0; x < w; x++) {
            const rayAngle = player.angle - FOV / 2 + (x / w) * FOV;
            const rayDirX = Math.cos(rayAngle);
            const rayDirY = Math.sin(rayAngle);

            let mapX = Math.floor(player.x);
            let mapY = Math.floor(player.y);

            const deltaDistX = Math.abs(1 / rayDirX);
            const deltaDistY = Math.abs(1 / rayDirY);

            let stepX = rayDirX < 0 ? -1 : 1;
            let stepY = rayDirY < 0 ? -1 : 1;

            let sideDistX = rayDirX < 0 ? (player.x - mapX) * deltaDistX : (mapX + 1 - player.x) * deltaDistX;
            let sideDistY = rayDirY < 0 ? (player.y - mapY) * deltaDistY : (mapY + 1 - player.y) * deltaDistY;

            let hit = 0, side = 0, dist = 0;

            while (hit === 0 && dist < MAX_DEPTH) {
                if (sideDistX < sideDistY) {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    side = 0;
                } else {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    side = 1;
                }
                dist++;
                hit = getMap(mapX, mapY);
            }

            if (hit === 0) {
                zBuffer[x] = MAX_DEPTH;
                continue;
            }

            let perpDist = (side === 0)
                ? (mapX - player.x + (1 - stepX) / 2) / rayDirX
                : (mapY - player.y + (1 - stepY) / 2) / rayDirY;

            zBuffer[x] = perpDist;

            const wallHeight = Math.floor(h / perpDist);
            const drawStart = Math.max(0, Math.floor((h - wallHeight) / 2 + bobY));
            const drawEnd = Math.min(h, Math.floor((h + wallHeight) / 2 + bobY));

            const wallColor = WALL_COLORS[hit] || WALL_COLORS[1];
            const shade = side === 0 ? 1.0 : 0.7;
            const fogFactor = Math.max(0, 1 - perpDist / MAX_DEPTH);

            const r = Math.floor(wallColor.r * shade * fogFactor);
            const g = Math.floor(wallColor.g * shade * fogFactor);
            const b = Math.floor(wallColor.b * shade * fogFactor);

            off.fillStyle = `rgb(${r},${g},${b})`;
            off.fillRect(x, drawStart, 1, drawEnd - drawStart);
        }

        const sortedEnemies = enemies
            .filter(e => e.alive)
            .map(e => {
                const dx = e.x - player.x;
                const dy = e.y - player.y;
                return { ...e, dist: Math.sqrt(dx * dx + dy * dy) };
            })
            .sort((a, b) => b.dist - a.dist);

        for (const enemy of sortedEnemies) {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;

            const angleToEnemy = Math.atan2(dy, dx);
            let angleDiff = angleToEnemy - player.angle;

            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

            if (Math.abs(angleDiff) > FOV / 2 + 0.2) continue;

            const screenX = Math.floor((0.5 + angleDiff / FOV) * w);
            const spriteSize = Math.floor(h / enemy.dist);
            const spriteTop = Math.floor((h - spriteSize) / 2 + bobY);

            const halfW = Math.floor(spriteSize / 3);
            const startX = Math.max(0, screenX - halfW);
            const endX = Math.min(w, screenX + halfW);
            const fogFactor = Math.max(0, 1 - enemy.dist / MAX_DEPTH);

            for (let sx = startX; sx < endX; sx++) {
                if (enemy.dist >= zBuffer[sx]) continue;

                const bodyTop = spriteTop + Math.floor(spriteSize * 0.2);
                const bodyBot = spriteTop + spriteSize;

                off.fillStyle = enemy.hurtTimer > 0 ? `rgba(255,80,80,${fogFactor})`
                    : enemy.type === 0 ? `rgba(220,50,50,${fogFactor})`
                    : `rgba(50,200,80,${fogFactor})`;

                off.fillRect(sx, Math.max(0, bodyTop), 1, Math.max(0, bodyBot - bodyTop));

                const relX = (sx - startX) / (endX - startX);
                if ((relX > 0.25 && relX < 0.45) || (relX > 0.55 && relX < 0.75)) {
                    const eyeY = spriteTop + Math.floor(spriteSize * 0.3);
                    off.fillStyle = `rgba(255, 255, 0, ${fogFactor})`;
                    off.fillRect(sx, eyeY, 1, Math.max(1, Math.floor(spriteSize * 0.08)));
                }
            }
        }

        const weaponW = Math.floor(w * 0.16);
        const weaponH = Math.floor(h * 0.32);
        const weaponX = Math.floor(w / 2 - weaponW / 2);
        let weaponY = h - weaponH + Math.sin(player.bobPhase) * 4;

        if (player.shooting) weaponY += 8;

        off.fillStyle = '#444';
        off.fillRect(weaponX + weaponW * 0.35, weaponY - weaponH * 0.3, weaponW * 0.3, weaponH * 0.4);
        off.fillStyle = '#222';
        off.fillRect(weaponX, weaponY, weaponW, weaponH);

        if (player.shooting && player.shootTimer > 6) {
            off.fillStyle = '#ff0';
            off.fillRect(weaponX + weaponW * 0.2, weaponY - weaponH * 0.5, weaponW * 0.6, weaponH * 0.3);
        }

        const cx = Math.floor(w / 2), cy = Math.floor(h / 2);
        off.fillStyle = '#00ff9c';
        off.fillRect(cx - 4, cy, 3, 1); off.fillRect(cx + 2, cy, 3, 1);
        off.fillRect(cx, cy - 4, 1, 3); off.fillRect(cx, cy + 2, 1, 3);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);

        if (player.health <= 0 || enemies.every(e => !e.alive)) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = player.health <= 0 ? '#ff4757' : '#00ff9c';
            ctx.font = 'bold 32px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(player.health <= 0 ? 'YOU DIED' : 'VICTORY!', canvas.width / 2, canvas.height / 2 - 20);
            ctx.fillStyle = '#c9d1d9';
            ctx.font = '16px "JetBrains Mono", monospace';
            ctx.fillText(`Score: ${player.score}`, canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText('Press ESC or F10 to return to terminal', canvas.width / 2, canvas.height / 2 + 50);
            running = false;
            return;
        }

        updateHUD();
    }

    function updateHUD() {
        const healthFill = document.getElementById('doom-health-fill');
        const healthText = document.getElementById('doom-health-text');
        const ammoText = document.getElementById('doom-ammo-text');
        const scoreText = document.getElementById('doom-score-text');

        if (healthFill) {
            healthFill.style.width = Math.max(0, player.health) + '%';
            healthFill.style.background = player.health > 50 ? '#00ff9c' : player.health > 25 ? '#ffd60a' : '#ff4757';
        }
        if (healthText) healthText.textContent = Math.ceil(player.health);
        if (ammoText) ammoText.textContent = player.ammo;
        if (scoreText) scoreText.textContent = player.score;
    }

    function gameLoop() {
        if (!running) return;
        update();
        render();
        animFrame = requestAnimationFrame(gameLoop);
    }

    function start() {
        container = document.getElementById('doom-container');
        canvas = document.getElementById('doom-canvas');
        if (!container || !canvas) return;

        ctx = canvas.getContext('2d');
        container.style.display = 'flex';

        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height - 40;

        player = {
            x: 2.5, y: 2.5, angle: 0,
            health: 100, ammo: 50, score: 0,
            bobPhase: 0, shooting: false, shootTimer: 0,
        };

        spawnEnemies();

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        document.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('click', onClick);
        document.addEventListener('pointerlockchange', onPointerLockChange);

        running = true;
        gameLoop();
    }

    function stop() {
        running = false;
        if (animFrame) cancelAnimationFrame(animFrame);
        if (document.pointerLockElement) document.exitPointerLock();

        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
        document.removeEventListener('mousemove', onMouseMove);
        if (canvas) canvas.removeEventListener('click', onClick);
        document.removeEventListener('pointerlockchange', onPointerLockChange);

        if (container) container.style.display = 'none';

        for (const k in keys) keys[k] = false;
        mouseLocked = false;

        const cmdInput = document.getElementById('cmdInput');
        if (cmdInput) cmdInput.focus();
    }

    return { start, stop };
})();
