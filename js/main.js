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

  // --- Component #1: Provisioning Pipeline Steps Simulator ---
  const btnStartSimulation = document.getElementById('btnStartSimulation');
  const pipelineConsole = document.getElementById('pipelineConsole');
  const stepCards = document.querySelectorAll('.pipeline-step-card');
  let simulationRunning = false;

  const simulationLogs = [
    { time: '00:01', msg: '[INFO] Initializing hypervisor allocation on Node-CAI-04...', class: 'log-msg-cyan', stepIndex: 0 },
    { time: '00:03', msg: '[KERNEL] Provisioning isolated Linux cgroup & non-root user (uid=1001)...', class: '', stepIndex: 0 },
    { time: '00:06', msg: '[SUCCESS] Storage volume formatted with XFS filesystem and mounted at /data', class: 'log-msg-success', stepIndex: 0 },
    { time: '00:09', msg: '[DOCKER] Spawning n8n enterprise container daemon (image: n8nio/n8n:1.65.2)...', class: 'log-msg-cyan', stepIndex: 1 },
    { time: '00:13', msg: '[HEALTH] n8n core initialized. Webhook listener active on port :5678', class: 'log-msg-success', stepIndex: 1 },
    { time: '00:16', msg: '[SECURITY] Requesting Let\'s Encrypt wildcard SSL certificate via ACME DNS-01...', class: 'log-msg-cyan', stepIndex: 2 },
    { time: '00:20', msg: '[SSL] TLS v1.3 certificate signed and provisioned for *.egyhost.cloud [A+ Rating]', class: 'log-msg-success', stepIndex: 2 },
    { time: '00:24', msg: '[DATABASE] PostgreSQL 16 cluster attached & Redis 7.2 queue broker primed', class: 'log-msg-cyan', stepIndex: 3 },
    { time: '00:27', msg: '[NETWORK] BGP router routing IP 197.168.42.10 via EG-IX local gateway (<8ms latency)', class: 'log-msg-success', stepIndex: 4 },
    { time: '00:30', msg: '[DONE] Instance ready! URL: https://n8n-instance-382.egyhost.cloud [Ready for Webhooks]', class: 'log-msg-success', stepIndex: 4 }
  ];

  if (btnStartSimulation && pipelineConsole) {
    btnStartSimulation.addEventListener('click', () => {
      if (simulationRunning) return;
      simulationRunning = true;
      btnStartSimulation.disabled = true;
      btnStartSimulation.innerHTML = `<span>جارٍ التجهيز الآلي...</span> <span class="live-pulse-dot"></span>`;
      pipelineConsole.innerHTML = '';

      stepCards.forEach((c) => {
        c.className = 'pipeline-step-card state-pending';
      });

      let currentStep = -1;
      let logIndex = 0;

      const logInterval = setInterval(() => {
        if (logIndex < simulationLogs.length) {
          const item = simulationLogs[logIndex];
          
          const line = document.createElement('div');
          line.className = 'log-line';
          line.innerHTML = `<span class="log-time">${item.time}</span><span class="${item.class}">${item.msg}</span>`;
          pipelineConsole.appendChild(line);
          pipelineConsole.scrollTop = pipelineConsole.scrollHeight;

          if (item.stepIndex !== currentStep) {
            currentStep = item.stepIndex;
            stepCards.forEach((card, idx) => {
              if (idx < currentStep) {
                card.className = 'pipeline-step-card state-done';
              } else if (idx === currentStep) {
                card.className = 'pipeline-step-card state-active';
              } else {
                card.className = 'pipeline-step-card state-pending';
              }
            });
          }

          logIndex++;
        } else {
          clearInterval(logInterval);
          stepCards.forEach(card => card.className = 'pipeline-step-card state-done');
          btnStartSimulation.disabled = false;
          btnStartSimulation.innerHTML = `<span>إعادة تشغيل المحاكاة</span> <span>↻</span>`;
          simulationRunning = false;
          showToast('اكتمل تجهيز السيرفر الفوري بنجاح في أقل من 30 ثانية!');
        }
      }, 700);
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
    '.kpi-card, .pricing-card, .template-card, .pipeline-step-card, .faq-item, .section-head, .calc-card-container, .service-card, .guarantee-banner-box'
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

  // Initial runs
  renderPricingCards();
  updateCalculator();
});
