---
name: vocabulary-learning-app-building
description: This prompt is using to guild YOU to build a vocabulary learning app.
model: Claude Sonnet 4.5 (copilot)
tools: [execute, read, edit, search, web]
---

# Vocabulary Learning App Building

## Tech Stack

- **Language:** TypeScript
- **Frontend:** React
- **Backend:** Express
- **Database:** MongoDB
- **Build Tool:** Vite
- **UI Library:** MUI
- **Form Management:** React Hook Form
- **Form Validation:** Yup
- **HTTP Client:** Axios
- **Server State Management:** React Query

## Environment

- Development: Use docker to set up the development environment with separate containers for the server, client, and database. use watch mode for hot reloading during development.

## Structure

```
├── server/     # Server application
├── client/     # Client application
└── data/       # Mock data for importing into the database
```

---

## Rules

### Global Rules

- Write clean, maintainable, and well-documented code.
- Follow best practices for security and performance.

### Server Rules

- Use RESTful API design principles.
- Apply SOLID principles in the code structure.
- Implement error handling and validation for every request.
- Use environment variables for configuration.
- Use structure: **Controllers**, **Services**, **Models**, **Routes**.

### Client Rules

- Use React functional components and hooks.
- Implement state management using **Context API**.
- Use **MUI** for UI components and styling.
- Implement form validation for user inputs using **React Hook Form** and **Yup**.
- Adapt for mobile and desktop screens (responsive design).
- Use **React Router** for navigation between pages.
- Implement error handling and loading states for API calls.
- Use environment variables for configuration.
- Structure the app with clear separation of concerns: `components/`, `pages/`, `services/`, etc.

---

## Stories

This app is used to learn vocabulary and phrases. It has two main pages: **Vocabulary** and **Phrases**.

- **Vocabulary** is grouped by topics (e.g., Food, Travel, Business). Each topic contains a list of words with:
  - Definition
  - Type (noun, verb, adjective, etc.)
  - IPA pronunciation
  - Example sentences (a list)
  - Image

- **Phrases** is grouped by topics (e.g., Food, Travel, Business). Each topic contains a list of phrases with:
  - Definition
  - Example sentences (a list)
  - Image
  - _(Same as Vocabulary but without Type and IPA pronunciation)_

- Users can add new words and phrases, which will be stored in the database.

- In the **Vocabulary page**, list all topics with the number of words in each. Clicking a topic navigates to a detail page listing all words as cards showing: word, type, IPA, definition, example sentences, and image.

- In the **Phrases page**, list all topics with the number of phrases in each. Clicking a topic navigates to a detail page listing all phrases as cards showing: phrase, definition, and example sentences. _(Same as Vocabulary but without type and IPA)_

---

## Features

### Home Page

- Display a welcome message and navigation links to the **Vocabulary** and **Phrases** pages.

---

### Vocabulary Page

- **Create new topic button:** Opens a modal form to input the topic name and submit to create a new topic. Duplicate topic names are not allowed.

- **Import topics and words button:** Opens a modal form to upload a JSON file with the following structure, then submits to import the topic and words into the database: example: `data/contract-and-marketing.json`

After submitting, the topic and words are imported into the database and displayed on the Vocabulary page.

- **Topic list:** Display all topics with the number of words in each. Clicking a topic navigates to the topic details page.

---

### Vocabulary Topic Details Page

- **Create new vocabulary button:** Opens a modal form to input:
  - Word
  - Type
  - IPA pronunciation
  - Definition
  - Example sentences — added dynamically by clicking **"Add Example Sentence"**, which appends a new input field. Users can add as many as needed.
  - Image URL _(optional)_

- **Vocabulary list:** Display all words as a **table** or **card** format. Toggle between views using a **"Switch View"** button.
  - Each card/row displays: word, type, IPA, definition, example sentences, image.
  - Each entry has **Edit** and **Delete** buttons.

---

### Phrases Page

- **Create new topic button:** Opens a modal form to input the topic name and submit to create a new topic. Duplicate topic names are not allowed.

- **Import topics and phrases button:** Opens a modal form to upload a JSON file with the following structure, then submits to import the topic and phrases into the database: example: `data/contract-and-marketing.json`

- **Topic list:** Display all topics with the number of phrases in each. Clicking a topic navigates to the topic details page.

---

### Phrases Topic Details Page

- **Create new phrase button:** Opens a modal form to input:
  - Phrase
  - Definition
  - Example sentences — added dynamically by clicking **"Add Example Sentence"**, which appends a new input field. Users can add as many as needed.
  - Image URL _(optional)_

- **Phrase list:** Display all phrases as a **table** or **card** format. Toggle between views using a **"Switch View"** button.
  - Each card/row displays: phrase, definition, example sentences, image.
  - Each entry has **Edit** and **Delete** buttons.

---

### Practice page

---

name: vocabulary-learning-app-building
description: This prompt is using to guild YOU to build a vocabulary learning app.
model: Claude Sonnet 4.5 (copilot)
tools: [execute, read, edit, search, web]

---

# Vocabulary Learning App Building

## Tech Stack

- **Language:** TypeScript
- **Frontend:** React
- **Backend:** Express
- **Database:** MongoDB
- **Build Tool:** Vite
- **UI Library:** MUI
- **Form Management:** React Hook Form
- **Form Validation:** Yup
- **HTTP Client:** Axios
- **Server State Management:** React Query

## Environment

- Development: Use docker to set up the development environment with separate containers for the server, client, and database. Use watch mode for hot reloading during development.

## Structure

```
├── server/     # Server application
├── client/     # Client application
└── data/       # Mock data for importing into the database
```

---

## Rules

### Global Rules

- Write clean, maintainable, and well-documented code.
- Follow best practices for security and performance.

### Server Rules

- Use RESTful API design principles.
- Apply SOLID principles in the code structure.
- Implement error handling and validation for every request.
- Use environment variables for configuration.
- Use structure: **Controllers**, **Services**, **Models**, **Routes**.

### Client Rules

- Use React functional components and hooks.
- Implement state management using **Context API**.
- Use **MUI** for UI components and styling.
- Implement form validation for user inputs using **React Hook Form** and **Yup**.
- Adapt for mobile and desktop screens (responsive design).
- Use **React Router** for navigation between pages.
- Implement error handling and loading states for API calls.
- Use environment variables for configuration.
- Structure the app with clear separation of concerns: `components/`, `pages/`, `services/`, etc.

---

## Stories

This app is used to learn vocabulary and phrases. It has two main pages: **Vocabulary** and **Phrases**.

- **Vocabulary** is grouped by topics (e.g., Food, Travel, Business). Each topic contains a list of words with:
  - Definition
  - Type (noun, verb, adjective, etc.)
  - IPA pronunciation
  - Example sentences (a list)
  - Image

- **Phrases** is grouped by topics (e.g., Food, Travel, Business). Each topic contains a list of phrases with:
  - Definition
  - Example sentences (a list)
  - Image
  - _(Same as Vocabulary but without Type and IPA pronunciation)_

- Users can add new words and phrases, which will be stored in the database.

- In the **Vocabulary page**, list all topics with the number of words in each. Clicking a topic navigates to a detail page listing all words as cards showing: word, type, IPA, definition, example sentences, and image.

- In the **Phrases page**, list all topics with the number of phrases in each. Clicking a topic navigates to a detail page listing all phrases as cards showing: phrase, definition, and example sentences. _(Same as Vocabulary but without type and IPA)_

---

## Features

### Home Page

- Display a welcome message and navigation links to the **Vocabulary** and **Phrases** pages.

---

### Vocabulary Page

- **Create new topic button:** Opens a modal form to input the topic name and submit to create a new topic. Duplicate topic names are not allowed.

- **Import topics and words button:** Opens a modal form to upload a JSON file with the following structure, then submits to import the topic and words into the database: example: `data/contract-and-marketing.json`

After submitting, the topic and words are imported into the database and displayed on the Vocabulary page.

- **Topic list:** Display all topics with the number of words in each. Clicking a topic navigates to the topic details page.

---

### Vocabulary Topic Details Page

- **Create new vocabulary button:** Opens a modal form to input:
  - Word
  - Type
  - IPA pronunciation
  - Definition
  - Example sentences — added dynamically by clicking **"Add Example Sentence"**, which appends a new input field. Users can add as many as needed.
  - Image URL _(optional)_

- **Vocabulary list:** Display all words as a **table** or **card** format. Toggle between views using a **"Switch View"** button.
  - Each card/row displays: word, type, IPA, definition, example sentences, image.
  - Each entry has **Edit** and **Delete** buttons.

- **Practice button:** Redirects to the Practice page for this topic.

---

### Phrases Page

- **Create new topic button:** Opens a modal form to input the topic name and submit to create a new topic. Duplicate topic names are not allowed.

- **Import topics and phrases button:** Opens a modal form to upload a JSON file with the following structure, then submits to import the topic and phrases into the database: example: `data/contract-and-marketing.json`

- **Topic list:** Display all topics with the number of phrases in each. Clicking a topic navigates to the topic details page.

---

### Phrases Topic Details Page

- **Create new phrase button:** Opens a modal form to input:
  - Phrase
  - Definition
  - Example sentences — added dynamically by clicking **"Add Example Sentence"**, which appends a new input field. Users can add as many as needed.
  - Image URL _(optional)_

- **Phrase list:** Display all phrases as a **table** or **card** format. Toggle between views using a **"Switch View"** button.
  - Each card/row displays: phrase, definition, example sentences, image.
  - Each entry has **Edit** and **Delete** buttons.

- **Practice button:** Redirects to the Practice page for this topic.

---

### Practice Page

- Accessible from both Vocabulary and Phrases topic detail pages via a **"Practice"** button.

- **Word/Phrase count selector:** Shown at the top before the session starts. User can choose how many items to practice. Default is **20**.

- **Session flow:** The app randomly selects N words or phrases from the topic. Items with a **"Learned"** status (based on `practiceCount`) are deprioritized but still eligible.

- **Practice card:** Displays the **definition** (and example sentences) of the current word or phrase. The word/phrase itself is hidden — the user must recall it. A **"Learned"** badge is shown if the item has been previously practiced successfully.

- **Answer input:** An input field below the card where the user types the word or phrase. Pressing **Enter** or clicking **Submit** checks the answer.

- **Correct answer flow:** If the answer matches (case-insensitive), the app calls the API to increment `practiceCount`, shows a success indicator, and advances to the next card.

- **Wrong answer flow:** If the answer is incorrect, the app calls the API to increment `wrongCount`, shows an error indicator with the correct answer revealed, and requires the user to re-type the word before continuing.

- **Progress indicator:** A progress bar or counter (e.g. **3 / 20**) is shown throughout the session.

- **Congratulations screen:** After completing all cards, a summary screen is shown with total correct, total wrong, and accuracy percentage. Buttons to navigate back to the **Topic page** or **Home page** are provided.

---

## User Stories & Features Summary

### User Stories

| ID    | Page                               | Story Title                    | Description                                                                                                                                                                    | Priority |
| ----- | ---------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| S-01  | Home                               | Welcome & Navigation           | Display a welcome message and navigation links to the Vocabulary and Phrases pages.                                                                                            | High     |
| S-02  | Vocabulary                         | Browse Vocabulary Topics       | List all vocabulary topics with the number of words in each. Click a topic to navigate to its detail page.                                                                     | High     |
| S-03  | Vocabulary                         | Create Vocabulary Topic        | Open a modal form to input a topic name and create a new vocabulary topic. Duplicate names are not allowed.                                                                    | High     |
| S-04  | Vocabulary                         | Import Vocabulary via JSON     | Open a modal form to upload a JSON file containing topic name and words array. Imported data is saved to the database and shown on the page.                                   | High     |
| S-05  | Vocabulary Detail                  | View Vocabulary Details        | Display all words in a topic as cards or table. Each entry shows word, type, IPA, definition, example sentences, and image.                                                    | High     |
| S-06  | Vocabulary Detail                  | Switch Vocabulary View Mode    | Toggle between card and table layouts using a switcher button on the vocabulary detail page.                                                                                   | Medium   |
| S-07  | Vocabulary Detail                  | Create New Vocabulary Entry    | Modal form to add a word with type, IPA, definition, dynamic example sentences list, and optional image URL.                                                                   | High     |
| S-08  | Vocabulary Detail                  | Edit / Delete Vocabulary Entry | Each word card/row has Edit and Delete buttons. Edit opens a pre-filled modal; Delete removes the entry from the database.                                                     | High     |
| S-09  | Phrases                            | Browse Phrase Topics           | List all phrase topics with the number of phrases in each. Click a topic to navigate to its detail page.                                                                       | High     |
| S-10  | Phrases                            | Create Phrase Topic            | Open a modal form to input a topic name and create a new phrase topic. Duplicate names are not allowed.                                                                        | High     |
| S-11  | Phrases                            | Import Phrases via JSON        | Open a modal form to upload a JSON file containing topic name and phrases array. Imported data is saved to the database.                                                       | High     |
| S-12  | Phrases Detail                     | View Phrase Details            | Display all phrases in a topic as cards or table. Each entry shows phrase, definition, example sentences, and image.                                                           | High     |
| S-13  | Phrases Detail                     | Switch Phrases View Mode       | Toggle between card and table layouts using a switcher button on the phrases detail page.                                                                                      | Medium   |
| S-14  | Phrases Detail                     | Create New Phrase Entry        | Modal form to add a phrase with definition, dynamic example sentences list, and optional image URL.                                                                            | High     |
| S-15  | Phrases Detail                     | Edit / Delete Phrase Entry     | Each phrase card/row has Edit and Delete buttons. Edit opens a pre-filled modal; Delete removes the entry.                                                                     | High     |
| S-P01 | Vocabulary Detail / Phrases Detail | Practice Start Button          | Each topic detail page has a "Practice" button. Clicking it redirects the user to the Practice page for that topic.                                                            | High     |
| S-P02 | Practice                           | Choose Number of Words         | At the top of the Practice page, the user can select the number of words/phrases to practice. Default is 20. The selector is shown before the session starts.                  | High     |
| S-P03 | Practice                           | Random Word/Phrase Selection   | The app randomly selects N words or phrases from the topic. Already-learned items are deprioritized but still eligible.                                                        | High     |
| S-P04 | Practice                           | Learned Badge on Card          | Each practice card displays a "Learned" badge if the word/phrase has been previously practiced successfully.                                                                   | Medium   |
| S-P05 | Practice                           | Definition Card Display        | The current word/phrase is shown as a card displaying its definition. The word/phrase itself is hidden — the user must recall it.                                              | High     |
| S-P06 | Practice                           | Answer Input Field             | Below the card, an input field lets the user type the word or phrase. Pressing Enter or clicking Submit submits the answer.                                                    | High     |
| S-P07 | Practice                           | Correct Answer Flow            | If the answer is correct, the app calls the API to increment `practiceCount`, shows a success indicator, and advances to the next card.                                        | High     |
| S-P08 | Practice                           | Wrong Answer Flow              | If the answer is wrong, the app calls the API to increment `wrongCount`, shows an error indicator with the correct answer, and requires the user to re-type before continuing. | High     |
| S-P09 | Practice                           | Progress Indicator             | A progress bar or counter (e.g. 3 / 20) is shown at the top of the practice session.                                                                                           | Medium   |
| S-P10 | Practice                           | Congratulations Screen         | After completing all cards, a summary screen shows total correct, total wrong, and accuracy %. Buttons navigate back to the Topic page or Home page.                           | High     |

---

### Features

| ID    | Page                               | Feature                                      | Component                  | Type     |
| ----- | ---------------------------------- | -------------------------------------------- | -------------------------- | -------- |
| F-01  | Home                               | Welcome & Navigation                         | `HomePage`                 | UI       |
| F-02  | Vocabulary                         | Topic List with Word Count                   | `TopicList`                | UI/API   |
| F-03  | Vocabulary                         | Create Topic Modal                           | `CreateTopicModal`         | Form/API |
| F-04  | Vocabulary                         | Import JSON Modal                            | `ImportTopicModal`         | Form/API |
| F-05  | Vocabulary Detail                  | Word Card View                               | `WordCard`                 | UI       |
| F-06  | Vocabulary Detail                  | Word Table View                              | `WordTable`                | UI       |
| F-07  | Vocabulary Detail                  | View Switcher                                | `ViewSwitcher`             | UI       |
| F-08  | Vocabulary Detail                  | Create Word Modal                            | `CreateWordModal`          | Form/API |
| F-09  | Vocabulary Detail                  | Edit Word Modal                              | `EditWordModal`            | Form/API |
| F-10  | Vocabulary Detail                  | Delete Word                                  | `WordCard / WordTable`     | API      |
| F-11  | Vocabulary Detail                  | Dynamic Example Sentences Input              | `ExampleSentencesList`     | Form     |
| F-12  | Phrases                            | Topic List with Phrase Count                 | `TopicList`                | UI/API   |
| F-13  | Phrases                            | Create Topic Modal                           | `CreateTopicModal`         | Form/API |
| F-14  | Phrases                            | Import JSON Modal                            | `ImportTopicModal`         | Form/API |
| F-15  | Phrases Detail                     | Phrase Card View                             | `PhraseCard`               | UI       |
| F-16  | Phrases Detail                     | Phrase Table View                            | `PhraseTable`              | UI       |
| F-17  | Phrases Detail                     | View Switcher                                | `ViewSwitcher`             | UI       |
| F-18  | Phrases Detail                     | Create Phrase Modal                          | `CreatePhraseModal`        | Form/API |
| F-19  | Phrases Detail                     | Edit Phrase Modal                            | `EditPhraseModal`          | Form/API |
| F-20  | Phrases Detail                     | Delete Phrase                                | `PhraseCard / PhraseTable` | API      |
| F-21  | Phrases Detail                     | Dynamic Example Sentences Input              | `ExampleSentencesList`     | Form     |
| F-22  | All                                | Responsive Layout (Mobile/Desktop)           | `Global`                   | UI       |
| F-23  | All Modals                         | Form Validation (RHF + Yup)                  | `Global`                   | Form     |
| F-24  | All                                | API Error & Loading States                   | `Global`                   | UX       |
| F-P01 | Vocabulary Detail / Phrases Detail | Practice Start Button                        | `PracticeButton`           | UI       |
| F-P02 | Practice                           | Word Count Selector                          | `WordCountSelector`        | UI/Form  |
| F-P03 | Practice                           | Random Word/Phrase Fetcher                   | `usePracticeSession`       | API      |
| F-P04 | Practice                           | Learned Badge                                | `LearnedBadge`             | UI       |
| F-P05 | Practice                           | Definition Card                              | `PracticeCard`             | UI       |
| F-P06 | Practice                           | Answer Input Field                           | `AnswerInput`              | Form     |
| F-P07 | Practice                           | Correct Answer Handler                       | `usePracticeSession`       | API      |
| F-P08 | Practice                           | Wrong Answer Handler                         | `usePracticeSession`       | API      |
| F-P09 | Practice                           | Progress Bar                                 | `PracticeProgress`         | UI       |
| F-P10 | Practice                           | Congratulations Screen                       | `CongratulationsScreen`    | UI       |
| F-P11 | Practice                           | Session Summary (correct / wrong / accuracy) | `SessionSummary`           | UI       |
| F-P12 | Practice                           | Navigate Back to Topic                       | `CongratulationsScreen`    | UI       |
| F-P13 | Practice                           | Navigate Back to Home                        | `CongratulationsScreen`    | UI       |

---

### Practice API Endpoints

| Method  | Endpoint                                                | Description                                  |
| ------- | ------------------------------------------------------- | -------------------------------------------- |
| `GET`   | `/api/vocabulary/topics/:topicId/words/random?limit=20` | Fetch N random words from a vocabulary topic |
| `GET`   | `/api/phrases/topics/:topicId/phrases/random?limit=20`  | Fetch N random phrases from a phrases topic  |
| `PATCH` | `/api/vocabulary/words/:wordId/practice`                | Increment `practiceCount` for a word         |
| `PATCH` | `/api/vocabulary/words/:wordId/wrong`                   | Increment `wrongCount` for a word            |
| `PATCH` | `/api/phrases/phrases/:phraseId/practice`               | Increment `practiceCount` for a phrase       |
| `PATCH` | `/api/phrases/phrases/:phraseId/wrong`                  | Increment `wrongCount` for a phrase          |

---

### Practice Data Model Updates

Add the following fields to both `Word` and `Phrase` models:

```ts
practiceCount: { type: Number, default: 0 }
wrongCount:    { type: Number, default: 0 }
isLearned:     { type: Boolean, default: false }  // true when practiceCount >= threshold
```

---

### Practice Flow

```
Topic Detail Page
       │
       ▼
 [Practice Button]
       │
       ▼
 Practice Page
  ┌────────────────────────────────┐
  │  Choose number of words [20 ▾] │  ← WordCountSelector (default 20)
  │  [Start Practice]              │
  └────────────────────────────────┘
       │
       ▼
 Session Start — fetch N random words/phrases
       │
       ▼
 ┌─────────────────────────────────────────┐
 │  Progress:  3 / 20  ████░░░░░░░░░░░░░  │  ← PracticeProgress
 │                                         │
 │  ┌─────────────────────────────────┐    │
 │  │  [Learned ✓]                    │    │  ← LearnedBadge (if applicable)
 │  │                                 │    │
 │  │  Definition:                    │    │  ← PracticeCard
 │  │  "làm hài lòng; đáp ứng"        │    │
 │  │                                 │    │
 │  └─────────────────────────────────┘    │
 │                                         │
 │  Type the word:  [____________] [Enter] │  ← AnswerInput
 └─────────────────────────────────────────┘
       │
       ├── ✅ Correct → PATCH practiceCount → next card
       │
       └── ❌ Wrong   → PATCH wrongCount → show correct answer → re-enter to continue
       │
       ▼ (after last card)
 ┌─────────────────────────────────────────┐
 │  🎉 Congratulations!                    │  ← CongratulationsScreen
 │                                         │
 │  ✅ Correct:   17                       │  ← SessionSummary
 │  ❌ Wrong:      3                       │
 │  🎯 Accuracy: 85%                       │
 │                                         │
 │  [← Back to Topic]   [🏠 Home]          │
 └─────────────────────────────────────────┘
```

## User Stories & Features Summary

### User Stories

| ID   | Page              | Story Title                    | Description                                                                                                                                  | Priority |
| ---- | ----------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| S-01 | Home              | Welcome & Navigation           | Display a welcome message and navigation links to the Vocabulary and Phrases pages.                                                          | High     |
| S-02 | Vocabulary        | Browse Vocabulary Topics       | List all vocabulary topics with the number of words in each. Click a topic to navigate to its detail page.                                   | High     |
| S-03 | Vocabulary        | Create Vocabulary Topic        | Open a modal form to input a topic name and create a new vocabulary topic. Duplicate names are not allowed.                                  | High     |
| S-04 | Vocabulary        | Import Vocabulary via JSON     | Open a modal form to upload a JSON file containing topic name and words array. Imported data is saved to the database and shown on the page. | High     |
| S-05 | Vocabulary Detail | View Vocabulary Details        | Display all words in a topic as cards or table. Each entry shows word, type, IPA, definition, example sentences, and image.                  | High     |
| S-06 | Vocabulary Detail | Switch Vocabulary View Mode    | Toggle between card and table layouts using a switcher button on the vocabulary detail page.                                                 | Medium   |
| S-07 | Vocabulary Detail | Create New Vocabulary Entry    | Modal form to add a word with type, IPA, definition, dynamic example sentences list, and optional image URL.                                 | High     |
| S-08 | Vocabulary Detail | Edit / Delete Vocabulary Entry | Each word card/row has Edit and Delete buttons. Edit opens a pre-filled modal; Delete removes the entry from the database.                   | High     |
| S-09 | Phrases           | Browse Phrase Topics           | List all phrase topics with the number of phrases in each. Click a topic to navigate to its detail page.                                     | High     |
| S-10 | Phrases           | Create Phrase Topic            | Open a modal form to input a topic name and create a new phrase topic. Duplicate names are not allowed.                                      | High     |
| S-11 | Phrases           | Import Phrases via JSON        | Open a modal form to upload a JSON file containing topic name and phrases array. Imported data is saved to the database.                     | High     |
| S-12 | Phrases Detail    | View Phrase Details            | Display all phrases in a topic as cards or table. Each entry shows phrase, definition, example sentences, and image.                         | High     |
| S-13 | Phrases Detail    | Switch Phrases View Mode       | Toggle between card and table layouts using a switcher button on the phrases detail page.                                                    | Medium   |
| S-14 | Phrases Detail    | Create New Phrase Entry        | Modal form to add a phrase with definition, dynamic example sentences list, and optional image URL.                                          | High     |
| S-15 | Phrases Detail    | Edit / Delete Phrase Entry     | Each phrase card/row has Edit and Delete buttons. Edit opens a pre-filled modal; Delete removes the entry.                                   | High     |

---

### Features

| ID    | Page                               | Feature                                      | Component                  | Type     |
| ----- | ---------------------------------- | -------------------------------------------- | -------------------------- | -------- |
| F-01  | Home                               | Welcome & Navigation                         | `HomePage`                 | UI       |
| F-02  | Vocabulary                         | Topic List with Word Count                   | `TopicList`                | UI/API   |
| F-03  | Vocabulary                         | Create Topic Modal                           | `CreateTopicModal`         | Form/API |
| F-04  | Vocabulary                         | Import JSON Modal                            | `ImportTopicModal`         | Form/API |
| F-05  | Vocabulary Detail                  | Word Card View                               | `WordCard`                 | UI       |
| F-06  | Vocabulary Detail                  | Word Table View                              | `WordTable`                | UI       |
| F-07  | Vocabulary Detail                  | View Switcher                                | `ViewSwitcher`             | UI       |
| F-08  | Vocabulary Detail                  | Create Word Modal                            | `CreateWordModal`          | Form/API |
| F-09  | Vocabulary Detail                  | Edit Word Modal                              | `EditWordModal`            | Form/API |
| F-10  | Vocabulary Detail                  | Delete Word                                  | `WordCard / WordTable`     | API      |
| F-11  | Vocabulary Detail                  | Dynamic Example Sentences Input              | `ExampleSentencesList`     | Form     |
| F-12  | Phrases                            | Topic List with Phrase Count                 | `TopicList`                | UI/API   |
| F-13  | Phrases                            | Create Topic Modal                           | `CreateTopicModal`         | Form/API |
| F-14  | Phrases                            | Import JSON Modal                            | `ImportTopicModal`         | Form/API |
| F-15  | Phrases Detail                     | Phrase Card View                             | `PhraseCard`               | UI       |
| F-16  | Phrases Detail                     | Phrase Table View                            | `PhraseTable`              | UI       |
| F-17  | Phrases Detail                     | View Switcher                                | `ViewSwitcher`             | UI       |
| F-18  | Phrases Detail                     | Create Phrase Modal                          | `CreatePhraseModal`        | Form/API |
| F-19  | Phrases Detail                     | Edit Phrase Modal                            | `EditPhraseModal`          | Form/API |
| F-20  | Phrases Detail                     | Delete Phrase                                | `PhraseCard / PhraseTable` | API      |
| F-21  | Phrases Detail                     | Dynamic Example Sentences Input              | `ExampleSentencesList`     | Form     |
| F-22  | All                                | Responsive Layout (Mobile/Desktop)           | `Global`                   | UI       |
| F-23  | All Modals                         | Form Validation (RHF + Yup)                  | `Global`                   | Form     |
| F-24  | All                                | API Error & Loading States                   | `Global`                   | UX       |
| F-P01 | Vocabulary Detail / Phrases Detail | Practice Start Button                        | `PracticeButton`           | UI       |
| F-P02 | Practice                           | Word Count Selector                          | `WordCountSelector`        | UI/Form  |
| F-P03 | Practice                           | Random Word/Phrase Fetcher                   | `usePracticeSession`       | API      |
| F-P04 | Practice                           | Learned Badge                                | `LearnedBadge`             | UI       |
| F-P05 | Practice                           | Definition Card                              | `PracticeCard`             | UI       |
| F-P06 | Practice                           | Answer Input Field                           | `AnswerInput`              | Form     |
| F-P07 | Practice                           | Correct Answer Handler                       | `usePracticeSession`       | API      |
| F-P08 | Practice                           | Wrong Answer Handler                         | `usePracticeSession`       | API      |
| F-P09 | Practice                           | Progress Bar                                 | `PracticeProgress`         | UI       |
| F-P10 | Practice                           | Congratulations Screen                       | `CongratulationsScreen`    | UI       |
| F-P11 | Practice                           | Session Summary (correct / wrong / accuracy) | `SessionSummary`           | UI       |
| F-P12 | Practice                           | Navigate Back to Topic                       | `CongratulationsScreen`    | UI       |
| F-P13 | Practice                           | Navigate Back to Home                        | `CongratulationsScreen`    | UI       |

---

## Summary

| Metric                  | Count |
| ----------------------- | ----- |
| Total User Stories      | 25    |
| Total Features          | 37    |
| High Priority Stories   | 21    |
| Medium Priority Stories | 4     |
| Pages                   | 6     |
| Practice API Endpoints  | 6     |
| New Model Fields        | 3     |
