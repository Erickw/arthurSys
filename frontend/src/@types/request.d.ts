type RequestProps = {
  key?: string;
  id: string;
  userId: string;
  productionId: string;
  patientName: string;
  patientEmail: string;
  status: string;
  date: Date;
  address: Address;
  bankInfo: BankInfo;
};

type Address = {
  complement: string;
  street: string;
  city: string;
  state: string;
  district: string;
  postalCode: number;
  number: number;
};

type BankInfo = {
  bankAccount: string;
  bank: string;
  identification: string;
  value: number;
  note: string;
  agency: string;
};
