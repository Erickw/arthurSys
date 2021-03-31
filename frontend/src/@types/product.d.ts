type ProductProps = {
  id: string;
  name: string;
  description: string;
  value: number;
  requiredPayment: number;
  notes: string;
  available: boolean;
  bankInfo: BankInfo;
  fields: InputGroupProps[];
};

type BankInfo = {
  bankAccount: string;
  bank: string;
  identification: string;
  value: number;
  note: string;
  agency: string;
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
