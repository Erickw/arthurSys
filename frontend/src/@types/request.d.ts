/* eslint-disable @typescript-eslint/no-explicit-any */
type RequestProps = {
  key?: string;
  id: string;
  userId: string;
  userName: string;
  productId: string;
  patientName: string;
  patientEmail: string;
  status: string;
  date: Date;
  address: Address;
  fieldsValues: RequestGroupProps[];
  productPropose: string;
};

type RequestGroupProps = {
  title: string;
  fields: RequestGroupInputsProps[];
};

type RequestGroupInputsProps = {
  [x: string]: string;
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
