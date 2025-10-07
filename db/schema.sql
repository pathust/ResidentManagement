-- Active: 1759857430738@@127.0.0.1@3306@mysql
-- Drop database if exists
DROP DATABASE IF EXISTS RESIDENT_MANAGEMENT_DB;

-- Create database
CREATE DATABASE RESIDENT_MANAGEMENT_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use database
USE RESIDENT_MANAGEMENT_DB;

-- ------------------------------
-- I. USER MANAGEMENT
-- ------------------------------

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,  -- ADMIN, COLLECTOR, RESIDENT
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    manage_ward_id INT NULL,
    last_login_at DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(45) UNIQUE NOT NULL
);

CREATE TABLE permission (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    permission VARCHAR(45) UNIQUE NOT NULL
);

CREATE TABLE role_permission (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    UNIQUE INDEX r_p_UNIQUE (role_id ASC, permission_id ASC) VISIBLE
    -- INDEX fk_rp_person_id_idx (permission_id ASC) VISIBLE
);

-- ------------------------------
-- II. RESIDENT DATA
-- ------------------------------

CREATE TABLE ward (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province_id INT NOT NULL,
    UNIQUE INDEX uq_ward_name_province (name ASC, province_id ASC) VISIBLE
);

CREATE TABLE province (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) UNIQUE NOT NULL
);

CREATE TABLE ethnicity (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE households (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ward_id INT NOT NULL,
    house_address_details VARCHAR(255) NULL DEFAULT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    -- head_person_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE persons (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    -- household_id INT,
    current_household_id INT NULL DEFAULT NULL,
    full_name VARCHAR(255) NOT NULL,
    -- alias VARCHAR(100),
    date_of_birth DATE,
    place_of_birth VARCHAR(255),
    -- origin VARCHAR(255),
    place_of_origin_ward_id INT NULL DEFAULT NULL,
    place_of_origin_details VARCHAR(255) NULL,
    ethnicity_id INT,
    religion VARCHAR(100) NULL DEFAULT NULL,
    gender ENUM('M', 'F', 'X') NOT NULL,
    occupation VARCHAR(255),
    workplace VARCHAR(255),
    id_number VARCHAR(50) UNIQUE,
    id_issue_date DATE,
    id_issue_place VARCHAR(255),
    -- registration_date DATE,
    -- previous_address TEXT,
    perm_address_ward_id INT NULL DEFAULT NULL,
    temp_address_ward_id INT NULL DEFAULT NULL,
    perm_address_details VARCHAR(255) NULL DEFAULT NULL,
    temp_address_details VARCHAR(255) NULL DEFAULT NULL,
    phone_number VARCHAR(15) NULL DEFAULT NULL,
    email_address VARCHAR(255) NULL DEFAULT NULL,
    status ENUM('ALIVE', 'DEAD') NOT NULL DEFAULT 'ALIVE',
    -- relation_to_head VARCHAR(100),
    -- status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, MOVED, DECEASED
    -- moved_date DATE,
    -- moved_to TEXT,
    -- deceased_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE household_membership (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    household_id INT NOT NULL,
    person_id INT NOT NULL,
    is_household_head TINYINT NOT NULL DEFAULT 0,
    relation_to_head VARCHAR(45) NOT NULL,
    start_date DATE,
    end_date DATE NULL DEFAULT NULL,
    registration_perm_date DATE NULL DEFAULT NULL,
    prev_perm_address_ward_id INT NULL,
    prev_perm_address_details VARCHAR(255) NULL,
    active_person_id INT GENERATED ALWAYS AS (CASE WHEN end_date IS NULL THEN person_id ELSE NULL END) STORED,
    active_head_household_id INT GENERATED ALWAYS AS (CASE WHEN end_date IS NULL AND is_household_head=1 THEN household_id ELSE NULL END) STORED,
    INDEX fk_hm_person_id_idx (person_id ASC) VISIBLE,
    INDEX fk_hm_household_id_idx (household_id ASC) VISIBLE,
    INDEX fk_hm_prev_perm_address_ward_id_idx (prev_perm_address_ward_id ASC) VISIBLE,
    UNIQUE INDEX uq_hm_one_active_membership_per_person (active_person_id ASC) VISIBLE,
    UNIQUE INDEX uq_hm_one_active_head_per_household (active_head_household_id ASC) INVISIBLE,
    INDEX idx_hm_household_active (household_id ASC, end_date ASC) VISIBLE
);

-- ------------------------------
-- III. HOUSEHOLD EVENT
-- ------------------------------
CREATE TABLE household_address_change (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    household_id INT NOT NULL,
    from_address_ward_id INT NOT NULL,
    from_address_details VARCHAR(255) NULL,
    to_address_ward_id INT NOT NULL,
    to_address_details VARCHAR(255) NULL,
    change_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX fk_hac_household_id_idx (household_id ASC) VISIBLE,
    INDEX fk_hac_from_address_id_idx (from_address_ward_id ASC) VISIBLE,
    INDEX fk_hac_to_address_id_idx (to_address_ward_id ASC) VISIBLE
);

CREATE TABLE household_head_change (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    household_id INT NOT NULL,
    from_person_id INT NOT NULL,
    to_person_id INT NOT NULL,
    change_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX fk_hhc_household_id_idx (household_id ASC) VISIBLE,
    INDEX fk_hhc_from_person_id_idx (from_person_id ASC) VISIBLE,
    INDEX fk_hhc_to_person_id_idx (to_person_id ASC) VISIBLE
);

CREATE TABLE household_split (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    from_household_id INT NOT NULL,
    to_household_id INT NOT NULL,
    split_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    INDEX idx_split_date (split_date ASC) VISIBLE,
    INDEX fk_from_household_id_idx (from_household_id ASC) VISIBLE,
    INDEX fk_to_household_id_idx (to_household_id ASC) VISIBLE
);

CREATE TABLE household_split_member (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    household_split_id INT NOT NULL,
    person_id INT NOT NULL,
    is_head TINYINT NOT NULL DEFAULT 0,
    INDEX fk_household_split_id_idx (household_split_id ASC) VISIBLE,
    INDEX fk_hsm_person_id_idx (person_id ASC) VISIBLE
);

CREATE TABLE household_event(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    household_id INT NOT NULL,
    event_type VARCHAR(45) NOT NULL,
    event_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    details TEXT,
    INDEX fk_he_household_id_idx (household_id ASC) VISIBLE,
    INDEX idx_he_household_date (household_id ASC, event_date ASC) VISIBLE
);

-- ------------------------------
-- IV. PERSON EVENT
-- ------------------------------
CREATE TABLE temporary_residence (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    person_id INT NOT NULL,
    current_household_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL DEFAULT NULL,
    temp_address_ward_id INT NOT NULL,
    temp_address_details VARCHAR(255) NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    details TEXT,
    INDEX fk_tr_person_id_idx (person_id ASC) VISIBLE,
    INDEX fk_tr_current_household_id_idx (current_household_id ASC) VISIBLE,
    INDEX id_tr_period (person_id ASC, start_date ASC, end_date ASC) VISIBLE,
    INDEX fk_tr_temp_address_ward_id_idx (temp_address_ward_id ASC) VISIBLE
);

CREATE TABLE temporary_absence (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    person_id INT NOT NULL,
    current_household_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    destination TEXT,
    reason TEXT,
    perm_address_ward_id INT NOT NULL,
    temp_address_ward_id INT NULL DEFAULT NULL,
    perm_address_details VARCHAR(255) NULL DEFAULT NULL,
    temp_address_details VARCHAR(255) NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX fk_ta_person_id_idx (person_id ASC) VISIBLE,
    INDEX fk_ta_household_id_idx (current_household_id ASC) VISIBLE,
    INDEX idx_ta_period (person_id ASC, start_date ASC, end_date ASC) VISIBLE,
    INDEX fk_ta_perm_address_ward_id_idx (perm_address_ward_id ASC) VISIBLE,
    INDEX fk_ta_temp_address_ward_id_idx (temp_address_ward_id ASC) VISIBLE
);

CREATE TABLE permanent_residence_change (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    person_id INT NOT NULL,
    current_household_id INT NOT NULL,
    prev_address_ward_id INT NULL DEFAULT NULL,
    prev_address_details VARCHAR(255) NULL DEFAULT NULL,
    address_ward_id INT NOT NULL,
    address_details VARCHAR(255) NULL DEFAULT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    details TEXT,
    INDEX fk_pr_person_id_idx (person_id ASC) VISIBLE,
    INDEX fk_pr_current_household_id_idx (current_household_id ASC) VISIBLE,
    INDEX fk_pr_prev_address_ward_id_idx (prev_address_ward_id ASC) VISIBLE,
    INDEX fk_pr_to_address_ward_id_idx (address_ward_id ASC) VISIBLE
);

CREATE TABLE birth_declare (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    person_id INT NOT NULL,
    declarer_id INT NOT NULL,
    father_id INT NULL,
    mother_id INT NULL,
    date_of_birth DATE NOT NULL,
    date_of_declaration DATE NOT NULL,
    place_of_birth VARCHAR(255) NOT NULL,
    place_of_origin_ward_id INT NOT NULL,
    place_of_origin_details VARCHAR(255) NULL,
    relation_with_declarer VARCHAR(45) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    UNIQUE INDEX uq_bd_person_id (person_id ASC) VISIBLE,
    INDEX id_bd_declarer_id_idx (declarer_id ASC) VISIBLE,
    INDEX id_bd_person_id_idx (person_id ASC) VISIBLE,
    INDEX id_bd_father_d_idx (father_id ASC) VISIBLE,
    INDEX id_bd_mother_id_idx (mother_id ASC) VISIBLE,
    INDEX fk_bd_place_of_origin_ward_id_idx (place_of_origin_ward_id ASC) VISIBLE
);

CREATE TABLE death_declare (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    person_id INT NOT NULL,
    declarer_id INT NOT NULL,
    date_of_declaration DATE NOT NULL,
    time_of_death DATETIME NULL,
    last_permanent_residence_ward_id INT NOT NULL,
    last_permanent_residence_details VARCHAR(255) NULL,
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX uq_dd_person_id (person_id ASC) VISIBLE,
    INDEX fk_dd_person_id_idx (person_id ASC) VISIBLE,
    INDEX fk_dd_declarer_id_idx (declarer_id ASC) VISIBLE,
    INDEX fk_dd_last_perm_residence_ward_id_idx (last_permanent_residence_ward_id ASC) VISIBLE
);

CREATE TABLE person_event (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    person_id INT NOT NULL,
    event_type VARCHAR(45) NOT NULL,
    event_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    details TEXT,
    INDEX fk_pe_person_id_idx (person_id ASC) VISIBLE,
    INDEX idx_person_event (person_id ASC, created_at ASC) VISIBLE,
    INDEX idx_pe_person_date (person_id ASC, event_date ASC) VISIBLE
);

-- ------------------------------
-- V. FEE COLLECTION
-- ------------------------------

CREATE TABLE fee_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL,
    default_amount DECIMAL(15,2) DEFAULT 0,
    frequency VARCHAR(50) DEFAULT 'ONE_TIME', -- ONE_TIME, MONTHLY, YEARLY
    is_mandatory TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE collection_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fee_type_id INT NOT NULL,
    event_date DATE NOT NULL,
    due_date DATE,
    description TEXT,
    collector_user_id INT NOT NULL,
    approver_user_id INT,
    total_expected DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, CLOSED, CANCELLED
    fund_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    collection_event_id INT NOT NULL,
    household_id INT NOT NULL,
    person_id INT,
    expected_amount DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0,
    payment_date DATE,
    method VARCHAR(100), -- CASH, TRANSFER, CARD
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PARTIAL, COMPLETED
    notes TEXT,
    fund_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payment_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL,
    change_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(15,2),
    details TEXT,
    user_id INT
);

-- ------------------------------
-- VI. FUND MANAGEMENT
-- ------------------------------

CREATE TABLE funds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,  -- RESTRICTED, UNRESTRICTED
    currency VARCHAR(10) DEFAULT 'VND',
    restricted_to TEXT,
    balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE fund_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fund_id INT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,  -- INFLOW, OUTFLOW, TRANSFER_IN, TRANSFER_OUT
    amount DECIMAL(15,2) NOT NULL,
    transaction_date DATE NOT NULL,
    reference_id INT,
    reference_type VARCHAR(50), -- PAYMENT, EXPENSE, TRANSFER, REWARD
    user_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fund_id INT NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT NOT NULL,
    approver_user_id INT NOT NULL,
    recipient VARCHAR(255),
    proof TEXT,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE fund_transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_fund_id INT NOT NULL,
    dest_fund_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    transfer_date DATE NOT NULL,
    reason TEXT NOT NULL,
    user_id INT,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, COMPLETED, CANCELLED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------
-- VII. FOREIGN KEY CONSTRAINTS
-- ------------------------------

-- Users FK
ALTER TABLE users
    ADD CONSTRAINT fk_ua_role_id 
        FOREIGN KEY (role_id) 
        REFERENCES role (id) 
        ON DELETE NO ACTION,
    ADD CONSTRAINT fk_ua_manage_ward_id
        FOREIGN KEY (manage_ward_id)
        REFERENCES ward (id)
        ON DELETE NO ACTION;

-- Role - Permission FK
ALTER TABLE role_permission
    ADD CONSTRAINT fk_rp_role_id
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_rp_permission_id
        FOREIGN KEY (permission_id)
        REFERENCES permission(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Ward FK
ALTER TABLE ward
    ADD CONSTRAINT fk_province_id
        FOREIGN KEY (province_id)
        REFERENCES province(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Households FK
ALTER TABLE households
    -- ADD CONSTRAINT fk_households_head_person
    --     FOREIGN KEY (head_person_id) REFERENCES persons(id) ON DELETE SET NULL;
    ADD CONSTRAINT fk_h_ward_id
        FOREIGN KEY (ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;


-- Persons FK
ALTER TABLE persons
    -- ADD CONSTRAINT fk_persons_household
    --     FOREIGN KEY (household_id) 
    --     REFERENCES households(id) 
    --     ON DELETE SET NULL;
    ADD CONSTRAINT fk_p_household_id
        FOREIGN KEY (current_household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_p_place_of_origin_ward_id
        FOREIGN KEY (place_of_origin_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_p_ethnicity_id
        FOREIGN KEY (ethnicity_id)
        REFERENCES ethnicity(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_p_perm_address_ward_id
        FOREIGN KEY (perm_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_p_temp_address_ward_id
        FOREIGN KEY (temp_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Household - Person membership
ALTER TABLE household_membership
    ADD CONSTRAINT fk_hm_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_hm_household_id
        FOREIGN KEY (household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_hm_prev_perm_address_ward_id
        FOREIGN KEY (prev_perm_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Household address change
ALTER TABLE household_address_change
    ADD CONSTRAINT fk_hac_household_id
        FOREIGN KEY (household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_hac_from_address_id
        FOREIGN KEY (from_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_hac_to_address_id
        FOREIGN KEY (to_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

ALTER TABLE household_head_change
    ADD CONSTRAINT fk_hhc_household_id
        FOREIGN KEY (household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_hhc_from_person_id
        FOREIGN KEY (from_person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_hhc_to_person_id
        FOREIGN KEY (to_person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Household split
ALTER TABLE household_split
    ADD CONSTRAINT fk_hs_from_household_id
        FOREIGN KEY (from_household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_hs_to_household_id
        FOREIGN KEY (to_household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Househole split members
ALTER TABLE household_split_member
    ADD CONSTRAINT fk_hsm_household_split_id
        FOREIGN KEY (household_split_id)
        REFERENCES household_split(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_hsm_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
    
-- Household events
ALTER TABLE household_event
    ADD CONSTRAINT fk_he_household_id
        FOREIGN KEY (household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Temporary residence FK
ALTER TABLE temporary_residence
    ADD CONSTRAINT fk_tr_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_tr_current_household_id
        FOREIGN KEY (current_household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_tr_temp_address_ward_id
        FOREIGN KEY (temp_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Temporary absence FK
ALTER TABLE temporary_absence
    ADD CONSTRAINT fk_ta_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_ta_household_id
        FOREIGN KEY (current_household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_ta_perm_address_ward_id
        FOREIGN KEY (perm_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_ta_temp_address_ward_id
        FOREIGN KEY (temp_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Permanent residence change FK
ALTER TABLE permanent_residence_change
    ADD CONSTRAINT fk_pr_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_pr_household_id
        FOREIGN KEY (current_household_id)
        REFERENCES households(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_pr_prev_address_ward_id
        FOREIGN KEY (prev_address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_pr_to_address_ward_id
        FOREIGN KEY (address_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Birth declare FK
ALTER TABLE birth_declare
    ADD CONSTRAINT fk_bd_declarer_id
        FOREIGN KEY (declarer_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_bd_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_bd_father_id
        FOREIGN KEY (father_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_bd_mother_id
        FOREIGN KEY (mother_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_bd_place_of_origin_ward_id
        FOREIGN KEY (place_of_origin_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Death declare FK
ALTER TABLE death_declare
    ADD CONSTRAINT fk_dd_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_dd_declarer_id
        FOREIGN KEY (declarer_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    ADD CONSTRAINT fk_dd_last_perm_residence_ward_id
        FOREIGN KEY (last_permanent_residence_ward_id)
        REFERENCES ward(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Person events FK
ALTER TABLE person_event
    ADD CONSTRAINT fk_pe_person_id
        FOREIGN KEY (person_id)
        REFERENCES persons(id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;

-- Collection Events FK
ALTER TABLE collection_events
    ADD CONSTRAINT fk_collection_events_fee_type
        FOREIGN KEY (fee_type_id) REFERENCES fee_types(id),
ADD CONSTRAINT fk_collection_events_collector
FOREIGN KEY (collector_user_id) REFERENCES users(id),
ADD CONSTRAINT fk_collection_events_approver
FOREIGN KEY (approver_user_id) REFERENCES users(id),
ADD CONSTRAINT fk_collection_events_fund
FOREIGN KEY (fund_id) REFERENCES funds(id);

-- Payments FK
ALTER TABLE payments
    ADD CONSTRAINT fk_payments_collection_event
        FOREIGN KEY (collection_event_id) REFERENCES collection_events(id),
ADD CONSTRAINT fk_payments_household
FOREIGN KEY (household_id) REFERENCES households(id),
ADD CONSTRAINT fk_payments_person
FOREIGN KEY (person_id) REFERENCES persons(id),
ADD CONSTRAINT fk_payments_fund
FOREIGN KEY (fund_id) REFERENCES funds(id);

-- Payment Logs FK
ALTER TABLE payment_logs
    ADD CONSTRAINT fk_payment_logs_payment
        FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_payment_logs_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- Fund Transactions FK
ALTER TABLE fund_transactions
    ADD CONSTRAINT fk_fund_transactions_fund
        FOREIGN KEY (fund_id) REFERENCES funds(id),
ADD CONSTRAINT fk_fund_transactions_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- Expenses FK
ALTER TABLE expenses
    ADD CONSTRAINT fk_expenses_fund
        FOREIGN KEY (fund_id) REFERENCES funds(id),
ADD CONSTRAINT fk_expenses_approver
FOREIGN KEY (approver_user_id) REFERENCES users(id);

-- Fund Transfers FK
ALTER TABLE fund_transfers
    ADD CONSTRAINT fk_fund_transfers_source
        FOREIGN KEY (source_fund_id) REFERENCES funds(id),
ADD CONSTRAINT fk_fund_transfers_dest
FOREIGN KEY (dest_fund_id) REFERENCES funds(id),
ADD CONSTRAINT fk_fund_transfers_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- ------------------------------
-- VIII. INDEXES FOR PERFORMANCE
-- ------------------------------

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX fk_rp_permission_id_idx ON role_permission(permission_id);
CREATE INDEX idx_persons_current_household ON persons(current_household_id);
CREATE INDEX idx_persons_status ON persons(status);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_collection_events_date ON collection_events(event_date);
CREATE INDEX idx_fund_transactions_date ON fund_transactions(transaction_date);