import { Schema, model } from "mongoose";

const newProduct = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CartsSchema = new Schema(
  {
    products: [newProduct],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const cartsModel = model("Cart", CartsSchema);