import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../config/.env.local") });

export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
