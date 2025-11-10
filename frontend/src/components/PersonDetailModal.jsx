"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, DatePicker, message } from "antd";
import dayjs from "dayjs";

const PersonDetailModal = ({ open, onClose, person, onSubmit }) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    
    // ✅ Reset form về giá trị ban đầu
    if (person) {
      const formData = {
        ...person,
        idIssueDate: person.idIssueDate && dayjs(person.idIssueDate).isValid()
          ? dayjs(person.idIssueDate)
          : null,
        dateOfBirth: person.dateOfBirth && dayjs(person.dateOfBirth).isValid()
          ? dayjs(person.dateOfBirth)
          : null,
      };
      form.setFieldsValue(formData);
    }
  };

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
      
      formValues.idIssueDate = formValues.idIssueDate?.format("YYYY-MM-DD");
      formValues.dateOfBirth = formValues.dateOfBirth?.format("YYYY-MM-DD");

      // ✅ Merge với person gốc
      const completeData = {
        ...person,
        ...formValues,
      };

      if (onSubmit) {
        await onSubmit(completeData);
        message.success("Cập nhật thông tin thành công!");
        setEditing(false);
        onClose();
      }
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        message.error(error.message || "Cập nhật thất bại!");
      }
      console.log("Validation failed:", error);
    }
  };

  // ✅ Không mutate person gốc
  useEffect(() => {
    if (!person) return;

    const formData = {
      ...person,
      idIssueDate: person.idIssueDate && dayjs(person.idIssueDate).isValid()
        ? dayjs(person.idIssueDate)
        : null,
      dateOfBirth: person.dateOfBirth && dayjs(person.dateOfBirth).isValid()
        ? dayjs(person.dateOfBirth)
        : null,
    };

    form.setFieldsValue(formData);
  }, [person, form]);

  return (
    <Modal
      title="Thông tin cá nhân"
      open={open}
      onCancel={() => {
        handleCancelEdit();
        onClose();
      }}
      footer={null}
      width={800}
      centered={true}
      destroyOnClose={true}
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
        className={`space-y-6 ${editing ? "" : "pointer-events-none"}`}
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