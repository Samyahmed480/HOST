# EGYHOST — سحابة سيرفرات VPS واستضافة n8n للأتمتة والذكاء الاصطناعي
### High-Performance Cloud VPS & Managed n8n Automation Hosting Platform

![EGYHOST Logo](assets/logo.jpg)

منصة سحابية متطورة مصممة وفق نظام التصميم **Cloud Core Precision**، متخصصة في بيع وتجهيز سيرفرات الـ VPS عالية الأداء واستضافة بيئات أتمتة **n8n** بدون قيود على عدد التشغيلات، مع دعم كامل لوسائل الدفع المحلية في مصر (إنستاباي، فودافون كاش، فوري).

---

## ⚡ مميزات الفرونت إند (Frontend Features)

- **نظام التصميم Cloud Core Precision**: واجهة هندسية فائقة الدقة بتدرجات الكحلي المؤسسي (`#00173e`) والسايان الكهربائي (`#00D8FF`) والأسطح الجليدية الباردة (`#F8FAFC`).
- **محاكي خط التجهيز الآلي (Provisioning Pipeline Simulator)**: محاكاة تفاعلية بـ 5 مراحل لعزل الموارد، تشغيل حاويات n8n، ضبط Reverse Proxy، إصدار SSL التلقائي، وربط قواعد البيانات مع بث مباشر لمخرجات الـ Terminal.
- **حاسبة الموارد المخصصة (Custom Plan Builder)**: أشرطة سحب وتمرير ديناميكية لحساب المعالج (vCPU)، الذاكرة (RAM)، وتخزين (NVMe Gen4) مع تحويل فوري بين الجنيه المصري (EGP) والدولار (USD).
- **جدول مواصفات الحزمة البرمجية (Server Stack Table)**: استعراض تفصيلي لإصدارات Ubuntu 24.04 LTS، n8n v1.65+، Docker 27.2، PostgreSQL 16، و Redis 7.2.
- **الطرفية التفاعلية (Interactive Code Terminal)**: قوالب جاهزة للنسخ بنقرة واحدة لملف `docker-compose.yml`، أوامر فحص الأداء `YABS`، واختبارات الـ `cURL Webhook`.
- **اختبار سرعة مراكز البيانات (Live Ping Latency Test)**: فحص حي لزمن الاستجابة لمراكز بيانات القاهرة (EG-IX < 8ms)، فرانكفورت، أمستردام، ودبي.
- **نموذج الإطلاق الفوري (Instant Deployment Modal)**: مسار حجز تفاعلي يحاكي نشر السيرفر وتوليد عنوان الـ IP ورابط لوحة n8n وبيانات الـ Root في ثوانٍ.

---

## 🏗️ معمارية الباك إند (Backend Architecture)

تم توثيق كافة تفاصيل المعمارية الخلفية، محرك التجهيز الآلي، مخطط قاعدة بيانات PostgreSQL، مواصفات الـ REST APIs، وطرق تكامل الدفع المصري في ملف مخصص:

📖 **[اضغط هنا لقراءة توثيق الباك إند الكامل (BACKEND.md)](BACKEND.md)**

---

## 📂 هيكل المشروع (Project Structure)

```text
├── assets/
│   ├── logo.jpg          # شعار EGYHOST الأصلي
│   ├── logo.svg          # نسخة الشعار المتجهة عالية الدقة (Vector SVG)
│   └── favicon.svg       # أيقونة التبويب في المتصفح
├── css/
│   ├── variables.css     # متغيرات الألوان والتيبوغرافيا لنظام Cloud Core Precision
│   └── style.css         # التنسيقات الكاملة والتجاوب لكافة الشاشات (RTL-First)
├── js/
│   └── main.js           # منطق التفاعل، الحاسبة، المحاكي، والتحويل بين العملات
├── index.html            # الصفحة الرئيسية للمنصة
├── index.php             # جسر تشغيل PHP لخوادم XAMPP Apache
├── BACKEND.md            # التوثيق الشامل لمعمارية الباك إند
└── README.md             # دليل المشروع والتشغيل
```

---

## 🚀 تشغيل المشروع محلياً

المشروع مبني كفرونت إند فائق السرعة وخفيف الوزن بدون حاجة لأي خطوات بناء معقدة (Zero-Build Vanilla Stack):

1. **عبر XAMPP Apache:**
   - ضع المجلد داخل `c:/xampp/htdocs/host`
   - شغل Apache وتوجه إلى: `http://localhost/host/`

2. **عبر أي خادم محلي (مثلاً Python):**
   ```bash
   python -m http.server 8080
   ```
   ثم افتح المتصفح على: `http://localhost:8080/`

---

© 2026 EGYHOST Cloud Technologies. جميع الحقوق محفوظة.
