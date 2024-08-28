import express from "express";
import router from "./router.js"
import cors from "cors";
//import data from './file.json' assert { type: 'json' };

const app = express();
app.use(cors());

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 3000;

// applying handler for API
app.use("/",router)

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Express is running on port http://localhost:${PORT}`);
});
