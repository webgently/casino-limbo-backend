import mongoose from "mongoose";
import { mongoConfig } from "./index";

export default () => {
  mongoose.connect(mongoConfig.test).then(() => {
    console.log("Database is connected");
  });
};
