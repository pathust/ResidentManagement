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
                       role VARCHAR(50) NOT NULL,  -- ADMIN, COLLECTOR, RESIDENT
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------
-- II. RESIDENT DATA
-- ------------------------------

CREATE TABLE households (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            code VARCHAR(50) UNIQUE NOT NULL,
                            head_person_id INT,
                            address_street VARCHAR(255),
                            address_ward VARCHAR(255),
                            address_district VARCHAR(255),
                            notes TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE persons (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         household_id INT,
                         full_name VARCHAR(255) NOT NULL,
                         alias VARCHAR(100),
                         dob DATE,
                         birthplace VARCHAR(255),
                         origin VARCHAR(255),
                         ethnicity VARCHAR(100),
                         religion VARCHAR(100),
                         occupation VARCHAR(255),
                         workplace VARCHAR(255),
                         id_number VARCHAR(50) UNIQUE,
                         id_issue_date DATE,
                         id_issue_place VARCHAR(255),
                         registration_date DATE,
                         previous_address TEXT,
                         relation_to_head VARCHAR(100),
                         status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, MOVED, DECEASED
                         moved_date DATE,
                         moved_to TEXT,
                         deceased_date DATE,
                         notes TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------
-- III. FEE COLLECTION
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
-- IV. FUND MANAGEMENT
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
-- V. FOREIGN KEY CONSTRAINTS
-- ------------------------------

-- Households FK
ALTER TABLE households
    ADD CONSTRAINT fk_households_head_person
        FOREIGN KEY (head_person_id) REFERENCES persons(id) ON DELETE SET NULL;

-- Persons FK
ALTER TABLE persons
    ADD CONSTRAINT fk_persons_household
        FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL;

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
-- VI. INDEXES FOR PERFORMANCE
-- ------------------------------

CREATE INDEX idx_persons_household ON persons(household_id);
CREATE INDEX idx_persons_status ON persons(status);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_collection_events_date ON collection_events(event_date);
CREATE INDEX idx_fund_transactions_date ON fund_transactions(transaction_date);