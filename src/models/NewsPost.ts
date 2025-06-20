import mongoose, { Schema, Document } from 'mongoose';

export interface INewsPost extends Document {
  title: string;
  content: string;
  type: 'video' | 'news' | 'insight' | 'announcement';
  videoUrl?: string;
  author: string;
  tags: string[];
  featured: boolean;
}

const NewsPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['video', 'news', 'insight', 'announcement']
  },
  videoUrl: { type: String },
  author: { type: String, required: true },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<INewsPost>('NewsPost', NewsPostSchema);
