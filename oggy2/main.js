import * as THREE from 'three';

const btnStory = document.getElementById('btnStory');
const storyScene = document.getElementById('story-scene');
const btnCloseStory = document.getElementById('btnCloseStory');

// Biến quản lý Background HTML
const bgBase = document.getElementById("bg-base");
const bgChar = document.getElementById("bg-char");

// ===== SCENE & UI ELEMENTS =====
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
let currentScene = scene1;

const infoPanel = document.getElementById("info-panel");
const infoTitle = document.getElementById("info-title");
const infoDesc = document.getElementById("info-desc");
const btnBack = document.getElementById("btnBack");
const btnScene = document.getElementById("btnScene");

// 🔥 Khai báo 2 biến này ở ngoài cùng để nút Back có thể gọi được
const funnyWrapper = document.getElementById("funny-wrapper");
const funnyTrack = document.getElementById("funny-track");

const clouds = document.querySelectorAll(".cloud");
const butterfliesDOM = document.querySelectorAll(".butterfly");
const mainLogo = document.getElementById('main-logo');
const scene1UI = document.getElementById('scene1-ui');
// Khởi tạo và tải sẵn TẤT CẢ âm thanh ngay từ đầu
const sfx = {
    // 1. Âm thanh UI / Môi trường
    home: new Audio('./assets/sounds/home.mp3'),
    sin: new Audio('./assets/sounds/sin.mp3'),
    next: new Audio('./assets/sounds/next.mp3'),
    sout: new Audio('./assets/sounds/sout.mp3'),
    tv: new Audio('./assets/sounds/tv.mp3'),
    exit: new Audio('./assets/sounds/exit.mp3'),

    // 2. Âm thanh riêng cho TỪNG NHÂN VẬT
    oggy: new Audio('./assets/sounds/oggy.mp3'),
    olivia: new Audio('./assets/sounds/olivia.mp3'),
    jack: new Audio('./assets/sounds/jack.mp3'),
    bob: new Audio('./assets/sounds/bob.mp3'),
    deedee: new Audio('./assets/sounds/deedee.mp3'),
    joey: new Audio('./assets/sounds/joey.mp3'),
    marky: new Audio('./assets/sounds/marky.mp3')
};

// Hàm tiện ích phát âm thanh (giữ nguyên như cũ)
let currentAudio = null; // Biến toàn cục để theo dõi âm thanh đang phát

function playSound(audioObj) {
    if (!audioObj) return;

    // 🛑 BƯỚC 1: Nếu có âm thanh nào đang phát, dừng nó lại ngay
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // 🛑 BƯỚC 2: Gán âm thanh mới vào biến quản lý
    currentAudio = audioObj;

    // 🛑 BƯỚC 3: Phát âm thanh mới
    currentAudio.currentTime = 0; 
    let playPromise = currentAudio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn("Trình duyệt chặn âm thanh:", error);
        });
    }
}
// ===== LOGIC TIVI =====
const tvContainer = document.getElementById('tv-container');
const tvScreen = document.getElementById('tv-screen');

// Danh sách các GIF bạn muốn phát
const tvGifs = [
  "./assets/tv6.gif",
  "./assets/tv4.gif",
  "./assets/tv1.gif",
  "./assets/tv3.gif",
  "./assets/tv5.gif",
  "./assets/tv2.gif",
  "./assets/tv7.gif"
];
let currentTvIndex = 0;

// Cứ mỗi 4 giây (4000ms) sẽ tự động chuyển kênh 1 lần
setInterval(() => {
  if (!tvScreen) return;
  currentTvIndex++;
  if (currentTvIndex >= tvGifs.length) {
    currentTvIndex = 0; // Quay lại gif đầu tiên
  }
  tvScreen.src = tvGifs[currentTvIndex];
}, 6000);

function updateLogoVisibility() {
  const isStoryOpen = storyScene.classList.contains('show-story');
  
  // Điều kiện để HIỆN logo & tivi: 
  // Phải ở Scene 1 (ngoài trời) VÀ không xem chi tiết VÀ không mở cốt truyện
  if (currentScene === scene1 && !isDetailMode && !isStoryOpen) {
    // Hiện Logo
    if (mainLogo) {
      mainLogo.style.opacity = '1';
      mainLogo.style.visibility = 'visible';
    }
    // Hiện Tivi
    if (tvContainer) {
      tvContainer.style.opacity = '1';
      tvContainer.style.visibility = 'visible';
    }
  } else {
    // Ẩn Logo
    if (mainLogo) {
      mainLogo.style.opacity = '0';
      mainLogo.style.visibility = 'hidden';
    }
    // Ẩn Tivi
    if (tvContainer) {
      tvContainer.style.opacity = '0';
      tvContainer.style.visibility = 'hidden';
    }
  }
}
// ===== LOADING MANAGER =====
const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.getElementById('loading-text');

const manager = new THREE.LoadingManager();
let isThreeJsLoaded = false;
let displayPercent = 0;

// Khi Three.js đã tải xong TOÀN BỘ hình ảnh vào bộ nhớ
manager.onLoad = function () {
  // Bên trong manager.onLoad, chỗ sau khi loadingScreen ẩn đi:
setTimeout(() => {
  updateLogoVisibility();
}, 2500);
  isThreeJsLoaded = true;
};

// Tạo bộ đếm: 100 bước, mỗi bước 20ms => Tổng thời gian là 2000ms (2 giây)
const loadingInterval = setInterval(() => {
  
  // Tăng phần trăm từ từ lên tối đa 99%
  if (displayPercent < 99) {
    displayPercent++; 
  } else if (isThreeJsLoaded) {
    // Chỉ chốt lên 100% khi Three.js báo là đã tải xong mọi thứ
    displayPercent = 100; 
  }

  // Cập nhật text hiển thị
  if (loadingText) {
    loadingText.innerText = `Đang tải vũ trụ Oggy... ${displayPercent}%`;
  }

  // Khi đạt 100%, hoàn thành và làm mờ màn hình
  if (displayPercent === 100) {
    clearInterval(loadingInterval); // Dừng bộ đếm
    
    if (loadingScreen) {
      loadingScreen.style.opacity = '0'; // Bắt đầu làm mờ
      
      // Đợi 0.5s cho hiệu ứng mờ kết thúc rồi ẩn hẳn
      setTimeout(() => {
        loadingScreen.style.visibility = 'hidden';
      }, 500);
    }
  }
}, 20); // 20ms cho mỗi 1%
// ===== CAMERA & RENDERER =====
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Sửa WebGLRenderer: Thêm alpha: true và setClearColor để Canvas hoàn toàn trong suốt
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0); 
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader(manager);
// ===== TẠO TEXTURE BÓNG ĐỔ DÙNG CHUNG =====
const shadowCanvas = document.createElement('canvas');
shadowCanvas.width = 128;
shadowCanvas.height = 128;
const shadowCtx = shadowCanvas.getContext('2d');
// Tạo hiệu ứng tỏa tròn: Đậm ở giữa, mờ dần ra viền
const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)'); // Màu đen độ mờ 70% ở tâm
gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');   // Tàng hình ở viền
shadowCtx.fillStyle = gradient;
shadowCtx.fillRect(0, 0, 128, 128);
const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

// ===== CREATE CHARACTER =====
let zIndexCounter = 0;

function createCharacter(name, img, x, y, desc, bgPath = null, customScale = 1, funnyMoments = []) {
  const geometry = new THREE.PlaneGeometry(2, 2.5);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    depthWrite: false,
    alphaTest: 0.1
  });

  const zOffset = zIndexCounter * 0.001;
  zIndexCounter++;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, zOffset);
  scene1.add(mesh);

  loader.load(img, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.NearestFilter;
   
    const canvas = document.createElement('canvas');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(texture.image, 0, 0);

    mesh.userData.hitCtx = ctx;
    mesh.userData.imgWidth = texture.image.width;
    mesh.userData.imgHeight = texture.image.height;

    const aspect = texture.image.width / texture.image.height;
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(2.5 * aspect, 2.5);
    material.map = texture;
    material.needsUpdate = true;
  });

  // 1. Khởi tạo userData GỐC của bạn trước
  mesh.userData = {
    name, desc,
    bgPath: bgPath, 
    funnyMoments: funnyMoments,
    basePos: new THREE.Vector3(x, y, zOffset),
    currentPos: new THREE.Vector3(x, y, zOffset),
    targetPos: new THREE.Vector3(x, y, zOffset),
    baseScale: new THREE.Vector3(customScale, customScale, 1),
    targetScale: new THREE.Vector3(customScale, customScale, 1),
    detailScale: new THREE.Vector3(1.5, 1.5, 1),
    targetOpacity: 1
  };
 
  mesh.scale.set(customScale, customScale, 1);

  // 2. TẠO BÓNG ĐỔ VÀ GẮN VÀO USERDATA (Nằm ngay trên return mesh)
  if (name !== "Marky") {
    const shadowGeo = new THREE.PlaneGeometry(1.5, 0.35); // Hình elip dẹt
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture, // Dùng shadowTexture từ Bước 1
      transparent: true,
      depthWrite: false, 
      opacity: 0.6
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    
    // Đặt bóng lùi về sau nhân vật một xíu
    shadowMesh.position.set(x, y - (1.2 * customScale), zOffset - 0.01);
    scene1.add(shadowMesh);
    
    // Gắn thêm thông tin bóng vào userData (không sợ bị ghi đè nữa)
    mesh.userData.shadow = shadowMesh;
    mesh.userData.shadowOffsetY = -1.25;
  }

  // 3. Cuối cùng mới return mesh
  return mesh;
}


// ===== KHỞI TẠO NHÂN VẬT =====
createCharacter("Bob", "./assets/bob.png", -1, 0, "Tên: Bob.\nTính cách: Cục súc, nghiêm khắc và rất coi trọng không gian riêng tư. Bob dễ nổi điên nếu ai đó chạm vào đồ đạc hoặc làm phiền giấc ngủ của mình.\nSở thích: Làm vườn, gặm xương, tập gym và tận hưởng sự yên tĩnh trong sân nhà mình. 💪", "./assets/bg_bob.jpg", 0.7,[
    "./assets/bfn1.jpg",
    "./assets/bfn2.jpg",
    "./assets/bfn3.jpg",
  ]);
createCharacter("Olivia", "./assets/olivia.png", -3.8, 0,"Tên: Olivia.\nTính cách: Dịu dàng, lạc quan và cực kỳ yêu thiên nhiên. Cô là người theo chủ nghĩa hòa bình, luôn muốn mọi người chung sống hạnh phúc.\nSở thích: Chăm sóc hoa lá, đọc sách, đi dạo và thực hiện các hoạt động bảo vệ môi trường. 🎀", "./assets/bg_olivia.jpg", 1.2,[
    "./assets/olfn1.jpg",
    "./assets/olfn2.jpg",
    "./assets/olfn3.jpg",
  ]);
createCharacter("Oggy", "./assets/oggy.png", -2.7, -1.2, "Tên: Oggy.\nTính cách: Hiền lành, yêu hòa bình, thích sống chill. Dễ cáu kỉnh khi bị phá hoại quá mức nhưng rất mau quên và dễ tha thứ.\nSở thích:\n- Nội trợ: Nấu ăn, dọn dẹp nhà cửa.\n- Giải trí: Xem TV, nghe nhạc cổ điển, chơi đàn Cello.\n- Sưu tầm: Tem và vật phẩm nhỏ xinh.\n- Lao động: Làm vườn, chăm sóc cây cảnh. 🍳🐱", "./assets/bg_oggy.jpg", 1.4,[
    "./assets/ofn1.jpg",
    "./assets/ofn2.jpg",
    "./assets/ofn3.jpg",
  ]);
createCharacter("Jack", "./assets/jack.png", -5.3, -1.2, "Tên: Jack.\nTính cách: Nóng nảy, tự phụ, dũng cảm nhưng rất thiếu kiên nhẫn. Tin rằng bạo lực và công nghệ là cách duy nhất để giải quyết lũ gián.\nSở thích: Chế tạo vũ khí/máy móc, tập thể hình, lái xe thể thao và khoe khoang sức mạnh. 😏", "./assets/bg_jack.jpg", 1.3,[
    "./assets/jfn1.jpg",
    "./assets/jfn2.jpg",
    "./assets/jfn3.jpg",
  ]);

createCharacter("Joey", "./assets/joey.png", -1, -2.3, "Tên: Joey.\nTính cách: Thông minh, mưu mô và cực kỳ tham vọng. Là 'bộ não' của nhóm, luôn nghiêm túc và độc đoán.\nSở thích: Lập kế hoạch chiếm đoạt tủ lạnh, kiếm tiền nhanh và khao khát trở thành bá chủ ngôi nhà. 😈", "./assets/bg_joey.jpg", 0.5,[
    "./assets/joeyfn1.jpg",
    "./assets/joeyfn2.jpg",
    "./assets/3fn2.jpg",
  ]);
createCharacter("Deedee", "./assets/deedee.png", -6.75, -2.2, "Tên: Dee Dee.\nTính cách: Ngây thơ, ham ăn và lười biếng. Thường hành động theo bản năng của dạ dày.\nSở thích: Ăn bất cứ thứ gì trong tủ lạnh, đặc biệt là xúc xích và đồ ngọt. Có thể ăn cả thế giới không chán. 🌭", "./assets/bg_deedee.jpg", 0.6,[
    "./assets/dfn1.jpg",
    "./assets/dfn2.jpg",
    "./assets/3fn3.jpg",
  ]);
createCharacter("Marky", "./assets/marky.png", -2, 1, "Tên: Marky.\nTính cách: Điềm tĩnh, tự mãn và mang tâm hồn nghệ sĩ đào hoa. Ít quan tâm đến việc phá hoại, thiên về tận hưởng cuộc sống.\nSở thích: Hẹn hò, soi gương chải chuốt và đọc tạp chí. 💖", "./assets/bg_marky.jpg", 0.5,[
    "./assets/3fn4.jpg",
    "./assets/mfn2.jpg",
    "./assets/3fn1.jpg",
  ]);

// ===== INTERACTION =====
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (isDetailMode || storyScene.classList.contains('show-story')) {
    document.body.style.cursor = 'default';
    return;
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(currentScene.children);
  let isHoveringChar = false;
  let hoveredObj = null;

  for (let i = 0; i < intersects.length; i++) {
    const hit = intersects[i];
    const obj = hit.object;

    if (!obj.userData.name || !obj.userData.hitCtx) continue;

    const uv = hit.uv;
    const pxX = Math.floor(uv.x * obj.userData.imgWidth);
    const pxY = Math.floor((1 - uv.y) * obj.userData.imgHeight);

    const pixelData = obj.userData.hitCtx.getImageData(pxX, pxY, 1, 1).data;
    const alphaChannel = pixelData[3];

    if (alphaChannel > 50) {
      isHoveringChar = true;
      hoveredObj = obj;
      break;
    }
  }

  document.body.style.cursor = isHoveringChar ? 'pointer' : 'default';
  currentHovered = hoveredObj;
});

let isDetailMode = false;
let currentSelected = null;
let currentHovered = null;

// SỰ KIỆN CLICK VÀO KHÔNG GIAN 3D
window.addEventListener("click", (event) => {
  if (isDetailMode) return;
  if (storyScene.classList.contains('show-story')) return;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(currentScene.children);

  let selectedObj = null;

  for (let i = 0; i < intersects.length; i++) {
    const hit = intersects[i];
    const obj = hit.object;

    if (!obj.userData.name || !obj.userData.hitCtx) continue;

    const uv = hit.uv;
    const pxX = Math.floor(uv.x * obj.userData.imgWidth);
    const pxY = Math.floor((1 - uv.y) * obj.userData.imgHeight);

    const pixelData = obj.userData.hitCtx.getImageData(pxX, pxY, 1, 1).data;
    const alphaChannel = pixelData[3];

    if (alphaChannel > 50) {
      selectedObj = obj;
      break;
    }
  }

  if (selectedObj) {
    // 🔥 THÊM LOGIC PHÁT ÂM THANH NGAY TẠI ĐÂY 🔥
    // 1. Chuyển tên thành chữ thường và xóa khoảng trắng (vd: "Dee Dee" -> "deedee")
    const charKey = selectedObj.userData.name.toLowerCase().replace(/\s+/g, '');
    
    // 2. Tìm trong kho sfx và phát
    if (sfx[charKey]) {
      playSound(sfx[charKey]);
    }

    // --- PHẦN CODE CŨ CỦA BẠN GIỮ NGUYÊN BÊN DƯỚI ---
    isDetailMode = true;
    currentSelected = selectedObj;
    btnStory.style.display = "none";
    infoTitle.innerText = selectedObj.userData.name;
    infoDesc.innerText = selectedObj.userData.desc;
    updateLogoVisibility();
   
    // 🔥 LOGIC SLIDER ẢNH (Thuật toán CSS Max-Content ưu việt) 🔥
    funnyTrack.innerHTML = "";
    const moments = selectedObj.userData.funnyMoments;
   
    if (moments && moments.length > 0) {
      for (let i = 0; i < 2; i++) {
        const group = document.createElement("div");
        group.className = "slide-group";
        moments.forEach(imgSrc => {
          const imgEl = document.createElement("img");
          imgEl.src = imgSrc;
          group.appendChild(imgEl);
        });
        funnyTrack.appendChild(group);
      }

      const secondsPerImage = 4;
      const calculatedDuration = moments.length * secondsPerImage;
     
      funnyTrack.style.animation = 'none';
      funnyTrack.offsetHeight; 
      funnyTrack.style.animation = `slideInfinite ${calculatedDuration}s linear infinite`;
      funnyWrapper.style.display = "block";
    } else {
      funnyWrapper.style.display = "none";
    }
   
    // UI Styling
    infoPanel.classList.add("active");
    btnScene.style.display = "none";
    
    // Đổi background sử dụng thẻ div HTML
    if (selectedObj.userData.bgPath) {
      bgChar.style.backgroundImage = `url(${selectedObj.userData.bgPath})`;
      bgChar.style.animation = 'none'; // Reset animation cũ
      bgChar.style.opacity = '1';
      bgChar.style.clipPath = 'circle(150% at 50% 50%)'; // Hiện full
    }

    infoPanel.style.width = "50%";
    infoPanel.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    infoPanel.style.backdropFilter = "blur(10px)";
    infoPanel.style.color = "#ffffff";
    infoTitle.style.color = "#ffffff";

    // 🔥 HIỆU ỨNG TRƯỢT VÀO LẦN LƯỢT (STAGGER ANIMATION) 🔥
    const uiElements = [infoTitle, infoDesc, funnyWrapper, btnBack];
    uiElements.forEach((el, index) => {
      if (el) {
        el.style.animation = 'none';
        el.offsetHeight;
        const delay = 0.3 + (index * 0.15);
        el.style.opacity = '0';
        el.style.animation = `slideInCascade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${delay}s`;
      }
    });

    clouds.forEach(el => el.style.display = "none");
    butterfliesDOM.forEach(el => el.style.display = "none");

    currentScene.children.forEach(child => {
      if (!child.userData.name) return;
      if (child === selectedObj) {
        child.userData.targetPos.set(-2.5, 0, 2);
        child.userData.targetScale.copy(child.userData.detailScale);
        child.userData.targetOpacity = 1;
      } else {
        child.userData.targetPos.copy(child.userData.basePos).setZ(-2);
        child.userData.targetScale.set(child.userData.baseScale.x * 0.5, child.userData.baseScale.y * 0.5, 1);
        child.userData.targetOpacity = 0;
      }
    });
  }
});

btnBack.addEventListener("click", (event) => {
  playSound(sfx.exit);
  event.stopPropagation();
  if (!isDetailMode) return; 

  const selectedObj = currentSelected;
  isDetailMode = false;
  currentSelected = null;

  // 2. KÍCH HOẠT ANIMATION 3D
  currentScene.children.forEach(child => {
    if (!child.userData.name) return;
   
    if (child === selectedObj) {
        child.userData.targetPos.set(-2.5, 1, 2.2); 
        child.userData.targetScale.set(child.userData.detailScale.x * 1.1, child.userData.detailScale.y * 1.1, 1);
        child.userData.targetOpacity = 1;
    } else {
        child.userData.targetOpacity = 1; 
        const scatterVec = child.userData.basePos.clone().normalize().multiplyScalar(1.5); 
        child.userData.targetPos.copy(child.userData.basePos).add(scatterVec);
        child.userData.targetScale.copy(child.userData.baseScale).multiplyScalar(1.1); 
    }
  });

  // 3. XỬ LÝ ANIMATION UI (HTML DOM) VỚI ELASTIC CASADE
  const uiElements = [btnBack, funnyWrapper, infoDesc, infoTitle];

  uiElements.forEach((el, index) => {
    if (el) {
      el.style.animation = 'none';
      el.offsetHeight; 
      const delay = index * 0.06; 
      el.style.animation = `exitWow 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards ${delay}s`;
    }
  });
 
  // Panel co lại kịch tính thành một điểm
  infoPanel.style.animation = "panelShrink 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards";
  
  // Gọi animation hút background lại (giống info panel)
  bgChar.style.animation = "bgShrinkClip 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6) forwards";

  // 4. KÍCH HOẠT PHỤC HỒI MÔI TRƯỜNG "PRO"
  setTimeout(() => {
    currentScene.children.forEach(child => {
        if (!child.userData.name) return;
        child.userData.targetPos.copy(child.userData.basePos);
        child.userData.targetScale.copy(child.userData.baseScale);
        child.userData.targetOpacity = 1;
    });
  }, 0);

  // 5. PHỤC HỒI MÔI TRƯỜNG SAU KHI UI ĐÃ ĐÓNG XONG (500ms)
  setTimeout(() => {
    // Thu kính đen về
    infoPanel.classList.remove("active");
    btnScene.style.display = "block";
    btnStory.style.display = "block";
   
    // Reset lại background html của nhân vật về tàng hình
    bgChar.style.animation = ""; 
    bgChar.style.opacity = "0";
    
    infoPanel.style.width = "400px";
    infoPanel.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    infoPanel.style.color = "#444";
    infoTitle.style.color = "#333";

    infoPanel.style.animation = "";
    uiElements.forEach(el => { if(el) el.style.animation = ""; });

    if (currentScene === scene1) {
      clouds.forEach(el => el.style.display = "block");
      butterfliesDOM.forEach(el => {
        el.style.display = "block";
        moveSmart(el);
      });
    }
    updateLogoVisibility();
  }, 300);
}); 

// ===== ANIMATION & BUTTERFLY LOGIC =====
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.02;

  currentScene.children.forEach((obj, index) => {
    if (!obj.userData.name) return;

    obj.userData.currentPos.lerp(obj.userData.targetPos, 0.08);
    let floatY = 0;

    if (isDetailMode && obj === currentSelected) {
      floatY = Math.sin(time * 2) * 0.05;
      const targetRotY = mouse.x * 0.4;  
      const targetRotX = -mouse.y * 0.2;
      obj.rotation.y += (targetRotY - obj.rotation.y) * 0.1;
      obj.rotation.x += (targetRotX - obj.rotation.x) * 0.1;
      obj.rotation.z += (Math.sin(time * 3) * 0.02 - obj.rotation.z) * 0.1;
    } else {
      if (obj === currentHovered && !isDetailMode) {
        // Tăng kích thước 8% khi hover
        obj.userData.targetScale.copy(obj.userData.baseScale).multiplyScalar(1.08);
      } else {
        obj.userData.targetScale.copy(obj.userData.baseScale);
      }
      
      floatY = Math.sin(time + index) * 0.2;
      obj.rotation.y += (0 - obj.rotation.y) * 0.1;
      obj.rotation.x += (0 - obj.rotation.x) * 0.1;
      obj.rotation.z += (0 - obj.rotation.z) * 0.1;
    }

    obj.position.copy(obj.userData.currentPos);
    obj.position.y += floatY;
    obj.scale.lerp(obj.userData.targetScale, 0.08);
    // 🔥 LOGIC CẬP NHẬT BÓNG ĐỔ 🔥
    if (obj.userData.shadow) {
      const shadow = obj.userData.shadow;
      
      // 1. Bóng luôn bám theo gốc X và Z của nhân vật
      shadow.position.x = obj.position.x;
      shadow.position.z = obj.position.z - 0.01;
      
      // Bóng nằm trên mặt đất (dựa vào Y gốc, không cộng floatY để bóng không bay theo)
      shadow.position.y = obj.userData.currentPos.y + (obj.userData.shadowOffsetY * obj.scale.y);

      // 2. Tính toán độ to nhỏ / đậm nhạt dựa theo floatY
      // floatY dao động từ khoảng -0.2 đến 0.2
      // Khi floatY > 0 (nhân vật nhấc lên): Bóng mờ đi và thu nhỏ
      // Khi floatY < 0 (nhân vật đáp xuống): Bóng đậm lên và phình to
      
      const targetShadowScale = obj.scale.x * (1 - floatY * 1.5);
      shadow.scale.setScalar(targetShadowScale);

      // Bóng sẽ mờ đi dựa vào khoảng cách bay, đồng thời nếu nhân vật bị mờ (lúc bấm vào nhà), bóng cũng mờ theo
      const characterOpacity = obj.material ? obj.material.opacity : 1;
      shadow.material.opacity = characterOpacity * (0.6 - floatY * 1.2);
      
      // Ẩn bóng để tiết kiệm tài nguyên nếu quá mờ
      shadow.visible = shadow.material.opacity > 0.05;
    }

    if (obj.material) {
      obj.material.opacity += (obj.userData.targetOpacity - obj.material.opacity) * 0.08;
      obj.visible = obj.material.opacity > 0.05;
    }
  });

  renderer.render(currentScene, camera);
}
animate();

function moveSmart(el) {
  if (el._timeout) clearTimeout(el._timeout);
  const duration = 3000 + Math.random() * 3000;
  const rect = renderer.domElement.getBoundingClientRect();
  const x = Math.random() * (rect.width - 240);
  const y = Math.random() * (rect.height - 240);
  el.style.transition = `transform ${duration}ms ease-in-out`;
  el.style.transform = `translate(${x}px, ${y}px)`;
  el._timeout = setTimeout(() => moveSmart(el), duration);
}
butterfliesDOM.forEach(btf => moveSmart(btf));

// ===== SCENE SWITCH =====
// ===== SCENE SWITCH (CHUYỂN CẢNH VÀO NHÀ / RA NGOÀI) =====
let isSceneTransitioning = false; // Biến cờ ngăn người dùng spam click

btnScene.addEventListener("click", (event) => {
  playSound(sfx.home);
  event.stopPropagation();
  if (isSceneTransitioning) return; 
  isSceneTransitioning = true;
  
  // Lấy thẻ canvas của ThreeJS
  const canvas = renderer.domElement;
  
  // 1. KÍCH HOẠT HIỆU ỨNG HÚT VÀO TÂM (Shrink)
  const shrinkTiming = "0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards";
  bgBase.style.animation = `sceneShrinkAnim ${shrinkTiming}`;
  canvas.style.animation = `sceneShrinkAnim ${shrinkTiming}`;
  if (scene1UI) scene1UI.style.animation = `sceneShrinkAnim ${shrinkTiming}`;
  
  // Làm mờ đi các UI phụ
  clouds.forEach(el => { el.style.transition = "opacity 0.3s"; el.style.opacity = "0"; });
  butterfliesDOM.forEach(el => { el.style.transition = "opacity 0.3s"; el.style.opacity = "0"; });
  if (btnStory) { btnStory.style.transition = "opacity 0.3s"; btnStory.style.opacity = "0"; }

  // 2. ĐỢI 600ms CHO HÚT XONG -> CHUYỂN HƯỚNG VÀO GAME
  setTimeout(() => {
    window.location.href = "../OGGY/index.html";
  }, 600);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Kích hoạt: Bấm nút thì khoác áo "show-story" vào
// ===== LOGIC CHUYỂN TRANG CỐT TRUYỆN =====
const pages = document.querySelectorAll('.story-page');
const btnNext = document.getElementById('btnNextPage');
const btnPrev = document.getElementById('btnPrevPage');
const btnClose = document.getElementById('btnCloseStory');
let currentStoryPage = 0;
let isFlipping = false; // Chống lặp lệnh khi đang lật

function updateStoryPages() {
  pages.forEach((page, index) => {
    page.classList.remove('active', 'past');
    if (index === currentStoryPage) {
      page.classList.add('active');
    } else if (index < currentStoryPage) {
      page.classList.add('past');
    }
  });

  // Hiện/Ẩn mũi tên điều hướng
  btnPrev.style.visibility = currentStoryPage === 0 ? 'hidden' : 'visible';
  btnNext.style.visibility = currentStoryPage === pages.length - 1 ? 'hidden' : 'visible';

  // Chỉ hiện nút đóng ở trang cuối
  btnClose.style.display = currentStoryPage === pages.length - 1 ? 'block' : 'none';
}

function nextPage() {
  if (isFlipping || currentStoryPage >= pages.length - 1) return;
  playSound(sfx.next); // Chỉ phát âm thanh khi thực sự lật trang
  isFlipping = true;
  currentStoryPage++;
  updateStoryPages();
  setTimeout(() => isFlipping = false, 800); // Đợi hiệu ứng CSS chạy xong
}

function prevPage() {
  if (isFlipping || currentStoryPage <= 0) return;
  playSound(sfx.next);
  isFlipping = true;
  currentStoryPage--;
  updateStoryPages();
  setTimeout(() => isFlipping = false, 800);
}

// 1. Sự kiện click mũi tên
btnNext.addEventListener('click', () => {
    nextPage();
});

btnPrev.addEventListener('click', () => {
    prevPage();
});

// 2. Sự kiện lăn chuột (Mouse Wheel)
let wheelCooldown = false;
storyScene.addEventListener('wheel', (e) => {
  if (wheelCooldown || isFlipping) return;
  
  wheelCooldown = true;
  setTimeout(() => wheelCooldown = false, 1200); // Cooldown 1.2s chặn trớn chuột/trackpad

  if (e.deltaY > 0) {
    nextPage();
  } else {
    prevPage();
  }
});

// 3. (Tùy chọn) Phím mũi tên trên bàn phím
window.addEventListener('keydown', (e) => {
  if (!storyScene.classList.contains('show-story')) return;
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
});



// Khi mở cốt truyện
btnStory.addEventListener('click', () => {
  playSound(sfx.sin);
  // 1. Hiện khung cảnh truyện
  storyScene.classList.add('show-story');
  
  // 2. Thêm class 'opening' để chạy animation vừa viết ở trên
  storyScene.classList.add('opening');

  // 3. Ẩn các thành phần khác (Tivi, Logo)
  if (tvContainer) tvContainer.style.display = 'none';
  if (mainLogo) mainLogo.style.display = 'none';

  // 4. Sau khi animation mở sách chạy xong (1.2s), ta gỡ class opening ra 
  // để không làm ảnh hưởng đến hiệu ứng lật trang bình thường sau này
  setTimeout(() => {
    storyScene.classList.remove('opening');
  }, 1200);

  // Reset về trang đầu
  currentStoryPage = 0;
  updateStoryPages();
});

// Nút đóng
// Nút đóng cốt truyện
btnCloseStory.addEventListener('click', () => {
  playSound(sfx.sout);
  // 1. Chạy hiệu ứng gập sách (Closing)
  storyScene.classList.add('closing');

  // 2. Chờ hiệu ứng lật trang đóng lại xong (0.8 giây)
  setTimeout(() => {
    // Tắt hẳn khung cảnh truyện
    storyScene.classList.remove('show-story');
    storyScene.classList.remove('closing');

    // 3. HIỆN LẠI TIVI VÀ LOGO KÈM HIỆU ỨNG (Cập nhật mới ở đây)
    if (tvContainer) {
      tvContainer.style.display = 'block'; 
      tvContainer.style.opacity = '1';
      // Reset và kích hoạt lại animation rơi xuống
      tvContainer.classList.remove('tv-fly-in');
      void tvContainer.offsetWidth; 
      tvContainer.classList.add('tv-fly-in');
      setTimeout(() => tvContainer.classList.remove('tv-fly-in'), 1200);
    }
    
    if (mainLogo) {
      mainLogo.style.display = 'block';   
      mainLogo.style.opacity = '1';
      // Reset và kích hoạt lại animation bắn lên
      mainLogo.classList.remove('logo-fly-in');
      void mainLogo.offsetWidth; 
      mainLogo.classList.add('logo-fly-in');
      setTimeout(() => mainLogo.classList.remove('logo-fly-in'), 1200);
    }
  }, 800); 
});