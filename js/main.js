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
    vps: [
      {
        id: 'vps-1',
        name: 'Cloud VPS - Standard 1',
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
        id: 'vps-2',
        name: 'Cloud VPS - Performance 2',
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
        id: 'vps-4',
        name: 'Cloud VPS - Pro Compute 4',
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

  let activePlanType = 'n8n'; // 'n8n' or 'vps'

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
      updateCalculator();
      showToast(`تم تبديل العملة إلى ${state.currency === 'EGP' ? 'الجنيه المصري (EGP)' : 'الدولار الأمريكي (USD)'}`);
    });
  });

  // --- Billing Period Toggle ---
  const billingCheckbox = document.getElementById('billingSwitch');
  if (billingCheckbox) {
    billingCheckbox.addEventListener('change', () => {
      state.billing = billingCheckbox.checked ? 'annual' : 'monthly';
      renderPricingCards();
      updateCalculator();
      if (state.billing === 'annual') {
        showToast('تم تطبيق خصم 20% على الاشتراك السنوي!');
      }
    });
  }

  // --- Plan Type Switcher (n8n Cloud vs VPS) ---
  const planTypeBtns = document.querySelectorAll('.plan-tab-btn');
  planTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      planTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePlanType = btn.getAttribute('data-type');
      renderPricingCards();
    });
  });

  // --- Interactive Calculator & Builder ---
  const cpuSlider = document.getElementById('calcCpu');
  const ramSlider = document.getElementById('calcRam');
  const storageSlider = document.getElementById('calcStorage');

  const cpuValBadge = document.getElementById('cpuValBadge');
  const ramValBadge = document.getElementById('ramValBadge');
  const storageValBadge = document.getElementById('storageValBadge');

  const summaryCpu = document.getElementById('summaryCpu');
  const summaryRam = document.getElementById('summaryRam');
  const summaryStorage = document.getElementById('summaryStorage');
  const summaryTotalDisplay = document.getElementById('summaryTotalPrice');
  const summaryCurrencyDisplay = document.getElementById('summaryCurrency');

  function calculateCustomPrice() {
    const cpu = parseInt(cpuSlider?.value || 4);
    const ram = parseInt(ramSlider?.value || 8);
    const storage = parseInt(storageSlider?.value || 120);

    let baseEgp = (cpu * 70) + (ram * 45) + (storage * 1.5);

    // Addons
    if (state.customPlan.backups) baseEgp += 95;
    if (state.customPlan.extraIp) baseEgp += 120;
    if (state.customPlan.aiVector) baseEgp += 150;
    if (state.customPlan.ddosShield) baseEgp += 180;

    return baseEgp;
  }

  function updateCalculator() {
    if (!cpuSlider) return;

    const cpu = cpuSlider.value;
    const ram = ramSlider.value;
    const storage = storageSlider.value;

    if (cpuValBadge) cpuValBadge.textContent = `${cpu} Cores`;
    if (ramValBadge) ramValBadge.textContent = `${ram} GB`;
    if (storageValBadge) storageValBadge.textContent = `${storage} GB NVMe`;

    if (summaryCpu) summaryCpu.textContent = `${cpu} vCPU AMD EPYC`;
    if (summaryRam) summaryRam.textContent = `${ram} GB DDR5`;
    if (summaryStorage) summaryStorage.textContent = `${storage} GB NVMe Gen4`;

    const rawEgp = calculateCustomPrice();
    const priceInfo = formatPrice(rawEgp);

    if (summaryTotalDisplay) summaryTotalDisplay.textContent = priceInfo.value;
    if (summaryCurrencyDisplay) summaryCurrencyDisplay.textContent = `${priceInfo.currencySymbol} ${priceInfo.periodText}`;
  }

  [cpuSlider, ramSlider, storageSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', updateCalculator);
    }
  });

  // Addon Cards Toggles
  document.querySelectorAll('.addon-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-addon');
      state.customPlan[key] = !state.customPlan[key];
      card.classList.toggle('selected', state.customPlan[key]);
      updateCalculator();
    });
  });

  const btnDeployCustom = document.getElementById('btnDeployCustom');
  if (btnDeployCustom) {
    btnDeployCustom.addEventListener('click', () => {
      const cpu = cpuSlider.value;
      const ram = ramSlider.value;
      const storage = storageSlider.value;
      const customName = `Custom Cloud Plan (${cpu}C / ${ram}GB / ${storage}GB)`;
      const rawPrice = calculateCustomPrice();
      openDeployModal(customName, rawPrice);
    });
  }


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

  // --- Quick Terminal Copy in Hero ---
  const heroCopyBtn = document.getElementById('heroCopyBtn');
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener('click', () => {
      const cmd = document.getElementById('heroTerminalCmd')?.innerText;
      if (navigator.clipboard && cmd) {
        navigator.clipboard.writeText(cmd).then(() => {
          showToast('تم نسخ أمر التجهيز السريع!');
        });
      }
    });
  }

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

  // --- Apple Living Hardware Telemetry Oscillations ---
  const cpuLoadVal = document.querySelector('.metric-gauge-group:nth-child(1) .metric-gauge-header .ltr-force');
  const cpuFill = document.querySelector('.metric-gauge-group:nth-child(1) .metric-gauge-fill');
  const ramVal = document.querySelector('.metric-gauge-group:nth-child(2) .metric-gauge-header .ltr-force');
  const ramFill = document.querySelector('.metric-gauge-group:nth-child(2) .metric-gauge-fill');
  const webhookVal = document.querySelector('.mini-telemetry-item:nth-child(2) .value');
  const latencyVal = document.querySelector('.mini-telemetry-item:nth-child(1) .value');

  setInterval(() => {
    if (!cpuLoadVal || !cpuFill) return;
    const cpuRandom = Math.floor(Math.random() * 8) + 28; // 28% to 35%
    cpuLoadVal.textContent = `${cpuRandom}% / 4.2 GHz`;
    cpuFill.style.width = `${cpuRandom}%`;

    if (ramVal && ramFill) {
      const ramUsed = (3.2 + Math.random() * 0.4).toFixed(1);
      const ramPct = Math.round((ramUsed / 8.0) * 100);
      ramVal.textContent = `${ramUsed} GB / 8.0 GB (${ramPct}%)`;
      ramFill.style.width = `${ramPct}%`;
    }

    if (webhookVal) {
      const hooks = Math.floor(Math.random() * 16) + 142;
      webhookVal.textContent = `${hooks} req/s`;
    }

    if (latencyVal) {
      const lat = (7.8 + Math.random() * 0.7).toFixed(1);
      latencyVal.textContent = `${lat} ms`;
    }
  }, 3200);

  // --- Apple Card Specular Coordinates ---
  const interactiveCards = document.querySelectorAll('.pricing-card, .kpi-card, .template-card, .telemetry-preview-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- Hero Showcase View Switcher (Apple Tabs) ---
  const tabBtn3D = document.getElementById('tabBtn3D');
  const tabBtnTelemetry = document.getElementById('tabBtnTelemetry');
  const view3dContainer = document.getElementById('view3dContainer');
  const viewTelemetryContainer = document.getElementById('viewTelemetryContainer');

  function switchHeroView(view) {
    if (view === '3d') {
      tabBtn3D?.classList.add('active');
      tabBtnTelemetry?.classList.remove('active');
      view3dContainer?.classList.add('active');
      viewTelemetryContainer?.classList.remove('active');
      if (window.egyhostThreeResize) {
        setTimeout(window.egyhostThreeResize, 40);
      }
    } else {
      tabBtn3D?.classList.remove('active');
      tabBtnTelemetry?.classList.add('active');
      view3dContainer?.classList.remove('active');
      viewTelemetryContainer?.classList.add('active');
    }
  }

  tabBtn3D?.addEventListener('click', () => switchHeroView('3d'));
  tabBtnTelemetry?.addEventListener('click', () => switchHeroView('telemetry'));

  // --- Three.js Interactive 3D Cloud Cluster Engine ---
  function initThreeJsCluster() {
    const canvas = document.getElementById('egyhostThreeCanvas');
    const wrapper = document.getElementById('threeCanvasWrapper');
    if (!canvas || !wrapper || typeof window.THREE === 'undefined') {
      return;
    }

    const THREE = window.THREE;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, wrapper.clientWidth / wrapper.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 7.6);

    // Lighting (Apple Keynote Holographic Ambiance)
    const ambientLight = new THREE.AmbientLight(0x0a2240, 1.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d8ff, 2.8);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight(0x00f0ff, 3.2, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Main Cluster Group
    const clusterGroup = new THREE.Group();
    clusterGroup.rotation.x = 0.28;
    clusterGroup.rotation.y = 0.55;
    scene.add(clusterGroup);

    // 1. Central Server Frame (Liquid Navy Gloss Cube)
    const coreGeo = new THREE.BoxGeometry(2.3, 2.3, 2.3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x051329,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.88
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    clusterGroup.add(coreMesh);

    // Cyan Glowing Wireframe Edges
    const edgesGeo = new THREE.EdgesGeometry(coreGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: 0.95
    });
    const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
    clusterGroup.add(wireframe);

    // 2. Internal Quantum Nucleus (Emissive Octahedron)
    const nucleusGeo = new THREE.OctahedronGeometry(0.85, 0);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0099cc,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.85
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    clusterGroup.add(nucleusMesh);

    // 3. Gyroscopic Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.035, 16, 90);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00d8ff,
      emissive: 0x007799,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    clusterGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.7, 0.028, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    clusterGroup.add(ring2);

    // 4. Orbiting Cluster Node Satellites (n8n Webhook Orbits)
    const satellites = [];
    const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00d8ff,
      emissiveIntensity: 1.1
    });
    for (let i = 0; i < 4; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      clusterGroup.add(sat);
      satellites.push({
        mesh: sat,
        orbitRadius: 2.1 + (i % 2) * 0.6,
        speed: 0.9 + i * 0.35,
        offset: (i * Math.PI) / 2
      });
    }

    // 5. Constellation Data Particles
    const particleCount = 360;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.055,
      transparent: true,
      opacity: 0.82
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    clusterGroup.add(particleSystem);

    // 6. Holographic Floor Grid
    const gridHelper = new THREE.GridHelper(8, 16, 0x00d8ff, 0x0d284a);
    gridHelper.position.y = -2.2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.32;
    clusterGroup.add(gridHelper);

    // Interaction & Animation State
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let targetRotationX = 0.28;
    let targetRotationY = 0.55;
    let autoRotate = true;
    let burstActive = false;
    let burstProgress = 0;

    // Pointer Handlers (Mouse & Touch)
    function onPointerDown(e) {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      prevMousePos = { x: clientX, y: clientY };
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMousePos.x;
      const deltaY = clientY - prevMousePos.y;

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.007;

      // Clamp vertical rotation so scene doesn't flip
      targetRotationX = Math.max(-0.85, Math.min(0.85, targetRotationX));
      prevMousePos = { x: clientX, y: clientY };
    }

    function onPointerUp() {
      isDragging = false;
    }

    wrapper.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    wrapper.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Trigger Data Burst on Canvas Click
    function triggerBurst() {
      burstActive = true;
      burstProgress = 0;
      showToast('⚡ تم إرسال نبض بيانات للأتمتة عبر Three.js');
    }

    wrapper.addEventListener('click', (e) => {
      // If clicking directly on wrapper without big drag
      if (!isDragging) {
        triggerBurst();
      }
    });

    // Interactive Control Buttons
    const btnRotate = document.getElementById('btnThreeRotate');
    const btnBurst = document.getElementById('btnThreeBurst');
    const btnReset = document.getElementById('btnThreeReset');

    btnRotate?.addEventListener('click', (e) => {
      e.stopPropagation();
      autoRotate = !autoRotate;
      btnRotate.classList.toggle('active', autoRotate);
      showToast(autoRotate ? 'تم تفعيل التدوير التلقائي' : 'تم إيقاف التدوير التلقائي');
    });

    btnBurst?.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerBurst();
    });

    btnReset?.addEventListener('click', (e) => {
      e.stopPropagation();
      targetRotationX = 0.28;
      targetRotationY = 0.55;
      showToast('تمت إعادة زاوية الرؤية للوضع الافتراضي');
    });

    // Window Resize Handler
    function handleResize() {
      if (!wrapper || !renderer || !camera) return;
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);
    window.egyhostThreeResize = handleResize;

    // Render Animation Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Auto rotation
      if (autoRotate && !isDragging) {
        targetRotationY += 0.005;
      }

      // Smooth Apple spring physics lerp
      clusterGroup.rotation.y += (targetRotationY - clusterGroup.rotation.y) * 0.08;
      clusterGroup.rotation.x += (targetRotationX - clusterGroup.rotation.x) * 0.08;

      // Internal nucleus counter rotation
      nucleusMesh.rotation.y -= 0.015;
      nucleusMesh.rotation.x += 0.01;

      // Gyroscopic rings rotation
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;

      // Orbit satellites
      satellites.forEach(sat => {
        const angle = time * sat.speed + sat.offset;
        sat.mesh.position.x = Math.cos(angle) * sat.orbitRadius;
        sat.mesh.position.z = Math.sin(angle) * sat.orbitRadius;
        sat.mesh.position.y = Math.sin(angle * 2) * 0.35;
      });

      // Interactive burst animation
      if (burstActive) {
        burstProgress += delta * 2.2;
        const pulse = Math.sin(burstProgress * Math.PI);
        if (burstProgress >= 1.0) {
          burstActive = false;
          burstProgress = 0;
          nucleusMat.emissiveIntensity = 0.9;
          coreMesh.scale.set(1, 1, 1);
          ring1.scale.set(1, 1, 1);
        } else {
          nucleusMat.emissiveIntensity = 0.9 + pulse * 2.0;
          const s = 1.0 + pulse * 0.12;
          coreMesh.scale.set(s, s, s);
          ring1.scale.set(1 + pulse * 0.18, 1 + pulse * 0.18, 1 + pulse * 0.18);
        }
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  // Initialize Three.js Cluster
  initThreeJsCluster();

  // Initial runs
  renderPricingCards();
  updateCalculator();
});
