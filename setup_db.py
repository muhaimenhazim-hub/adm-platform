"""
اسکریپت راه‌اندازی خودکار دیتابیس ابری Aiven برای پلتفرم ADM
شامل: ۱۰ جدول، ۳ پروسیجر مالی، ۵ تریگر هوشمند و داده‌های اولیه
"""
import pymysql
from config import DB_CONFIG

def setup_database():
    print("⏳ در حال برقراری ارتباط امن SSL با سرور دیتابیس Aiven...")
    conn = pymysql.connect(**DB_CONFIG, autocommit=True)
    cursor = conn.cursor()
    print("✅ اتصال امن به سرور ابری با موفقیت برقرار شد!")

    # ۱. ساخت ۱۰ جدول اصلی
    tables = [
        """
        CREATE TABLE IF NOT EXISTS `users` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `uid` varchar(20) NOT NULL,
          `username` varchar(100) NOT NULL,
          `email` varchar(150) NOT NULL,
          `phone` varchar(35) DEFAULT NULL,
          `password_hash` varchar(255) NOT NULL,
          `role` enum('user','admin') DEFAULT 'user',
          `avatar_url` varchar(255) DEFAULT '/assets/avatars/default.png',
          `referred_by` varchar(50) DEFAULT NULL,
          `referral_code` varchar(30) NOT NULL,
          `kyc_status` enum('unverified','pending','verified','rejected') DEFAULT 'unverified',
          `two_fa_enabled` tinyint(1) DEFAULT 0,
          `two_fa_secret` varchar(100) DEFAULT NULL,
          `status` enum('active','suspended','banned') DEFAULT 'active',
          `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
          `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_uid` (`uid`),
          UNIQUE KEY `uq_username` (`username`),
          UNIQUE KEY `uq_email` (`email`),
          UNIQUE KEY `uq_referral_code` (`referral_code`),
          KEY `idx_referred_by` (`referred_by`),
          KEY `idx_kyc_status` (`kyc_status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `user_balances` (
          `user_id` bigint(20) UNSIGNED NOT NULL,
          `active_capital` decimal(18,4) DEFAULT 0.0000,
          `locked_principal` decimal(18,4) DEFAULT 0.0000,
          `unlocked_principal` decimal(18,4) DEFAULT 0.0000,
          `withdrawable_profit` decimal(18,4) DEFAULT 0.0000,
          `pending_withdrawal` decimal(18,4) DEFAULT 0.0000,
          `total_lifetime_profit` decimal(18,4) DEFAULT 0.0000,
          `last_compound_date` datetime DEFAULT NULL,
          `last_profit_action_date` datetime DEFAULT NULL,
          `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`user_id`),
          CONSTRAINT `fk_ub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `daily_yield_rates` (
          `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
          `yield_date` date NOT NULL,
          `rate_percent` decimal(6,4) NOT NULL,
          `is_distributed` tinyint(1) DEFAULT 0,
          `distributed_at` datetime DEFAULT NULL,
          `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_yield_date` (`yield_date`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `investment_lots` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `user_id` bigint(20) UNSIGNED NOT NULL,
          `amount` decimal(18,4) NOT NULL,
          `source` enum('deposit','compound') NOT NULL,
          `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
          `unlock_date` datetime NOT NULL,
          `status` enum('locked','unlocked','withdrawn') DEFAULT 'locked',
          `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_lots_user_status` (`user_id`,`status`),
          KEY `idx_lots_unlock` (`unlock_date`),
          CONSTRAINT `fk_lot_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `kyc_verifications` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `user_id` bigint(20) UNSIGNED NOT NULL,
          `doc_type` varchar(50) NOT NULL,
          `doc_number` varchar(100) NOT NULL,
          `front_image_path` varchar(255) DEFAULT '/assets/kyc/default_front.jpg',
          `back_image_path` varchar(255) DEFAULT NULL,
          `status` enum('pending','verified','rejected') DEFAULT 'pending',
          `admin_notes` text DEFAULT NULL,
          `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP,
          `reviewed_at` datetime DEFAULT NULL,
          `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_user_kyc` (`user_id`),
          KEY `idx_kyc_status` (`status`),
          CONSTRAINT `fk_kyc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `referral_commissions` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `leader_id` bigint(20) UNSIGNED NOT NULL,
          `downline_user_id` bigint(20) UNSIGNED DEFAULT NULL,
          `member_id` bigint(20) UNSIGNED DEFAULT NULL,
          `user_id` bigint(20) UNSIGNED DEFAULT NULL,
          `generation_level` tinyint(4) DEFAULT 1,
          `generation` varchar(10) DEFAULT 'L1',
          `type` varchar(30) NOT NULL,
          `base_amount` decimal(18,4) DEFAULT 0.0000,
          `member_capital` decimal(18,4) DEFAULT 0.0000,
          `leader_active_cap` decimal(18,4) DEFAULT 0.0000,
          `capped_amount` decimal(18,4) DEFAULT 0.0000,
          `commission_rate` decimal(6,4) DEFAULT 0.0000,
          `applied_rate` decimal(6,2) DEFAULT 0.00,
          `commission_amount` decimal(18,4) DEFAULT 0.0000,
          `amount` decimal(18,4) DEFAULT 0.0000,
          `is_capped` tinyint(1) DEFAULT 0,
          `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_rc_leader` (`leader_id`),
          KEY `idx_rc_downline` (`downline_user_id`),
          KEY `idx_rc_member` (`member_id`),
          KEY `idx_rc_user` (`user_id`),
          CONSTRAINT `fk_rc_leader` FOREIGN KEY (`leader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `support_tickets` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `ticket_number` varchar(50) DEFAULT NULL,
          `ticket_code` varchar(50) DEFAULT NULL,
          `user_id` bigint(20) UNSIGNED NOT NULL,
          `subject` varchar(200) NOT NULL,
          `category` varchar(50) DEFAULT 'general',
          `department` varchar(100) DEFAULT 'General',
          `message` text DEFAULT NULL,
          `status` enum('pending','answered','closed') DEFAULT 'pending',
          `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
          `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_st_user` (`user_id`),
          KEY `idx_st_number` (`ticket_number`),
          KEY `idx_st_code` (`ticket_code`),
          CONSTRAINT `fk_st_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `ticket_replies` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `ticket_id` bigint(20) UNSIGNED NOT NULL,
          `sender_id` bigint(20) UNSIGNED DEFAULT NULL,
          `user_id` bigint(20) UNSIGNED DEFAULT NULL,
          `sender_role` enum('user','admin') DEFAULT 'user',
          `is_admin` tinyint(1) DEFAULT 0,
          `message` text NOT NULL,
          `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_tr_ticket` (`ticket_id`),
          KEY `idx_tr_sender` (`sender_id`),
          KEY `idx_tr_user` (`user_id`),
          CONSTRAINT `fk_tr_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `transactions` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `tx_id` varchar(60) NOT NULL,
          `user_id` bigint(20) UNSIGNED NOT NULL,
          `type` varchar(40) NOT NULL,
          `amount` decimal(18,4) NOT NULL,
          `fee` decimal(18,4) DEFAULT 0.0000,
          `bonus_amount` decimal(18,4) DEFAULT 0.0000,
          `net_amount` decimal(18,4) NOT NULL,
          `network` varchar(30) DEFAULT 'TRC20',
          `dest_address` varchar(255) DEFAULT NULL,
          `tx_hash` varchar(255) DEFAULT NULL,
          `status` enum('pending','completed','rejected') DEFAULT 'pending',
          `admin_note` varchar(255) DEFAULT NULL,
          `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
          `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_tx_id` (`tx_id`),
          KEY `idx_tx_user_type` (`user_id`,`type`),
          KEY `idx_tx_status` (`status`),
          CONSTRAINT `fk_tx_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """,
        """
        CREATE TABLE IF NOT EXISTS `user_sessions` (
          `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
          `user_id` bigint(20) UNSIGNED NOT NULL,
          `device_name` varchar(100) DEFAULT NULL,
          `browser` varchar(100) DEFAULT NULL,
          `ip_address` varchar(45) DEFAULT NULL,
          `location` varchar(100) DEFAULT NULL,
          `session_token` varchar(255) DEFAULT NULL,
          `last_activity` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          `is_active` tinyint(1) DEFAULT 1,
          PRIMARY KEY (`id`),
          KEY `idx_session_user` (`user_id`),
          CONSTRAINT `fk_us_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """
    ]

    for sql in tables:
        cursor.execute(sql)
    print("✅ تمام ۱۰ جدول اصلی با موفقیت ساخته شدند.")

    # ۲. ثبت داده‌های اولیه
    cursor.execute("""
    INSERT INTO `users` (`id`, `uid`, `username`, `email`, `phone`, `password_hash`, `role`, `avatar_url`, `referred_by`, `referral_code`, `kyc_status`, `two_fa_enabled`, `two_fa_secret`, `status`, `created_at`, `updated_at`) VALUES
    (1, '49949318', '0000', 'abca1994000@gmail.com', NULL, 'scrypt:32768:8:1$3rTjGiZ3REtfJ9LP$53e3caf9205a008c4661cfe7139b5d56a0c34fce62adb8da522e6c5765050d66f139fcf7e808a345690f73cfb479659f48acd9d1104d4710004e5cb1e34803ff', 'admin', '/assets/avatars/default.png', NULL, 'ADM2026', 'verified', 0, NULL, 'active', '2026-09-27 12:20:22', '2026-09-27 12:20:22'),
    (2, '57497305', 'aaa', 'aaa@gmail.com', NULL, 'scrypt:32768:8:1$8wJoNoT7L52F32s6$8f2a9ea5706dea301581710df61d25325b6d9334b89941a65d38adeaebc0b2e10e17800be7c05fbef6a6ae390ffcf8d3b43b9d3492ec0c32b411f15a4d9da4dc', 'user', '/assets/avatars/default.png', 'ADM2026', 'TH3B32EE', 'verified', 0, NULL, 'active', '2026-09-27 12:20:22', '2026-09-27 12:20:22')
    ON DUPLICATE KEY UPDATE updated_at = NOW();
    """)
    cursor.execute("""
    INSERT INTO `user_balances` (`user_id`, `active_capital`, `locked_principal`, `unlocked_principal`, `withdrawable_profit`, `pending_withdrawal`, `total_lifetime_profit`, `last_compound_date`, `last_profit_action_date`, `updated_at`) VALUES
    (1, 0.0000, 0.0000, 0.0000, 150.0000, 0.0000, 150.0000, NULL, '2026-09-11 12:20:22', '2026-09-27 13:33:31'),
    (2, 0.0000, 500.0000, 0.0000, 80.0000, 0.0000, 80.0000, NULL, '2026-09-07 12:20:22', '2026-09-27 15:08:43')
    ON DUPLICATE KEY UPDATE updated_at = NOW();
    """)
    print("✅ داده‌های اولیه (کاربر ادمین و موجودی‌ها) ثبت شدند.")

    # ۳. ثبت ۳ پروسیجر محاسباتی
    cursor.execute("DROP PROCEDURE IF EXISTS `sp_execute_compound`;")
    cursor.execute("""
    CREATE PROCEDURE `sp_execute_compound` (IN `p_user_id` BIGINT, IN `p_amount` DECIMAL(18,4), OUT `p_status` INT, OUT `p_msg` VARCHAR(255))
    BEGIN
        DECLARE v_withdrawable DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_days INT DEFAULT 999;
        DECLARE v_last_date DATETIME;
        DECLARE v_bonus DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_total_lot DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_tx_id VARCHAR(60);

        SELECT withdrawable_profit, COALESCE(last_profit_action_date, last_compound_date)
        INTO v_withdrawable, v_last_date
        FROM user_balances
        WHERE user_id = p_user_id;

        IF v_last_date IS NOT NULL THEN
            SET v_days = DATEDIFF(NOW(), v_last_date);
        ELSE
            SELECT DATEDIFF(NOW(), created_at) INTO v_days FROM users WHERE id = p_user_id;
        END IF;

        IF p_amount <= 0.0000 THEN
            SET p_status = 400;
            SET p_msg = 'مبلغ وارد شده برای ترکیب نامعتبر است.';
        ELSEIF v_withdrawable < p_amount THEN
            SET p_status = 400;
            SET p_msg = 'موجودی سود قابل برداشت کافی نیست.';
        ELSEIF v_days < 10 THEN
            SET p_status = 400;
            SET p_msg = 'عملیات کامپاند در کمتر از ۱۰ روز مجاز نمی‌باشد.';
        ELSE
            IF v_days > 50 THEN
                SET v_bonus = p_amount * 0.0300;
            ELSE
                SET v_bonus = 0.0000;
            END IF;

            SET v_total_lot = p_amount + v_bonus;
            SET v_tx_id = CONCAT('TX-CMP-', UNIX_TIMESTAMP(), '-', FLOOR(1000 + RAND() * 9000));

            UPDATE user_balances
            SET withdrawable_profit = withdrawable_profit - p_amount,
                active_capital = active_capital + v_total_lot,
                locked_principal = locked_principal + v_total_lot,
                last_compound_date = NOW(),
                last_profit_action_date = NOW()
            WHERE user_id = p_user_id;

            INSERT INTO investment_lots (user_id, amount, source, start_date, unlock_date, status, created_at)
            VALUES (p_user_id, v_total_lot, 'compound', NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 'locked', NOW());

            INSERT INTO transactions (tx_id, user_id, type, amount, fee, bonus_amount, net_amount, network, status, admin_note, created_at)
            VALUES (v_tx_id, p_user_id, 'compound', p_amount, 0.0000, v_bonus, v_total_lot, 'INTERNAL', 'completed', 'عملیات ترکیب سود', NOW());

            SET p_status = 200;
            SET p_msg = 'ترکیب سود با موفقیت انجام شد و لات ۹۰ روزه جدید فعال گردید.';
        END IF;
    END;
    """)

    cursor.execute("DROP PROCEDURE IF EXISTS `sp_request_withdraw_principal`;")
    cursor.execute("""
    CREATE PROCEDURE `sp_request_withdraw_principal` (IN `p_user_id` BIGINT, IN `p_amount` DECIMAL(18,4), IN `p_network` VARCHAR(30), IN `p_address` VARCHAR(255), OUT `p_status` INT, OUT `p_msg` VARCHAR(255))
    BEGIN
        DECLARE v_unlocked DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_fee DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_net DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_tx_id VARCHAR(60);

        SELECT unlocked_principal INTO v_unlocked
        FROM user_balances
        WHERE user_id = p_user_id;

        IF p_amount <= 0.0000 THEN
            SET p_status = 400;
            SET p_msg = 'مبلغ وارد شده نامعتبر است.';
        ELSEIF p_amount > v_unlocked THEN
            SET p_status = 400;
            SET p_msg = 'مبلغ درخواستی بیشتر از اصل سرمایه آزادشده است.';
        ELSE
            SET v_fee = p_amount * 0.0500;
            SET v_net = p_amount - v_fee;
            SET v_tx_id = CONCAT('TX-WP-', UNIX_TIMESTAMP(), '-', FLOOR(1000 + RAND() * 9000));

            UPDATE user_balances
            SET unlocked_principal = unlocked_principal - p_amount,
                active_capital = GREATEST(0.0000, active_capital - p_amount),
                pending_withdrawal = pending_withdrawal + p_amount,
                last_profit_action_date = NOW()
            WHERE user_id = p_user_id;

            INSERT INTO transactions (tx_id, user_id, type, amount, fee, net_amount, network, dest_address, status, created_at)
            VALUES (v_tx_id, p_user_id, 'withdraw_principal', p_amount, v_fee, v_net, p_network, p_address, 'pending', NOW());

            SET p_status = 200;
            SET p_msg = 'درخواست برداشت اصل سرمایه با موفقیت ثبت شد.';
        END IF;
    END;
    """)

    cursor.execute("DROP PROCEDURE IF EXISTS `sp_request_withdraw_profit`;")
    cursor.execute("""
    CREATE PROCEDURE `sp_request_withdraw_profit` (IN `p_user_id` BIGINT, IN `p_amount` DECIMAL(18,4), IN `p_network` VARCHAR(30), IN `p_address` VARCHAR(255), OUT `p_status` INT, OUT `p_msg` VARCHAR(255))
    BEGIN
        DECLARE v_active DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_withdrawable DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_last_date DATETIME;
        DECLARE v_days INT DEFAULT 999;
        DECLARE v_fee_rate DECIMAL(6,4) DEFAULT 0.0000;
        DECLARE v_fee DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_net DECIMAL(18,4) DEFAULT 0.0000;
        DECLARE v_tx_id VARCHAR(60);
        DECLARE v_kyc VARCHAR(30) DEFAULT 'unverified';

        SELECT b.active_capital, b.withdrawable_profit, b.last_profit_action_date, u.kyc_status
        INTO v_active, v_withdrawable, v_last_date, v_kyc
        FROM user_balances b
        JOIN users u ON b.user_id = u.id
        WHERE b.user_id = p_user_id;

        IF v_last_date IS NOT NULL THEN
            SET v_days = DATEDIFF(NOW(), v_last_date);
        ELSE
            SELECT DATEDIFF(NOW(), created_at) INTO v_days FROM users WHERE id = p_user_id;
        END IF;

        IF v_active < 50.0000 OR v_kyc != 'verified' THEN
            SET p_status = 400;
            SET p_msg = 'برداشت سود نیازمند احراز هویت تاییدشده و حداقل ۵۰ دلار سرمایه فعال است.';
        ELSEIF p_amount <= 0.0000 THEN
            SET p_status = 400;
            SET p_msg = 'مبلغ برداشت نامعتبر است.';
        ELSEIF v_withdrawable < (v_active * 0.1000) THEN
            SET p_status = 400;
            SET p_msg = 'قانون حداقل ۱۰٪ سود انباشته رعایت نشده است.';
        ELSEIF p_amount > v_withdrawable THEN
            SET p_status = 400;
            SET p_msg = 'مبلغ درخواستی بیشتر از سود موجود است.';
        ELSEIF v_days < 10 THEN
            SET p_status = 400;
            SET p_msg = 'برداشت در فاصله کمتر از ۱۰ روز از آخرین عملیات مسدود است.';
        ELSE
            IF v_days >= 10 AND v_days < 15 THEN
                SET v_fee_rate = 0.0500;
            ELSEIF v_days >= 15 AND v_days < 25 THEN
                SET v_fee_rate = 0.0300;
            ELSEIF v_days >= 25 AND v_days < 35 THEN
                SET v_fee_rate = 0.0100;
            ELSE
                SET v_fee_rate = 0.0000;
            END IF;

            SET v_fee = p_amount * v_fee_rate;
            SET v_net = p_amount - v_fee;
            SET v_tx_id = CONCAT('TX-W-', UNIX_TIMESTAMP(), '-', FLOOR(1000 + RAND() * 9000));

            UPDATE user_balances
            SET withdrawable_profit = withdrawable_profit - p_amount,
                pending_withdrawal = pending_withdrawal + p_amount,
                last_profit_action_date = NOW()
            WHERE user_id = p_user_id;

            INSERT INTO transactions (tx_id, user_id, type, amount, fee, net_amount, network, dest_address, status, created_at)
            VALUES (v_tx_id, p_user_id, 'withdraw_profit', p_amount, v_fee, v_net, p_network, p_address, 'pending', NOW());

            SET p_status = 200;
            SET p_msg = 'درخواست برداشت سود با موفقیت ثبت شد و در انتظار تایید است.';
        END IF;
    END;
    """)
    print("✅ تمام ۳ پروسیجر مالی با موفقیت ثبت شدند.")

    # ۴. ثبت ۵ تریگر هوشمند
    triggers = [
        ("DROP TRIGGER IF EXISTS `trg_after_kyc_update`;",
         """CREATE TRIGGER `trg_after_kyc_update` AFTER UPDATE ON `kyc_verifications` FOR EACH ROW BEGIN
            IF NEW.status != OLD.status THEN
                UPDATE users SET kyc_status = NEW.status WHERE id = NEW.user_id;
            END IF;
         END;"""),
        ("DROP TRIGGER IF EXISTS `trg_before_referral_commissions_insert`;",
         """CREATE TRIGGER `trg_before_referral_commissions_insert` BEFORE INSERT ON `referral_commissions` FOR EACH ROW BEGIN
            IF NEW.member_id IS NOT NULL AND NEW.downline_user_id IS NULL THEN
                SET NEW.downline_user_id = NEW.member_id;
            ELSEIF NEW.downline_user_id IS NOT NULL AND NEW.member_id IS NULL THEN
                SET NEW.member_id = NEW.downline_user_id;
            END IF;
            IF NEW.user_id IS NULL THEN
                SET NEW.user_id = COALESCE(NEW.member_id, NEW.downline_user_id);
            END IF;
            IF NEW.generation IS NOT NULL AND (NEW.generation_level IS NULL OR NEW.generation_level = 1) THEN
                IF NEW.generation LIKE 'L%' THEN
                    SET NEW.generation_level = CAST(SUBSTRING(NEW.generation, 2) AS UNSIGNED);
                END IF;
            ELSEIF NEW.generation_level IS NOT NULL AND (NEW.generation IS NULL OR NEW.generation = 'L1') THEN
                SET NEW.generation = CONCAT('L', NEW.generation_level);
            END IF;
            IF NEW.amount > 0 AND NEW.commission_amount = 0 THEN
                SET NEW.commission_amount = NEW.amount;
            ELSEIF NEW.commission_amount > 0 AND NEW.amount = 0 THEN
                SET NEW.amount = NEW.commission_amount;
            END IF;
            IF NEW.member_capital > 0 AND NEW.base_amount = 0 THEN
                SET NEW.base_amount = NEW.member_capital;
            ELSEIF NEW.base_amount > 0 AND NEW.member_capital = 0 THEN
                SET NEW.member_capital = NEW.base_amount;
            END IF;
         END;"""),
        ("DROP TRIGGER IF EXISTS `trg_before_support_tickets_insert`;",
         """CREATE TRIGGER `trg_before_support_tickets_insert` BEFORE INSERT ON `support_tickets` FOR EACH ROW BEGIN
            IF NEW.ticket_code IS NOT NULL AND NEW.ticket_number IS NULL THEN
                SET NEW.ticket_number = NEW.ticket_code;
            ELSEIF NEW.ticket_number IS NOT NULL AND NEW.ticket_code IS NULL THEN
                SET NEW.ticket_code = NEW.ticket_number;
            ELSEIF NEW.ticket_number IS NULL AND NEW.ticket_code IS NULL THEN
                SET NEW.ticket_number = CONCAT('#TK-', FLOOR(1000 + RAND() * 9000));
                SET NEW.ticket_code = NEW.ticket_number;
            END IF;
            IF NEW.department IS NOT NULL AND (NEW.category IS NULL OR NEW.category = 'general') THEN
                SET NEW.category = LOWER(SUBSTRING_INDEX(NEW.department, ',', 1));
            ELSEIF NEW.category IS NOT NULL AND NEW.department IS NULL THEN
                SET NEW.department = CONCAT(UCASE(LEFT(NEW.category, 1)), SUBSTRING(NEW.category, 2));
            END IF;
         END;"""),
        ("DROP TRIGGER IF EXISTS `trg_before_ticket_replies_insert`;",
         """CREATE TRIGGER `trg_before_ticket_replies_insert` BEFORE INSERT ON `ticket_replies` FOR EACH ROW BEGIN
            IF NEW.sender_id IS NOT NULL AND NEW.user_id IS NULL THEN
                SET NEW.user_id = NEW.sender_id;
            ELSEIF NEW.user_id IS NOT NULL AND NEW.sender_id IS NULL THEN
                SET NEW.sender_id = NEW.user_id;
            END IF;
            IF NEW.sender_role IS NOT NULL THEN
                SET NEW.is_admin = IF(NEW.sender_role = 'admin', 1, 0);
            ELSEIF NEW.is_admin IS NOT NULL THEN
                SET NEW.sender_role = IF(NEW.is_admin = 1, 'admin', 'user');
            END IF;
         END;"""),
        ("DROP TRIGGER IF EXISTS `trg_after_user_insert`;",
         """CREATE TRIGGER `trg_after_user_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
            INSERT INTO user_balances (user_id, active_capital, locked_principal, unlocked_principal, withdrawable_profit, pending_withdrawal, total_lifetime_profit, last_profit_action_date, updated_at)
            VALUES (NEW.id, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, 0.0000, NEW.created_at, NOW())
            ON DUPLICATE KEY UPDATE updated_at = NOW();
         END;""")
    ]

    for drop_sql, create_sql in triggers:
        cursor.execute(drop_sql)
        cursor.execute(create_sql)
    print("✅ تمام ۵ تریگر هوشمند با موفقیت ثبت شدند.")

    cursor.close()
    conn.close()
    print("\n🎉 دیتابیس ابری Aiven با موفقیت کامل ۱۰۰٪ راه‌اندازی و آماده به کار شد!")

if __name__ == '__main__':
    setup_database()