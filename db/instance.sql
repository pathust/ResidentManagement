-- Use database
USE RESIDENT_MANAGEMENT_DB;

-- ------------------------------
-- II. RESIDENT DATA
-- ------------------------------

-- Insert a household
INSERT INTO households (code, head_person_id, address_street, address_ward, address_district, notes, created_at, updated_at)
VALUES ('HH001', NULL, '123 Nguyen Trai', 'Ward 1', 'District 1', 'Sample household', NOW(), NOW());

-- Insert persons (including head of household)
INSERT INTO persons (household_id, full_name, alias, dob, birthplace, origin, ethnicity, religion, occupation, workplace, id_number, id_issue_date, id_issue_place, registration_date, previous_address, relation_to_head, status, notes, created_at, updated_at)
VALUES
    (1, 'Nguyen Van A', 'A', '1980-05-15', 'Ha Noi', 'Ha Noi', 'Kinh', 'Buddhism', 'Engineer', 'ABC Company', '123456789', '2010-01-01', 'Ha Noi', '2020-01-01', '456 Le Loi', 'Head', 'ACTIVE', 'Head of HH001', NOW(), NOW()),
    (1, 'Tran Thi B', 'B', '1985-08-20', 'Da Nang', 'Da Nang', 'Kinh', 'None', 'Teacher', 'XYZ School', '987654321', '2015-03-15', 'Da Nang', '2020-01-01', '789 Hai Ba Trung', 'Wife', 'ACTIVE', 'Wife of head', NOW(), NOW()),
    (1, 'Le Van C', 'C', '2010-03-10', 'Ho Chi Minh City', 'Ho Chi Minh City', 'Kinh', 'None', 'Student', 'School ABC', NULL, NULL, NULL, '2020-01-01', NULL, 'Son', 'ACTIVE', 'Son of head', NOW(), NOW());

-- Update head_person_id in households
UPDATE households SET head_person_id = 1 WHERE id = 1;

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