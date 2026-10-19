# EGYHOST — الدليل الشامل لمعمارية الباك إند وقاعدة البيانات
## Backend Architecture Blueprint (PHP 8.2+ & MySQL 8.0)
**نظام التصميم والبنية:** Cloud Core Precision  
**المنصة:** EGYHOST (Cloud VPS & Managed n8n Automation Infrastructure)  
**التقنيات الأساسية:** PHP 8.2+ | MySQL 8.0 / MariaDB 10.4+ | Docker Engine API | Nginx / Traefik  

---

> **ملاحظة توجيهية:** تم إعداد هذا الملف كمرجع معماري وتخطيطي شامل لتنفيذ الباك إند مستقبلاً، حيث يقتصر المستودع الحالي على واجهة المستخدم (الفرونت إند) المكتملة بنسبة 100%.

---

## 📌 1. المعمارية العامة للباك إند (System Architecture Overview)

يعتمد الباك إند المقترح لـ **EGYHOST** على بنية خدماتية مفصولة تعتمد على واجهات البرمجة (**Decoupled RESTful API Architecture**)، بحيث يتواصل الفرونت إند عبر طلبات `Fetch / JSON` مع خادم الـ PHP، وتُحفظ كافة العمليات في قاعدة بيانات **MySQL** عالية الأداء، بينما يتولى خادم الـ PHP إصدار أوامر التجهيز الآلي للسيرفرات وحاويات **n8n** عبر **Docker Engine API** وبروتوكول **SSH**.

```
┌────────────────────────────────────────────────────────┐
│           واجهة المستخدم الحالية (Frontend Client)       │
│  - حاسبة الموارد المخصصة - محاكي خط التجهيز الآلي       │
│  - استعراض باقات n8n والـ VPS - بوابات الدفع المحلية    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST API (JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│             بوابة الـ API وخادم الويب (Nginx / Apache)  │
│  - توجيه المسارات - ضغط Gzip/Brotli - شهادات SSL        │
│  - حماية من هجمات حجب الخدمة ومعدل الطلبات (Rate Limit)│
└───────────────────────────┬────────────────────────────┘
                            │ FastCGI
                            ▼
┌────────────────────────────────────────────────────────┐
│           خادم الباك إند الرئيسي (PHP 8.2+ Core)        │
│  ├── Controllers: معالجة الطلبات، الحسابات، التحقق      │
│  ├── Services: محرك التجهيز الآلي، بوابات الدفع         │
│  └── Config & DB: اتصال PDO آمن مع MySQL بنظام Pooling │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
   SQL Queries│ (PDO Prepared Statements)  │ Docker Socket / cURL
              ▼                            ▼
┌───────────────────────────┐  ┌─────────────────────────────┐
│  قاعدة البيانات (MySQL)   │  │    بيئة السيرفرات السحابية   │
│  (egyhost_db - MariaDB)   │  │   (Hypervisors & Docker)    │
│  - Users, Orders, Servers │  │   - n8n Enterprise Daemons  │
│  - Plans, Transactions    │  │   - Isolated Linux Cgroups  │
│  - Telemetry Logs Cache   │  │   - PostgreSQL 16 & Redis   │
└───────────────────────────┘  └─────────────────────────────┘
```

---

## 🗄️ 2. مخطط وتصميم قاعدة البيانات بالكامل (MySQL / MariaDB Schema)

تستخدم المنصة قاعدة بيانات **MySQL 8.0** أو **MariaDB 10.4+** (المتوافقة كلياً مع بيئة **XAMPP** وسيرفرات لينكس الإنتاجية) مع محرك **InnoDB** لدعم المعاملات البنكية المحمية (**ACID Compliant Transactions**) وترميز **`utf8mb4_unicode_ci`** لدعم النصوص العربية والرموز بشكل مثالي.

### كود إنشاء الجداول (DDL SQL Script):

```sql
CREATE DATABASE IF NOT EXISTS `egyhost_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `egyhost_db`;

-- 1. جدول المستخدمين والعملاء (Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone_number` VARCHAR(30) NOT NULL, -- رقم الهاتف المصري (+2010...)
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('CLIENT', 'ADMIN', 'SUPPORT') NOT NULL DEFAULT 'CLIENT',
  `status` ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_phone` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. جدول الخطط والباقات السحابية (Plans)
CREATE TABLE IF NOT EXISTS `plans` (
  `id` VARCHAR(50) PRIMARY KEY, -- مثال: 'n8n-starter', 'n8n-pro', 'vps-2'
  `category` ENUM('n8n', 'vps') NOT NULL,
  `name_ar` VARCHAR(100) NOT NULL,
  `name_en` VARCHAR(100) NOT NULL,
  `description_ar` TEXT,
  `cpu_cores` INT UNSIGNED NOT NULL,
  `ram_gb` INT UNSIGNED NOT NULL,
  `storage_gb` INT UNSIGNED NOT NULL,
  `bandwidth_tb` INT UNSIGNED NOT NULL DEFAULT 4,
  `price_egp_monthly` DECIMAL(10,2) NOT NULL,
  `price_usd_monthly` DECIMAL(10,2) NOT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. جدول السيرفرات السحابية وحاويات n8n (Servers / Instances)
CREATE TABLE IF NOT EXISTS `servers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED NOT NULL,
  `plan_id` VARCHAR(50) DEFAULT NULL,
  `server_type` ENUM('MANAGED_N8N', 'RAW_VPS', 'CUSTOM_CLOUD') NOT NULL,
  `hostname` VARCHAR(255) NOT NULL,
  `datacenter_region` VARCHAR(50) NOT NULL DEFAULT 'cairo-eg1',
  `assigned_ipv4` VARCHAR(45) DEFAULT NULL UNIQUE,
  `assigned_ipv6` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('PROVISIONING', 'ACTIVE', 'STOPPED', 'SUSPENDED', 'TERMINATED') NOT NULL DEFAULT 'PROVISIONING',
  `ssh_port` INT UNSIGNED NOT NULL DEFAULT 22,
  `root_password_encrypted` TEXT,
  `n8n_subdomain` VARCHAR(255) DEFAULT NULL,
  `n8n_version` VARCHAR(30) DEFAULT '1.65.2',
  `docker_container_id` VARCHAR(128) DEFAULT NULL,
  `is_redis_queue_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NOT NULL,
  INDEX `idx_user_servers` (`user_id`),
  INDEX `idx_server_status` (`status`),
  CONSTRAINT `fk_servers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_servers_plan` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. جدول الطلبات (Orders)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED NOT NULL,
  `server_id` INT UNSIGNED DEFAULT NULL,
  `plan_id` VARCHAR(50) DEFAULT NULL,
  `billing_cycle` ENUM('monthly', 'annual') NOT NULL DEFAULT 'monthly',
  `total_amount` DECIMAL(10,2) NOT NULL,
  `currency` ENUM('EGP', 'USD') NOT NULL DEFAULT 'EGP',
  `payment_method` ENUM('INSTAPAY', 'VODAFONE_CASH', 'FAWRY', 'CARD', 'CRYPTO') NOT NULL,
  `status` ENUM('PENDING_PAYMENT', 'PROCESSING', 'PAID', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  `reference_code` VARCHAR(100) NOT NULL UNIQUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  INDEX `idx_user_orders` (`user_id`),
  INDEX `idx_order_ref` (`reference_code`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orders_server` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. جدول المعاملات وتأكيد الدفع (Transactions)
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` ENUM('EGP', 'USD') NOT NULL DEFAULT 'EGP',
  `payment_method` VARCHAR(50) NOT NULL,
  `sender_identifier` VARCHAR(100) DEFAULT NULL, -- رقم فودافون كاش أو عنوان إنستاباي IPA
  `external_transaction_id` VARCHAR(150) DEFAULT NULL,
  `receipt_attachment_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `verified_by_user_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_at` TIMESTAMP NULL DEFAULT NULL,
  INDEX `idx_order_txn` (`order_id`),
  CONSTRAINT `fk_txn_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. جدول مقاييس التيليميتري الحية (Telemetry Metrics)
CREATE TABLE IF NOT EXISTS `telemetry_metrics` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `server_id` INT UNSIGNED NOT NULL,
  `cpu_usage_pct` DECIMAL(5,2) NOT NULL,
  `ram_usage_pct` DECIMAL(5,2) NOT NULL,
  `disk_usage_pct` DECIMAL(5,2) NOT NULL,
  `webhooks_per_sec` INT UNSIGNED NOT NULL DEFAULT 0,
  `ping_latency_ms` DECIMAL(6,2) NOT NULL DEFAULT 8.00,
  `recorded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_server_metrics` (`server_id`, `recorded_at` DESC),
  CONSTRAINT `fk_metrics_server` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📁 3. الهيكل المقترح لمجلدات الباك إند بـ PHP (Future Directory Layout)

عند البدء في بناء كود الباك إند مستقبلاً، يُوصى بهذا الهيكل النظيف والمنظم:

```text
c:\xampp\htdocs\host\
├── (ملفات الفرونت إند الحالية: index.html, about.html, privacy.html, css/, js/, assets/)
│
└── backend/                       # مجلد الباك إند المستقبلي
    ├── config/
    │   ├── Database.php           # فئة الاتصال بقاعدة بيانات MySQL عبر PDO
    │   └── app.php                # إعدادات النظام، العملات، ومفاتيح التشفير
    ├── controllers/
    │   ├── PlanController.php     # التحكم في جلب الباقات وحساب الأسعار
    │   ├── OrderController.php    # إنشاء الطلبات وربط وسائل الدفع
    │   ├── ServerController.php   # التحكم في السيرفرات (تشغيل، إيقاف، إعادة بناء)
    │   └── TelemetryController.php# تجميع وبث مقاييس الأداء للفرونت إند
    ├── services/
    │   ├── DockerService.php      # التواصل مع Docker Engine API عبر PHP cURL
    │   ├── PaymentService.php     # التحقق من مدفوعات فودافون كاش وإنستاباي
    │   └── NotificationService.php# إرسال رسائل التفعيل عبر الإيميل وواتساب
    ├── cron/
    │   ├── check_expirations.php  # فحص انتهاء الاشتراكات وتنبيه العملاء
    │   └── collect_telemetry.php  # سحب استهلاك المعالج والرام دورياً
    └── api/
        ├── plans.php              # نقطة النهاية: GET /backend/api/plans.php
        ├── checkout.php           # نقطة النهاية: POST /backend/api/checkout.php
        ├── verify_payment.php     # نقطة النهاية: POST /backend/api/verify_payment.php
        ├── server_action.php      # نقطة النهاية: POST /backend/api/server_action.php
        └── telemetry.php          # نقطة النهاية: GET /backend/api/telemetry.php
```

---

## ⚡ 4. دورة حياة تجهيز سيرفر n8n آلياً بـ PHP (Provisioning Workflow)

تتم عملية إطلاق وتجهيز سيرفر n8n للعميل من خلال كود PHP عبر 5 مراحل متتالية:

### المرحلة 1: استقبال الطلب وإنشاء السجل في MySQL
- يستقبل ملف `checkout.php` بيانات العميل (النطاق، الباقة المختارة، وسيلة الدفع).
- يتم إنشاء أمر الطلب بحالة `PENDING_PAYMENT` مع توليد كود مرجعي فريد (مثال: `EGY-884920`).

### المرحلة 2: تأكيد الدفع المحلي (InstaPay / Vodafone Cash)
- العميل يدفع عبر إنستاباي أو محفظة فودافون كاش ويرسل رقم العملية أو إشعار التحويل.
- بمجرد التأكيد، يقوم `PaymentService.php` بتحديث حالة الطلب إلى `PAID`، ويبدأ تشغيل خدمة التجهيز `DockerService::provisionServer()`.

### المرحلة 3: التجهيز الآلي عبر Docker Engine API بـ PHP
يتواصل PHP مباشرة مع مقبس Docker الداخلي (`/var/run/docker.sock` أو عبر HTTP REST API لمنفذ `2375`) لتنفيذ الأوامر التالية بدون تدخل بشري:
1. **عزل المستخدم ومجلد العمل:**
   ```php
   $instancePath = "/var/lib/egyhost/instances/{$serverId}";
   mkdir($instancePath, 0755, true);
   ```
2. **إنشاء قاعدة بيانات PostgreSQL مستقلة للحاوية:**
   يقوم PHP بإنشاء قاعدة بيانات مخصصة `n8n_{id}` ومستخدم مشفر لكتابة وحفظ سجلات الـ Executions.
3. **تشغيل حاوية n8n الرسمية مع دعم Redis Queue:**
   يرسل PHP طلب `POST` إلى نقطة نهاية داکر `/containers/create` بالمتغيرات البيئية:
   ```json
   {
     "Image": "docker.n8n.io/n8nio/n8n:latest",
     "Env": [
       "N8N_HOST=automation.domain.com",
       "WEBHOOK_URL=https://automation.domain.com/",
       "DB_TYPE=postgresdb",
       "EXECUTIONS_MODE=queue",
       "N8N_ENCRYPTION_KEY=sec_live_9942a7b8e"
     ]
   }
   ```
4. **توجيه البروكسي العكسي وإصدار SSL التلقائي:**
   - حقن اسم النطاق في إعدادات Traefik أو Nginx.
   - طلب شهادة TLS v1.3 مجانية من Let's Encrypt عبر بروتوكول ACME.

### المرحلة 4: توليد وحفظ بيانات الدخول وتنبيه العميل
- حفظ عنوان الـ IP المخصص وبيانات الـ Root مشفرة في جدول `servers`.
- إرسال بريد إلكتروني ورسالة واتساب للعميل تتضمن:
  - رابط لوحة n8n: `https://automation.domain.com/`
  - بيانات الـ SSH وسيرفر الـ VPS.

---

## 💳 5. آلية التكامل مع بوابات الدفع المصرية في PHP

### أ. إنستاباي اللحظي (InstaPay):
1. يولد PHP عنوان الدفع اللحظي (`egyhost@instapay`) وكود المرجع (`EGY-XXXXXX`).
2. العميل يقوم بالتحويل اللحظي ويكتب الكود المرجعي في خانة الملاحظات داخل تطبيق InstaPay.
3. يقوم النظام بمطابقة إشعار التحويل وتفعيل السيرفر خلال ثوانٍ.

### ب. فودافون كاش (Vodafone Cash):
1. يزود PHP العميل برقم المحفظة المعتمد للشركة.
2. يدخل العميل رقم المحفظة التي حول منها لتأكيد الإيداع في جدول `transactions`.

### ج. فوري (Fawry Pay):
1. تكامل عبر Fawry Server API لإنشاء كود دفع برقم مرجعي ينتهي خلال 24 ساعة.
2. استقبال Webhook من فوري عند سداد العميل في أي ماكينة لتغيير حالة السيرفر فورياً إلى `ACTIVE`.

---

## 📡 6. مواصفات واجهات البرمجة (RESTful API Endpoints Spec)

### 1. جلب الخطط والأسعار
- **المسار:** `GET /backend/api/plans.php`
- **الاستجابة:**
```json
{
  "success": true,
  "exchange_rate": 48.50,
  "plans": {
    "n8n": [
      {
        "id": "n8n-pro",
        "name_ar": "n8n Pro Business",
        "cpu_cores": 4,
        "ram_gb": 8,
        "storage_gb": 100,
        "price_egp": 750.00,
        "price_usd": 15.50,
        "featured": true
      }
    ]
  }
}
```

---

### 2. إتمام الطلب وتوليد كود الدفع
- **المسار:** `POST /backend/api/checkout.php`
- **الحمولة المرسلة من الفرونت إند:**
```json
{
  "plan_id": "n8n-pro",
  "hostname": "automation-cluster.mycompany.com",
  "datacenter": "cairo-eg1",
  "payment_method": "INSTAPAY",
  "billing_cycle": "monthly"
}
```
- **استجابة الباك إند:**
```json
{
  "success": true,
  "order_number": "ORD-77A91B",
  "reference_code": "EGY-994218",
  "total_amount_egp": 750.00,
  "payment_details": {
    "method": "InstaPay",
    "ipa": "egyhost@instapay",
    "account_name": "EGYHOST Cloud Services"
  }
}
```

---

### 3. سحب مقاييس الأداء الحية (Live Telemetry)
- **المسار:** `GET /backend/api/telemetry.php?server_id=1`
- **الاستجابة:**
```json
{
  "success": true,
  "metrics": {
    "cpu_load_pct": 32.4,
    "ram_used_gb": 3.4,
    "ram_total_gb": 8.0,
    "storage_used_gb": 18.5,
    "webhooks_per_sec": 148,
    "ping_cairo_ms": 8.2
  }
}
```

---

## 🔒 7. أفضل ممارسات الأمان والحماية في PHP & MySQL

1. **الوقاية التامة من ثغرات حقن الاستعلامات (SQL Injection):**
   - استخدام استعلامات **PDO Prepared Statements** حصراً مع منع المحاكاة (`PDO::ATTR_EMULATE_PREPARES => false`).
2. **تشفير كلمات المرور:**
   - استخدام دالة `password_hash($password, PASSWORD_ARGON2ID)` أو `PASSWORD_BCRYPT` مع Cost Factor مناسب.
3. **حماية ملفات التكوين والبيئة:**
   - تخزين بيانات الاتصال ومفاتيح تشفير n8n خارج مسار الويب العام (`public_html`) واستدعاؤها عبر متغيرات البيئة `.env`.
4. **حماية الـ REST APIs:**
   - التحقق من ترويسات `CORS` وتقييد المصادر المصرح لها بالاتصال.
   - تطبيق `Rate Limiting` لمنع إغراق الخادم بالطلبات (DDoS mitigation على مستوى التطبيق).
5. **عزل الحاويات المشغلة لـ n8n:**
   - تشغيل حاويات n8n بمستخدم غير جذري (`non-root user`) مع تقييد وصولها إلى ملفات النظام الرئيسية.

---

> هذا الدليل يمثل المرجع الكامل والنهائي لبناء الباك إند بـ **PHP & MySQL** ليتوافق بسلاسة مع الفرونت إند الحالي.
