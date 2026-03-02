# Type Safety Documentation

## Overview

This project implements strict type checking for all server-to-client data communication with runtime validation using TypeScript type guards.

## Architecture

### 1. Type Definitions ([client/src/types/](client/src/types/))

#### Domain Types ([index.ts](client/src/types/index.ts))

- `VocabularyTopic` - Vocabulary topic entity
- `VocabularyWord` - Vocabulary word entity with IPA, definition, examples
- `PhraseTopic` - Phrase topic entity
- `Phrase` - Phrase entity with definition and examples

#### API Types ([api.types.ts](client/src/types/api.types.ts))

- `ApiResponse<T>` - Standardized API response wrapper
- `ApiError` - Error response structure
- Request payload types for all CRUD operations:
  - `CreateVocabularyTopicRequest`
  - `UpdateVocabularyTopicRequest`
  - `CreateVocabularyWordRequest`
  - `UpdateVocabularyWordRequest`
  - `ImportVocabularyTopicRequest`
  - `CreatePhraseTopicRequest`
  - `UpdatePhraseTopicRequest`
  - `CreatePhraseRequest`
  - `UpdatePhraseRequest`
  - `ImportPhraseTopicRequest`

### 2. Runtime Validation ([client/src/utils/typeGuards.ts](client/src/utils/typeGuards.ts))

Type guards provide runtime validation that server responses match expected TypeScript types:

```typescript
// Validate single entity
if (isVocabularyTopic(data)) {
  // TypeScript now knows data is VocabularyTopic
  console.log(data.wordCount);
}

// Validate array of entities
if (isVocabularyTopicArray(data)) {
  // TypeScript knows data is VocabularyTopic[]
  data.forEach((topic) => console.log(topic.name));
}

// Validate API response with automatic error throwing
const topics = validateApiResponse(
  response.data,
  isVocabularyTopicArray,
  "Invalid vocabulary topics response",
);
```

#### Available Type Guards

- `isVocabularyTopic(obj)` / `isVocabularyTopicArray(arr)`
- `isVocabularyWord(obj)` / `isVocabularyWordArray(arr)`
- `isPhraseTopic(obj)` / `isPhraseTopicArray(arr)`
- `isPhrase(obj)` / `isPhraseArray(arr)`
- `isApiResponse<T>(obj, validator)` - Generic API response validator
- `validateApiResponse<T>(data, validator, errorMessage)` - Validates and extracts data or throws

### 3. API Service ([client/src/services/api.service.ts](client/src/services/api.service.ts))

All API methods now have:

- **Strict input types** using request payload interfaces
- **Strict output types** using domain entities
- **Runtime validation** using type guards
- **Automatic error handling** with descriptive messages

```typescript
// ❌ Before - No type safety
async createVocabularyWord(wordData: any) {
  const response = await this.api.post('/vocabulary/words', wordData);
  return response.data; // any
}

// ✅ After - Full type safety
async createVocabularyWord(
  wordData: CreateVocabularyWordRequest
): Promise<VocabularyWord> {
  const response = await this.api.post<ApiResponse<VocabularyWord>>(
    '/vocabulary/words',
    wordData
  );
  return validateApiResponse(
    response.data,
    isVocabularyWord,
    'Invalid create vocabulary word response'
  );
}
```

### 4. React Query Hooks ([client/src/hooks/](client/src/hooks/))

#### Vocabulary Hooks ([useVocabulary.ts](client/src/hooks/useVocabulary.ts))

- `useVocabularyTopics()` → Returns `VocabularyTopic[]`
- `useVocabularyTopic(topicId)` → Returns `VocabularyTopic`
- `useVocabularyWords(topicId)` → Returns `VocabularyWord[]`
- `useCreateVocabularyTopic()` → Accepts `string`, returns `VocabularyTopic`
- `useUpdateVocabularyTopic()` → Accepts `{topicId, name}`, returns `VocabularyTopic`
- `useDeleteVocabularyTopic()` → Accepts `string`, returns `void`
- `useCreateWord()` → Accepts `CreateVocabularyWordRequest`, returns `VocabularyWord`
- `useUpdateWord()` → Accepts `{wordId, data: UpdateVocabularyWordRequest}`
- `useDeleteWord()` → Accepts `{wordId, topicId}`
- `useImportVocabularyTopic()` → Accepts `ImportVocabularyTopicRequest`

#### Phrase Hooks ([usePhrases.ts](client/src/hooks/usePhrases.ts))

- `usePhraseTopics()` → Returns `PhraseTopic[]`
- `usePhraseTopic(topicId)` → Returns `PhraseTopic`
- `usePhrasesByTopic(topicId)` → Returns `Phrase[]`
- `useCreatePhraseTopic()` → Accepts `string`, returns `PhraseTopic`
- `useUpdatePhraseTopic()` → Accepts `{topicId, name}`, returns `PhraseTopic`
- `useDeletePhraseTopic()` → Accepts `string`, returns `void`
- `useCreatePhrase()` → Accepts `CreatePhraseRequest`, returns `Phrase`
- `useUpdatePhrase()` → Accepts `{phraseId, data: UpdatePhraseRequest}`
- `useDeletePhrase()` → Accepts `{phraseId, topicId}`
- `useImportPhraseTopic()` → Accepts `ImportPhraseTopicRequest`

## Usage Examples

### Creating a Vocabulary Word (Type-Safe)

```typescript
const createWordMutation = useCreateWord();

const handleSubmit = (formData: any) => {
  // Type checking ensures all required fields are present
  const wordData: CreateVocabularyWordRequest = {
    topicId: selectedTopic._id,
    word: formData.word,
    type: formData.type,
    IPA: formData.IPA,
    definition: formData.definition,
    exampleSentences: formData.exampleSentences,
    image: formData.image, // optional
  };

  createWordMutation.mutate(wordData);
};
```

### Fetching and Using Typed Data

```typescript
const { data: topics, isLoading, error } = useVocabularyTopics();

if (isLoading) return <Loading />;
if (error) return <Error message={error.message} />;

// TypeScript knows topics is VocabularyTopic[]
return (
  <div>
    {topics.map(topic => (
      <TopicCard
        key={topic._id}
        name={topic.name}
        wordCount={topic.wordCount} // Autocomplete works!
        createdAt={topic.createdAt}
      />
    ))}
  </div>
);
```

### Importing Topics with Validation

```typescript
const importMutation = useImportVocabularyTopic();

const handleImport = async (file: File) => {
  const json = JSON.parse(await file.text());

  const importData: ImportVocabularyTopicRequest = {
    name: json.name,
    words: json.words.map((w) => ({
      word: w.word,
      type: w.type,
      IPA: w.IPA,
      definition: w.definition,
      exampleSentences: w.exampleSentences || [],
      image: w.image,
    })),
  };

  importMutation.mutate(importData);
};
```

## Benefits

### 1. Compile-Time Type Safety

- TypeScript catches type mismatches before code runs
- IDE autocomplete and IntelliSense work perfectly
- Refactoring is safe - TypeScript shows all affected code

### 2. Runtime Validation

- Server responses are validated at runtime
- Invalid data throws descriptive errors immediately
- Prevents silent failures and undefined behavior

### 3. Better Developer Experience

- Clear error messages when validation fails
- No more `any` types - everything is typed
- Self-documenting code through type definitions

### 4. Maintainability

- Single source of truth for types
- Easy to add new endpoints with consistent patterns
- Changes to types automatically propagate

## Error Handling

When validation fails, you'll see errors like:

```
Error: Invalid vocabulary topics response
```

The error is logged with the actual response data for debugging:

```javascript
console.error("Invalid API response:", data);
```

Check the browser console for detailed information about what field failed validation.

## Adding New Endpoints

To add a new endpoint with full type safety:

1. **Define domain type** in [client/src/types/index.ts](client/src/types/index.ts)
2. **Define request/response types** in [client/src/types/api.types.ts](client/src/types/api.types.ts)
3. **Create type guard** in [client/src/utils/typeGuards.ts](client/src/utils/typeGuards.ts)
4. **Add API method** in [client/src/services/api.service.ts](client/src/services/api.service.ts)
5. **Create React Query hook** in appropriate hooks file

## Testing Type Safety

```typescript
// This will cause TypeScript error at compile time:
const badData = {
  topicId: 123, // ❌ Should be string, not number
  word: "hello",
};
createWordMutation.mutate(badData); // Type error!

// This will pass compile but fail at runtime:
const response = { success: true, data: { invalidField: "oops" } };
validateApiResponse(response, isVocabularyTopic, "Error"); // Throws!
```

## Best Practices

1. **Never use `any`** - Always define proper types
2. **Validate all API responses** - Use validateApiResponse or type guards
3. **Use request payload types** - Don't pass inline objects
4. **Handle errors gracefully** - Wrap API calls in try-catch when needed
5. **Keep types synchronized** - Update client types when server changes
