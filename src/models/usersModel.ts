import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
  resetPasswordToken: string;
  resetPasswordExpiresIn: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  generateResetToken(): string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide username.'],
      unique: [true, 'Username already taken.'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide ..'],
      unique: [true, 'Email already exists.'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password.'],
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      default: 'Hello! I am using this app.',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresIn: {
      type: Date,
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to generate a reset token
UserSchema.methods.generateResetToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes
  return resetToken;
};

// Ensure unique indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// mongodb+srv://namanpr7:2inhKEN1L5u7jExH@cluster0.9b6rk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
