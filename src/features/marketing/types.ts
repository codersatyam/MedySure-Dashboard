/** Payload for POST /demo-requests (camelCase `phoneNo`, per the backend contract). */
export type DemoRequestInput = {
  name: string;
  email: string;
  phoneNo: string;
};

/** Successful demo-request creation. */
export type DemoRequestResult = {
  id: string;
  createdAt: string;
};
