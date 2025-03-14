// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Row, Col, Typography, Tooltip } from 'antd';
import { HomeOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <Layout className="layout">
      {/* Header */}
      <Header style={{ position: 'sticky', top: 0, zIndex: 1 }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" selectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate('/')}>Home</Menu.Item>
        </Menu>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '100px 0', textAlign: 'center', backgroundColor: '#f0f2f5' }}>
        <Title level={2}>Welcome To Our App</Title>
        <p>A LAN-based file sharing system for seamless transfers within your network.</p>
        <Row justify="center" gutter={16}>
          <Col>
            <Tooltip title="Access your account">
              <Button
                type="primary"
                icon={<LoginOutlined />}
                size="large"
                onClick={handleLoginClick}
                style={{ margin: '0 10px' }}
              >
                Login
              </Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip title="Create a new account">
              <Button
                type="default"
                icon={<UserAddOutlined />}
                size="large"
                onClick={handleRegisterClick}
                style={{ margin: '0 10px' }}
              >
                Register
              </Button>
            </Tooltip>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: '#fff' }}>
        Cdrrmo File Sharing System ©2025 Created by Matrix
      </Footer>
    </Layout>
  );
};

export default Home;
