import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===== ELEMENTS =====
let gameplayScene;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    gameplayScene = document.getElementById('gameplay-scene');
    const progressBar = document.getElementById('progress-bar');
    const percentEl = document.getElementById('load-percent');
    const statusEl = document.getElementById('load-status');
    const globalLoading = document.getElementById('global-loading');
    
    const videoScene = document.getElementById('minigame-video-scene');
    const video = document.getElementById('minigame-intro-video');
    
    let progress = 0;
    const loadSteps = [
        "Đang kết nối máy chủ...",
        "Tải mô hình 3D...",
        "Đồng bộ âm thanh...",
        "Kiểm tra môi trường...",
        "Sẵn sàng!"
    ];

    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        percentEl.innerText = Math.floor(progress) + '%';
        
        const stepIndex = Math.floor((progress / 100) * (loadSteps.length - 1));
        statusEl.innerText = loadSteps[stepIndex];

        if (progress === 100) {
            clearInterval(interval);
            statusEl.innerText = 'Sẵn sàng!';

            // Show the Enter Game button (needed for audio interaction)
            const finishArea = document.getElementById('loading-finish-area');
            if (finishArea) finishArea.classList.remove('hidden');

            const btnEnter = document.getElementById('btn-enter-game');
            if (btnEnter) {
                btnEnter.addEventListener('click', () => {
                    globalLoading.style.transition = 'opacity 0.8s ease, transform 1s ease';
                    globalLoading.style.opacity = '0';
                    globalLoading.style.transform = 'scale(1.1)';

                    setTimeout(() => {
                        globalLoading.classList.add('hidden');

                        const videoScene = document.getElementById('minigame-video-scene');
                        const video = document.getElementById('minigame-intro-video');

                        if (videoScene && video) {
                            videoScene.classList.remove('hidden');
                            video.muted = false; // Video có tiếng
                            video.play().catch(e => {
                                console.log("Audio play failed, falling back to muted");
                                video.muted = true;
                                video.play();
                            });

                            video.onended = () => {
                                showInstructions();
                            };
                        } else {
                            showInstructions();
                        }
                    }, 800);
                });
            }
        }
    }, 120);

    // Listeners for Video and Instructions
    const skipBtn = document.getElementById('btn-skip-minigame-video');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            const video = document.getElementById('minigame-intro-video');
            if (video) video.pause();
            showInstructions();
        });
    }

    const startBtn = document.getElementById('btn-start-gameplay');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const instructionScene = document.getElementById('minigame-instructions-scene');
            if (instructionScene) instructionScene.classList.add('hidden');
            if (gameplayScene) gameplayScene.classList.remove('hidden');
            initGameplay3D();
        });
    }

    // Win Scene Buttons
    const btnRestartWin = document.getElementById('btn-restart-from-win');
    if (btnRestartWin) {
        btnRestartWin.addEventListener('click', () => {
            location.reload();
        });
    }
    const btnBackPF = document.getElementById('btn-back-portfolio');
    if (btnBackPF) {
        btnBackPF.addEventListener('click', () => {
            // Quay trở về Portfolio của bạn
            window.location.href = "../oggy2/index.html"; 
        });
    }
});

function showInstructions() {
    const videoScene = document.getElementById('minigame-video-scene');
    const instructionScene = document.getElementById('minigame-instructions-scene');
    if (videoScene) videoScene.classList.add('hidden');
    if (instructionScene) {
        instructionScene.classList.remove('hidden');
        const textEl = instructionScene.querySelector('.typewriter-text');
        if (textEl) {
            const originalText = textEl.innerText;
            typeWriter(textEl, originalText);
        }
    }
    // Play instruction music
    playBGM('videos/nhachuongdan.mp3', true);
}

function showWinScene() {
    console.log("showWinScene called!");
    stopBGM();
    playBGM('videos/winn.mp3', false);

    // Ẩn các scene gameplay
    document.querySelectorAll('.scene').forEach(s => s.classList.add('hidden'));

    // Ẩn game-over nếu đang hiện
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) gameOverScreen.classList.remove('show');

    // Hiện win-scene (nằm ngoài gameplay-scene)
    const winScene = document.getElementById('win-scene');
    if (winScene) {
        winScene.classList.add('show');

        const scoreEl = document.getElementById('win-score');
        if (scoreEl) scoreEl.innerText = score || 0;

        const timeEl = document.getElementById('win-time');
        if (timeEl) {
            const timePlayed = 90 - Math.max(0, Math.floor(timeRemaining || 0));
            timeEl.innerText = timePlayed;
        }

        setTimeout(spawnConfetti, 300);
        console.log("Win Scene shown!");
    } else {
        console.error("#win-scene not found!");
    }
}

function spawnConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    
    const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.opacity = Math.random();
        container.appendChild(confetti);
    }
}

function triggerGameOver() {
    console.log("triggerGameOver called!");
    stopBGM();
    playBGM('videos/thuacuoigame.mp3', false);
    phase = 3;

    // Ẩn các scene gameplay
    document.querySelectorAll('.scene').forEach(s => s.classList.add('hidden'));

    // Ẩn win-scene nếu đang hiện
    const winScene = document.getElementById('win-scene');
    if (winScene) winScene.classList.remove('show');

    // Hiện game-over-screen (nằm ngoài gameplay-scene)
    const gameOverScreen = document.getElementById('game-over-screen');
    if (gameOverScreen) {
        gameOverScreen.classList.add('show');
        console.log("Game Over Screen shown!");
    } else {
        console.error("#game-over-screen not found!");
    }
}

function typeWriter(element, text, speed = 30) {
    element.innerHTML = '';
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Audio System
let bgMusic = null;
function playBGM(file, loop = true) {
    if (bgMusic) {
        if (bgMusic.src.includes(file)) return; // Already playing
        bgMusic.pause();
        bgMusic = null;
    }
    bgMusic = new Audio(file);
    bgMusic.loop = loop;
    bgMusic.play().catch(e => console.log("Audio play blocked:", e));
}
function stopBGM() {
    if (bgMusic) {
        bgMusic.pause();
        bgMusic = null;
    }
}

// Phát sound effect ngắn một lần (không ảnh hưởng BGM)
function playSFX(file, volume = 1.0) {
    try {
        const sfx = new Audio(file);
        sfx.volume = volume;
        sfx.play().catch(() => {}); // Im lặng nếu bị block
    } catch (e) {}
}

// ==========================================
// FLOW 3: 3D ISOMETRIC GAMEPLAY (DON'T STARVE STYLE)
// ==========================================
let scene3D, camera3D, renderer3D, controls3D;
let chairModel, doorModel, keyModel, keyHitBox;
let roaches = [];
let gameInitialized = false;
let joeyHealth = 3;
let speedMultiplier = 1.0;
let phase = 1; // 1: đập gián, 2: giải đố, 3: game over
let flyingTomatoes = [];
let tomatoBaseModel = null;
let nextTomatoTime = 75; // Đầu tiên ở giây 75 (90 - 15)

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let isTimeFrozen = false;
let isRoachesFrozen = false;
let timeFreezeTimer = null;
let roachFreezeTimer = null;
let isGamePaused = false; // Dừng game khi help modal mở

let timeRemaining = 90; // 1 phút 30 giây đập gián
let lastTime = 0;
let consecutiveMisses = 0;

let score = 0;
let lives = 3;
let reviveTimer = null;
let lastRoachHitTime = 0;
let lastJoeyHitTime = 0; // Chống spam click vào Joey
let bombs = [];

function updateScoreboard() {
    const scoreEl = document.getElementById('score-val');
    const livesEl = document.getElementById('lives-val');
    if (scoreEl) scoreEl.innerText = score;
    if (livesEl) {
        let hearts = "";
        for(let i=0; i<lives; i++) hearts += "❤️";
        livesEl.innerText = hearts;
    }
}
const hidingSpots = [
    { x: -14, z: -2 }, // Sau TV
    { x: 3, z: -2 },   // Sau Sofa Vàng
    { x: -13, z: 0 },  // Sau Sofa Xanh (Mới!)
    { x: 13, z: -14 }  // Sau Ghế nhựa
];
let splatDecals = [];

function spawnHitText(x, y, text) {
    const comicWords = ["POW!", "BAM!", "SMACK!", "ZAP!", "BOOM!", "SMASH!"];
    const displayText = text || comicWords[Math.floor(Math.random() * comicWords.length)];
    
    const el = document.createElement('div');
    el.className = 'hit-text';
    el.innerText = displayText;
    
    // Random color for each hit
    const colors = ["#f1c40f", "#e74c3c", "#3498db", "#2ecc71", "#9b59b6"];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => { if (document.body.contains(el)) el.remove(); }, 600);
}

function spawnFloorDecal(x, z, roach) {
    const geo = new THREE.PlaneGeometry(5, 5);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.02, z); // Hơi cao hơn sàn một chút
    scene3D.add(mesh);
    splatDecals.push(mesh);
    if (roach) roach.userData.lastDecal = mesh;
}

function spawnFlyingTomato() {
    if (!tomatoBaseModel) return;
    const tomato = tomatoBaseModel.clone();
    tomato.scale.set(6, 6, 6);
    tomato.position.set((Math.random() - 0.5) * 30, 2, -20);
    scene3D.add(tomato);
    playSFX('videos/nemcachua.mp3', 0.7); // Sound cà chua đang bay tới

    const targetX = (Math.random() - 0.5) * 10;
    const targetY = 22 + (Math.random() - 0.5) * 10;
    const targetZ = 50;

    const frames = 60 + Math.random() * 30;
    const vx = (targetX - tomato.position.x) / frames;
    const vy = (targetY - tomato.position.y) / frames + 0.3;
    const vz = (targetZ - tomato.position.z) / frames;

    tomato.userData = {
        isFlyingTomato: true,
        vx: vx, vy: vy, vz: vz,
        rotX: Math.random() * 0.2,
        rotY: Math.random() * 0.2
    };
    flyingTomatoes.push(tomato);
}


function triggerTomatoSplat() {
    let div = document.getElementById('tomato-splat-overlay');
    if (!div) {
        div = document.createElement('div');
        div.id = 'tomato-splat-overlay';
        div.style.position = 'absolute';
        div.style.top = '0'; div.style.left = '0';
        div.style.width = '100%'; div.style.height = '100%';
        // Trung tâm mờ đỏ nhạt, viền đỏ đậm nhấp nháy
        div.style.background = 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, rgba(139,0,0,0.5) 60%, rgba(100,0,0,0.8) 100%)';
        div.style.backdropFilter = 'blur(6px)';
        div.style.zIndex = '9999';
        div.style.pointerEvents = 'none';
        div.style.transition = 'opacity 0.3s';
        div.classList.add('tomato-splat-pulsing');
        document.getElementById('game-canvas-container').appendChild(div);
    }
    div.style.opacity = '1';
    
    if (div.hideTimeout) clearTimeout(div.hideTimeout);
    div.hideTimeout = setTimeout(() => {
        div.style.opacity = '0';
    }, 3000);
}

function initGameplay3D() {
    if (gameInitialized) return;
    gameInitialized = true;

    const container = document.getElementById('game-canvas-container');
    scene3D = new THREE.Scene();
    scene3D.background = new THREE.Color(0x1a1a1a); // Slightly lighter than pure black to see depth

    // Camera Perspective (Giúp thấy rõ chiều sâu, 2 góc phòng và không gian thực)
    const aspect = container.clientWidth / container.clientHeight;
    camera3D = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    camera3D.position.set(0, 22, 50); // Tiến lại gần hơn một chút theo yêu cầu
    camera3D.lookAt(new THREE.Vector3(0, 5, -10)); // Nhìn sâu vào giữa bức tường phía sau phòng

    renderer3D = new THREE.WebGLRenderer({ antialias: true });
    renderer3D.setSize(container.clientWidth, container.clientHeight);
    renderer3D.shadowMap.enabled = true; // BẬT ĐỔ BÓNG
    renderer3D.shadowMap.type = THREE.PCFSoftShadowMap; // Bóng đổ mềm mượt
    container.appendChild(renderer3D.domElement);

    // Ánh sáng có đổ bóng
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Tăng độ sáng môi trường
    scene3D.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5); // Tăng cường ánh sáng trực tiếp
    dirLight.position.set(15, 30, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.bias = -0.001; // Giảm lỗi sọc bóng
    scene3D.add(dirLight);

    // Scene 5: Khối nhà (1 mặt bằng, 2 mặt đứng)
    const scene5 = new THREE.Group();
    scene3D.add(scene5);

    // Khởi tạo Loader
    const loader = new GLTFLoader();

    // Tải Căn phòng 3D (thay thế khối hộp cơ bản)
    loader.load('assets/room.glb', (gltf) => {
        const room = gltf.scene;
        room.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
        room.scale.set(5, 5, 5); // Tùy chỉnh độ lớn cho phù hợp với camera
        room.position.set(0, -2, 0); // Hạ thấp một chút
        scene5.add(room);
    });

    // Tải Phô mai (Dùng làm mồi nhử)
    let cheeseModel = null;
    loader.load('assets/cheese.glb', (gltf) => {
        cheeseModel = gltf.scene;
        cheeseModel.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
        cheeseModel.scale.set(3, 3, 3);
    });

    // Tải Cà chua (dùng để ném)
    loader.load('assets/tomato.glb', (gltf) => {
        const tomato = gltf.scene;
        tomato.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
        tomato.scale.set(4, 4, 4);
        tomatoBaseModel = tomato;
    });

    // Tải Cartoon Sofa (Sofa xanh)
    loader.load('assets/cartoon_sofa.glb', (gltf) => {
        const sofa = gltf.scene;
        sofa.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
        // Khôi phục lại kích thước ban đầu
        sofa.scale.set(3, 3, 3);
        // Đặt x = -13, y = -2.5, z = 0 (kéo về trong tầm nhìn camera)
        sofa.position.set(-13, -2.5, 0); 
        // Quay 90 độ từ phải sang trái (nhìn vào giữa phòng)
        sofa.rotation.y = -Math.PI / 2; 
        scene5.add(sofa);
    });

    // Tải Cartoon TV
    loader.load('assets/cartoon_TV.glb', (gltf) => {
        const tv = gltf.scene;
        tv.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
        // Phóng to TV khổng lồ hơn nữa
        tv.scale.set(8, 8, 8);
        // Đặt x = 13, z = 15
        tv.position.set(13, 0, 15); 
        tv.rotation.y = Math.PI; 
        scene5.add(tv);
    });

    // (Đã gỡ bỏ Cửa Tím theo yêu cầu)


    // Tạo Sprites (Gián) - Phong cách Don't Starve
    const textureLoader = new THREE.TextureLoader();
    const spriteMaterial = (texturePath) => {
        const texture = textureLoader.load(texturePath);
        return new THREE.SpriteMaterial({ map: texture, color: 0xffffff });
    };

    const createRoach = (name, texturePath, size) => {
        const sprite = new THREE.Sprite(spriteMaterial(texturePath));
        sprite.scale.set(size, size, 1);
        // Random chỉ trong khu vực sàn nhà (-14 đến 14)
        sprite.position.set((Math.random() - 0.5) * 28, size/2, (Math.random() - 0.5) * 28);
        sprite.userData = { name: name, targetX: 0, targetZ: 0, alive: true };
        scene3D.add(sprite);
        return sprite;
    };

    roaches.push(createRoach('Marky', 'assets/marky.png', 5));
    roaches.push(createRoach('DeeDee', 'assets/deedee.png', 5));
    roaches.push(createRoach('Joey', 'assets/joey.png', 6.5)); // Trùm to hơn

    // Gán mục tiêu ngẫu nhiên ban đầu
    roaches.forEach(r => assignNewTarget(r));

    // Lắng nghe sự kiện Click đập gián
    container.addEventListener('click', onDocumentMouseClick, false);
    
    // Cập nhật vị trí chuột liên tục để gián né tránh
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }, false);

    // Sự kiện Quả bom và Ném Cà chua
    setInterval(() => {
        if (phase === 1) {
            // Bombs (tối đa 4 quả)
            if (bombs.length < 4) {
                const bombGeo = new THREE.SphereGeometry(1.5, 16, 16);
                const bombMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, transparent: true });
                const bomb = new THREE.Mesh(bombGeo, bombMat);
                bomb.position.set((Math.random() - 0.5) * 28, 1.5, (Math.random() - 0.5) * 28);
                bomb.castShadow = true;
                bomb.userData = { isBomb: true, lastBlink: performance.now() };
                scene3D.add(bomb);
                bombs.push(bomb);

                const fuseGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
                const fuseMat = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
                const fuse = new THREE.Mesh(fuseGeo, fuseMat);
                fuse.position.y = 1.5;
                bomb.add(fuse);

                setTimeout(() => {
                    if (bombs.includes(bomb)) {
                        scene3D.remove(bomb);
                        bombs = bombs.filter(b => b !== bomb);
                    }
                }, 5000);
            }

            // Cà chua ném vào màn hình (Cứ mỗi 15s)
            if (tomatoBaseModel && timeRemaining <= nextTomatoTime && timeRemaining > 0) {
                nextTomatoTime -= 15;
                const numTomatoes = Math.floor(Math.random() * 2) + 1; // 1-2 quả
                for (let i = 0; i < numTomatoes; i++) spawnFlyingTomato();
            }
        }
    }, 2000); // 2 giây một lần

    // Reset game — về màn hướng dẫn
    document.getElementById('btn-retry-game').addEventListener('click', () => {
        // 1. Ẩn game over screen
        document.getElementById('game-over-screen').classList.remove('show');

        // 2. Reset tất cả biến trạng thái
        timeRemaining = 90;
        lastTime = 0;
        joeyHealth = 3;
        speedMultiplier = 1.0;
        phase = 1;
        consecutiveMisses = 0;
        nextTomatoTime = 75;
        score = 0;
        lives = 3;
        clearTimeout(reviveTimer);
        isTimeFrozen = false;
        isRoachesFrozen = false;
        clearTimeout(timeFreezeTimer);
        clearTimeout(roachFreezeTimer);

        // 3. Dọn dẹp 3D scene nếu đã init
        if (scene3D) {
            bombs.forEach(b => scene3D.remove(b));
            bombs = [];
            if (keyModel) { scene3D.remove(keyModel); keyModel = null; }
            if (keyHitBox) { scene3D.remove(keyHitBox); keyHitBox = null; }
            splatDecals.forEach(m => scene3D.remove(m));
            splatDecals = [];
            roaches.forEach(r => {
                r.userData.alive = true;
                if (r.material) { r.material.rotation = 0; r.material.opacity = 1; }
                r.position.y = r.scale.y / 2;
                r.userData.lastDecal = null;
                assignNewTarget(r);
            });
        }

        // 4. Reset UI overlay
        const splatEl = document.getElementById('splat-overlay');
        if (splatEl) splatEl.classList.remove('active');
        const darkEl = document.getElementById('time-darkness-overlay');
        if (darkEl) darkEl.style.opacity = '0';
        document.body.classList.remove('flash-warning');
        const timerEl = document.getElementById('game-timer');
        if (timerEl) timerEl.style.color = '#ff3333';

        // 5. Ẩn gameplay-scene
        const gameplayScene = document.getElementById('gameplay-scene');
        if (gameplayScene) gameplayScene.classList.add('hidden');

        // 6. Quay về màn hình hướng dẫn
        stopBGM();
        showInstructions();
    });

    document.getElementById('btn-exit-to-menu').addEventListener('click', () => {
        window.location.href = "../oggy2/index.html"; 
    });

    // ── HELP PAUSE MODAL SYSTEM ──
    // Track mỗi ability chỉ dùng được 1 lần
    const usedHelp = { life: false, time: false, roach: false };
    // isGamePaused là biến global — không khai báo lại ở đây

    const helpBtn       = document.getElementById('help-btn');
    const helpModal     = document.getElementById('help-modal');
    const helpCloseBtn  = document.getElementById('help-close-btn');
    const btnAddLife    = document.getElementById('help-add-life');
    const btnFreezeTime = document.getElementById('help-freeze-time');
    const btnFreezeRoach= document.getElementById('help-freeze-roaches');

    function openHelpModal() {
        isGamePaused = true;
        helpModal.classList.remove('hidden');
        // Cập nhật trạng thái nút đã dùng
        if (usedHelp.life)  { btnAddLife.classList.add('help-used');    btnAddLife.disabled    = true; }
        if (usedHelp.time)  { btnFreezeTime.classList.add('help-used'); btnFreezeTime.disabled = true; }
        if (usedHelp.roach) { btnFreezeRoach.classList.add('help-used');btnFreezeRoach.disabled= true; }
    }

    function closeHelpModal() {
        isGamePaused = false;
        helpModal.classList.add('hidden');
    }

    if (helpBtn) helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openHelpModal();
    });

    if (helpCloseBtn) helpCloseBtn.addEventListener('click', closeHelpModal);

    btnAddLife.addEventListener('click', () => {
        if (usedHelp.life) return;
        usedHelp.life = true;
        lives++;
        updateScoreboard();
        spawnHitText(window.innerWidth / 2, window.innerHeight / 2, '+1 MẠNG! ❤️');
        closeHelpModal();
    });

    btnFreezeTime.addEventListener('click', () => {
        if (usedHelp.time) return;
        usedHelp.time = true;
        isTimeFrozen = true;
        clearTimeout(timeFreezeTimer);
        document.getElementById('game-timer').style.color = '#3498db';
        closeHelpModal();
        timeFreezeTimer = setTimeout(() => {
            isTimeFrozen = false;
            document.getElementById('game-timer').style.color = '#e74c3c';
        }, 5000);
        spawnHitText(window.innerWidth / 2, window.innerHeight / 2, '⏰ ĐỒNG HỒ ĐÃ DỪNG! (5s)');
    });

    btnFreezeRoach.addEventListener('click', () => {
        if (usedHelp.roach) return;
        usedHelp.roach = true;
        isRoachesFrozen = true;
        clearTimeout(roachFreezeTimer);
        closeHelpModal();
        spawnHitText(window.innerWidth / 2, window.innerHeight / 2, '🪳 GIÁN BỊ ĐÓNG BĂNG! (5s)');
        roachFreezeTimer = setTimeout(() => {
            isRoachesFrozen = false;
        }, 5000);
    });


    requestAnimationFrame(animateGameplay3D);
}

function assignNewTarget(roach) {
    if (Math.random() < 0.4) { // Tỉ lệ chui vào góc cao hơn một chút
        const spots = [
            { x: -13, z: 0, peekX: 1, peekZ: 0 },    // Gầm Sofa Xanh (Thò ra hướng phải)
            { x: 0, z: 0, peekX: 0, peekZ: 1 },      // Gầm Sofa Vàng ở giữa phòng (Thò ra đằng trước)
            { x: 13, z: 15, peekX: -1, peekZ: -1 }   // Góc TV (Thò ra góc chéo)
        ];
        const spot = spots[Math.floor(Math.random() * spots.length)];
        roach.userData.targetX = spot.x;
        roach.userData.targetZ = spot.z;
        roach.userData.peekX = spot.peekX;
        roach.userData.peekZ = spot.peekZ;
        roach.userData.goingToHide = true;
    } else {
        // Chạy ra ngoài không gian rộng từ x = -20 đến 20, z = -20 đến 20
        roach.userData.targetX = (Math.random() - 0.5) * 40;
        roach.userData.targetZ = (Math.random() - 0.5) * 40;
        roach.userData.goingToHide = false;
        roach.userData.state = 'running';
        roach.userData.isHidden = false;
    }
}

function onDocumentMouseClick(event) {
    event.preventDefault();
    const container = document.getElementById('game-canvas-container');
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera3D);

    // Kiểm tra Ctrl + Click chém trái cây (cà chua)
    if (phase === 1 && event.ctrlKey && flyingTomatoes.length > 0) {
        const tomatoIntersects = raycaster.intersectObjects(flyingTomatoes, true);
        if (tomatoIntersects.length > 0) {
            let hitObj = tomatoIntersects[0].object;
            while (hitObj.parent && hitObj.parent.type !== 'Scene') {
                if (hitObj.userData.isFlyingTomato) break;
                hitObj = hitObj.parent;
            }
            if (hitObj && hitObj.userData.isFlyingTomato) {
                scene3D.remove(hitObj);
                flyingTomatoes = flyingTomatoes.filter(t => t !== hitObj);
                score += 15;
                updateScoreboard();
                spawnHitText(event.clientX, event.clientY, "CẮT! (+15)");
                return;
            }
        }
    }



    if (phase === 2 && (keyModel || keyHitBox)) {
        // Sử dụng keyHitBox (vùng bấm ẩn) để dễ bấm trúng hơn khi chìa khóa nhỏ
        const targets = [];
        if (keyHitBox) targets.push(keyHitBox);
        if (keyModel) targets.push(keyModel);

        const keyIntersects = raycaster.intersectObjects(targets, true);
        
        if (keyIntersects.length > 0) {
            event.stopPropagation(); // Ngăn sự kiện lan tỏa gây reload ngoài ý muốn
            document.getElementById('gameplay-hud').innerText = "ĐÃ LẤY ĐƯỢC CHÌA KHÓA VÀNG!";
            
            console.log("Key clicked! Triggering win scene...");
            showWinScene();
            return;
        }
    }

    // Kiểm tra đập gián hoặc bom (Chỉ áp dụng trong Phase 1)
    if (phase !== 1) return;

    // Hiệu ứng rung màn hình
    const gameContainer = document.getElementById('game-canvas-container');
    gameContainer.classList.remove('shake-screen');
    void gameContainer.offsetWidth; // trigger reflow
    gameContainer.classList.add('shake-screen');

    // Check Bombs
    const intersectsBombs = raycaster.intersectObjects(bombs);
    if (intersectsBombs.length > 0) {
        const hitBomb = intersectsBombs[0].object;
        scene3D.remove(hitBomb);
        bombs = bombs.filter(b => b !== hitBomb);
        
        score -= 2;
        lives--;
        updateScoreboard();
        spawnHitText(event.clientX, event.clientY, "BÙM!");
        
        const splat = document.getElementById('splat-overlay');
        splat.classList.remove('active');
        void splat.offsetWidth;
        splat.classList.add('active');

        if (lives <= 0) {
            triggerGameOver();
        }
        return;
    }

    const intersects = raycaster.intersectObjects(roaches);

    if (intersects.length > 0) {
        const hitRoach = intersects[0].object;
        if (!hitRoach.userData.alive) return;

        // Nếu gián đang núp trong gầm thì tàng hình/không đập được
        if (hitRoach.userData.isHidden) {
            spawnHitText(event.clientX, event.clientY, "TRƯỢT! NÓ ĐANG NÚP!");
            return;
        }

        consecutiveMisses = 0;
        score += 10;
        updateScoreboard();
        playSFX('videos/bop.mp3', 0.8); // Sound đập trúng gián
        spawnHitText(event.clientX, event.clientY, "BỐP! (+10)");
        
        // Revive mechanic reset
        clearTimeout(reviveTimer);
        reviveTimer = setTimeout(() => {
            if (phase === 1) {
                document.getElementById('gameplay-hud').innerText = "CÁC CON GIÁN ĐÃ HỒI SINH!";
                roaches.forEach(r => {
                    if (!r.userData.alive && r.userData.name !== 'Joey') {
                        r.userData.alive = true;
                        r.material.rotation = 0;
                        r.material.opacity = 1;
                        r.position.y = r.scale.y / 2;
                        assignNewTarget(r);
                        // Xóa bóng sau 1s khi tỉnh lại
                        setTimeout(() => {
                            if (r.userData.lastDecal) {
                                scene3D.remove(r.userData.lastDecal);
                                splatDecals = splatDecals.filter(d => d !== r.userData.lastDecal);
                                r.userData.lastDecal = null;
                            }
                        }, 1000);
                    }
                });
            }
        }, 10000);

        if (hitRoach.userData.name === 'Joey') {
            // Chống spam click (phải cách nhau ít nhất 400ms mới tính 1 hit)
            const now = performance.now();
            if (now - lastJoeyHitTime < 400) return;
            lastJoeyHitTime = now;

            joeyHealth--;
            speedMultiplier += 0.3; // Tăng tốc độ chung
            document.getElementById('gameplay-hud').innerText = `Đập trúng JOEY! (Máu: ${joeyHealth}/3)`;
            hitRoach.material.color.setHex(0xff0000); // Lóe đỏ
            setTimeout(() => { if (hitRoach.userData.alive) hitRoach.material.color.setHex(0xffffff); }, 200);

            if (joeyHealth <= 0) {
                // JOEY CHẾT
                hitRoach.userData.alive = false;
                hitRoach.material.rotation = Math.PI / 2; // Nằm bẹp
                hitRoach.material.opacity = 0.3;
                hitRoach.position.y = 0.5; // Dán xuống sàn
                spawnFloorDecal(hitRoach.position.x, hitRoach.position.z, hitRoach);
                
                checkAllRoachesDead(hitRoach);
            }
        } else {
            // Đập trúng đàn em
            hitRoach.userData.alive = false;
            hitRoach.material.rotation = Math.PI / 2;
            hitRoach.material.opacity = 0.3;
            hitRoach.position.y = 0.5;
            spawnFloorDecal(hitRoach.position.x, hitRoach.position.z, hitRoach);
            speedMultiplier += 0.2; // Tăng tốc độ con còn lại
            
            checkAllRoachesDead();
        }
    } else {
        // Đập trượt -> Báo động, gián chạy nhanh hơn
        consecutiveMisses++;
        speedMultiplier += 0.2;
        document.getElementById('gameplay-hud').innerText = "HỤT RỒI! Chúng đang chạy nhanh hơn!";

        if (consecutiveMisses >= 3) {
            consecutiveMisses = 0;
            score -= 2;
            updateScoreboard();
            playSFX('videos/truot.mp3', 0.9); // Sound trượt → gián phản công
            document.getElementById('gameplay-hud').innerText = "GIÁN PHẢN CÔNG! BỊ NÉM CÀ CHUA! (-2 Điểm)";
            const splat = document.getElementById('splat-overlay');
            splat.classList.remove('active');
            void splat.offsetWidth; // trigger reflow
            splat.classList.add('active');
        } else {
            spawnHitText(event.clientX, event.clientY, "HỤT! (Chạy nhanh hơn)");
        }
    }
}

function checkAllRoachesDead(lastHitObj) {
    const aliveRoaches = roaches.filter(r => r.userData.alive);
    
    if (aliveRoaches.length === 0) {
        phase = 2; // Chuyển sang Phase 2 (Giải đố)
        document.getElementById('gameplay-hud').innerText = "TUYỆT VỜI! Đã hạ gục tất cả! Chìa khóa vàng xuất hiện rồi!";
        document.getElementById('gameplay-hud').style.color = "#f1c40f";

        // Drop chìa khóa tại vị trí con gián cuối cùng bị đập
        const dropPos = lastHitObj ? lastHitObj.position : new THREE.Vector3(0, 0, 0);
        
        const loader = new GLTFLoader();
        loader.load('assets/golden_key.glb', (gltf) => {
            keyModel = gltf.scene;
            keyModel.traverse((child) => { 
                if (child.isMesh) { 
                    child.castShadow = true; 
                    child.receiveShadow = true; 
                } 
            });
            keyModel.scale.set(0.01, 0.01, 0.01); 
            keyModel.position.copy(dropPos);
            keyModel.position.y += 2.5; 
            scene3D.add(keyModel);

            const hitGeo = new THREE.SphereGeometry(5, 12, 12);
            const hitMat = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true, 
                opacity: 0,
                depthWrite: false 
            });
            keyHitBox = new THREE.Mesh(hitGeo, hitMat);
            keyHitBox.position.copy(keyModel.position);
            scene3D.add(keyHitBox);
        }, undefined, (error) => {
            const geo = new THREE.SphereGeometry(1, 16, 16);
            const mat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffd700 });
            keyModel = new THREE.Mesh(geo, mat);
            keyModel.position.copy(dropPos);
            keyModel.position.y += 2.5;
            scene3D.add(keyModel);
        });
    } else {
        // Cập nhật số lượng còn lại
        const count = aliveRoaches.length;
        const names = aliveRoaches.map(r => r.userData.name).join(", ");
        document.getElementById('gameplay-hud').innerText = `Còn ${count} con gián (${names})! Đập tiếp đi!`;
        document.getElementById('gameplay-hud').style.color = "#fff";
    }
}

function animateGameplay3D(currentTime) {
    requestAnimationFrame(animateGameplay3D);

    // TẠM DỪNG: giữ render nhưng bỏ qua toàn bộ game logic
    if (isGamePaused) {
        renderer3D.render(scene3D, camera3D);
        lastTime = currentTime; // Reset để tránh delta lớn khi resume
        return;
    }

    // Initialize lastTime on first frame to prevent huge delta
    if (!lastTime || lastTime === 0) { lastTime = currentTime; return; }

    // Timer Logic
    if (phase === 1 && timeRemaining > 0 && !isTimeFrozen) {
        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        timeRemaining -= delta;

        // Music Phases (Every 30s)
        if (timeRemaining > 60) {
            playBGM('videos/daugame.mp3', true);
        } else if (timeRemaining > 30) {
            playBGM('videos/giuagame.mp3', true);
        } else if (timeRemaining > 0) {
            playBGM('videos/gancuoigame.mp3', true);
        }


        // Hiệu ứng tối dần theo thời gian (Darkening)
        const darkness = document.getElementById('time-darkness-overlay');
        if (darkness) {
            // Only darken when < 30s remain (not throughout whole game)
            const darkFactor = timeRemaining < 30 ? Math.max(0, 0.4 * (1 - timeRemaining / 30)) : 0;
            darkness.style.opacity = darkFactor;
        }


        // Cảnh báo cà chua sắp xuất hiện (2s trước spawn)
        if (timeRemaining <= nextTomatoTime + 2 && timeRemaining > nextTomatoTime) {
            document.getElementById('gameplay-hud').innerText = "CHÚ Ý: GIÁN SẮP PHẢN CÔNG! CÀ CHUA SẮP BAY TỚI!";
            document.getElementById('gameplay-hud').style.color = "#f1c40f";
        }

        // Cảnh báo 10s cuối
        if (timeRemaining <= 10) {
            document.getElementById('gameplay-hud').innerText = `CHÚ Ý! CÒN ${Math.ceil(timeRemaining)}S ĐỂ LẤY ĐƯỢC CHÌA KHÓA!`;
            document.getElementById('gameplay-hud').style.color = "#e74c3c";
            document.body.classList.add('flash-warning');
        } else {
            document.body.classList.remove('flash-warning');
        }

        if (timeRemaining <= 0) {
            timeRemaining = 0;
            triggerGameOver();
        }
        document.getElementById('game-timer').innerText = `⏱ ${Math.ceil(timeRemaining)}s`;
    }

    // AI Di chuyển Gián
    if (phase === 1) {
        // Bombs thoắt ẩn thoắt hiện (dịch chuyển tức thời & chớp tắt)
        bombs.forEach(bomb => {
            const elapsed = currentTime - bomb.userData.lastBlink;
            
            // Hiệu ứng chớp tắt opacity theo nhịp
            bomb.material.opacity = 0.3 + Math.abs(Math.cos(elapsed * 0.01)) * 0.7;

            // Mỗi 1.5 giây thì teleport xuất hiện ở chỗ mới
            if (elapsed > 1500) {
                bomb.position.set((Math.random() - 0.5) * 28, 1.5, (Math.random() - 0.5) * 28);
                bomb.userData.lastBlink = currentTime;
            }
        });

        // Di chuyển Cà chua ném vào màn hình
        flyingTomatoes.forEach((t, index) => {
            t.position.x += t.userData.vx;
            t.position.y += t.userData.vy;
            t.position.z += t.userData.vz;
            t.userData.vy -= 0.01; // Trọng lực hút xuống
            
            t.rotation.x += t.userData.rotX;
            t.rotation.y += t.userData.rotY;

            // Chạm mặt màn hình / camera
            if (t.position.z > 40) { 
                triggerTomatoSplat();
                scene3D.remove(t);
                flyingTomatoes.splice(index, 1);
            } else if (t.position.y < -5) { 
                scene3D.remove(t);
                flyingTomatoes.splice(index, 1);
            }
        });

        roaches.forEach(roach => {
            if (!roach.userData.alive || isRoachesFrozen) return;

            if (roach.userData.state === 'taunting') {
                const elapsed = currentTime - roach.userData.tauntStart;
                
                // Thò ra thụt vào đùa giỡn người chơi (dao động theo sóng sin)
                const peekAmount = Math.abs(Math.sin(elapsed * 0.01)) * 4; 
                
                // Dùng hướng thò ra đã được cấu hình riêng cho từng chỗ núp
                roach.position.x = roach.userData.baseX + roach.userData.peekX * peekAmount;
                roach.position.z = roach.userData.baseZ + roach.userData.peekZ * peekAmount;
                
                // Gián lắc lư/rung lắc trêu tức
                roach.material.rotation = Math.sin(elapsed * 0.005) * 0.5;

                // Trêu tức xong (khoảng 0.5 giây) thì lại chạy ra ngoài
                if (elapsed > 500) {
                    roach.material.rotation = 0;
                    roach.userData.isHidden = false;
                    assignNewTarget(roach);
                }
            } else {
                // Cơ chế né tránh vợt đập ruồi
                raycaster.setFromCamera(mouse, camera3D);
                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
                const mouse3D = new THREE.Vector3();
                if (raycaster.ray.intersectPlane(plane, mouse3D)) {
                    const distToMouse = Math.hypot(mouse3D.x - roach.position.x, mouse3D.z - roach.position.z);
                    if (distToMouse < 8 && !roach.userData.isHidden && !roach.userData.goingToHide) {
                        // Bỏ chạy ra xa khỏi chuột
                        roach.userData.targetX = roach.position.x + (roach.position.x - mouse3D.x) * 1.5;
                        roach.userData.targetZ = roach.position.z + (roach.position.z - mouse3D.z) * 1.5;
                        // Giới hạn trong sàn (-20 đến 20)
                        roach.userData.targetX = Math.max(-20, Math.min(20, roach.userData.targetX));
                        roach.userData.targetZ = Math.max(-20, Math.min(20, roach.userData.targetZ));
                    }
                }

                let tx = roach.userData.targetX;
                let tz = roach.userData.targetZ;

                const dx = tx - roach.position.x;
                const dz = tz - roach.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist < 1) {
                    if (roach.userData.goingToHide) {
                        roach.userData.state = 'taunting';
                        roach.userData.tauntStart = currentTime;
                        roach.userData.baseX = roach.position.x;
                        roach.userData.baseZ = roach.position.z;
                        roach.userData.isHidden = true; // Bắt đầu bất tử
                    } else {
                        assignNewTarget(roach); // Chạy tới điểm ngẫu nhiên mới
                    }
                } else {
                    const baseSpeed = (roach.userData.name === 'Joey') ? 0.3 : 0.2;
                    const speed = baseSpeed * speedMultiplier;
                    roach.position.x += (dx / dist) * speed;
                    roach.position.z += (dz / dist) * speed;
                }
            }
        });
    }

    renderer3D.render(scene3D, camera3D);
}