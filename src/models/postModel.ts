import mongoose, { Schema } from 'mongoose';

export interface IPost extends Document {
  image: string[];
  caption?: string;
  author: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: mongoose.Schema.Types.ObjectId[];
  tags?: string[];
  likeCount: number;
  commentCount: number;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    image: [
      {
        type: String,
      },
    ],
    caption: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Unauthorized'],
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    likeCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    }
  },
  { timestamps: true },
);

// Text index for caption
// text index allows you to perform text searches, such as finding posts that include certain keywords in their captions.
PostSchema.index({ caption: 'text', tags: 1 });

// Speeds up queries to fetch posts by a specific user (e.g., "Show me all posts by user X").
PostSchema.index({ author: 1, createdAt: -1 });

// Useful for sorting posts by creation date, which is common in feed-based apps.
PostSchema.index({ createdAt: -1 });


PostSchema.index({ tags: 1 });


export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
