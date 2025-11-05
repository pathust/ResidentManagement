"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

const PersonDetailModal = ({ open, onClose, person, onSubmit }) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    form.setFieldsValue(person);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.idIssueDate = values.idIssueDate?.format("YYYY-MM-DD");
      values.dateOfBirth = values.dateOfBirth?.format("YYYY-MM-DD");

      if (onSubmit) await onSubmit(values);
    } catch (error) {
      console.log("Validation failed:", error);
    } finally {
      setEditing(false);
      form.setFieldsValue(person);
    }
  };

  useEffect(() => {
    const reselectHandler = () => {
      person.idIssueDate = person.idIssueDate && dayjs(person.idIssueDate).isValid()
        ? dayjs(person.idIssueDate)
        : null;
        
      person.dateOfBirth = person.dateOfBirth && dayjs(person.dateOfBirth).isValid()
        ? dayjs(person.dateOfBirth)
        : null;

      form.setFieldsValue(person);
    }

    reselectHandler();
  }, [person])

  return (
    <Modal
      title="Thông tin cá nhân"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered={true}
      destroyOnHidden={true}
      maskClosable={false}
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: "1rem",
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        // disabled={!editing}
        className={`space-y-6 ${editing?"":"pointer-events-none"}`}
      >
        {/* Thông tin cơ bản */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Họ và tên" name="fullName"><Input /></Form.Item>
            <Form.Item label="Giới tính" name="gender"><Input /></Form.Item>
            <Form.Item label="Ngày sinh" name="dateOfBirth"><DatePicker className="w-full" /></Form.Item>
            <Form.Item label="Nơi sinh" name="placeOfBirth"><Input /></Form.Item>
            <Form.Item label="Dân tộc" name="ethnicityName"><Input /></Form.Item>
            <Form.Item label="Tôn giáo" name="religion"><Input /></Form.Item>
          </div>
        </div>

        {/* Giấy tờ tùy thân */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Giấy tờ tùy thân</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Số CMND/CCCD" name="idNumber"><Input /></Form.Item>
            <Form.Item label="Ngày cấp" name="idIssueDate"><DatePicker className="w-full" /></Form.Item>
            <Form.Item label="Nơi cấp" name="idIssuePlace"><Input /></Form.Item>
          </div>
        </div>

        {/* Địa chỉ */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Địa chỉ</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Quê quán" name="placeOfOriginDetails"><Input /></Form.Item>
            <Form.Item label="Phường/Xã (Quê quán)" name="placeOfOriginWardName"><Input /></Form.Item>
            <Form.Item label="Địa chỉ thường trú" name="permAddressDetails"><Input /></Form.Item>
            <Form.Item label="Phường/Xã (Thường trú)" name="permAddressWardName"><Input /></Form.Item>
            <Form.Item label="Địa chỉ tạm trú" name="tempAddressDetails"><Input /></Form.Item>
            <Form.Item label="Phường/Xã (Tạm trú)" name="tempAddressWardName"><Input /></Form.Item>
          </div>
        </div>

        {/* Liên hệ và công việc */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Liên hệ & Công việc</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Nghề nghiệp" name="occupation"><Input /></Form.Item>
            <Form.Item label="Nơi làm việc" name="workplace"><Input /></Form.Item>
            <Form.Item label="Số điện thoại" name="phoneNumber"><Input /></Form.Item>
            <Form.Item label="Email" name="emailAddress"><Input /></Form.Item>
          </div>
        </div>

        {/* Thông tin khác */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Khác</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Trạng thái" name="status"><Input /></Form.Item>
            <Form.Item label="Ghi chú" name="notes">
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>
        </div>
      </Form>

      {/* Footer cố định */}
      <div className="flex justify-end gap-3 mt-6 pt-3 border-t sticky bottom-0 bg-white z-10">
        {!editing ? (
          <Button type="primary" onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        ) : (
          <>
            <Button onClick={handleCancelEdit}>Hủy</Button>
            <Button type="primary" onClick={handleSubmit}>
              Xác nhận
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PersonDetailModal;
