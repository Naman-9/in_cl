import mongoose, { Schema } from 'mongoose';
import Post from './postModel';

export interface IComment {
  userId: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Schema.Types.ObjectId;
  text: string;
  replies?: mongoose.Schema.Types.ObjectId[];
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true },
);

// Middleware to increment like count
CommentSchema.post<IComment>('save', async function (doc) {
  try {
    await Post.findByIdAndUpdate(doc.postId, { $inc: { commentCount: 1 } });
  } catch (error) {
    console.error('Error updating like count after save:', error);
  }
});

// Middleware to decrement like count
CommentSchema.post<IComment>('findOneAndDelete', async function (doc) {
  if (doc) {
    try {
      await Post.findByIdAndUpdate(doc.postId, { $inc: { commentCount: -1 } });
    } catch (error) {
      console.error('Error updating like count after delete:', error);
    }
  }
});



export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
