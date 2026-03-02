import mongoose, { Schema, Document } from 'mongoose';

export interface IVocabularyWord extends Document {
  topicId: mongoose.Types.ObjectId;
  word: string;
  type: string;
  IPA: string;
  definition: string;
  exampleSentences: string[];
  image?: string;
  practiceCount: number;
  wrongCount: number;
  isLearned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularyWordSchema: Schema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'VocabularyTopic',
      required: [true, 'Topic ID is required'],
    },
    word: {
      type: String,
      required: [true, 'Word is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Word type is required'],
      trim: true,
    },
    IPA: {
      type: String,
      required: [true, 'IPA pronunciation is required'],
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
VocabularyWordSchema.index({ topicId: 1 });
VocabularyWordSchema.index({ word: 1 });

export default mongoose.model<IVocabularyWord>('VocabularyWord', VocabularyWordSchema);
