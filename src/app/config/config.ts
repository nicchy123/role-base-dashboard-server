import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  bcrypt_salt: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_token_expiry: process.env.JWT_ACCESS_TOKEN_EXPIRES,
  jwt_refresh_token_expiry: process.env.JWT_REFRESH_TOKEN_EXPIRES,
  default_pass: process.env.DEFAULT_PASS,
  node_env: process.env.NODE_ENV,
};
