type ProductProps = {
  id: string;
  name: string;
  description: string;
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

type InputType = "string" | "number" | "select" | "date" | "file";
