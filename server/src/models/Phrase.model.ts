import mongoose, { Schema, Document } from 'mongoose';

export interface IPhrase extends Document {
  topicId: mongoose.Types.ObjectId;
  phrase: string;
  definition: string;
  exampleSentences: string[];
  image?: string;
  practiceCount: number;
  wrongCount: number;
  isLearned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PhraseSchema: Schema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'PhraseTopic',
      required: [true, 'Topic ID is required'],
    },
    phrase: {
      type: String,
      required: [true, 'Phrase is required'],
      trim: true,
    },
    definition: {
      type: String,
      required: [true, 'Definition is required'],
      trim: true,
    },
    exampleSentences: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    practiceCount: {
      type: Number,
      default: 0,
    },
    wrongCount: {
      type: Number,
      default: 0,
    },
    isLearned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
PhraseSchema.index({ topicId: 1 });
PhraseSchema.index({ phrase: 1 });

export default mongoose.model<IPhrase>('Phrase', PhraseSchema);
