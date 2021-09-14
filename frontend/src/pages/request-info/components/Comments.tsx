/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Card,
  Comment,
  Empty,
  Form,
  Input,
  Tooltip,
  Modal,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import api from '../../../clients/api';
import { useAuth } from '../../../hooks/auth';
import { getTypeUserColor } from '../../../utils/utils';

interface CommentType {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

interface CommentProps {
  comments: CommentType[];
  requestId: string;
  handleAddComment: (commentData: Omit<CommentType, 'id'>) => Promise<void>;
}

interface User {
  id: string;
  name: string;
  type: 'admin' | 'cadista' | 'cliente';
}

const { confirm } = Modal;

export default function Comments({
  comments,
  requestId,
  handleAddComment,
}: CommentProps): JSX.Element {
  const { user } = useAuth();
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentsState, setCommentsState] = useState<CommentType[]>(comments);
  const [users, setUsers] = useState<User[]>([]);

  async function loadComments() {
    const { data: newComments } = await api.get(
      `/comments/request/${requestId}`,
    );
    const commentsSorted = newComments
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    setCommentsState(commentsSorted);
  }

  async function handleSubmit({ comment }) {
    setIsSubmitting(true);
    const commentData = {
      authorId: user.id,
      content: comment,
      createdAt: new Date(),
    };
    await handleAddComment(commentData);
    setIsSubmitting(false);
    form.resetFields();
    loadComments();
  }

  function deleteCommentModal(commentId: string) {
    const deleteParams = {
      requestId,
      commentId,
    };
    confirm({
      title: `Você tem certeza que deseja deletar esse comentário ?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      async onOk() {
        await api.delete(`/comments`, {
          data: deleteParams,
        });
        await loadComments();
      },
    });
  }

  useEffect(() => {
    async function loadCommentUsers() {
      const { data: usersFromApi } = await api.get('/users');
      setUsers(usersFromApi);
      setIsLoadingComments(false);
    }

    loadCommentUsers();
  }, []);

  return (
    <Card
      title="Comentários"
      style={{ marginTop: 24, minWidth: 450 }}
      bordered={false}
      loading={isLoadingComments}
    >
      {commentsState && commentsState.length > 0 ? (
        commentsState.map(commentItem => (
          <Comment
            key={commentItem.id}
            actions={
              commentItem.authorId === user.id && [
                <Tooltip key="comment-basic-like" title="Deletar">
                  <span onClick={() => deleteCommentModal(commentItem.id)}>
                    <DeleteOutlined
                      style={{ fontSize: '16px', color: '#cc0600' }}
                    />
                  </span>
                </Tooltip>,
              ]
            }
            author={
              users.find(userItem => userItem.id === commentItem.authorId)?.name
            }
            content={<p>{commentItem.content}</p>}
            avatar={
              <Avatar
                style={{
                  backgroundColor: getTypeUserColor(
                    users.find(userItem => userItem.id === commentItem.authorId)
                      ?.type,
                  ),
                }}
                icon={<UserOutlined />}
              />
            }
            datetime={<span>{moment(commentItem.createdAt).fromNow()}</span>}
          />
        ))
      ) : (
        <Empty description="Sem comentários" />
      )}
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
        style={{ marginTop: 24, marginBottom: 0 }}
      >
        <Form.Item
          name="comment"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o comentário!',
            },
          ]}
        >
          <Input.Search
            placeholder="Fazer um comentário"
            enterButton="Enviar"
            loading={isSubmitting}
            onSearch={() => form.submit()}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
