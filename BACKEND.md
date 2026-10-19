# EGYHOST — توثيق معمارية الباك إند ومحرك التجهيز السحابي
### Backend Architecture & Automated Provisioning Engine Specification
**نظام التصميم:** Cloud Core Precision  
**المنصة:** EGYHOST (Cloud VPS & Managed n8n Automation Infrastructure)

---

## 📌 1. نظرة عامة على النظام (System Overview)

صُممت المنصة وفق معمارية برمجية مفصولة بالكامل (**Decoupled Micro-services / Event-Driven Architecture**)، حيث يتولى الفرونت إند (Frontend Client) التفاعل مع المستخدم وعرض المقاييس التفاعلية والحاسبة، بينما يتولى الباك إند (Backend Core) استقبال الطلبات، إدارة المدفوعات المحلية، والتواصل مع بيئة الخوادم والـ Hypervisors عبر طوابير مهام غير متزامنة (Asynchronous Job Queues).

```
   ┌────────────────────────────────────────────────────────┐
   │            واجهة المستخدم (Frontend UI / Client)        │
   │  (حاسبة الموارد - محاكي التجهيز - عروض n8n و VPS)      │
   └───────────────────────────┬────────────────────────────┘
                               │ HTTPS / REST API / WSS
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             بوابة الخدمات (API Gateway / Nginx)         │
   │   (Rate Limiting - CORS - SSL Termination - Auth)      │
   └───────────────────────────┬────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     خادم الباك إند الرئيسي    │   │      محرك التجهيز الآلي       │
│  (Node.js / Express / Go)     │   │ (Worker Daemon / BullMQ Queue)│
│  - إدارة المستخدمين والخطط     │   │ - حجز الـ IP والموارد         │
│  - بوابات الدفع (InstaPay/VF) │   │ - إنشاء حاويات Docker/n8n     │
│  - واجهات التحكم في السيرفرات │   │ - تهيئة Postgres و SSL        │
└───────────────┬───────────────┘   └───────────────┬───────────────┘
                │                                   │
                ▼                                   ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     قاعدة البيانات الرئيسية    │   │     بيئة الخوادم والعقد       │
│      (PostgreSQL 16)          │   │  (Proxmox VE / Docker Nodes)  │
│ - Users, Orders, Servers, Auth│   │  (Cairo EG-IX / Frankfurt DE) │
└───────────────────────────────┘   └───────────────────────────────┘
```

---

## ⚡ 2. دورة حياة تجهيز سيرفر n8n آلياً (Automated Pipeline Workflow)

عندما يضغط العميل على **"تأكيد وإطلاق السيرفر"** في الفرونت إند، يتم تنفيذ الخطوات البرمجية التالية على الباك إند:

### الخطوة 1: استلام الطلب والتحقق (Order Ingestion)
1. يستقبل الباك إند عبر `POST /api/v1/orders/checkout` حمولة الطلب (Payload):
   - نوع الخطة (مثلاً `n8n-pro` أو مواصفات الـ Custom Calculator).
   - النطاق المطلوب (`Hostname`).
   - مركز البيانات المختار (`Cairo EG-IX` أو `Frankfurt`).
   - وسيلة الدفع (إنستاباي، فودافون كاش، فوري، فيزا).
2. يتم تسجيل الطلب في قاعدة البيانات بالحالة `PENDING_PAYMENT`.

### الخطوة 2: معالجة وتأكيد الدفع (Payment Processing)
- **InstaPay / فودافون كاش:**
  - يتم إنشاء معرف دفع فريد (`reference_code`) وإرساله للعميل.
  - بمجرد استلام التحويل (عبر Webhook بنكي أو التحقق الآلي من رسائل المحفظة أو موافقة الدعم)، تتغير الحالة إلى `PAID`.
- يتم إطلاق حدث (Event): `order.paid` لإدراج مهمة التجهيز في طابور الـ Worker.

### الخطوة 3: التجهيز الآلي للبنية (Automated Infrastructure Provisioning)
يقوم الـ Worker المسؤول عن عقدة التشغيل (Node Agent) بتنفيذ الإجراءات التالية بالتتابع في أقل من 30 ثانية:
1. **حجز الموارد (Resource Isolation):**
   - حجز عنوان IPv4 مخصص ونظيف من مجمع العناوين (IP Pool).
   - إنشاء مستخدم نظام معزول `uid:gid` وضبط حدود cgroups (vCPU Cores & RAM limits).
2. **تهيئة وحدة التخزين (NVMe Storage Provisioning):**
   - تخصيص مجلد التخزين المستقل `/var/lib/egyhost/instances/{instance_id}`.
   - تهيئة نظام الملفات وتطبيق كوتا الحجم (XFS/ZFS Quota).
3. **تشغيل حاوية n8n Enterprise Daemon:**
   - استدعاء Docker Engine API لتشغيل حاوية `docker.n8n.io/n8nio/n8n:latest`.
   - ضبط المتغيرات البيئية الحساسة:
     ```env
     N8N_HOST=automation.domain.com
     WEBHOOK_URL=https://automation.domain.com/
     DB_TYPE=postgresdb
     DB_POSTGRESDB_HOST=postgres-cluster-internal
     EXECUTIONS_MODE=queue
     QUEUE_BULL_REDIS_HOST=redis-broker-internal
     N8N_ENCRYPTION_KEY={SECURE_GENERATED_KEY}
     ```
4. **ربط قاعدة بيانات PostgreSQL 16 و Redis:**
   - إنشاء قاعدة بيانات مستقلة `n8n_{client_id}` ومستخدم ذو صلاحيات محصورة.
   - تفعيل طابور Redis لضمان عدم فقدان أي خطاف ويب (Zero-dropped Webhooks) تحت الضغط العالي.
5. **البروكسي العكسي وإصدار SSL التلقائي:**
   - حقن مسار التوجيه في Traefik أو Nginx Vhost آلياً.
   - طلب شهادة Let's Encrypt TLS v1.3 عبر ACME DNS Challenge وربطها بالدومين.

### الخطوة 4: إرسال بيانات الاعتماد وتفعيل المراقبة
- حفظ بيانات الدخول مشفرة (AES-256-GCM) في جدول السيرفرات.
- إرسال بريد إلكتروني ورسالة واتساب تلقائية تتضمن:
  - عنوان الـ IPv4 المخصص.
  - رابط لوحة تحكم n8n: `https://automation.yourdomain.com/`
  - اسم المستخدم وكلمة مرور الـ Root / Dashboard.
- بدء جمع مقاييس التيليميتري الدورية (CPU, RAM, Disk, Latency).

---

## 🗄️ 3. مخطط قاعدة البيانات (Database Schema - PostgreSQL)

```sql
-- 1. جدول المستخدمين (Users Table)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(30) NOT NULL, -- أرقام مصرية (+2010...)
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CLIENT', -- CLIENT, ADMIN, SUPPORT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول الخطط والباقات (Plans Table)
CREATE TABLE plans (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'n8n-starter', 'n8n-pro', 'vps-2'
    category VARCHAR(20) NOT NULL, -- 'n8n' OR 'vps'
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    cpu_cores INT NOT NULL,
    ram_gb INT NOT NULL,
    storage_gb INT NOT NULL,
    bandwidth_tb INT NOT NULL DEFAULT 4,
    price_egp NUMERIC(10, 2) NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. جدول السيرفرات وحاويات n8n (Servers / Instances Table)
CREATE TABLE servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) REFERENCES plans(id),
    server_type VARCHAR(20) NOT NULL, -- 'MANAGED_N8N', 'RAW_VPS'
    hostname VARCHAR(255) NOT NULL,
    datacenter_region VARCHAR(50) NOT NULL, -- 'cairo-eg1', 'frankfurt-de1'
    assigned_ipv4 INET UNIQUE,
    assigned_ipv6 CIDR,
    status VARCHAR(30) DEFAULT 'PROVISIONING', -- PROVISIONING, ACTIVE, STOPPED, SUSPENDED
    ssh_port INT DEFAULT 22,
    root_password_encrypted TEXT,
    n8n_subdomain VARCHAR(255),
    n8n_version VARCHAR(30) DEFAULT '1.65.2',
    is_redis_queue_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 4. جدول المعاملات والمدفوعات (Transactions & Payments Table)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    server_id UUID REFERENCES servers(id),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL, -- 'EGP', 'USD'
    payment_method VARCHAR(50) NOT NULL, -- 'INSTAPAY', 'VODAFONE_CASH', 'FAWRY', 'CARD'
    reference_code VARCHAR(100) UNIQUE NOT NULL,
    receipt_attachment_url TEXT,
    status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- 5. جدول سجلات التيليميتري والمراقبة (Telemetry Logs Table)
CREATE TABLE telemetry_metrics (
    id BIGSERIAL PRIMARY KEY,
    server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
    cpu_usage_pct NUMERIC(5, 2) NOT NULL,
    ram_usage_pct NUMERIC(5, 2) NOT NULL,
    disk_usage_pct NUMERIC(5, 2) NOT NULL,
    webhooks_per_second INT DEFAULT 0,
    ping_latency_ms NUMERIC(6, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_telemetry_server_time ON telemetry_metrics(server_id, recorded_at DESC);
CREATE INDEX idx_servers_status ON servers(status);
```

---

## 📡 4. مواصفات واجهات البرمجة (RESTful API Specification)

### 1. جلب الخطط والأسعار الحالية
- **Endpoint:** `GET /api/v1/plans`
- **Response:**
```json
{
  "success": true,
  "exchange_rate": { "USD_TO_EGP": 48.50 },
  "categories": {
    "n8n": [
      {
        "id": "n8n-pro",
        "name": "n8n Pro Business",
        "cpu": 4,
        "ram_gb": 8,
        "storage_gb": 100,
        "price_egp_monthly": 750.00,
        "price_usd_monthly": 15.50,
        "redis_queue": true,
        "unlimited_executions": true
      }
    ]
  }
}
```

---

### 2. إنشاء طلب سيرفر جديد (Checkout)
- **Endpoint:** `POST /api/v1/orders/checkout`
- **Request Body:**
```json
{
  "plan_id": "n8n-pro",
  "hostname": "workflows.agency.com",
  "region": "cairo-eg1",
  "billing_cycle": "annual",
  "payment_method": "INSTAPAY",
  "client": {
    "name": "أحمد إبراهيم",
    "email": "ahmed@agency.com",
    "phone": "+201012345678"
  }
}
```
- **Response:**
```json
{
  "success": true,
  "order_id": "ord_88412acb",
  "amount_due": 7200.00,
  "currency": "EGP",
  "payment_instructions": {
    "method": "INSTAPAY",
    "ipa_address": "egyhost@instapay",
    "account_name": "EGYHOST Cloud Services",
    "reference_code": "EGY-99421"
  },
  "status": "AWAITING_PAYMENT"
}
```

---

### 3. تأكيد الدفع وإطلاق السيرفر فورياً
- **Endpoint:** `POST /api/v1/orders/{order_id}/verify-payment`
- **Request Body:**
```json
{
  "reference_code": "EGY-99421",
  "sender_phone_or_ipa": "ahmed@instapay",
  "transaction_id": "TXN_7749102"
}
```
- **Response:**
```json
{
  "success": true,
  "status": "PROVISIONING_STARTED",
  "estimated_time_seconds": 30,
  "stream_url": "/api/v1/servers/instance_38291/stream-logs"
}
```

---

### 4. التحكم في دورة حياة السيرفر (Server Lifecycle Management)
- `POST /api/v1/servers/{server_id}/action`
  - Actions: `start`, `stop`, `restart`, `rebuild`, `create_snapshot`.
- `GET /api/v1/servers/{server_id}/telemetry`
  - إرجاع إحصائيات المعالج، الرام، وحالة n8n الحية كل 5 ثوانٍ.

---

## 🔒 5. الأمان والعزل في بيئة الإنتاج (Production Security & Isolation)

1. **شبكة معزولة لكل عميل (Isolated Docker Bridge Network):**
   - كل حاوية n8n وقاعدة بيانات Postgres تعمل داخل Docker Network معزولة تماماً لا تستطيع الوصول للحاويات المجاورة (`icc=false`).
2. **الحماية ضد هجمات حجب الخدمة (1.2 Tbps DDoS Shield):**
   - تمرير حركة مرور منفذ 80 و 443 عبر شبكة تصفية وتوزيع BGP Anycast في القاهرة وفرانكفورت.
3. **جدار حماية UFW مسبق التكوين:**
   - قفل منافذ قواعد البيانات الداخلية (5432, 6379) والسماح بالوصول إليها فقط محلياً (`127.0.0.1`).
   - حماية منفذ SSH (تغيير المنفذ الافتراضي، إغلاق تسجيل الدخول بكلمة سر وتفعيل الـ Keys + Fail2ban لحظر أي تخمين بعد 3 محاولات).
4. **تشفير المفاتيح والتكوينات:**
   - استخدام `N8N_ENCRYPTION_KEY` عشوائي 256-bit لكل عميل لحماية بيانات الـ Credentials والـ API Keys المحفوظة في السيناريوهات.

---

## 🛠️ 6. مقترح حزمة التقنيات للباك إند (Recommended Tech Stack)

| المكون | التقنية الموصى بها | السبب والمبرر التقني |
| :--- | :--- | :--- |
| **لغة الباك إند** | **Node.js (TypeScript) أو Go** | أداء استثنائي في التعامل مع طلبات الـ I/O المكثفة والـ Webhooks والـ WebSockets |
| **إطار العمل** | **Express.js / Fastify أو Go Fiber** | سرعة، خفة استهلاك الذاكرة، وسهولة التوثيق |
| **قاعدة البيانات** | **PostgreSQL 16** | قوة الفهرسة، أمان المعاملات المالية (ACID)، ودعم JSONB |
| **طابور المهام (Queue)** | **BullMQ + Redis 7.2** | إدارة عمليات التجهيز غير المتزامنة ومراقبة حالة كل سيرفر |
| **إدارة الحاويات** | **Docker Engine API + Traefik v3** | مرونة وسرعة نشر الحاويات مع شهادات SSL آلية بدون توقف |
| **مراقبة العتاد** | **Prometheus + Node Exporter** | جمع إحصائيات المعالجات والرام والشبكة وبثها للفرونت إند |

---

> تم إعداد هذا التوثيق ليتكامل 100% مع واجهة الفرونت إند الحالية المبنية وفق نظام **Cloud Core Precision**.
