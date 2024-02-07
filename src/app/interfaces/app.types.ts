export type TImageObject = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type ResponseData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};


export const USER_ROLE  = {
  admin: "admin",
  user: "user",
} as const;

export type TUserRole = keyof typeof USER_ROLE;