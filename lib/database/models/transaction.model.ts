import { Schema, model, models, Document } from "mongoose";

export interface ITransaction extends Document {
  createdAt: Date;
  stripeId: string;
  amount: number;
  plan?: string;
  credits?: number;
  buyer: Schema.Types.ObjectId;
}

const TransactionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  stripeId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  plan: { type: String },
  credits: { type: Number },
  buyer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Transaction =
  models.Transaction || model("Transaction", TransactionSchema, "transactions");

export default Transaction;
