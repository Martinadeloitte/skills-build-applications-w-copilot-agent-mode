import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: 'running' | 'walking' | 'cycling' | 'swimming' | 'strength' | 'yoga' | 'other';
  duration: number; // in minutes
  distance?: number; // in kilometers
  calories?: number;
  points: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    activityType: {
      type: String,
      required: true,
      enum: ['running', 'walking', 'cycling', 'swimming', 'strength', 'yoga', 'other']
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    distance: {
      type: Number,
      min: 0
    },
    calories: {
      type: Number,
      min: 0
    },
    points: {
      type: Number,
      required: true,
      default: 0
    },
    notes: {
      type: String,
      maxlength: 500
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Calculate points based on activity type and duration
ActivitySchema.pre('save', function() {
  if (!this.points) {
    const basePoints: { [key: string]: number } = {
      running: 10,
      walking: 5,
      cycling: 8,
      swimming: 12,
      strength: 9,
      yoga: 6,
      other: 5
    };
    
    const pointsPerMinute = basePoints[String(this.activityType)] || 5;
    this.points = Math.floor(Number(this.duration) * pointsPerMinute);
  }
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
