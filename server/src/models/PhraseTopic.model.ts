import mongoose, { Schema, Document } from 'mongoose';

export interface IPhraseTopic extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const PhraseTopicSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Topic name is required'],
      unique: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPhraseTopic>('PhraseTopic', PhraseTopicSchema);
