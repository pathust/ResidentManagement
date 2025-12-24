import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  message,
  List,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import PersonSearchModal from "./PersonSearchModal";
import ConfirmModal from "./ConfirmModal";

const HouseholdMemberManageModal = ({ 
  open, 
  onClose, 
  household, 
  currentMembers,
  onAddMember,
  onRemoveMember,
  onSuccess, // NEW: Callback khi thành công
}) => {
  const [members, setMembers] = useState([]);
  const [personSearchOpen, setPersonSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

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
    if (open && currentMembers) {
      setMembers(currentMembers);
    }
  }, [open, currentMembers]);

  const handleAddMemberFromSearch = (person) => {
    if (!person) return;
    
    // Check if person already exists
    if (members.some((m) => m.personId === person.id)) {
      message.info("Người này đã là thành viên của hộ khẩu");
      return;
    }

    // Add to temporary list
    setMembers((prev) => [
      ...prev,
      {
        tempId: Date.now().toString(),
        personId: person.id,
        fullName: person.fullName,
        idNumber: person.idNumber,
        dateOfBirth: person.dateOfBirth,
        gender: person.gender,
        phoneNumber: person.phoneNumber,
        isHouseholdHead: false,
        relationToHead: "",
        isNew: true, // Mark as new member
      },
    ]);
  };

  const handleRemoveMember = (member) => {
    openConfirm("remove_member", () => {
      if (member.isNew) {
        // Just remove from temporary list
        setMembers((prev) => prev.filter((m) => m.tempId !== member.tempId));
      } else {
        // Mark for deletion
        setMembers((prev) =>
          prev.map((m) =>
            m.membershipId === member.membershipId
              ? { ...m, markedForDeletion: true }
              : m
          )
        );
      }
    });
  };

  const handleUndoRemove = (membershipId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.membershipId === membershipId
          ? { ...m, markedForDeletion: false }
          : m
      )
    );
  };

  const setMemberRelation = (memberId, value) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.isNew && m.tempId === memberId) {
          return { ...m, relationToHead: value };
        } else if (!m.isNew && m.membershipId === memberId) {
          return { ...m, relationToHead: value };
        }
        return m;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Get new members to add
      const newMembers = members.filter((m) => m.isNew);
      
      // Get members to remove
      const membersToRemove = members.filter((m) => m.markedForDeletion);

      // Validate: cannot remove household head
      const removingHead = membersToRemove.some((m) => m.isHouseholdHead);
      if (removingHead) {
        message.error("Không thể xóa chủ hộ. Vui lòng đổi chủ hộ trước.");
        setLoading(false);
        return;
      }

      // Validate: new members must have relationToHead
      const invalidNewMembers = newMembers.filter(
        (m) => !m.relationToHead || m.relationToHead.trim() === ""
      );
      if (invalidNewMembers.length > 0) {
        message.error("Vui lòng nhập quan hệ với chủ hộ cho tất cả thành viên mới");
        setLoading(false);
        return;
      }

      openConfirm("submit", async () => {
        try {
          // Process removals first
          for (const member of membersToRemove) {
            await onRemoveMember(member.membershipId);
          }

          // Then process additions
          for (const member of newMembers) {
            await onAddMember({
              personId: member.personId,
              isHouseholdHead: false,
              relationToHead: member.relationToHead,
              startDate: new Date().toISOString().split('T')[0],
            });
          }

          message.success("Cập nhật thành viên thành công!");
          
          // Call success callback to refresh data
          if (onSuccess) {
            await onSuccess();
          }
          
          onClose();
        } catch (error) {
          console.error("Error updating members:", error);
          message.error(error.message || "Có lỗi xảy ra");
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error preparing update:", error);
      message.error(error.message || "Có lỗi xảy ra");
      setLoading(false);
    }
  };

  const handleClose = () => {
    openConfirm("close", () => {
      setMembers([]);
      onClose();
    });
  };

  return (
    <>
      <Modal
        title="Quản lý thành viên hộ khẩu"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={900}
        centered
        destroyOnHidden={true}
      >
        <div className="mb-4">
          <p><strong>Mã hộ khẩu:</strong> {household?.code}</p>
          <p><strong>Địa chỉ:</strong> {household?.houseAddressDetails}</p>
        </div>

        <h3 className="font-semibold text-lg border-b pb-1 mb-3">
          Danh sách thành viên
        </h3>

        <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 16 }}>
          <List
            size="small"
            dataSource={members}
            renderItem={(member) => (
              <List.Item
                style={{
                  opacity: member.markedForDeletion ? 0.5 : 1,
                  textDecoration: member.markedForDeletion ? "line-through" : "none",
                  background: member.isNew ? "#f0f7ff" : "transparent",
                  padding: "12px",
                  borderRadius: 6,
                  marginBottom: 8,
                  border: "1px solid #f0f0f0",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <strong>{member.fullName}</strong>
                      {member.isNew && (
                        <span style={{ marginLeft: 8, color: "#1890ff", fontSize: 12 }}>
                          [Mới]
                        </span>
                      )}
                      {member.markedForDeletion && (
                        <span style={{ marginLeft: 8, color: "#ff4d4f", fontSize: 12 }}>
                          [Sẽ xóa]
                        </span>
                      )}
                    </div>
                    <Space>
                      {member.markedForDeletion ? (
                        <Button
                          size="small"
                          onClick={() => handleUndoRemove(member.membershipId)}
                        >
                          Hoàn tác
                        </Button>
                      ) : (
                        !member.isHouseholdHead && (
                          <Popconfirm
                            title="Xác nhận xóa thành viên này?"
                            onConfirm={() => handleRemoveMember(member)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                            >
                              Xóa
                            </Button>
                          </Popconfirm>
                        )
                      )}
                    </Space>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 13 }}>
                    <div>CCCD: {member.idNumber || "—"}</div>
                    <div>Ngày sinh: {member.dateOfBirth || "—"}</div>
                    <div>Giới tính: {member.gender === "M" ? "Nam" : "Nữ"}</div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    {member.isHouseholdHead ? (
                      <span style={{ color: "#1890ff", fontWeight: 500 }}>Chủ hộ</span>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "#666" }}>Quan hệ với chủ hộ:</span>
                        <Input
                          placeholder="Vợ, con, bố, mẹ..."
                          value={member.relationToHead}
                          onChange={(e) =>
                            setMemberRelation(
                              member.isNew ? member.tempId : member.membershipId,
                              e.target.value
                            )
                          }
                          style={{ width: 200 }}
                          disabled={member.markedForDeletion}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={() => setPersonSearchOpen(true)}
        >
          Thêm thành viên mới
        </Button>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <Button onClick={handleClose} disabled={loading}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Xác nhận
          </Button>
        </div>
      </Modal>

      {/* Person search modal */}
      <PersonSearchModal
        open={personSearchOpen}
        onClose={() => setPersonSearchOpen(false)}
        onConfirm={handleAddMemberFromSearch}
      />

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmOpen}
        onCancel={handleConfirmNo}
        onConfirm={handleConfirmYes}
        message={
          confirmContext === "remove_member"
            ? "Bạn có chắc muốn xóa thành viên này?"
            : confirmContext === "submit"
            ? "Bạn có chắc muốn lưu các thay đổi?"
            : "Bạn có chắc muốn đóng? Các thay đổi sẽ không được lưu."
        }
      />
    </>
  );
};

export default HouseholdMemberManageModal;