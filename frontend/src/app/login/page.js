"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const result = await login(values.username, values.password);

      if (result.success) {
        message.success("Đăng nhập thành công!");
        router.replace("/dashboard");
        router.refresh();

        await new Promise((resolve) => setTimeout(resolve, 500));
        router.replace("/dashboard");
      } else {
        message.error(result.error || "Đăng nhập thất bại!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          borderRadius: 8,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Đăng nhập
          </Title>
          <Text type="secondary">Hệ thống quản lý khu dân cư</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}