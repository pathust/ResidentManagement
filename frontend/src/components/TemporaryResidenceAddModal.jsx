"use client";

import React from "react";
import { Modal, Form, Input, DatePicker, Select, message } from "antd";
import { locationAPI, personAPI, householdAPI } from "@/services/api";
import dayjs from "dayjs";

const TemporaryResidenceAddModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  
  const [provinces, setProvinces] = React.useState([]);
  const [tempAddressWards, setTempAddressWards] = React.useState([]);
  const [persons, setPersons] = React.useState([]);
  const [households, setHouseholds] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [provincesData, personsData, householdsData] = await Promise.all([
          locationAPI.getAllProvinces(),
          personAPI.getAll(),
          householdAPI.getAll({ pageSize: 100, pageIndex: 0 })
        ]);
        setProvinces(provincesData);
        setPersons(personsData);
        setHouseholds(householdsData);
      } catch (error) {
        console.error("Error loading data:", error);
        message.error("Không thể tải dữ liệu");
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open]);

  const handleTempAddressProvinceChange = async (provinceId) => {
    form.setFieldsValue({ tempAddressWardId: undefined });
    try {
      const wards = await locationAPI.getWardsByProvince(provinceId);
      setTempAddressWards(wards);
    } catch (error) {
      console.error("Error loading wards:", error);
      message.error("Không thể tải danh sách phường/xã");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (values.startDate) {
        values.startDate = values.startDate.format("YYYY-MM-DD");
      }
      if (values.endDate) {
        values.endDate = values.endDate.format("YYYY-MM-DD");
      }

      delete values.tempAddressProvinceId;

      setLoading(true);
      await onSubmit(values);
      
      message.success("Đăng ký tạm trú thành công!");
      form.resetFields();
      onClose();
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        message.error(error.message || "Đăng ký thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đăng ký tạm trú"
      open={open}
      onCancel={() => {
        form.resetFields();
        setTempAddressWards([]);
        onClose();
      }}
      onOk={handleSubmit}
      okText="Đăng ký"
      cancelText="Hủy"
      confirmLoading={loading}
      width={700}
      centered
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="Người đăng ký"
          name="personId"
          rules={[{ required: true, message: "Vui lòng chọn người" }]}
        >
          <Select
            placeholder="Chọn người đăng ký tạm trú"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {persons.map(person => (
              <Select.Option key={person.id} value={person.id}>
                {person.fullName} - {person.idNumber || "Chưa có CCCD"}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Hộ khẩu hiện tại"
          name="currentHouseholdId"
        >
          <Select
            placeholder="Chọn hộ khẩu"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {households.map(hh => (
              <Select.Option key={hh.id} value={hh.id}>
                {hh.code} - {hh.houseAddressDetails}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Từ ngày"
            name="startDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
          >
            <DatePicker 
              className="w-full" 
              format="DD/MM/YYYY" 
              placeholder="Chọn ngày bắt đầu"
            />
          </Form.Item>

          <Form.Item
            label="Đến ngày"
            name="endDate"
          >
            <DatePicker 
              className="w-full" 
              format="DD/MM/YYYY" 
              placeholder="Chọn ngày kết thúc (không bắt buộc)"
            />
          </Form.Item>
        </div>

        <h3 className="font-semibold text-base mb-3">Địa chỉ tạm trú</h3>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item 
            label="Tỉnh/Thành phố" 
            name="tempAddressProvinceId"
          >
            <Select
              placeholder="Chọn tỉnh/thành"
              onChange={handleTempAddressProvinceChange}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {provinces.map(prov => (
                <Select.Option key={prov.id} value={prov.id}>
                  {prov.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            label="Phường/Xã" 
            name="tempAddressWardId"
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select
              placeholder="Chọn phường/xã"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!form.getFieldValue('tempAddressProvinceId')}
            >
              {tempAddressWards.map(ward => (
                <Select.Option key={ward.id} value={ward.id}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item 
          label="Chi tiết địa chỉ tạm trú" 
          name="tempAddressDetails"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
        >
          <Input placeholder="Số nhà, đường..." />
        </Form.Item>

        <Form.Item label="Ghi chú" name="details">
          <Input.TextArea 
            rows={3} 
            placeholder="Lý do tạm trú, thông tin thêm..." 
            showCount 
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemporaryResidenceAddModal;