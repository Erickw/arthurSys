import React, { useCallback, useState } from "react";
import { Button, Form, Input, Select, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { InputsWrapper, InputGroupWrapper } from "./styles";
import { v4 } from "uuid";
import { useForm } from "antd/lib/form/Form";

const { Item, List, ErrorList } = Form;
const { Title } = Typography;

const NewProduct: React.FC = () => {
  const [form] = useForm();
  const handleSubmit = useCallback((data) => {
    console.log(data);
  }, []);
  const handleChange = useCallback((data) => {
    console.log(data);
  }, []);

  return (
    <>
      <Title>Novo Produto</Title>
      <Form
        layout="vertical"
        form={form}
        style={{ width: "60%" }}
        onFinish={handleSubmit}
      >
        <Item label="Nome do produto" name="name" required>
          <Input />
        </Item>
        <Item label="Descrição do serviço" name="description">
          <Input.TextArea />
        </Item>
        <List name="form">
          {(groups, { add, remove }, { errors }) => (
            <>
              {groups.map((group, index) => (
                <Item
                  label={
                    <Title level={3}>
                      {`Grupo ${index + 1}`}
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(group.name)}
                        style={{ marginLeft: "16px" }}
                      />
                    </Title>
                  }
                  key={index}
                >
                  <Item
                    label="Título do Grupo"
                    name={[group.name, "title"]}
                    fieldKey={[group.fieldKey, "title"]}
                    required
                  >
                    <Input />
                  </Item>
                  <List name={[group.name, "fields"]}>
                    {(
                      fields,
                      { add: addField, remove: removeField },
                      { errors: errorsFields }
                    ) => (
                      <>
                        {fields.map((field, index) => (
                          <Item
                            label={
                              <>
                                {`Input ${index + 1}`}
                                {index > 0 && (
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => removeField(field.name)}
                                    style={{ marginLeft: "16px" }}
                                  />
                                )}
                              </>
                            }
                            key={index}
                          >
                            <InputsWrapper>
                              <Item
                                label="Nome"
                                name={[field.name, "name"]}
                                fieldKey={[field.fieldKey, "name"]}
                                required
                              >
                                <Input />
                              </Item>
                              <Item
                                label="Label"
                                name={[field.name, "label"]}
                                fieldKey={[field.fieldKey, "label"]}
                                required
                              >
                                <Input />
                              </Item>
                              <Item
                                label="Tipo"
                                name={[field.name, "type"]}
                                fieldKey={[field.fieldKey, "type"]}
                                required
                              >
                                <Select defaultValue="string">
                                  <Select.Option value="string">
                                    Texto
                                  </Select.Option>
                                  <Select.Option value="number">
                                    Número
                                  </Select.Option>
                                  <Select.Option value="select">
                                    Select
                                  </Select.Option>
                                  <Select.Option value="radio-group">
                                    Radio Group
                                  </Select.Option>
                                  <Select.Option value="date">
                                    Date
                                  </Select.Option>
                                  <Select.Option value="file">
                                    Arquivo
                                  </Select.Option>
                                </Select>
                              </Item>
                              <Item
                                label="Opções"
                                name={[field.name, "options"]}
                                fieldKey={[field.fieldKey, "options"]}
                              >
                                <Select
                                  mode="tags"
                                  tokenSeparators={[","]}
                                ></Select>
                              </Item>
                            </InputsWrapper>
                          </Item>
                        ))}
                        <Item>
                          <Button
                            type="link"
                            block
                            onClick={() => addField()}
                            icon={<PlusOutlined />}
                          >
                            Adiconar campos
                          </Button>
                          <ErrorList errors={errorsFields} />
                        </Item>
                      </>
                    )}
                  </List>
                </Item>
              ))}

              <Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Adiconar grupo de campos
                </Button>
                <ErrorList errors={errors} />
              </Item>
            </>
          )}
        </List>
        <Button block type="primary" htmlType="submit">
          Criar Produto
        </Button>
      </Form>
    </>
  );
};

export default NewProduct;
