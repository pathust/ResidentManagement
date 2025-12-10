// frontend/src/components/DeathDeclareAddModal.jsx
"use client";

import React from "react";
import { Modal, Form, Input, DatePicker, Select, message } from "antd";
import { locationAPI, personAPI } from "@/services/api";
import dayjs from "dayjs";

const DeathDeclareAddModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  
  const [provinces, setProvinces] = React.useState([]);
  const [lastResidenceWards, setLastResidenceWards] = React.useState([]);
  const [persons, setPersons] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [provincesData, personsData] = await Promise.all([
          locationAPI.getAllProvinces(),
          personAPI.getAll()
        ]);
        setProvinces(provincesData);
        setPersons(personsData.filter(p => p.status === "ALIVE"));
      } catch (error) {
        console.error("Error loading data:", error);
        message.error("Không thể tải dữ liệu");
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open]);

  const handleLastResidenceProvinceChange = async (provinceId) => {
    form.setFieldsValue({ lastPermanentResidenceWardId: undefined });
    try {
      const wards = await locationAPI.getWardsByProvince(provinceId);
      setLastResidenceWards(wards);
    } catch (error) {
      console.error("Error loading wards:", error);
      message.error("Không thể tải danh sách phường/xã");
    }
  };

  const handleDeclarerChange = (declarerId) => {
    const declarer = persons.find(p => p.id === declarerId);
    if (declarer?.permAddressWardId) {
      locationAPI.getWardById(declarer.permAddressWardId).then(ward => {
        if (ward?.provinceId) {
          form.setFieldsValue({ 
            lastResidenceProvinceId: ward.provinceId,
            lastPermanentResidenceWardId: declarer.permAddressWardId,
            lastPermanentResidenceDetails: declarer.permAddressDetails
          });
          handleLastResidenceProvinceChange(ward.provinceId);
        }
      });
    }
  };

  const handlePersonChange = (personId) => {
    const person = persons.find(p => p.id === personId);
    if (person) {
      form.setFieldsValue({
        idNumber: person.idNumber
      });
      
      if (person.permAddressWardId) {
        locationAPI.getWardById(person.permAddressWardId).then(ward => {
          if (ward?.provinceId) {
            form.setFieldsValue({ 
              lastResidenceProvinceId: ward.provinceId,
              lastPermanentResidenceWardId: person.permAddressWardId,
              lastPermanentResidenceDetails: person.permAddressDetails
            });
            handleLastResidenceProvinceChange(ward.provinceId);
          }
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (values.dateOfDeclaration) {
        values.dateOfDeclaration = values.dateOfDeclaration.format("YYYY-MM-DD");
      }
      if (values.timeOfDeath) {
        values.timeOfDeath = values.timeOfDeath.format("YYYY-MM-DDTHH:mm:ss");
      }

      delete values.lastResidenceProvinceId;

      setLoading(true);
      await onSubmit(values);
      
      message.success("Khai tử thành công!");
      form.resetFields();
      onClose();
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin!");
      } else {
        message.error(error.message || "Khai tử thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Custom filter function cho Select
  const filterPersonOption = (input, option) => {
    const person = persons.find(p => p.id === option.value);
    if (!person) return false;
    
    const searchStr = input.toLowerCase();
    const fullName = (person.fullName || '').toLowerCase();
    const idNumber = (person.idNumber || '').toLowerCase();
    
    return fullName.includes(searchStr) || idNumber.includes(searchStr);
  };

  return (
    <Modal
      title="Khai tử"
      open={open}
      onCancel={() => {
        form.resetFields();
        setLastResidenceWards([]);
        onClose();
      }}
      onOk={handleSubmit}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={loading}
      width={800}
      centered
      destroyOnClose={true}
      maskClosable={false}
      styles={{
        body: {
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <h3 className="font-semibold text-base mb-3">Thông tin người mất</h3>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Người mất"
            name="personId"
            rules={[{ required: true, message: "Vui lòng chọn người" }]}
          >
            <Select
              placeholder="Nhập tên hoặc CCCD để tìm kiếm..."
              showSearch
              onChange={handlePersonChange}
              filterOption={filterPersonOption}
              optionFilterProp="children"
            >
              {persons.map(person => (
                <Select.Option key={person.id} value={person.id}>
                  {person.fullName} - {person.idNumber || "Chưa có CCCD"}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Số CCCD (không bắt buộc)"
            name="idNumber"
          >
            <Input placeholder="Số CCCD" disabled />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Thời gian mất"
            name="timeOfDeath"
            rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
          >
            <DatePicker 
              showTime
              className="w-full" 
              format="DD/MM/YYYY HH:mm:ss" 
              placeholder="Chọn thời gian mất"
            />
          </Form.Item>

          <Form.Item
            label="Ngày khai tử"
            name="dateOfDeclaration"
            rules={[{ required: true, message: "Vui lòng chọn ngày khai tử" }]}
            initialValue={dayjs()}
          >
            <DatePicker 
              className="w-full" 
              format="DD/MM/YYYY" 
              placeholder="Chọn ngày khai tử"
            />
          </Form.Item>
        </div>

        <h3 className="font-semibold text-base mb-3 mt-4">Thông tin người khai tử</h3>

        <Form.Item
          label="Người khai tử"
          name="declarerId"
          rules={[{ required: true, message: "Vui lòng chọn người khai tử" }]}
        >
          <Select
            placeholder="Nhập tên hoặc CCCD để tìm kiếm..."
            showSearch
            onChange={handleDeclarerChange}
            filterOption={filterPersonOption}
            optionFilterProp="children"
          >
            {persons.map(person => (
              <Select.Option key={person.id} value={person.id}>
                {person.fullName} - {person.idNumber || "Chưa có CCCD"}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <h3 className="font-semibold text-base mb-3 mt-4">Địa chỉ thường trú cuối cùng</h3>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item 
            label="Tỉnh/Thành phố" 
            name="lastResidenceProvinceId"
          >
            <Select
              placeholder="Chọn tỉnh/thành"
              onChange={handleLastResidenceProvinceChange}
              showSearch
              filterOption={(input, option) =>
                (option?.children?.toString() || '').toLowerCase().includes(input.toLowerCase())
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
            name="lastPermanentResidenceWardId"
            rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
          >
            <Select
              placeholder="Chọn phường/xã"
              showSearch
              filterOption={(input, option) =>
                (option?.children?.toString() || '').toLowerCase().includes(input.toLowerCase())
              }
              disabled={!form.getFieldValue('lastResidenceProvinceId')}
            >
              {lastResidenceWards.map(ward => (
                <Select.Option key={ward.id} value={ward.id}>
                  {ward.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item 
          label="Chi tiết địa chỉ" 
          name="lastPermanentResidenceDetails"
        >
          <Input placeholder="Số nhà, đường..." />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea 
            rows={3} 
            placeholder="Ghi chú thêm..." 
            showCount 
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeathDeclareAddModal;