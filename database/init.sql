-- ============================================
-- TaskFlow Database Setup
-- ============================================

CREATE DATABASE IF NOT EXISTS taskflow
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE taskflow;

-- Tables are auto-created by Hibernate (ddl-auto=update)
-- This script is for manual setup or production migrations

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    status        ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE') NOT NULL DEFAULT 'TODO',
    priority      ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    display_order INT,
    user_id       BIGINT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_user_order (user_id, display_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task_tags (
    task_id BIGINT      NOT NULL,
    tag     VARCHAR(50) NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_tag (tag)
) ENGINE=InnoDB;
