/* =========================================================
   1. CONTROL DE MODALES (Expuestos en window para onclick)
   ========================================================= */
window.openModal = function (id) {
  const modal = document.getElementById(id);
  if (!modal) {
    console.error("No se encontró el elemento con ID:", id);
    return;
  }
  modal.style.display = 'flex';
};

window.closeModal = function (id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = 'none';
};

/* =========================================================
   2. SISTEMA DE BOLETAS Y COMUNICADOS
   ========================================================= */
window.DB_NOTAS = {
  "GEM-2026-001": { nombre: "Juan Carlos Pérez", boletaUrl: "#", periodo: "I Bimestre" },
  "GEM-2026-002": { nombre: "María Fernanda Ramos", boletaUrl: "#", periodo: "I Bimestre" }
};

// Consulta de Boleta del Alumno
window.consultarBoleta = function (e) {
  e.preventDefault();
  const codigoInput = document.getElementById('codigo-alumno');
  const codigo = codigoInput ? codigoInput.value.trim().toUpperCase() : '';
  const contenedor = document.getElementById('resultado-estudiante');
  
  if (!contenedor) return;
  contenedor.classList.remove('hidden');
  contenedor.style.display = 'block';

  if (window.DB_NOTAS[codigo]) {
    const data = window.DB_NOTAS[codigo];
    contenedor.innerHTML = `
      <div class="text-left space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-emerald-400 font-bold uppercase"><i class="fa-solid fa-check"></i> Alumno Encontrado</span>
          <span class="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">${codigo}</span>
        </div>
        <p class="text-sm font-bold text-white">${data.nombre}</p>
        <p class="text-xs text-gray-400">Periodo: ${data.periodo}</p>
        <a href="${data.boletaUrl}" download class="mt-3 block text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-xs transition">
          <i class="fa-solid fa-file-arrow-down mr-1"></i> Descargar Boleta PDF
        </a>
      </div>
    `;
  } else {
    contenedor.innerHTML = `
      <p class="text-xs text-red-400 text-center">
        <i class="fa-solid fa-circle-exclamation mr-1"></i> Código no válido o sin boleta asignada. Verifica con secretaría.
      </p>
    `;
  }
};

// Login de Administrador (Contraseña demo: admin123)
window.authAdmin = function (e) {
  e.preventDefault();
  const passInput = document.getElementById('admin-pass');
  const pass = passInput ? passInput.value.trim() : '';

  if (pass === "admin123") {
    window.closeModal('modal-admin-auth');
    window.openModal('modal-admin-panel');
    if (passInput) passInput.value = '';
  } else {
    alert("Clave incorrecta. Clave demo: admin123");
  }
};

// Guardar Boleta (Simulación de carga)
window.guardarBoleta = function () {
  const cod = document.getElementById('admin-doc-codigo')?.value.trim().toUpperCase();
  const nom = document.getElementById('admin-doc-nombre')?.value.trim();
  const file = document.getElementById('admin-doc-file')?.files[0];

  if (!cod || !nom) {
    alert("Por favor, completa el código y el nombre del estudiante.");
    return;
  }

  const fileUrl = file ? URL.createObjectURL(file) : '#';

  window.DB_NOTAS[cod] = {
    nombre: nom,
    boletaUrl: fileUrl,
    periodo: "Bimestre Actual"
  };

  alert(`Boleta guardada con éxito para el código: ${cod}`);
  document.getElementById('admin-doc-codigo').value = '';
  document.getElementById('admin-doc-nombre').value = '';
  document.getElementById('admin-doc-file').value = '';
};

// Publicar Comunicado Flotante
window.publicarComunicado = function () {
  const title = document.getElementById('admin-comunicado-titulo')?.value.trim();
  const desc = document.getElementById('admin-comunicado-texto')?.value.trim();

  if (!title || !desc) {
    alert("Por favor escribe el título y el contenido del comunicado.");
    return;
  }

  const popup = document.getElementById('floating-announcement');
  const popupTitle = document.getElementById('popup-title');
  const popupDesc = document.getElementById('popup-desc');

  if (popup && popupTitle && popupDesc) {
    popupTitle.textContent = title;
    popupDesc.textContent = desc;
    popup.style.display = 'block';
  }

  window.closeModal('modal-admin-panel');
};

/* =========================================================
   3. ANIMACIÓN THREE.JS 3D (TU CÓDIGO ORIGINAL COMPLETO)
   ========================================================= */
function initThreeJs() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Iluminación
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // 2. Partículas Doradas Flotantes
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 55;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.18,
    color: 0xF59E0B,
    transparent: true,
    opacity: 0.85
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  // 3. Esfera 3D con el Logo del Colegio
  const textureLoader = new THREE.TextureLoader();
  const logoTexture = textureLoader.load('imagenes/logo.png', (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
  });

  // Crear la geometría esférica y escalarla a elipsoide vertical
  const elipsoidGeo = new THREE.SphereGeometry(3, 64, 64);
  elipsoidGeo.scale(1.2, 2.5, 1.2);

// Material con color dorado base de respaldo
  const sphereMat = new THREE.MeshStandardMaterial({
    map: logoTexture,
    color: 0xF59E0B,        // Respaldo visible inmediato
    roughness: 0.3,
    metalness: 0.5,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });

  // Crear la malla y añadirla a la escena
  const logoSphere = new THREE.Mesh(elipsoidGeo, sphereMat);
  logoSphere.rotation.x = Math.PI / 12;
  scene.add(logoSphere);

  // 4. Tracker de Mouse
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
  });

  // 5. Bucle Único de Animación (Render Loop)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Animación de partículas
    particlesMesh.rotation.y = elapsedTime * 0.04;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Animación de la esfera del logo
    logoSphere.rotation.y = elapsedTime * 0.18;
    logoSphere.rotation.x = Math.PI / 6 + Math.sin(elapsedTime * 0.5) * 0.1;

    // Paraje interactivo de la cámara con el ratón
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // 6. Responsividad de Pantalla
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

/* =========================================================
   4. INICIALIZACIÓN DE DOM Y LIBRERÍAS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 800,
      easing: 'ease-out-cubic'
    });
  }

  // Inicializar Swiper 3D Coverflow
  if (typeof Swiper !== 'undefined') {
    new Swiper(".mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      coverflowEffect: {
        rotate: 30,
        stretch: 0,
        depth: 180,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // Menú Móvil Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Envío a WhatsApp desde Formulario de Admisión
  const admisionForm = document.getElementById('admisionForm');
  if (admisionForm) {
    admisionForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const telefonoColegio = "51987111222"; 
      const nombre = document.getElementById('nombreApoderado').value.trim();
      const email = document.getElementById('emailApoderado').value.trim();
      const telefono = document.getElementById('telefonoApoderado').value.trim();
      const nivel = document.getElementById('nivelInteres').value.trim();
      const consulta = document.getElementById('mensajeApoderado').value.trim();

      const mensajeWhatsApp = 
        `*¡NUEVA SOLICITUD DE ADMISIÓN - WEB!* 🏫✨\n\n` +
        `👤 *Apoderado:* ${nombre}\n` +
        `📧 *Correo:* ${email}\n` +
        `📱 *Teléfono:* ${telefono}\n` +
        `🎓 *Nivel de Interés:* ${nivel}\n\n` +
        `📝 *Consulta:* \n"${consulta}"\n\n` +
        `_Enviado desde el portal web oficial._`;

      const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
      window.open(`https://wa.me/${telefonoColegio}?text=${mensajeCodificado}`, '_blank');
    });
  }

  // Inicializar Three.js
  initThreeJs();
});