import PhraseTopic, { IPhraseTopic } from '../models/PhraseTopic.model';
import Phrase, { IPhrase } from '../models/Phrase.model';
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

export class PhraseService {
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
    const total = await PhraseTopic.countDocuments(filter);

    // Get paginated topics
    const topics = await PhraseTopic.find(filter)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get phrase count for each topic
    const topicsWithCount = await Promise.all(
      topics.map(async (topic) => {
        const phraseCount = await Phrase.countDocuments({ topicId: topic._id });
        return {
          _id: topic._id,
          name: topic.name,
          phraseCount,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        };
      })
    );

    // Sort by phraseCount if requested (needs post-query sorting)
    if (sortBy === 'phraseCount') {
      topicsWithCount.sort((a, b) => {
        return sortOrder === 1 ? a.phraseCount - b.phraseCount : b.phraseCount - a.phraseCount;
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

  async getTopicById(topicId: string): Promise<IPhraseTopic> {
    const topic = await PhraseTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }
    return topic;
  }

  async createTopic(name: string): Promise<IPhraseTopic> {
    // Check if topic already exists
    const existingTopic = await PhraseTopic.findOne({ name: name.trim() });
    if (existingTopic) {
      throw new AppError('Topic with this name already exists', 400);
    }

    const topic = await PhraseTopic.create({ name: name.trim() });
    return topic;
  }

  async updateTopic(topicId: string, name: string): Promise<IPhraseTopic> {
    // Check if another topic with the same name exists
    const existingTopic = await PhraseTopic.findOne({
      name: name.trim(),
      _id: { $ne: topicId },
    });

    if (existingTopic) {
      throw new AppError('Topic with this name already exists', 400);
    }

    const topic = await PhraseTopic.findByIdAndUpdate(
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
    const topic = await PhraseTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    // Delete all phrases in this topic
    await Phrase.deleteMany({ topicId });
    await PhraseTopic.findByIdAndDelete(topicId);
  }

  // Phrase methods
  async getPhrasesByTopic(
    topicId: string,
    options: QueryOptions = {}
  ): Promise<PaginatedResult<IPhrase>> {
    // Verify topic exists
    const topic = await PhraseTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    const { search = '', sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = options;

    // Build filter query
    const filter: any = { topicId };
    if (search) {
      filter.$or = [
        { phrase: { $regex: search, $options: 'i' } },
        { definition: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort query
    const sortOrder = order === 'desc' ? -1 : 1;
    let sortQuery: any = {};

    if (sortBy === 'phrase') {
      sortQuery = { phrase: sortOrder };
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
    const total = await Phrase.countDocuments(filter);

    // Get paginated phrases
    const phrases = await Phrase.find(filter)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data: phrases,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPhraseById(phraseId: string): Promise<IPhrase> {
    const phrase = await Phrase.findById(phraseId);
    if (!phrase) {
      throw new AppError('Phrase not found', 404);
    }
    return phrase;
  }

  async createPhrase(phraseData: {
    topicId: string;
    phrase: string;
    definition: string;
    exampleSentences?: string[];
    image?: string;
  }): Promise<IPhrase> {
    // Verify topic exists
    const topic = await PhraseTopic.findById(phraseData.topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    const phrase = await Phrase.create(phraseData);
    return phrase;
  }

  async updatePhrase(
    phraseId: string,
    phraseData: {
      phrase?: string;
      definition?: string;
      exampleSentences?: string[];
      image?: string;
    }
  ): Promise<IPhrase> {
    const phrase = await Phrase.findByIdAndUpdate(phraseId, phraseData, {
      new: true,
      runValidators: true,
    });

    if (!phrase) {
      throw new AppError('Phrase not found', 404);
    }

    return phrase;
  }

  async deletePhrase(phraseId: string): Promise<void> {
    const phrase = await Phrase.findById(phraseId);
    if (!phrase) {
      throw new AppError('Phrase not found', 404);
    }

    await Phrase.findByIdAndDelete(phraseId);
  }

  async importTopicWithPhrases(data: {
    topic: string;
    phrases: Array<{
      phrase: string;
      definition: string;
      exampleSentences?: string[];
      image?: string;
    }>;
  }): Promise<{ topic: IPhraseTopic; phrases: IPhrase[] }> {
    // Check if topic exists
    let topic = await PhraseTopic.findOne({ name: data.topic.trim() });

    if (!topic) {
      // Create new topic
      topic = await PhraseTopic.create({ name: data.topic.trim() });
    }

    // Create all phrases
    const phrases = await Promise.all(
      data.phrases.map((phrase) =>
        Phrase.create({
          topicId: topic!._id,
          ...phrase,
        })
      )
    );

    return { topic, phrases };
  }

  // Practice methods
  async getRandomPhrases(topicId: string, limit: number): Promise<IPhrase[]> {
    // Verify topic exists
    const topic = await PhraseTopic.findById(topicId);
    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    // Get only learned phrases from the topic
    const learnedPhrases = await Phrase.find({ topicId, isLearned: true });

    if (learnedPhrases.length === 0) {
      throw new AppError('No learned phrases found in this topic', 404);
    }

    // Shuffle the learned phrases
    const shuffledPhrases = learnedPhrases.sort(() => Math.random() - 0.5);

    // Return up to 'limit' phrases
    return shuffledPhrases.slice(0, Math.min(limit, shuffledPhrases.length));
  }

  async incrementPracticeCount(phraseId: string): Promise<IPhrase> {
    const phrase = await Phrase.findById(phraseId);
    if (!phrase) {
      throw new AppError('Phrase not found', 404);
    }

    phrase.practiceCount += 1;

    // Mark as learned if practiced successfully 3 times
    if (phrase.practiceCount >= 3) {
      phrase.isLearned = true;
    }

    await phrase.save();
    return phrase;
  }

  async incrementWrongCount(phraseId: string): Promise<IPhrase> {
    const phrase = await Phrase.findById(phraseId);
    if (!phrase) {
      throw new AppError('Phrase not found', 404);
    }

    phrase.wrongCount += 1;
    await phrase.save();
    return phrase;
  }
}

export default new PhraseService();
