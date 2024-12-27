import mongoose, { Document, Schema } from "mongoose";
import Post from "./postModel";

export interface ILike extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    postId: mongoose.Schema.Types.ObjectId,
}

const LikeSchema: Schema<ILike> = new Schema(
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
    }
)

// Middleware to increment like count
LikeSchema.post<ILike>("save", async function (doc) {
    try {
        await Post.findByIdAndUpdate(doc.postId, { $inc: { likeCount: 1 } });
    } catch (error) {
        console.error("Error updating like count after save:", error);
    }
});

// Middleware to decrement like count
LikeSchema.post<ILike>("findOneAndDelete", async function (doc) {
    if (doc) {
        try {
            await Post.findByIdAndUpdate(doc.postId, { $inc: { likeCount: -1 } });
        } catch (error) {
            console.error("Error updating like count after delete:", error);
        }
    }
});

// prevent duplicate likes
LikeSchema.index({ userId: 1, postId: 1 }, { unique: [true, "Already liked."] });

export default mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);