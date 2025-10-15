-- Active: 1759857430738@@127.0.0.1@3306@resident_management_db
-- Use database
USE RESIDENT_MANAGEMENT_DB;

INSERT INTO role(role)
VALUES ('ADMIN'), ('COLLECTOR'), ('RESIDENT');

INSERT INTO users (username, password_hash, role_id, manage_ward_id, created_at, updated_at)
VALUES
    ('admin', '$2a$12$A8/XBc25xxufSCygqDp6TuBi5njm4YJw94EUuTlKNER8ozHPse5p2', 1, NULL, NOW(), NOW()),
    ('collector', '$2a$12$mwoieiJRIVNg7oUjpfI2XeIes8UVFtc9CSxv9LBvkYMc0KVfMBy3u', 2, NULL, NOW(), NOW()),
    ('resident', '$2a$12$Q6l6iky1PKKSwWIiXJwvtOXv9JE3MsJsBVSQP5augHTaq57ptBcwG', 3, 1, NOW(), NOW());

-- ------------------------------
-- II. RESIDENT DATA
-- ------------------------------

-- Insert provinces
INSERT INTO province (name)
VALUES ('Ho Chi Minh City'), ('Ha Noi');

-- Insert wards
INSERT INTO ward (name, province_id)
VALUES ('Ward 1', 1), ('Ward 2', 1);

-- Insert ethnicities
INSERT INTO ethnicity (name)
VALUES ('Kinh'), ('Hoa'), ('Tay');

-- Insert a household
INSERT INTO households (ward_id, house_address_details, code, notes, created_at, updated_at)
VALUES  (1, '123 Nguyen Trai', 'HH001', 'Sample household', NOW(), NOW()),
        (2, '456 Tran Hung Dao', 'HH002', 'Another household', NOW(), NOW());

-- Insert persons (including head of household)
INSERT INTO persons (current_household_id, full_name, date_of_birth, place_of_birth, 
                    place_of_origin_ward_id, place_of_origin_details, ethnicity_id, religion, gender,
                    occupation, workplace, id_number, id_issue_date, id_issue_place, 
                    phone_number, email_address, status, notes, perm_address_ward_id, created_at, updated_at)
VALUES
    (1, 'Nguyen Van A', '1980-05-15', 'Ho Chi Minh City', 
    1, '123 Nguyen Trai', 1, 'Buddhism', 'M', 
    'Engineer', 'ABC Company', '123456789', '2010-01-01', 'Ho Chi Minh City', 
    '0123456789', 'nguyenvana@example.com', 'ALIVE', 'Head of HH001', 1, NOW(), NOW()),
    (1, 'Tran Thi B', '1985-08-20', 'Ho Chi Minh City',
    1, '123 Nguyen Trai', 1, 'Christian', 'F',
    'Teacher', 'XYZ School', '987654321', '2012-02-02', 'Ho Chi Minh City',
    '0987654321', 'tranthib@example.com', 'ALIVE', 'Wife of HH001', 1, NOW(), NOW()),
    (1, 'Nguyen Van C', '2010-03-10', 'Ho Chi Minh City',
    1, '123 Nguyen Trai', 1, 'None', 'M', 
    'Student', 'School XYZ', NULL, NULL, NULL, 
    NULL, NULL, 'ALIVE', 'Son of HH001', 1, NOW(), NOW());
INSERT INTO household_membership (household_id, person_id, is_household_head, relation_to_head, start_date, end_date, registration_perm_date)
VALUES
    (1, 1, 1, 'Head', '2020-01-01', NULL, '2020-01-01'),
    (1, 2, 0, 'Wife', '2020-01-01', NULL, '2020-01-01'),
    (1, 3, 0, 'Son', '2020-01-01', NULL, '2020-01-01');  

-- Update head_person_id in households
-- UPDATE households SET head_person_id = 1 WHERE id = 1;

-- ------------------------------
-- III. FEE COLLECTION
-- ------------------------------

-- Insert fee types
INSERT INTO fee_types (name, description, unit, default_amount, frequency, is_mandatory, created_at, updated_at)
VALUES
    ('Management Fee', 'Monthly management fee', 'VND', 500000.00, 'MONTHLY', 1, NOW(), NOW()),
    ('Water Fee', 'Water usage fee', 'VND', 200000.00, 'MONTHLY', 1, NOW(), NOW());

-- Insert collection event
INSERT INTO collection_events (fee_type_id, event_date, due_date, description, collector_user_id, approver_user_id, total_expected, status, fund_id, created_at, updated_at)
VALUES
    (1, '2025-10-01', '2025-10-15', 'October 2025 Management Fee', 2, 1, 500000.00, 'OPEN', NULL, NOW(), NOW());

-- Insert payment
INSERT INTO payments (collection_event_id, household_id, person_id, expected_amount, amount_paid, payment_date, method, status, notes, fund_id, created_at, updated_at)
VALUES
    (1, 1, 1, 500000.00, 500000.00, '2025-10-10', 'CASH', 'COMPLETED', 'Paid on time', NULL, NOW(), NOW());

-- Insert payment log
INSERT INTO payment_logs (payment_id, change_type, change_date, amount, details, user_id)
VALUES
    (1, 'CREATE', NOW(), 500000.00, 'Initial payment record', 2);

-- ------------------------------
-- IV. FUND MANAGEMENT
-- ------------------------------

-- Insert fund
INSERT INTO funds (name, description, type, currency, restricted_to, balance, created_at, updated_at)
VALUES
    ('General Fund', 'Fund for general expenses', 'UNRESTRICTED', 'VND', NULL, 1000000.00, NOW(), NOW());

-- Insert fund transaction
INSERT INTO fund_transactions (fund_id, transaction_type, amount, transaction_date, reference_id, reference_type, user_id, notes, created_at)
VALUES
    (1, 'INFLOW', 1000000.00, '2025-10-01', NULL, 'INITIAL', 1, 'Initial fund deposit', NOW());

-- Insert expense
INSERT INTO expenses (fund_id, expense_date, amount, description, approver_user_id, recipient, proof, status, notes, created_at, updated_at)
VALUES
    (1, '2025-10-05', 300000.00, 'Office supplies', 1, 'Office Depot', 'invoice_001.pdf', 'APPROVED', 'Approved expense', NOW(), NOW());