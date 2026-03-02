# Vocabulary Learning App

A full-stack web application for learning vocabulary and phrases, built with React, Express, MongoDB, and Docker.

## Features

- 📚 **Vocabulary Management**: Learn words organized by topics with type, IPA pronunciation, definitions, and examples
- 💬 **Phrases Management**: Master common phrases organized by topics with definitions and examples
- ➕ **Create & Edit**: Add your own words and phrases, or edit existing ones
- 📥 **Import Data**: Upload JSON files to bulk import topics and content
- 🔄 **Multiple Views**: Switch between card and table views for comfortable learning
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **MUI (Material-UI)** - Component library
- **React Router** - Navigation
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client

### Backend

- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Express Validator** - Request validation

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
vocabulary/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── vocabulary/
│   │   │   └── phrases/
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── validators/    # Request validators
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
├── data/                  # Sample data for import
│   ├── contract-and-marketing.json
│   └── lession-2-pharse.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### Installation & Running

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vocabulary
   ```

2. **Create environment files**

   ```bash
   # Server environment
   cp server/.env.example server/.env

   # Client environment
   cp client/.env.example client/.env
   ```

3. **Start the application with Docker**

   ```bash
   docker-compose up --build
   ```

   This will start three containers:
   - **MongoDB** - Database (port 27017)
   - **Server** - Express API (port 3001)
   - **Client** - React app (port 5173)

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - Health check: http://localhost:3001/api/health

### Development Mode

The application runs in development mode with hot reloading:

- **Client**: Vite's HMR updates the UI instantly
- **Server**: Nodemon watches for file changes and restarts automatically

### Code Quality & Formatting

The project uses **ESLint** and **Prettier** for code quality and consistent formatting.

#### Running Linting & Formatting

**Client:**

```bash
# Lint code
cd client
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

**Server:**

```bash
# Lint code
cd server
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

#### VS Code Integration

The project includes VS Code configuration for automatic formatting on save:

1. Install recommended extensions:
   - **ESLint** (`dbaeumer.vscode-eslint`)
   - **Prettier** (`esbenp.prettier-vscode`)

2. Recommended extensions will be suggested when you open the workspace

3. Code will automatically format on save and fix ESLint issues

#### Configuration Files

- **Client ESLint**: `.eslintrc.cjs` - React-specific rules
- **Server ESLint**: `.eslintrc.json` - Node.js rules
- **Prettier**: `.prettierrc` - Formatting rules (both client/server)

### Stopping the Application

```bash
docker-compose down
```

To remove volumes (database data):

```bash
docker-compose down -v
```

## Usage Guide

### Creating Topics

1. Navigate to **Vocabulary** or **Phrases** page
2. Click **"Create New Topic"** button
3. Enter a topic name
4. Click **"Create"**

### Importing Data

1. Click **"Import Topics and Words/Phrases"** button
2. Upload a JSON file with the following structure:

**For Vocabulary:**

```json
[
  {
    "topic": "Business Terms",
    "words": [
      {
        "word": "Negotiate",
        "type": "Verb",
        "IPA": "/nɪˈɡoʊ.ʃi.eɪt/",
        "definition": "To discuss something to reach an agreement",
        "exampleSentences": [
          "They negotiated a better deal.",
          "We need to negotiate the terms."
        ],
        "image": "https://example.com/image.jpg"
      }
    ]
  }
]
```

**For Phrases:**

```json
[
  {
    "topic": "Office Life",
    "phrases": [
      {
        "phrase": "Think outside the box",
        "definition": "To think creatively and differently",
        "exampleSentences": [
          "We need to think outside the box to solve this problem."
        ],
        "image": ""
      }
    ]
  }
]
```

3. Click **"Import"** to add the data

### Adding Words/Phrases

1. Click on a topic to view its details
2. Click **"Create New Word/Phrase"** button
3. Fill in the form:
   - **For Vocabulary**: word, type, IPA, definition, example sentences, image (optional)
   - **For Phrases**: phrase, definition, example sentences, image (optional)
4. Click **"Add Example Sentence"** to add more examples
5. Click **"Create"**

### Editing & Deleting

- Click the **Edit** icon on any card/row to modify content
- Click the **Delete** icon and confirm to remove content

### Switching Views

- On detail pages, use the **"Card View" / "Table View"** toggle to switch display modes

## API Endpoints

### Vocabulary

#### Topics

- `GET /api/vocabulary/topics` - Get all vocabulary topics
- `GET /api/vocabulary/topics/:topicId` - Get specific topic
- `POST /api/vocabulary/topics` - Create new topic
- `PUT /api/vocabulary/topics/:topicId` - Update topic
- `DELETE /api/vocabulary/topics/:topicId` - Delete topic

#### Words

- `GET /api/vocabulary/topics/:topicId/words` - Get words by topic
- `GET /api/vocabulary/words/:wordId` - Get specific word
- `POST /api/vocabulary/words` - Create new word
- `PUT /api/vocabulary/words/:wordId` - Update word
- `DELETE /api/vocabulary/words/:wordId` - Delete word
- `POST /api/vocabulary/import` - Import topic with words

### Phrases

#### Topics

- `GET /api/phrases/topics` - Get all phrase topics
- `GET /api/phrases/topics/:topicId` - Get specific topic
- `POST /api/phrases/topics` - Create new topic
- `PUT /api/phrases/topics/:topicId` - Update topic
- `DELETE /api/phrases/topics/:topicId` - Delete topic

#### Phrases

- `GET /api/phrases/topics/:topicId/phrases` - Get phrases by topic
- `GET /api/phrases/phrases/:phraseId` - Get specific phrase
- `POST /api/phrases/phrases` - Create new phrase
- `PUT /api/phrases/phrases/:phraseId` - Update phrase
- `DELETE /api/phrases/phrases/:phraseId` - Delete phrase
- `POST /api/phrases/import` - Import topic with phrases

## Environment Variables

### Server (.env)

```
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://admin:password123@mongodb:27017/vocabulary?authSource=admin
```

### Client (.env)

```
VITE_API_URL=http://localhost:3001/api
```

## Database

MongoDB is configured with:

- **Username**: admin
- **Password**: password123
- **Database**: vocabulary
- **Port**: 27017

Data is persisted in a Docker volume named `mongodb_data`.

## Troubleshooting

### Port Already in Use

If ports 3001, 5173, or 27017 are already in use:

1. Stop other services using these ports
2. Or modify the ports in `docker-compose.yml`

### Cannot Connect to Database

1. Ensure MongoDB container is running: `docker ps`
2. Check MongoDB logs: `docker logs vocabulary-mongodb`
3. Verify connection string in `server/.env`

### Frontend Cannot Connect to API

1. Check server logs: `docker logs vocabulary-server`
2. Verify `VITE_API_URL` in `client/.env`
3. Ensure server is running on port 3001

### Clear All Data

To reset the database:

```bash
docker-compose down -v
docker-compose up --build
```

## Development

### Without Docker

If you prefer to run without Docker:

1. **Install dependencies**

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Start MongoDB** (locally or use a cloud instance)

3. **Update environment files** with your MongoDB connection string

4. **Run server**

   ```bash
   cd server
   npm run dev
   ```

5. **Run client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
