import React from "react";
import { Modal } from "antd";

export const ConfirmActionModal = ({ open, onCancel, onConfirm, message }) => (
    <Modal
        open={open}
        onOk={onConfirm}
        onCancel={onCancel}
        okText="Đồng ý"
        cancelText="Hủy"
        centered
        width={360}
        destroyOnHidden
    >
        <p>{message}</p>
    </Modal>
);

export default ConfirmActionModal;