// src/components/Home.js
import React, { useState } from 'react';
import { Layout, Menu, Row, Col, Typography, Card, Button, Tooltip } from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [tooltipVisible, setTooltipVisible] = useState('');

  const handleMouseEnter = (buttonType) => {
    setTooltipVisible(buttonType);
  };

  const handleMouseLeave = () => {
    setTooltipVisible('');
  };

  return (
    <Layout className="layout">
      {/* Header */}
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>Home</Menu.Item>
        </Menu>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '50px 0', backgroundColor: '#f0f2f5' }}>
        <Row justify="center">
          <Col span={16}>
            <Title level={2} style={{ textAlign: 'center' }}>Welcome to Cdrrmo</Title>
            <Text style={{ display: 'block', textAlign: 'center', fontSize: '16px', marginBottom: '20px' }}>
              A LAN-based file sharing system for seamless transfers within your network.
            </Text>
            <Row gutter={[16, 16]} justify="center">
              <Col span={8}>
                <Card bordered={false} style={{ textAlign: 'center' }}>
                  <Tooltip title="Access your account" visible={tooltipVisible === 'login'}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<LoginOutlined />}
                      style={{ width: '100%' }}
                      onMouseEnter={() => handleMouseEnter('login')}
                      onMouseLeave={handleMouseLeave}
                    >
                      Login
                    </Button>
                  </Tooltip>
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} style={{ textAlign: 'center' }}>
                  <Tooltip title="Create a new account" visible={tooltipVisible === 'register'}>
                    <Button
                      type="default"
                      size="large"
                      icon={<UserAddOutlined />}
                      style={{ width: '100%' }}
                      onMouseEnter={() => handleMouseEnter('register')}
                      onMouseLeave={handleMouseLeave}
                    >
                      Register
                    </Button>
                  </Tooltip>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: '#fff' }}>
        Cdrrmo File Sharing System ©2025 Created by Your Name
      </Footer>
    </Layout>
  );
};

export default Home;
