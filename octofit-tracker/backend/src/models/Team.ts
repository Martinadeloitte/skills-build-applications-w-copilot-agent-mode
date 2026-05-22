import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  captainId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    description: {
      type: String,
      maxlength: 200
    },
    captainId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    totalPoints: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITeam>('Team', TeamSchema);
