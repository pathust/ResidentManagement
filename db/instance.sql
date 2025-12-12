-- Active: 1759857430738@@127.0.01@3306@resident_management_db

USE RESIDENT_MANAGEMENT_DB;

-- =================================================================
-- I. DỮ LIỆU NỀN TẢNG (ĐỊA LÝ & DÂN TỘC)
-- =================================================================

-- ------------------------------------------------------------
-- 1. PROVINCE
-- ------------------------------------------------------------
INSERT INTO province (name) VALUES
                                ('TP Hồ Chí Minh'), ('Hà Nội'), ('Đà Nẵng'), ('Hải Phòng'), ('Cần Thơ'),
                                ('Quảng Ninh'), ('Bà Rịa - Vũng Tàu'), ('Thanh Hóa'), ('Nghệ An'),
                                ('Thừa Thiên Huế'), ('Khánh Hòa'), ('Bình Dương'), ('Đồng Nai'),
                                ('Long An'), ('An Giang'), ('Kiên Giang'), ('Lâm Đồng'),
                                ('Đắk Lắk'), ('Quảng Nam'), ('Quảng Bình');

-- ------------------------------------------------------------
-- 2. WARD
-- ------------------------------------------------------------
INSERT INTO ward (name, province_id) VALUES
                                         ('Phường Bến Nghé, Quận 1', 1),
                                         ('Phường 25, Quận Bình Thạnh', 1),
                                         ('Phường Kim Mã, Quận Ba Đình', 2),
                                         ('Phường Hàng Trống, Quận Hoàn Kiếm', 2),
                                         ('Phường Thạch Thang, Quận Hải Châu', 3),
                                         ('Phường An Khê, Quận Thanh Khê', 3),
                                         ('Phường Minh Khai, Quận Hồng Bàng', 4),
                                         ('Phường Lạch Tray, Quận Ngô Quyền', 4),
                                         ('Phường Tân An, Quận Ninh Kiều', 5),
                                         ('Phường Bình Thủy, Quận Bình Thủy', 5),
                                         ('Phường Bãi Cháy, TP Hạ Long', 6),
                                         ('Phường Cẩm Trung, TP Cẩm Phả', 6),
                                         ('Phường 1, TP Vũng Tàu', 7),
                                         ('Phường Phước Hưng, TP Bà Rịa', 7),
                                         ('Phường Lam Sơn, TP Thanh Hóa', 8),
                                         ('Phường Bắc Sơn, TP Sầm Sơn', 8),
                                         ('Phường Hưng Dũng, TP Vinh', 9),
                                         ('Phường Thu Thủy, TX Cửa Lò', 9),
                                         ('Phường Phú Hội, TP Huế', 10),
                                         ('Phường Thuận Hòa, TP Huế', 10),
                                         ('Phường Lộc Thọ, TP Nha Trang', 11),
                                         ('Phường Cam Nghĩa, TP Cam Ranh', 11),
                                         ('Phường Phú Cường, TP Thủ Dầu Một', 12),
                                         ('Phường Dĩ An, TP Dĩ An', 12),
                                         ('Phường Trảng Dài, TP Biên Hòa', 13),
                                         ('Phường Xuân An, TP Long Khánh', 13),
                                         ('Phường 1, TP Tân An', 14),
                                         ('Thị trấn Bến Lức, Huyện Bến Lức', 14),
                                         ('Phường Mỹ Long, TP Long Xuyên', 15),
                                         ('Phường Châu Phú A, TP Châu Đốc', 15),
                                         ('Phường Vĩnh Thanh, TP Rạch Giá', 16),
                                         ('Phường Tô Châu, TP Hà Tiên', 16),
                                         ('Phường 1, TP Đà Lạt', 17),
                                         ('Phường 2, TP Bảo Lộc', 17),
                                         ('Phường Tân Lợi, TP Buôn Ma Thuột', 18),
                                         ('Thị trấn Ea Kar, Huyện Ea Kar', 18),
                                         ('Phường Tân Thạnh, TP Tam Kỳ', 19),
                                         ('Phường Minh An, TP Hội An', 19),
                                         ('Phường Đồng Mỹ, TP Đồng Hới', 20),
                                         ('Phường Ba Đồn, TX Ba Đồn', 20);

-- ------------------------------------------------------------
-- 3. ETHNICITY
-- ------------------------------------------------------------
INSERT INTO ethnicity (name) VALUES
                                 ('Kinh'), ('Tày'), ('Thái'), ('Hoa'), ('Khơ-me'), ('Mường'),
                                 ('Nùng'), ('H''Mông'), ('Dao'), ('Gia Rai'), ('Ê Đê'), ('Ba Na'),
                                 ('Chăm'), ('Sán Dìu'), ('Cơ Tu');

-- =================================================================
-- II. USER & ROLE
-- =================================================================

INSERT INTO roles(role)
VALUES ('ADMIN'), ('MANAGER'), ('COLLECTOR'), ('RESIDENT');

INSERT INTO permissions(permission)
VALUES ('VIEW_DASHBOARD'), ('MANAGE_USERS'), ('VIEW_REPORTS'),
       ('COLLECT_FEES'), ('MANAGE_FUNDS');

INSERT INTO role_permission(role_id, permission_id)
VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 1), (2, 2), (2, 3),
    (3, 1), (3, 4),
    (4, 1);

-- Mật khẩu chung theo role
SET @pass_admin  = '$2a$12$A8/XBc25xxufSCygqDp6TuBi5njm4YJw94EUuTlKNER8ozHPse5p2';
SET @pass_mgr    = '$2a$12$K4ZCq0.Qy1bsxLzvp7ELQuVlkaMGvUau7xz5/xZG5CeZg9bpnTxDS';
SET @pass_col    = '$2a$12$mwoieiJRIVNg7oUjpfI2XeIes8UVFtc9CSxv9LBvkYMc0KVfMBy3u';
SET @pass_res    = '$2a$12$Q6l6iky1PKKSwWIiXJwvtOXv9JE3MsJsBVSQP5augHTaq57ptBcwG';

INSERT INTO users (username, password_hash, role_id, manage_ward_id, created_at, updated_at)
VALUES
    ('admin', @pass_admin, 1, NULL, NOW(), NOW()),
    ('quanly', @pass_mgr, 2, NULL, NOW(), NOW()),
    ('manager2', @pass_mgr, 2, NULL, NOW(), NOW()),
    ('thuphi', @pass_col, 3, NULL, NOW(), NOW()),
    ('thuphi2', @pass_col, 3, NULL, NOW(), NOW()),
    ('cudan', @pass_res, 4, 1, NOW(), NOW());

-- =================================================================
-- III. HỘ KHẨU & NHÂN KHẨU
-- =================================================================

INSERT INTO households (ward_id, house_address_details, code, notes, created_at, updated_at)
VALUES
    (1, 'Số 15, Đường Lê Thánh Tôn', 'HK001', 'Hộ gia đình ông An', NOW(), NOW()),
    (3, 'Số 28, Ngõ 5, Phố Kim Mã', 'HK002', 'Hộ gia đình bà Lan', NOW(), NOW());

INSERT INTO persons (
    current_household_id, full_name, date_of_birth, place_of_birth,
    place_of_origin_ward_id, place_of_origin_details, ethnicity_id,
    religion, gender, occupation, workplace, id_number, id_issue_date,
    id_issue_place, phone_number, email_address, status, notes,
    perm_address_ward_id, created_at, updated_at
)
VALUES
    (1, 'Nguyễn Văn An', '1980-05-15', 'Hà Nội', 3, 'Kim Mã, Ba Đình', 1,
     'Không', 'M', 'Kỹ sư xây dựng', 'Vinaconex', '001080001234',
     '2021-01-01', 'Cục CS QLHC về TTXH', '0912345678',
     'nguyenvanan@gmail.com', 'ALIVE', 'Chủ hộ HK001', 1, NOW(), NOW()),

    (1, 'Trần Thị Bích', '1985-08-20', 'Nam Định', 1, 'TP Nam Định', 1,
     'Phật giáo', 'F', 'Giáo viên', 'Trường THPT Trưng Vương',
     '001185005678', '2021-02-02', 'Cục CS QLHC về TTXH', '0987654321',
     'tranthibich@gmail.com', 'ALIVE', 'Vợ ông An', 1, NOW(), NOW()),

    (1, 'Nguyễn Văn Cường', '2012-03-10', 'TP Hồ Chí Minh', 1, NULL, 1,
     'Không', 'M', 'Học sinh', 'Trường THCS Đồng Khởi',
     NULL, NULL, NULL, NULL, NULL, 'ALIVE', 'Con ông An', 1, NOW(), NOW());

INSERT INTO household_membership (
    household_id, person_id, is_household_head,
    relation_to_head, start_date, end_date, registration_perm_date
)
VALUES
    (1, 1, 1, 'Chủ hộ', '2020-01-01', NULL, '2020-01-01'),
    (1, 2, 0, 'Vợ', '2020-01-01', NULL, '2020-01-01'),
    (1, 3, 0, 'Con', '2020-01-01', NULL, '2020-01-01');

-- =================================================================
-- IV. QUỸ & THU PHÍ
-- =================================================================

INSERT INTO fee_types (name, description, unit, default_amount, frequency, is_mandatory, created_at, updated_at)
VALUES
    ('Phí quản lý chung cư', 'Phí vận hành, an ninh, vệ sinh hàng tháng', 'VND', 500000.00, 'MONTHLY', 1, NOW(), NOW()),
    ('Tiền nước sinh hoạt', 'Thu theo khối lượng tiêu thụ', 'VND', 150000.00, 'MONTHLY', 1, NOW(), NOW()),
    ('Quỹ An ninh Quốc phòng', 'Đóng góp tự nguyện hàng năm', 'VND', 50000.00, 'YEARLY', 0, NOW(), NOW());

INSERT INTO funds(name, description, type, currency, restricted_to, balance, created_at, updated_at)
VALUES
    ('Quỹ Hoạt động chung', 'Chi trả điện hành lang, rác thải, sửa chữa nhỏ', 'UNRESTRICTED', 'VND', NULL, 10000000.00, NOW(), NOW()),
    ('Quỹ Khuyến học & Khen thưởng', 'Dùng để khen thưởng con em cư dân', 'RESTRICTED', 'VND', NULL, 5000000.00, NOW(), NOW());

INSERT INTO fund_transactions (fund_id, transaction_type, amount, transaction_date, reference_id, reference_type, user_id, notes, created_at)
VALUES
    (1, 'INFLOW', 10000000.00, '2025-10-01', NULL, 'INITIAL', 1, 'Số dư đầu kỳ Quỹ chung', NOW()),
    (2, 'INFLOW', 5000000.00, '2025-10-01', NULL, 'INITIAL', 1, 'Tài trợ cho Quỹ khuyến học', NOW());

INSERT INTO collection_events (fee_type_id, event_date, due_date, description, collector_user_id, approver_user_id, total_expected, status, fund_id, created_at, updated_at)
VALUES
    (1, '2025-10-01', '2025-10-15', 'Thu phí quản lý tháng 10/2025', 4, 2, 500000.00, 'OPEN', 1, NOW(), NOW());

INSERT INTO payments (collection_event_id, household_id, person_id, expected_amount, amount_paid, payment_date, method, status, notes, fund_id, created_at, updated_at)
VALUES
    (1, 1, 1, 500000.00, 500000.00, '2025-10-05', 'TRANSFER', 'COMPLETED',
     'Chuyển khoản VCB', 1, NOW(), NOW());

INSERT INTO payment_logs (payment_id, change_type, change_date, amount, details, user_id)
VALUES (1, 'CREATE', NOW(), 500000.00, 'Ghi nhận thanh toán', 4);

INSERT INTO expenses (fund_id, expense_date, amount, description, approver_user_id, recipient, proof, status, notes, created_at, updated_at)
VALUES
    (1, '2025-10-06', 300000.00, 'Mua giấy in và mực in', 2, 'Fahasa', 'hoadon_fahasa_001.jpg', 'APPROVED', 'Đã duyệt', NOW(), NOW());

-- =================================================================
-- V. KHEN THƯỞNG
-- =================================================================

INSERT INTO reward_types (name, description, default_amount, created_at, updated_at)
VALUES ('Học sinh Giỏi cấp Quận/Huyện', 'Thưởng cho học sinh HSG', 200000.00, NOW(), NOW());

INSERT INTO reward_events (name, event_date, fund_id, approver_user_id, status, created_at, updated_at)
VALUES ('Tuyên dương học sinh giỏi 2024-2025', '2025-10-15', 2, 2, 'COMPLETED', NOW(), NOW());

INSERT INTO person_rewards (reward_event_id, person_id, reward_type_id, awarded_amount, gift_description, status, payout_date, created_at, updated_at)
VALUES
    (1, 3, 1, 200000.00, 'Phong bì + 10 vở Campus', 'PAID', '2025-10-16', NOW(), NOW());

-- =================================================================
-- VI. NGHIỆP VỤ KHÁC
-- =================================================================

INSERT INTO fund_transfers (source_fund_id, dest_fund_id, amount, transfer_date, reason, user_id, status, created_at, updated_at)
VALUES
    (1, 2, 500000.00, '2025-10-20', 'Trích quỹ chung hỗ trợ sự kiện', 2, 'COMPLETED', NOW(), NOW());

INSERT INTO fund_transactions (fund_id, transaction_type, amount, transaction_date, reference_id, reference_type, user_id, notes, created_at)
VALUES
    (1, 'TRANSFER_OUT', 500000.00, '2025-10-20', 1, 'TRANSFER', 2, 'Chuyển sang quỹ khuyến học', NOW()),
    (2, 'TRANSFER_IN', 500000.00, '2025-10-20', 1, 'TRANSFER', 2, 'Nhận từ quỹ chung', NOW());

INSERT INTO collection_events (fee_type_id, event_date, due_date, description, collector_user_id, approver_user_id, total_expected, status, fund_id, created_at, updated_at)
VALUES
    (2, '2025-10-01', '2025-10-20', 'Tiền nước tháng 10/2025', 4, 2, 150000.00, 'OPEN', 1, NOW(), NOW());

INSERT INTO payments (collection_event_id, household_id, person_id, expected_amount, amount_paid, payment_date, method, status, notes, fund_id, created_at, updated_at)
VALUES
    (2, 2, NULL, 150000.00, 150000.00, '2025-10-18', 'CASH', 'COMPLETED',
     'Đóng tiền mặt', 1, NOW(), NOW());

INSERT INTO payment_logs (payment_id, change_type, change_date, amount, details, user_id)
VALUES (2, 'CREATE', NOW(), 150000.00, 'Thu ngân nhận tiền', 4);
