# Development Guidelines

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Start both servers (see main README)

## Code Style

### Frontend (React/JavaScript)

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Use meaningful variable and function names

### Backend (Go)

- Follow Go conventions and idioms
- Use `gofmt` for formatting
- Write clear, self-documenting code
- Keep functions focused and small
- Handle errors explicitly

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with clear messages
4. Push and create a pull request

## Testing

### Frontend
- Write unit tests for components
- Test user interactions
- Use React Testing Library

### Backend
- Write unit tests for functions
- Test API endpoints
- Use Go's built-in testing framework

## Environment Variables

Create `.env` files for environment-specific configuration:

- `.env.local` - Local development (gitignored)
- `.env.example` - Example configuration (committed)

## Debugging

### Frontend
- Use React DevTools
- Check browser console
- Use Vite's error overlay

### Backend
- Use Go's debugging tools
- Check server logs
- Use `fmt.Printf` or a logging library

## Performance

- Optimize images and assets
- Use React.memo for expensive components
- Implement pagination for large datasets
- Use database indexes appropriately
