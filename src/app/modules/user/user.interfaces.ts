export type TUser = {
  email: string;
  name: string;
  password: string;
  role?: "admin" | "user";
  status?: "active" | "blocked";
  isDeleted?: boolean;
  passwordChangedAt?: Date;
};
