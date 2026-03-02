import mongoose, { Schema, Document } from 'mongoose';

export interface IVocabularyTopic extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularyTopicSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Topic name is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IVocabularyTopic>('VocabularyTopic', VocabularyTopicSchema);
