import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminDetails, logoutAdmin, updateProfile } from '../../action/adminAction';
import { useNavigate } from 'react-router-dom';
import { notification, Input, Tag, Upload, Modal, Form } from 'antd';
import { Card, Button, Typography, Avatar, Divider, Row, Col } from 'antd';
import { LogoutOutlined, SaveOutlined, EditOutlined, BackwardOutlined, UploadOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import 'antd/dist/reset.css';

// Styled Components
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgb(105, 59, 184);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgb(105, 59, 184);
  }
`;

const StyledCard = styled(Card)`
  width: 90%;
  max-width: 900px;
  margin: 50px auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  position: relative;
  overflow: visible;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StyledButton = styled(Button)`
  background-color: #693bb8;
  color: white;
  padding: 10px 20px;
  &:hover {
    background-color: #5638a0;
  }
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  text-transform: none;
  font-weight: 600;
  margin-right: 16px;
`;

const ProfileItem = styled(Typography.Text)`
  color: #595959;
  margin-bottom: 16px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AnimatedAvatar = styled(Avatar)`
  width: 196px;
  height: 196px;
  font-size: 48px;
  color: rgb(245, 106, 0);
  background-color: rgb(253, 227, 207);
  box-shadow: rgba(150, 190, 238, 0.35) 0px 0px 15px 3px;
  animation: ${pulseAnimation} 2s infinite;
  cursor: pointer;
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  .ant-modal-header {
    border-radius: 20px 20px 0 0;
    background-color: white;
    border-bottom: none;
  }
  .ant-modal-title {
    color: black;
    font-weight: 600;
  }
  .ant-modal-body {
    padding: 24px;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: #595959;
    font-weight: 500;
  }
  .ant-input, .ant-input-password {
    border-radius: 8px;
  }
  .ant-upload.ant-upload-select {
    width: 100%;
  }
`;

const StyledFormButton = styled(Button)`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
  background-color: #693bb8;
  border-color: #693bb8;
  &:hover, &:focus {
    background-color: #5638a0;
    border-color: #5638a0;
  }
`;

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleBackClick = () => {
    window.history.back();
  };

  const showEditProfileModal = () => {
    form.setFieldsValue({
      name: admin?.name,
      email: admin?.email,
    });
    setIsEditProfileVisible(true);
  };

  const handleEditProfileCancel = () => {
    setIsEditProfileVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    notification.success({
      message: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/pages/login/login3');
  };

  useEffect(() => {
    console.log("Current admin state:", admin);
  }, [admin]);

  const handleUpdate = async (values) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', values.name);
      formDataToSend.append('email', values.email);
      if (values.newPassword) {
        formDataToSend.append('newPassword', values.newPassword);
      }
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formDataToSend.append('profile', fileList[0].originFileObj);
      }

      const result = await dispatch(updateProfile(formDataToSend));
      
      if (updateProfile.fulfilled.match(result)) {
        notification.success({
          message: 'Update admin Successfully',
          description: 'Your profile has been updated.',
        });
        setIsEditProfileVisible(false);
        setFileList([]);
        dispatch(getAdminDetails()); // Reload user data
      } else {
        throw new Error(result.error.message || 'Failed to update admin');
      }
    } catch (error) {
      console.error('Update admin failed:', error);
      notification.error({
        message: 'Update Failed',
        description: error.message || 'There was an error updating your profile.',
      });
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    dispatch(getAdminDetails());
  }, [dispatch]);

  useEffect(() => {
    if (admin) {
      console.log("User Data: ", admin);
    }
  }, [admin]);

  const getProfileImageUrl = (profile) => {
    if (!profile) {
      return 'default-admin-image-url'; // Replace with actual default image URL
    }
    return profile.startsWith('http') ? profile : `http://localhost:8080/${profile.replace(/\\/g, '/')}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '20px' }}>
      <StyledCard>
        <Row>
          <Col span={24} style={{ textAlign: 'left', marginBottom: '10px' }}>
            <Button type="link" style={{ color: '#693bb8' }} icon={<BackwardOutlined />} onClick={handleBackClick}>
              Profile
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={14}>
            <Typography.Title level={3} style={{ color: '#693bb8', marginBottom: '20px' }}>
              Admin Profile Details
            </Typography.Title>
            <ProfileItem>
              <strong>Name:</strong>&nbsp;<span>{admin ? admin.name : 'Loading...'}</span>
            </ProfileItem>
            <ProfileItem>
              <strong>Email:</strong>&nbsp;<span>{admin ? admin.email : 'Loading...'}</span>
            </ProfileItem>
            <ProfileItem>
              <strong>Role:</strong>&nbsp;<Tag color="purple">{admin ? admin.role : 'Loading...'}</Tag>
            </ProfileItem>
            <ProfileItem>
              <strong>Join:</strong>&nbsp;{admin ? admin.created_at : 'Loading...'}
            </ProfileItem>
            <Divider />
            <StyledButton icon={<EditOutlined />} onClick={showEditProfileModal}>
              Edit Profile
            </StyledButton>
            <StyledButton icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </StyledButton>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'center' }}>
            <AnimatedAvatar src={getProfileImageUrl(admin?.profile)} />
          </Col>
        </Row>
        <StyledModal
          title="Edit Profile"
          visible={isEditProfileVisible}
          onCancel={handleEditProfileCancel}
          footer={null}
        >
          <StyledForm
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[{ min: 8, message: 'Password must be at least 8 characters' }]}
            >
              <Input.Password placeholder="New Password" />
            </Form.Item>
            <Form.Item
              name="profile"
              label="Profile Picture"
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleFileChange}
                fileList={fileList}
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <StyledFormButton type="primary" htmlType="submit">
                <SaveOutlined /> Save Changes
              </StyledFormButton>
            </Form.Item>
          </StyledForm>
        </StyledModal>
      </StyledCard>
    </div>
  );
};

export default AdminProfile;
