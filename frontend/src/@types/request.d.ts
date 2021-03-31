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
