# Tetris React

A modern implementation of the classic Tetris game built with React, TypeScript, and Vite.

## Features

- Classic Tetris gameplay mechanics
- Responsive design with neon visual theme
- Score tracking and level progression
- Next piece preview
- Game over detection and reset
- Pause functionality
- Hard drop feature
- Sound effects system with:
  - Movement sounds
  - Rotation effects
  - Piece landing
  - Line clearing
  - Level up jingles
  - Game over sound
  - Mute toggle option

## Controls

- ← → : Move piece left/right
- ↑ : Rotate piece
- ↓ : Soft drop
- Space : Hard drop
- P : Pause game
- R : Reset game
- M : Toggle sound

## Technical Details

### Core Technologies
- React 18
- TypeScript
- Vite
- CSS Modules

### Sound System
The game uses the Web Audio API for sound generation, providing:
- Low-latency audio playback
- Synthesized sound effects
- No external audio file dependencies
- Volume control through mute toggle

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Architecture

The game is built with a modular architecture:
- `useGameLogic` hook manages game state and mechanics
- Component-based UI with React
- CSS Modules for scoped styling
- Web Audio API for sound generation
- TypeScript for type safety

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this code for your own projects!
