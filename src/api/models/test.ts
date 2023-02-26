import mongoose from 'mongoose';
import { ITest } from '../../interfaces/ITest';

const Test = new mongoose.Schema(
  {    
    name: {
        type: String,
        required: [true, "name is required"],
        default: "name",
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITest & mongoose.Document>('ITest', Test);