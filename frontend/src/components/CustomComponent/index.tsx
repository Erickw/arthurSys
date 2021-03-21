import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Radio,
  Select,
  Upload,
} from "antd";

type CustomInputProps = {
  type: InputType;
  options?: string[];
};

const CustomInput: React.FC<CustomInputProps> = ({ type, options }) => {
  switch (type) {
    case "string":
      return <Input />;
    case "number":
      return <Input type="number" />;
    case "select":
      return (
        <Select>
          {options.map((option) => (
            <Select.Option
              value={option.toLowerCase()}
              key={option.toLowerCase()}
            >
              {option}
            </Select.Option>
          ))}
        </Select>
      );
    case "date":
      return <DatePicker />;
    case "file":
      return (
        <Upload>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      );
    default:
      return <Input />;
  }
};
export default CustomInput;
