import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Exporting env variable
const CLIENT_ID = process.env.API_KEY;
const CLIENT_SECRET = process.env.API_SECRET;
//Podira ser tambien directo:
//export const CLIENT_ID = process.env.API_KEY;

export { CLIENT_ID, CLIENT_SECRET };
