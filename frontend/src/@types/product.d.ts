type ProductProps = {
  id: string;
  name: string;
  description: string;
  value: number;
  requiredPayment: number;
  notes: string;
  available: boolean;
  bankInfo: BankInfoProps;
  fields: InputGroupProps[];
};

type BankInfoProps = {
  bankAccount: string;
  bank: string;
  identification: string;
  value: number;
  note: string;
  agency: string;
};

type InputGroupProps = {
  title: string;
  comments: string;
  fields: InputProps[];
};

type InputProps = {
  name: string;
  label: string;
  type: InputType;
  options?: string[];
};

type InputType = 'string' | 'number' | 'select' | 'date' | 'file';
