import VocabularyTopic, { IVocabularyTopic } from '../models/VocabularyTopic.model';
import VocabularyWord, { IVocabularyWord } from '../models/VocabularyWord.model';
import { AppError } from '../middleware/errorHandler';

interface QueryOptions {
  search?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class VocabularyService {
  // Topic methods
  async getAllTopics(options: QueryOptions = {}): Promise<PaginatedResult<any>> {
    const { search = '', sortBy = 'name', order = 'asc', page = 1, limit = 10 } = options;

    // Build filter query
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Build sort query
    const sortOrder = order === 'desc' ? -1 : 1;
    let sortQuery: any = {};

    if (sortBy === 'name') {
      sortQuery = { name: sortOrder };
    } else if (sortBy === 'updatedAt') {
      sortQuery = { updatedAt: sortOrder };
    } else {
      sortQuery = { name: sortOrder };
    }

    // Get total count
    const total = await VocabularyTopic.countDocuments(filter);

    // Get paginated topics
    const topics = await VocabularyTopic.find(filter)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get word count for each topic
    const topicsWithCount = await Promise.all(
      topics.map(async (topic) => {
        const wordCount = await VocabularyWord.countDocuments({ topicId: topic._id });
        return {
          _id: topic._id,
          name: topic.name,
          wordCount,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        };
      })
    );

    // Sort by wordCount if requested (needs post-query sorting)
    if (sortBy === 'wordCount') {
      topicsWithCount.sort((a, b) => {
        return sortOrder === 1 ? a.wordCount - b.wordCount : b.wordCount - a.wordCount;
      });
    }

    return {
      data: topicsWithCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTopicById(topicId: string): Promise<IVocabularyTopic> {
    const topic = await VocabularyTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }
    return topic;
  }

  async createTopic(name: string): Promise<IVocabularyTopic> {
    // Check if topic already exists
    const existingTopic = await VocabularyTopic.findOne({ name: name.trim() });
    if (existingTopic) {
      throw new AppError('Topic with this name already exists', 400);
    }

    const topic = await VocabularyTopic.create({ name: name.trim() });
    return topic;
  }

  async updateTopic(topicId: string, name: string): Promise<IVocabularyTopic> {
    // Check if another topic with the same name exists
    const existingTopic = await VocabularyTopic.findOne({
      name: name.trim(),
      _id: { $ne: topicId },
    });

    if (existingTopic) {
      throw new AppError('Topic with this name already exists', 400);
    }

    const topic = await VocabularyTopic.findByIdAndUpdate(
      topicId,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    return topic;
  }

  async deleteTopic(topicId: string): Promise<void> {
    const topic = await VocabularyTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    // Delete all words in this topic
    await VocabularyWord.deleteMany({ topicId });
    await VocabularyTopic.findByIdAndDelete(topicId);
  }

  // Word methods
  async getWordsByTopic(
    topicId: string,
    options: QueryOptions = {}
  ): Promise<PaginatedResult<IVocabularyWord>> {
    // Verify topic exists
    const topic = await VocabularyTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    const { search = '', sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = options;

    // Build filter query
    const filter: any = { topicId };
    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: 'i' } },
        { definition: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort query
    const sortOrder = order === 'desc' ? -1 : 1;
    let sortQuery: any = {};

    if (sortBy === 'word') {
      sortQuery = { word: sortOrder };
    } else if (sortBy === 'type') {
      sortQuery = { type: sortOrder };
    } else if (sortBy === 'practiceCount') {
      sortQuery = { practiceCount: sortOrder };
    } else if (sortBy === 'wrongCount') {
      sortQuery = { wrongCount: sortOrder };
    } else if (sortBy === 'isLearned') {
      sortQuery = { isLearned: sortOrder };
    } else {
      sortQuery = { createdAt: sortOrder };
    }

    // Get total count
    const total = await VocabularyWord.countDocuments(filter);

    // Get paginated words
    const words = await VocabularyWord.find(filter)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: words,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getWordById(wordId: string): Promise<IVocabularyWord> {
    const word = await VocabularyWord.findById(wordId);
    if (!word) {
      throw new AppError('Word not found', 404);
    }
    return word;
  }

  async createWord(wordData: {
    topicId: string;
    word: string;
    type: string;
    IPA: string;
    definition: string;
    exampleSentences?: string[];
    image?: string;
  }): Promise<IVocabularyWord> {
    // Verify topic exists
    const topic = await VocabularyTopic.findById(wordData.topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    // Check if word already exists in this topic (case-insensitive)
    const existingWord = await VocabularyWord.findOne({
      topicId: wordData.topicId,
      word: { $regex: new RegExp(`^${wordData.word.trim()}$`, 'i') },
    });

    if (existingWord) {
      throw new AppError(`Word "${wordData.word}" already exists in this topic`, 400);
    }

    const word = await VocabularyWord.create(wordData);
    return word;
  }

  async updateWord(
    wordId: string,
    wordData: {
      word?: string;
      type?: string;
      IPA?: string;
      definition?: string;
      exampleSentences?: string[];
      image?: string;
    }
  ): Promise<IVocabularyWord> {
    const word = await VocabularyWord.findByIdAndUpdate(wordId, wordData, {
      new: true,
      runValidators: true,
    });

    if (!word) {
      throw new AppError('Word not found', 404);
    }

    return word;
  }

  async deleteWord(wordId: string): Promise<void> {
    const word = await VocabularyWord.findById(wordId);
    if (!word) {
      throw new AppError('Word not found', 404);
    }

    await VocabularyWord.findByIdAndDelete(wordId);
  }

  async importTopicWithWords(data: {
    topic: string;
    words: Array<{
      word: string;
      type: string;
      IPA: string;
      definition: string;
      exampleSentences?: string[];
      image?: string;
    }>;
  }): Promise<any> {
    // Check if topic exists
    let topic = await VocabularyTopic.findOne({ name: data.topic.trim() });

    if (!topic) {
      // Create new topic
      topic = await VocabularyTopic.create({ name: data.topic.trim() });
    }

    // Create all words
    await Promise.all(
      data.words.map((word) =>
        VocabularyWord.create({
          topicId: topic!._id,
          ...word,
        })
      )
    );

    // Return topic with word count matching the expected response format
    const wordCount = await VocabularyWord.countDocuments({ topicId: topic._id });

    return {
      _id: topic._id,
      name: topic.name,
      wordCount,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    };
  }

  // Practice methods
  async getRandomWords(topicId: string, limit: number): Promise<IVocabularyWord[]> {
    // Verify topic exists
    const topic = await VocabularyTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    // Get only learned words from the topic
    const learnedWords = await VocabularyWord.find({ topicId, isLearned: true });

    if (learnedWords.length === 0) {
      throw new AppError('No learned words found in this topic', 404);
    }

    // Shuffle the learned words
    const shuffledWords = learnedWords.sort(() => Math.random() - 0.5);

    // Return up to 'limit' words
    return shuffledWords.slice(0, Math.min(limit, shuffledWords.length));
  }

  async incrementPracticeCount(wordId: string): Promise<IVocabularyWord> {
    const word = await VocabularyWord.findById(wordId);
    if (!word) {
      throw new AppError('Word not found', 404);
    }

    word.practiceCount += 1;

    await word.save();
    return word;
  }

  async incrementWrongCount(wordId: string): Promise<IVocabularyWord> {
    const word = await VocabularyWord.findById(wordId);
    if (!word) {
      throw new AppError('Word not found', 404);
    }

    word.wrongCount += 1;
    await word.save();
    return word;
  }
}

export default new VocabularyService();
