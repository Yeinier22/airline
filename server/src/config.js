import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPaths = [
	path.resolve(__dirname, "../.env.local"),
	path.resolve(__dirname, ".env.local"),
];

for (const envPath of envPaths) {
	if (fs.existsSync(envPath)) {
		dotenv.config({ path: envPath });
		break;
	}
}

export const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.X_RAPIDAPI_KEY;
export const RAPIDAPI_HOST =
	process.env.RAPIDAPI_HOST || "kiwi-com-flights-api.p.rapidapi.com";
