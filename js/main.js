/**
 * EGYHOST - Interactive Cloud Platform & n8n Automation Engine
 * High-performance, Developer-First Telemetry & Provisioning Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- State Management ---
  const state = {
    currency: 'EGP', // 'EGP' or 'USD'
    billing: 'monthly', // 'monthly' or 'annual'
    usdToEgpRate: 48.5,
    customPlan: {
      cpu: 4,
      ram: 8,
      storage: 120,
      backups: true,
      extraIp: false,
      aiVector: true,
      ddosShield: false
    }
  };

  // Base Plan Prices (in EGP, monthly)
  const plansData = {
    n8n: [
      {
        id: 'n8n-starter',
        name: 'n8n Starter',
        desc: 'مثالي للمشاريع الناشئة، المطورين، وصناع المحتوى لأتمتة سير العمل.',
        priceEgp: 390,
        cpu: '2 vCPU AMD EPYC',
        ram: '4 GB DDR5',
        storage: '50 GB NVMe Gen4',
        featured: false,
        specs: [
          { text: 'تشغيلات غير محدودة (Unlimited Executions)', strong: true },
          { text: 'قاعدة بيانات PostgreSQL 16 مخصصة', strong: false },
          { text: 'نطاق فرعي مجاني مع شهادة SSL تلقائية', strong: false },
          { text: 'نسخ احتياطي يومي تلقائي (Daily Snapshots)', strong: false },
          { text: 'أكثر من 400+ عقدة ربط وتكامل مسبقة التثبيت', strong: false },
          { text: 'دعم فني متخصص على مدار الساعة', strong: false }
        ]
      },
      {
        id: 'n8n-pro',
        name: 'n8n Pro Business',
        desc: 'الباقة الأكثر طلباً للشركات، الوكالات، ومتاجر التجارة الإلكترونية عالية الحركة.',
        priceEgp: 750,
        cpu: '4 vCPU AMD EPYC 3.8GHz',
        ram: '8 GB DDR5',
        storage: '100 GB NVMe Gen4',
        featured: true,
        specs: [
          { text: 'وضع طابور Redis Queue لدعم آلاف الـ Webhooks المتزامنة', strong: true },
          { text: 'عقد الذكاء الاصطناعي (AI Nodes & Vector DB) مفعلة مسبقاً', strong: true },
          { text: 'قاعدة بيانات عالية الأداء مع ذاكرة تخزين مؤقتة', strong: false },
          { text: 'دعم ربط النطاق المخصص الخاص بك (Custom Domain)', strong: false },
          { text: 'نسخ احتياطي كل 12 ساعة + استعادة سحابية بنقرة واحدة', strong: false },
          { text: 'دعم فني ذو أولوية VIP عبر واتساب وتيليجرام', strong: true }
        ]
      },
      {
        id: 'n8n-enterprise',
        name: 'n8n AI Enterprise Cluster',
        desc: 'أقوى بنية مخصصة للذكاء الاصطناعي، وكلاء الوظائف (AI Agents) والأنظمة الضخمة.',
        priceEgp: 1490,
        cpu: '8 vCPU Dedicated Compute',
        ram: '16 GB ECC RAM',
        storage: '240 GB NVMe Raid-10',
        featured: false,
        specs: [
          { text: 'عناقيد عمالية متعددة (Multi-Worker Autoscaling)', strong: true },
          { text: 'بيئة معزولة بالكامل بأعلى معايير الأمان المؤسسي', strong: true },
          { text: 'عنوان IPv4 مخصص ونظيف بنسبة 100%', strong: false },
          { text: 'ضمان توافر الخدمة 99.99% بموجب اتفاقية SLA', strong: true },
          { text: 'مراقبة حية للأنشطة والتدقيق وتنبيهات أمنية فورية', strong: false },
          { text: 'مهندس دعم مخصص لمراجعة بنية وتدفقات الأتمتة', strong: true }
        ]
      }
    ],
    cloud: [
      {
        id: 'cloud-1',
        name: 'Cloud Server - Standard 1',
        desc: 'سيرفر سحابي مخصص للمواقع الصغيرة، واجهات البرمجة، والبيئات التجريبية.',
        priceEgp: 190,
        cpu: '1 vCPU AMD EPYC',
        ram: '2 GB RAM',
        storage: '40 GB NVMe Gen4',
        featured: false,
        specs: [
          { text: 'صلاحيات روت كاملة (Full Root / SSH Access)', strong: true },
          { text: 'حركة مرور شهرية 2 TB على شبكة 10 Gbps', strong: false },
          { text: 'عنوان IPv4 مخصص + /64 IPv6 مجاني', strong: false },
          { text: 'حماية متقدمة ضد هجمات حجب الخدمة (DDoS Shield)', strong: false },
          { text: 'إعادة تثبيت نظام التشغيل بنقرة واحدة (Ubuntu/Debian)', strong: false }
        ]
      },
      {
        id: 'cloud-2',
        name: 'Cloud Server - Performance 2',
        desc: 'التوازن المثالي للشركات الناشئة، السيرفرات التجارية وسيرفرات التطبيقات.',
        priceEgp: 340,
        cpu: '2 vCPU AMD EPYC',
        ram: '4 GB RAM',
        storage: '80 GB NVMe Gen4',
        featured: true,
        specs: [
          { text: 'صلاحيات روت كاملة (Full Root / SSH Access)', strong: true },
          { text: 'حركة مرور شهرية 4 TB فائقة السرعة', strong: false },
          { text: 'عنوان IPv4 مخصص ونظيف', strong: false },
          { text: 'دعم Docker، Podman، وK3s بنقرة واحدة', strong: true },
          { text: 'لقطات نظام سريعة (Fast Snapshots)', strong: false }
        ]
      },
      {
        id: 'cloud-4',
        name: 'Cloud Server - Pro Compute 4',
        desc: 'أداء فائق لقواعد البيانات الضخمة، المتاجر الكبيرة وسيناريوهات الإنتاج الحرجة.',
        priceEgp: 620,
        cpu: '4 vCPU AMD EPYC',
        ram: '8 GB RAM',
        storage: '160 GB NVMe Gen4',
        featured: false,
        specs: [
          { text: 'أنوية معالجة مخصصة وعالية التردد 3.8GHz+', strong: true },
          { text: 'حركة مرور شهرية 8 TB على منافذ 10 Gbps', strong: false },
          { text: 'عنوان IPv4 مخصص + حماية DDoS حتى 1.2 Tbps', strong: false },
          { text: 'نسخ احتياطي أسبوعي مضمّن مجاناً', strong: true },
          { text: 'دعم فني متاح 24/7 مع وقت استجابة قياسي', strong: false }
        ]
      }
    ]
  };

  // Backwards compatibility alias
  plansData.vps = plansData.cloud;

  let activePlanType = 'n8n'; // 'n8n' or 'cloud'

  // --- Currency & Billing Conversion Helper ---
  function formatPrice(egpAmount) {
    let finalAmount = egpAmount;
    if (state.billing === 'annual') {
      finalAmount = egpAmount * 0.8; // 20% discount
    }

    if (state.currency === 'USD') {
      const usdVal = (finalAmount / state.usdToEgpRate).toFixed(1);
      return {
        value: usdVal,
        currencySymbol: '$',
        periodText: state.billing === 'annual' ? '/ شهرياً (تدفع سنوياً)' : '/ شهر'
      };
    } else {
      const egpVal = Math.round(finalAmount);
      return {
        value: egpVal.toLocaleString('ar-EG'),
        currencySymbol: 'ج.م',
        periodText: state.billing === 'annual' ? '/ شهرياً (تدفع سنوياً)' : '/ شهر'
      };
    }
  }

  // --- Render Pricing Cards ---
  const pricingContainer = document.getElementById('pricingGrid');

  function renderPricingCards() {
    if (!pricingContainer) return;
    const plans = plansData[activePlanType];
    pricingContainer.innerHTML = '';

    plans.forEach(plan => {
      const priceInfo = formatPrice(plan.priceEgp);
      const card = document.createElement('div');
      card.className = `pricing-card ${plan.featured ? 'featured' : ''}`;
      
      let badgeHtml = '';
      if (plan.featured) {
        badgeHtml = `<div class="popular-badge">الأكثر اختياراً</div>`;
      }

      let specsHtml = plan.specs.map(s => `
        <li class="spec-item">
          <span class="spec-icon">✓</span>
          <span class="${s.strong ? 'spec-strong' : ''}">${s.text}</span>
        </li>
      `).join('');

      card.innerHTML = `
        ${badgeHtml}
        <div class="plan-header">
          <h3 class="plan-name">${plan.name}</h3>
          <p class="plan-desc">${plan.desc}</p>
        </div>

        <div class="price-container">
          <span class="price-amount">${priceInfo.value}</span>
          <span class="price-currency">${priceInfo.currencySymbol}</span>
          <span class="price-period">${priceInfo.periodText}</span>
        </div>

        <div style="background-color: var(--surface-ice); padding: 10px 14px; border-radius: var(--rounded-sm); margin-bottom: 20px; font-family: var(--font-mono); font-size: 12px; display: flex; justify-content: space-between; border: 1px solid var(--surface-border);">
          <span><strong style="color: var(--primary);">${plan.cpu}</strong></span>
          <span><strong style="color: var(--secondary);">${plan.ram}</strong></span>
          <span><strong style="color: var(--on-surface-variant);">${plan.storage}</strong></span>
        </div>

        <ul class="plan-specs-list">
          ${specsHtml}
        </ul>

        <button class="btn ${plan.featured ? 'btn-accent' : 'btn-primary'} btn-deploy-plan" data-plan-id="${plan.id}" data-plan-name="${plan.name}" data-price="${plan.priceEgp}">
          <span>إطلاق السيرفر الآن</span>
          <span style="font-size: 16px;">←</span>
        </button>
      `;

      pricingContainer.appendChild(card);
    });

    // Attach click events for newly rendered buttons
    document.querySelectorAll('.btn-deploy-plan').forEach(btn => {
      btn.addEventListener('click', () => {
        const planName = btn.getAttribute('data-plan-name');
        const planPrice = btn.getAttribute('data-price');
        openDeployModal(planName, planPrice);
      });
    });
  }

  // --- Currency Toggle Buttons ---
  const currencyBtns = document.querySelectorAll('.currency-btn');
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currency = btn.getAttribute('data-currency');
      renderPricingCards();
      showToast(`تم تبديل العملة إلى ${state.currency === 'EGP' ? 'الجنيه المصري (EGP)' : 'الدولار الأمريكي (USD)'}`);
    });
  });

  // --- Billing Period Toggle ---
  const billingCheckbox = document.getElementById('billingSwitch');
  if (billingCheckbox) {
    billingCheckbox.addEventListener('change', () => {
      state.billing = billingCheckbox.checked ? 'annual' : 'monthly';
      renderPricingCards();
      if (state.billing === 'annual') {
        showToast('تم تطبيق خصم 20% على الاشتراك السنوي!');
      }
    });
  }

  // --- Plan Type Switcher (n8n Cloud vs Cloud Compute) ---
  const planTypeBtns = document.querySelectorAll('.plan-tab-btn');
  planTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      planTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePlanType = btn.getAttribute('data-type');
      renderPricingCards();
    });
  });


  // --- Copy To Clipboard Buttons ---
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-copy-target');
      const el = document.querySelector(targetSelector);
      const textToCopy = el ? el.innerText : '';

      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('تم نسخ المحتوى بنجاح إلى الحافظة!');
        });
      }
    });
  });



  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });


  // --- Deployment / Checkout Modal Logic ---
  const deployModal = document.getElementById('deployModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const selectedPlanNameDisplay = document.getElementById('modalPlanName');
  const selectedPlanPriceDisplay = document.getElementById('modalPlanPrice');
  const deployFormView = document.getElementById('deployFormView');
  const deployingProgressView = document.getElementById('deployingProgressView');
  const deploySuccessView = document.getElementById('deploySuccessView');
  const btnConfirmDeploy = document.getElementById('btnConfirmDeploy');
  const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');

  function openDeployModal(planName, planPriceEgp) {
    if (!deployModal) return;
    selectedPlanNameDisplay.textContent = planName;
    const priceInfo = formatPrice(parseFloat(planPriceEgp) || 750);
    selectedPlanPriceDisplay.textContent = `${priceInfo.value} ${priceInfo.currencySymbol} ${priceInfo.periodText}`;

    deployFormView.style.display = 'block';
    deployingProgressView.style.display = 'none';
    deploySuccessView.style.display = 'none';
    btnConfirmDeploy.style.display = 'inline-flex';

    deployModal.classList.add('active');
  }

  function closeDeployModal() {
    if (deployModal) {
      deployModal.classList.remove('active');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDeployModal);
  if (btnCloseSuccessModal) btnCloseSuccessModal.addEventListener('click', closeDeployModal);

  if (deployModal) {
    deployModal.addEventListener('click', (e) => {
      if (e.target === deployModal) closeDeployModal();
    });
  }

  if (btnConfirmDeploy) {
    btnConfirmDeploy.addEventListener('click', () => {
      const hostnameInput = document.getElementById('modalHostname')?.value || 'my-n8n-server.cloud';

      deployFormView.style.display = 'none';
      btnConfirmDeploy.style.display = 'none';
      deployingProgressView.style.display = 'block';

      setTimeout(() => {
        deployingProgressView.style.display = 'none';
        deploySuccessView.style.display = 'block';

        const ipDisplay = document.getElementById('successIp');
        const urlDisplay = document.getElementById('successUrl');
        const passDisplay = document.getElementById('successPass');

        const randomIp = `197.168.${Math.floor(Math.random() * 80) + 10}.${Math.floor(Math.random() * 200) + 20}`;
        if (ipDisplay) ipDisplay.textContent = randomIp;
        if (urlDisplay) urlDisplay.textContent = `https://${hostnameInput}/`;
        if (passDisplay) passDisplay.textContent = `Egy_${Math.random().toString(36).substring(2, 10)}!`;

        showToast('تم إطلاق وتجهيز السيرفر بنجاح!');
      }, 2500);
    });
  }

  // --- Global Toast Notification Helper ---
  const toastEl = document.getElementById('toastNotification');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.querySelector('.toast-text').textContent = message;
    toastEl.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3800);
  }

  // --- Apple Style FAQ Accordion Toggle ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parentItem = question.closest('.faq-item');
      if (!parentItem) return;
      const wasActive = parentItem.classList.contains('active');
      
      // Close all other items for clean Apple accordion feel
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!wasActive) {
        parentItem.classList.add('active');
      }
    });
  });

  // --- Apple Scroll-Driven Entrance Animation System ---
  const revealTargets = document.querySelectorAll(
    '.kpi-card, .pricing-card, .template-card, .faq-item, .section-head, .calc-card-container, .service-card, .guarantee-banner-box'
  );

  revealTargets.forEach((el) => {
    el.classList.add('apple-reveal');
    const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
    if (siblingIndex > 0 && siblingIndex <= 5) {
      el.classList.add(`delay-${Math.min(siblingIndex, 5)}`);
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('apple-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('apple-visible'));
  }



  // --- Apple Style Mobile Navigation Drawer Controller ---
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  function openMobileMenu() {
    if (!mobileToggleBtn || !mobileDrawer) return;
    mobileToggleBtn.classList.add('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mobile-nav-locked');
  }

  function closeMobileMenu() {
    if (!mobileToggleBtn || !mobileDrawer) return;
    mobileToggleBtn.classList.remove('active');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mobile-nav-locked');
  }

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on clicking any link inside drawer
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close if clicked outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Auto-close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --- Apple Card Specular Coordinates ---
  const interactiveCards = document.querySelectorAll('.pricing-card, .kpi-card, .template-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- ThreeUI 3D Cloud Datacenter Server Racks Background Engine ---
  function initServerDatacenterBackground() {
    const bgCanvas = document.getElementById('egyhostServerBgCanvas');
    if (!bgCanvas || typeof window.THREE === 'undefined') return;

    const THREE = window.THREE;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf1f6fd, 18, 55);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 4.5, 14.5);
    camera.lookAt(0, 1.8, -8);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 2.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d8ff, 3.4);
    keyLight.position.set(12, 18, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x0284c7, 2.0);
    fillLight.position.set(-12, -4, 6);
    scene.add(fillLight);

    // Glowing Cyan Datacenter Corridor Point Lights
    const leftAisleLight = new THREE.PointLight(0x00d8ff, 3.8, 35);
    leftAisleLight.position.set(-5, 4.5, -2);
    scene.add(leftAisleLight);

    const rightAisleLight = new THREE.PointLight(0x00d8ff, 3.8, 35);
    rightAisleLight.position.set(5, 4.5, -2);
    scene.add(rightAisleLight);

    // Datacenter Cluster Group
    const datacenterGroup = new THREE.Group();
    scene.add(datacenterGroup);

    // Reusable Materials (Crisp, High-Tech Server Chassis with Glowing Cyan Edges)
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x061426,
      metalness: 0.9,
      roughness: 0.18,
      transparent: true,
      opacity: 0.96
    });

    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x0e223d,
      metalness: 0.85,
      roughness: 0.25
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95
    });

    // Server Rack Dimensions
    const rackGeo = new THREE.BoxGeometry(1.6, 5.6, 1.8);
    const rackEdgeGeo = new THREE.EdgesGeometry(rackGeo);
    const bladeGeo = new THREE.BoxGeometry(1.48, 0.6, 1.7);

    // Generate Parallel Rows of Datacenter Server Racks
    // Perfectly positioned to frame mobile and desktop screens
    const ledPoints = [];
    const ledColors = [];
    const serverRacks = [];

    const rackPositions = [
      // Left aisle: front to back
      { x: -5.0, z: 2 },
      { x: -5.0, z: -3.5 },
      { x: -5.0, z: -9 },
      { x: -5.0, z: -14.5 },
      { x: -5.0, z: -20 },
      { x: -8.0, z: 0 },
      { x: -8.0, z: -6 },
      { x: -8.0, z: -12 },
      { x: -8.0, z: -18 },
      // Right aisle: front to back
      { x: 5.0, z: 2 },
      { x: 5.0, z: -3.5 },
      { x: 5.0, z: -9 },
      { x: 5.0, z: -14.5 },
      { x: 5.0, z: -20 },
      { x: 8.0, z: 0 },
      { x: 8.0, z: -6 },
      { x: 8.0, z: -12 },
      { x: 8.0, z: -18 }
    ];

    rackPositions.forEach(pos => {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(pos.x, 2.8, pos.z);

      // Main Chassis
      const rackMesh = new THREE.Mesh(rackGeo, rackMat);
      rackGroup.add(rackMesh);

      // Glowing Cyan Edge Lines
      const edgeLines = new THREE.LineSegments(rackEdgeGeo, edgeMat);
      rackGroup.add(edgeLines);

      // 7 Tiered 1U/2U Server Trays inside each rack
      for (let s = 0; s < 7; s++) {
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = -2.2 + s * 0.72;
        rackGroup.add(blade);

        // Add 3 Blinking Server Activity LEDs per tray faceplate
        for (let l = 0; l < 3; l++) {
          const ledX = pos.x + (pos.x < 0 ? 0.82 : -0.82); // Facing inward corridor
          const ledY = 2.8 + blade.position.y;
          const ledZ = pos.z - 0.5 + l * 0.5;

          ledPoints.push(ledX, ledY, ledZ);

          // LED Color: 70% Green, 20% Cyan, 10% Amber
          const rType = Math.random();
          if (rType < 0.65) {
            ledColors.push(0.06, 0.85, 0.48); // Vivid Emerald Green
          } else if (rType < 0.9) {
            ledColors.push(0.0, 0.92, 1.0);  // High Cyan
          } else {
            ledColors.push(1.0, 0.7, 0.1);   // Amber
          }
        }
      }

      datacenterGroup.add(rackGroup);
      serverRacks.push(rackGroup);
    });

    // Blinking Server Activity LED Point Cloud
    const ledGeo = new THREE.BufferGeometry();
    ledGeo.setAttribute('position', new THREE.Float32BufferAttribute(ledPoints, 3));
    ledGeo.setAttribute('color', new THREE.Float32BufferAttribute(ledColors, 3));

    const ledMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 1.0
    });
    const ledSystem = new THREE.Points(ledGeo, ledMat);
    datacenterGroup.add(ledSystem);

    // Floor Optical Network Bus Lines
    const lineCoords = [];
    [-5.0, -8.0, 5.0, 8.0, 0].forEach(lx => {
      lineCoords.push(lx, 0.05, 6);
      lineCoords.push(lx, 0.05, -24);
    });
    const busGeo = new THREE.BufferGeometry();
    busGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineCoords, 3));
    const busMat = new THREE.LineBasicMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: 0.45
    });
    const busLines = new THREE.LineSegments(busGeo, busMat);
    datacenterGroup.add(busLines);

    // Floating Optical Data Packets (Network Fiber Stream)
    const packetCount = 80;
    const packetPositions = new Float32Array(packetCount * 3);
    const packetSpeeds = [];

    for (let p = 0; p < packetCount; p++) {
      const aisleX = (Math.random() - 0.5) * 10.0;
      packetPositions[p * 3] = aisleX;
      packetPositions[p * 3 + 1] = 0.1 + Math.random() * 4.5;
      packetPositions[p * 3 + 2] = 4 - Math.random() * 26;
      packetSpeeds.push(0.04 + Math.random() * 0.06);
    }

    const packetGeo = new THREE.BufferGeometry();
    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0x00d8ff,
      size: 0.07,
      transparent: true,
      opacity: 0.95
    });
    const packetStream = new THREE.Points(packetGeo, packetMat);
    datacenterGroup.add(packetStream);

    // Parallax & Scrolling Dynamics
    let targetCamX = 0;
    let targetCamY = 4.5;
    let targetCamZ = 14.5;

    function onMouseMove(e) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCamX = nx * 0.8;
      targetCamY = 4.5 - ny * 0.4;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      targetCamZ = 14.5 - scrollRatio * 5; // Gentle glide
      targetCamY = 4.5 + scrollRatio * 1.0;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    function onResize() {
      if (!renderer || !camera) return;
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;

      // On mobile screens (aspect < 1.0), widen the FOV and scale rack group so server towers flank both sides of the phone screen
      if (aspect < 1.0) {
        camera.fov = 76;
        targetCamY = 4.2;
        targetCamZ = 15.0;
        datacenterGroup.scale.set(0.68, 0.92, 1.0);
      } else {
        camera.fov = 50;
        targetCamY = 4.5;
        targetCamZ = 14.5;
        datacenterGroup.scale.set(1.0, 1.0, 1.0);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);
    onResize(); // Initial responsive setup!

    // Animation Loop
    let tick = 0;
    function animateBg() {
      requestAnimationFrame(animateBg);

      tick++;

      // Lerp camera motion (Apple Keynote smooth inertia)
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(targetCamX * 0.3, 1.2, camera.position.z - 18);

      // Animate Traveling Data Packets
      const posArr = packetGeo.attributes.position.array;
      for (let p = 0; p < packetCount; p++) {
        posArr[p * 3 + 2] += packetSpeeds[p];
        if (posArr[p * 3 + 2] > 6) {
          posArr[p * 3 + 2] = -24;
        }
      }
      packetGeo.attributes.position.needsUpdate = true;

      // Random Server LED activity blinks
      if (tick % 6 === 0) {
        ledMat.opacity = 0.85 + Math.random() * 0.15;
      }

      renderer.render(scene, camera);
    }

    animateBg();
  }

  // Initialize ThreeUI 3D Datacenter Server Racks Background Engine
  initServerDatacenterBackground();

  // Initial runs
  renderPricingCards();
});
