# Code Quality Setup - Quick Reference

This project uses ESLint and Prettier to maintain code quality and consistent formatting.

## What's Configured

### ESLint

- **Client**: React-specific rules with TypeScript support
- **Server**: Node.js rules with TypeScript support
- Automatically checks for code quality issues
- Catches common errors and anti-patterns

### Prettier

- Enforces consistent code formatting
- Integrates with ESLint
- Auto-formats on save in VS Code

## VS Code Setup (Recommended)

1. **Install Extensions** (VS Code will prompt you):
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)

2. **Benefits**:
   - ✅ Auto-format on save
   - ✅ Inline error highlighting
   - ✅ Auto-fix on save
   - ✅ Consistent code style across team

## Command Line Usage

### Client (React)

```bash
cd client

# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format all code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

### Server (Express)

```bash
cd server

# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Format all code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

## Running in Docker

The ESLint and Prettier packages are installed in the Docker containers. You can run commands inside containers:

```bash
# Client
docker exec vocabulary-client npm run lint
docker exec vocabulary-client npm run format

# Server
docker exec vocabulary-server npm run lint
docker exec vocabulary-server npm run format
```

## Configuration Files

### Client

- **ESLint**: `client/.eslintrc.cjs`
  - React, React Hooks, and TypeScript rules
  - Prettier integration
- **Prettier**: `client/.prettierrc`
  - Single quotes, semicolons, 100 char line width
  - 2-space indentation

### Server

- **ESLint**: `server/.eslintrc.json`
  - Node.js and TypeScript rules
  - Prettier integration
- **Prettier**: `server/.prettierrc`
  - Same rules as client for consistency

### VS Code

- **Settings**: `.vscode/settings.json`
  - Format on save enabled
  - ESLint auto-fix on save
  - Prettier as default formatter

## Common Issues & Solutions

### "ESLint is disabled"

- Make sure you have the ESLint extension installed
- Reload VS Code window: `Cmd/Ctrl + Shift + P` → "Reload Window"

### "Prettier not formatting"

- Check that Prettier extension is installed
- Verify it's set as default formatter in settings
- Try manually formatting: `Cmd/Ctrl + Shift + P` → "Format Document"

### "Dependencies not found"

- Run `npm install` in client or server directory
- Or rebuild Docker containers: `docker-compose up --build`

### "node_modules missing locally"

If you need local node_modules for VS Code IntelliSense:

```bash
# Copy from containers to local
docker cp vocabulary-client:/app/node_modules ./client/node_modules
docker cp vocabulary-server:/app/node_modules ./server/node_modules
```

## Best Practices

1. **Before Committing**: Always run lint and format checks
2. **VS Code**: Enable auto-format on save for seamless experience
3. **Team Consistency**: All developers should use the same ESLint/Prettier config
4. **CI/CD**: Add lint checks to your CI pipeline

## Customizing Rules

### Adding ESLint Rules

Edit the appropriate `.eslintrc` file:

```js
"rules": {
  "no-console": "warn",  // warn on console.log
  "semi": ["error", "always"]  // require semicolons
}
```

### Changing Prettier Settings

Edit `.prettierrc`:

```json
{
  "printWidth": 80, // change line width
  "singleQuote": false // use double quotes
}
```

After changing configs, restart VS Code for changes to take effect.

## Additional Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [ESLint React Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
