import React, { useState, useEffect, use } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
} from "antd";
import PersonSearchModal from "./PersonSearchModal";
import { useAuth } from "@/contexts/AuthContext";

const HouseholdAddModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [Wards, setWards] = useState([]);

  // confirm modal (shared)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // person search modal
  const [personSearchOpen, setPersonSearchOpen] = useState(false);

  const { util } = useAuth();

  const openConfirm = (context, action) => {
    setConfirmContext(context);
    setPendingAction(() => action);
    setConfirmOpen(true);
  };

  const handleConfirmYes = () => {
    if (pendingAction) pendingAction();
    setConfirmOpen(false);
  };

  const handleConfirmNo = () => {
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setMembers([]);
    }
  }, [open]);

  useEffect(() => {
    if (util && util.provincesData.length > 0) {
      setProvinces(util.provincesData.map((p) => ({ id: p.id, name: p.name })));
    }
  }, [util]);

  const handleProvinceChange = (value) => {
    const wards = util.provincesData.find((p) => p.id === value)?.wards || [];

    setWards(wards);
    form.setFieldsValue({ wardId: undefined });
  };

  // Add member via personSearchModal result
  const handleAddMemberFromPerson = (person) => {
    if (!person) return;
    // avoid duplicates by id
    if (members.some((m) => m.personId === person.id)) {
      message.info("Người này đã có trong danh sách");
      return;
    }
    setMembers((prev) => [
      ...prev,
      {
        tempId: Date.now().toString(),
        personId: person.id,
        fullName: person.fullName,
        idNumber: person.idNumber,
        dateOfBirth: person.dateOfBirth,
        isHead: false,
        relationWithHead: "",
        isHouseholdHead: false,
      },
    ]);
  };

  const handleRemoveMember = (tempId) => {
    openConfirm("remove_member", () => {
      setMembers((prev) => prev.filter((m) => m.tempId !== tempId));
    });
  };

  const setMemberHead = (tempId, isHead) => {
    if (isHead) {
      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          isHead: m.tempId === tempId,
          relationWithHead: m.tempId === tempId ? "" : m.relationWithHead
        }))
      );
    } else {
      setMembers((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, isHead: false } : m
        )
      );
    }
  };

  const setMemberRelationWithHead = (tempId, value) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.tempId === tempId ? { ...m, relationWithHead: value } : m
      )
    );
  };

  const handleSubmit = async () => {
    // validate form fields first
    try {
      const values = await form.validateFields();

      const headCount = members.filter((m) => m.isHead).length;
      if (headCount !== 1) {
        message.error("Phải có đúng 1 chủ hộ trước khi gửi (chọn 1 người là 'Chủ hộ')");
        return;
      }

      // build payload: only send ids of persons added
      const payload = {
        code: values.code,
        wardId: values.wardId,
        houseAddressDetails: values.houseAddressDetails || "",
        notes: values.notes || "",
        members: members.map((m) => ({
          personId: m.personId,
          isHead: m.isHead,
          relationWithHead: m.relationWithHead
        })),
      };

      // open confirm before actually submitting
      openConfirm("submit_form", async () => {
        if (onSubmit) await onSubmit(payload);
        message.success("Tạo hộ khẩu thành công!");
        form.resetFields();
        setMembers([]);
        onClose();
      });

    } catch (err) {
      message.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  const handleClose = () => {
    openConfirm("close_modal", () => {
      form.resetFields();
      setMembers([]);
      onClose();
    });
  };

  return (
    <>
      <Modal
        title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Tạo hộ khẩu mới</span>
        </div>}
        open={open}
        onCancel={handleClose}
        footer={null}
        width={900}
        centered
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <h3 className="font-semibold text-lg border-b pb-1 mb-3">Thông tin chung</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item label="Mã hộ khẩu" name="code" rules={[{ required: true, message: "Nhập mã hộ khẩu" }]}>
              <Input placeholder="HK123" />
            </Form.Item>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Địa chỉ</p>
              <div className="grid grid-cols-3 gap-4">
                <Form.Item 
                  label="Tỉnh/Thành phố" 
                  name="provinceId"
                  rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành"
                    onChange={handleProvinceChange}
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
                  name="wardId"
                  rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    disabled={!form.getFieldValue('provinceId')}
                  >
                    {Wards.map(ward => (
                      <Select.Option key={ward.id} value={ward.id}>
                        {ward.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
  
                <Form.Item label="Chi tiết địa chỉ" name="houseAddressDetails">
                  <Input placeholder="Số nhà, đường..." />
                </Form.Item>
              </div>
            </div>
  

            <Form.Item label="Ghi chú" name="notes">
              <Input.TextArea rows={2} placeholder="Ghi chú thêm..." />
            </Form.Item>
          </div>
        </Form>

        <h3 className="font-semibold text-lg border-b pb-1 mt-6 mb-3">Danh sách thành viên khởi tạo</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {members.map((m) => (
            <div key={m.tempId} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 220px 60px", gap: 8, alignItems: "center", border: "1px solid #f0f0f0", padding: 8, borderRadius: 6 }}>
              <div style={{ fontWeight: 600 }}>{m.fullName}</div>
              <div>{m.idNumber}</div>
              <div>{m.dateOfBirth}</div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Select
                  value={m.isHead}
                  onChange={(value) => setMemberHead(m.tempId, value)}
                  style={{ width: 140 }}
                >
                  <Select.Option value={true}>Chủ hộ</Select.Option>
                  <Select.Option value={false}>Khác</Select.Option>
                </Select>

                {!m.isHead && (
                  <Input
                    placeholder="Quan hệ với chủ hộ"
                    value={m.relationWithHead}
                    onChange={(e) => setMemberRelationWithHead(m.tempId, e.target.value)} />
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <Button danger onClick={() => handleRemoveMember(m.tempId)}>-</Button>
              </div>
            </div>
          ))}

          <Button type="dashed" block onClick={() => setPersonSearchOpen(true)}>+ Thêm thành viên</Button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <Button style={{ marginRight: 8 }} onClick={handleClose}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit}>Xác nhận</Button>
        </div>
      </Modal>

      {/* Person search modal */}
      <PersonSearchModal
        open={personSearchOpen}
        onClose={() => setPersonSearchOpen(false)}
        onConfirm={(person) => handleAddMemberFromPerson(person)}
      />

      {/* Shared small confirm modal */}
      <Modal
        open={confirmOpen}
        onCancel={handleConfirmNo}
        onOk={handleConfirmYes}
        okText="Đồng ý"
        cancelText="Hủy"
        centered
        width={360}
        destroyOnHidden
      >
        {confirmContext === "remove_member" && <p>Bạn có chắc muốn xóa thành viên này?</p>}
        {confirmContext === "submit_form" && <p>Bạn có chắc muốn gửi thông tin hộ khẩu?</p>}
        {confirmContext === "close_modal" && <p>Bạn có chắc muốn đóng? Mọi dữ liệu sẽ bị mất.</p>}
      </Modal>
    </>
  );
};

export default HouseholdAddModal;
