type ProductProps = {
  id: string;
  name: string;
  descriptions: string;
  form: InputGroupProps[];
};

type InputGroupProps = {
  title: string;
  fields: InputProps[];
};

type InputProps = {
  name: string;
  label: string;
  type: InputType;
  options?: string[];
};

type InputType =
  | "string"
  | "number"
  | "select"
  | "radio-group"
  | "date"
  | "file";
