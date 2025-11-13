"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import { locationAPI } from "@/services/api";

const PersonDetailModal = ({ open, onClose, person, onSubmit }) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  
  // State cho provinces và ethnicities
  const [provinces, setProvinces] = useState([]);
  const [ethnicities, setEthnicities] = useState([]);
  
  // State cho wards của từng địa chỉ
  const [placeOfOriginWards, setPlaceOfOriginWards] = useState([]);
  const [permAddressWards, setPermAddressWards] = useState([]);
  const [tempAddressWards, setTempAddressWards] = useState([]);

  // Load provinces và ethnicities khi modal mở
  useEffect(() => {
    const loadData = async () => {
      try {
        const [provincesData, ethnicitiesData] = await Promise.all([
          locationAPI.getAllProvinces(),
          locationAPI.getAllEthnicities()
        ]);
        setProvinces(provincesData);
        setEthnicities(ethnicitiesData);
      } catch (error) {
        console.error("Error loading data:", error);
        message.error("Không thể tải dữ liệu");
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open]);

  // Load wards khi có person data
  useEffect(() => {
    const loadWards = async () => {
      if (!person) return;

      try {
        // Load wards cho quê quán
        if (person.placeOfOriginWardId) {
          const ward = await locationAPI.getWardById(person.placeOfOriginWardId);
          if (ward?.provinceId) {
            const wards = await locationAPI.getWardsByProvince(ward.provinceId);
            setPlaceOfOriginWards(wards);
          }
        }

        // Load wards cho thường trú
        if (person.permAddressWardId) {
          const ward = await locationAPI.getWardById(person.permAddressWardId);
          if (ward?.provinceId) {
            const wards = await locationAPI.getWardsByProvince(ward.provinceId);
            setPermAddressWards(wards);
          }
        }

        // Load wards cho tạm trú
        if (person.tempAddressWardId) {
          const ward = await locationAPI.getWardById(person.tempAddressWardId);
          if (ward?.provinceId) {
            const wards = await locationAPI.getWardsByProvince(ward.provinceId);
            setTempAddressWards(wards);
          }
        }
      } catch (error) {
        console.error("Error loading wards:", error);
      }
    };

    if (open && person) {
      loadWards();
    }
  }, [open, person]);

  // Handlers cho province changes
  const handlePlaceOfOriginProvinceChange = async (provinceId) => {
    form.setFieldsValue({ placeOfOriginWardId: undefined });
    try {
      const wards = await locationAPI.getWardsByProvince(provinceId);
      setPlaceOfOriginWards(wards);
    } catch (error) {
      console.error("Error loading wards:", error);
      message.error("Không thể tải danh sách phường/xã");
    }
  };

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

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);

    // Reset form về giá trị ban đầu
    if (person) {
      loadFormData(person);
    }
  };

  const loadFormData = async (personData) => {
    // Tìm provinceId từ wardId
    let placeOfOriginProvinceId = null;
    let permAddressProvinceId = null;
    let tempAddressProvinceId = null;

    try {
      if (personData.placeOfOriginWardId) {
        const ward = await locationAPI.getWardById(personData.placeOfOriginWardId);
        placeOfOriginProvinceId = ward?.provinceId;
      }
      if (personData.permAddressWardId) {
        const ward = await locationAPI.getWardById(personData.permAddressWardId);
        permAddressProvinceId = ward?.provinceId;
      }
      if (personData.tempAddressWardId) {
        const ward = await locationAPI.getWardById(personData.tempAddressWardId);
        tempAddressProvinceId = ward?.provinceId;
      }
    } catch (error) {
      console.error("Error loading ward details:", error);
    }

    const formData = {
      ...personData,
      placeOfOriginProvinceId,
      permAddressProvinceId,
      tempAddressProvinceId,
      idIssueDate:
        personData.idIssueDate && dayjs(personData.idIssueDate).isValid()
          ? dayjs(personData.idIssueDate)
          : null,
      dateOfBirth:
        personData.dateOfBirth && dayjs(personData.dateOfBirth).isValid()
          ? dayjs(personData.dateOfBirth)
          : null,
    };
    
    form.setFieldsValue(formData);
  };

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();
  
      // Format dates
      if (formValues.idIssueDate) {
        formValues.idIssueDate = formValues.idIssueDate.format("YYYY-MM-DD");
      }
      if (formValues.dateOfBirth) {
        formValues.dateOfBirth = formValues.dateOfBirth.format("YYYY-MM-DD");
      }
  
      // Remove province fields (chỉ cần wardId)
      delete formValues.placeOfOriginProvinceId;
      delete formValues.permAddressProvinceId;
      delete formValues.tempAddressProvinceId;
  
      // ✅ THÊM DÒNG NÀY (sau delete provinces, trước merge):
      delete formValues.ethnicityName;
      delete formValues.placeOfOriginWardName;
      delete formValues.permAddressWardName;
      delete formValues.tempAddressWardName;
      delete formValues.currentHouseholdCode;
  
      // Merge với person gốc
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
    }
  };

  // Load data khi person thay đổi
  useEffect(() => {
    if (!person) return;
    loadFormData(person);
  }, [person, form]);

  return (
    <Modal
      title="Thông tin cá nhân"
      open={open}
      onCancel={() => {
        handleCancelEdit();
        setPlaceOfOriginWards([]);
        setPermAddressWards([]);
        setTempAddressWards([]);
        onClose();
      }}
      footer={null}
      width={900}
      centered
      destroyOnClose
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
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="M">Nam</Select.Option>
                <Select.Option value="F">Nữ</Select.Option>
                <Select.Option value="X">Khác</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="dateOfBirth"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker 
                className="w-full" 
                format="DD/MM/YYYY" 
                placeholder="Chọn ngày sinh" 
              />
            </Form.Item>

            <Form.Item label="Nơi sinh" name="placeOfBirth">
              <Input placeholder="Hà Nội" />
            </Form.Item>

            <Form.Item 
              label="Dân tộc" 
              name="ethnicityId"
              rules={[{ required: true, message: "Vui lòng chọn dân tộc" }]}
            >
              <Select 
                placeholder="Chọn dân tộc"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {ethnicities.map(eth => (
                  <Select.Option key={eth.id} value={eth.id}>
                    {eth.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Tôn giáo" name="religion">
              <Input placeholder="Không" />
            </Form.Item>
          </div>
        </div>

        {/* Giấy tờ tùy thân */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">
            Giấy tờ tùy thân
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Số CMND/CCCD" name="idNumber">
              <Input placeholder="001234567890" />
            </Form.Item>

            <Form.Item label="Ngày cấp" name="idIssueDate">
              <DatePicker 
                className="w-full" 
                format="DD/MM/YYYY" 
                placeholder="Chọn ngày cấp" 
              />
            </Form.Item>

            <Form.Item label="Nơi cấp" name="idIssuePlace">
              <Input placeholder="Công an TP Hà Nội" />
            </Form.Item>
          </div>
        </div>

        {/* Địa chỉ */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Địa chỉ</h3>

          {/* Quê quán */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Quê quán</p>
            <div className="grid grid-cols-3 gap-4">
              <Form.Item 
                label="Tỉnh/Thành phố" 
                name="placeOfOriginProvinceId"
              >
                <Select
                  placeholder="Chọn tỉnh/thành"
                  onChange={handlePlaceOfOriginProvinceChange}
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
                name="placeOfOriginWardId"
                rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
              >
                <Select
                  placeholder="Chọn phường/xã"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  disabled={!form.getFieldValue('placeOfOriginProvinceId')}
                >
                  {placeOfOriginWards.map(ward => (
                    <Select.Option key={ward.id} value={ward.id}>
                      {ward.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Chi tiết địa chỉ" name="placeOfOriginDetails">
                <Input placeholder="Số nhà, đường..." />
              </Form.Item>
            </div>
          </div>

          {/* Thường trú */}
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Địa chỉ thường trú</p>
            <div className="grid grid-cols-3 gap-4">
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

              <Form.Item label="Chi tiết địa chỉ" name="permAddressDetails">
                <Input placeholder="Số nhà, đường..." />
              </Form.Item>
            </div>
          </div>

          {/* Tạm trú */}
          <div>
            <p className="text-sm font-medium mb-2">Địa chỉ tạm trú (không bắt buộc)</p>
            <div className="grid grid-cols-3 gap-4">
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

              <Form.Item label="Chi tiết địa chỉ" name="tempAddressDetails">
                <Input placeholder="Số nhà, đường..." />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Liên hệ và công việc */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">
            Liên hệ & Công việc
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Nghề nghiệp" name="occupation">
              <Input placeholder="Kỹ sư" />
            </Form.Item>

            <Form.Item label="Nơi làm việc" name="workplace">
              <Input placeholder="Công ty ABC" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { pattern: /^[0-9]{10,15}$/, message: "Số điện thoại không hợp lệ" },
              ]}
            >
              <Input placeholder="0123456789" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="emailAddress"
              rules={[{ type: "email", message: "Email không hợp lệ" }]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>
          </div>
        </div>

        {/* Thông tin khác */}
        <div>
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Khác</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                <Select.Option value="ALIVE">Còn sống</Select.Option>
                <Select.Option value="DEAD">Đã mất</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Ghi chú" name="notes" className="col-span-2">
              <Input.TextArea 
                rows={3} 
                placeholder="Ghi chú thêm..." 
                showCount 
                maxLength={1000} 
              />
            </Form.Item>
          </div>
        </div>
      </Form>

      {/* Footer buttons */}
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