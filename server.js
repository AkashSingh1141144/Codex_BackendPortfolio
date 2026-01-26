import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";



// connect database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port http:localhost:${PORT}`);
});
