type ProductProps = {
  id: string;
  name: string;
  description: string;
  value: number;
  requiredPayment: number;
  notes: string;
  available: boolean;
  fields: InputGroupProps[];
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

type InputType = 'string' | 'number' | 'select' | 'date' | 'file';
