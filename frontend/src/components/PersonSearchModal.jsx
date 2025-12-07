import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Button,
  message,
  List,
} from "antd";

import { searchPersons } from "@/services/searchAPI";

const PersonSearchModal = ({ open, onClose, onConfirm }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // debounced input
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await searchPersons(query);
        setResults(res);
      } catch (err) {
        setResults([]);
        console.error(err);
        message.error("Lỗi khi tìm kiếm");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedId(null);
      setResults([]);
    }
  }, [open]);

  const handleConfirm = () => {
    const selected = results.find((r) => r.id === selectedId) || null;
    onConfirm(selected);
    onClose();
  };

  return (
    <Modal
      title="Tìm kiếm"
      open={open}
      onCancel={() => onClose()}
      footer={null}
      width={600}
      centered
      destroyOnHidden
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <Input
          placeholder="Nhập tên hoặc CCCD..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => setQuery("")}>X</Button>
      </div>

      <div style={{ maxHeight: 240, overflowY: "auto", border: "1px solid #f0f0f0", padding: 8 }}>
        <List
          size="small"
          dataSource={results}
          loading={loading}
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelectedId(item.id)}
              style={{
                cursor: "pointer",
                background: selectedId === item.id ? "#e6f7ff" : "transparent",
                borderRadius: 4,
                padding: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.fullName}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{item.idNumber} - {item.dateOfBirth}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{item.gender=="M"?"Nam":"Nữ"}</div>
                </div>
                <div style={{ alignSelf: "center" }}>{selectedId === item.id ? "✓" : null}</div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <Button onClick={() => { onConfirm(null); onClose(); }} style={{ marginRight: 8 }}>
          Hủy
        </Button>
        <Button type="primary" onClick={handleConfirm} disabled={!selectedId}>
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};

export default PersonSearchModal;