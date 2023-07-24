import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const db = mongoose.connection;
const connection = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => console.log(err));

  db.once("open", () => {
    console.log("Conexion a MongoDB exitosa");
  });

  db.on("error", (err) => {
    console.log(err);
  });
};

export default connection();
