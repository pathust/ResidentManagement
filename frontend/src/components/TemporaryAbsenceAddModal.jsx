"use client";

import React from "react";
import { Modal, Form, Input, DatePicker, Select, message } from "antd";
import { locationAPI, personAPI } from "@/services/api";
import { householdsAPI } from "@/services/householdsAPI";

const TemporaryAbsenceAddModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  
  const [provinces, setProvinces] = React.useState([]);
  const [permAddressWards, setPermAddressWards] = React.useState([]);
  const [tempAddressWards, setTempAddressWards] = React.useState([]);
  const [persons, setPersons] = React.useState([]);
  const [households, setHouseholds] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [provincesData, personsData, householdsData] = await Promise.all([
          locationAPI.getAllProvinces(),
          personAPI.getAll(),
          householdsAPI.getAll({ pageSize: 100, pageIndex: 0 })
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

  const handlePermAddressProvinceChange = async (provinceId) => {
    form.setFieldsValue({ permAddressWardId: undefined });
    try {
      const wards = await locationAPI.getWardsByProvince(provinceId);
      setPermAddressWards(wards);
    } catch (error) {
      console.error("Error loading wards:", error);
      message.error("Không thể tải danh sách phường/xã");
    }
  };

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

      delete values.permAddressProvinceId;
      delete values.tempAddressProvinceId;

      setLoading(true);
      await onSubmit(values);
      
      message.success("Đăng ký tạm vắng thành công!");
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
      title="Đăng ký tạm vắng"
      open={open}
      onCancel={() => {
        form.resetFields();
        setPermAddressWards([]);
        setTempAddressWards([]);
        onClose();
      }}
      onOk={handleSubmit}
      okText="Đăng ký"
      cancelText="Hủy"
      confirmLoading={loading}
      width={800}
      centered
      destroyOnHidden={true}
      maskClosable={false}
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="Người đăng ký"
          name="personId"
          rules={[{ required: true, message: "Vui lòng chọn người" }]}
        >
          <Select
            placeholder="Chọn người đăng ký tạm vắng"
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

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Nơi đến"
            name="destination"
            rules={[{ required: true, message: "Vui lòng nhập nơi đến" }]}
          >
            <Input placeholder="Ví dụ: Hà Nội, TP.HCM..." />
          </Form.Item>

          <Form.Item
            label="Lý do"
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
          >
            <Input placeholder="Ví dụ: Công tác, du học..." />
          </Form.Item>
        </div>

        <h3 className="font-semibold text-base mb-3 mt-4">Địa chỉ thường trú</h3>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item 
            label="Tỉnh/Thành phố" 
            name="permAddressProvinceId"
          >
            <Select
              placeholder="Chọn tỉnh/thành"
              onChange={handlePermAddressProvinceChange}
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
            name="permAddressWardId"
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select
              placeholder="Chọn phường/xã"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!form.getFieldValue('permAddressProvinceId')}
            >
              {permAddressWards.map(ward => (
                <Select.Option key={ward.id} value={ward.id}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item 
          label="Chi tiết địa chỉ thường trú" 
          name="permAddressDetails"
        >
          <Input placeholder="Số nhà, đường..." />
        </Form.Item>

        <h3 className="font-semibold text-base mb-3 mt-4">Địa chỉ tạm vắng (không bắt buộc)</h3>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item 
            label="Tỉnh/Thành phố" 
            name="tempAddressProvinceId"
          >
            <Select
              placeholder="Chọn tỉnh/thành"
              onChange={handleTempAddressProvinceChange}
              showSearch
              allowClear
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
          >
            <Select
              placeholder="Chọn phường/xã"
              showSearch
              allowClear
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
          label="Chi tiết địa chỉ tạm vắng" 
          name="tempAddressDetails"
        >
          <Input placeholder="Số nhà, đường..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TemporaryAbsenceAddModal;