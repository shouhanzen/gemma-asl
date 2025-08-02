# PREV.md - Current App Architecture & Functionality

## Overview
This is a standard React application bootstrapped with Create React App (CRA), currently in its initial state with minimal customization.

## Technology Stack
- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Language**: TypeScript 4.9.5
- **Testing**: Jest with React Testing Library
- **Styling**: CSS (App.css, index.css)

## Project Structure
```
gemma-asl/
├── public/
│   ├── index.html          # Main HTML template
│   ├── favicon.ico         # Site favicon
│   ├── logo192.png         # PWA icon (192px)
│   ├── logo512.png         # PWA icon (512px)
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # Search engine directives
├── src/
│   ├── App.tsx             # Main application component
│   ├── App.css             # App component styles
│   ├── App.test.tsx        # App component tests
│   ├── index.tsx           # Application entry point
│   ├── index.css           # Global styles
│   ├── logo.svg            # React logo asset
│   ├── react-app-env.d.ts  # CRA TypeScript definitions
│   ├── reportWebVitals.ts  # Performance monitoring
│   └── setupTests.ts       # Test configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Current Functionality

### Main Application (App.tsx)
- **Purpose**: Displays the default CRA welcome screen
- **Components**: Single functional component with JSX
- **Content**: 
  - React logo with spinning animation
  - Welcome message prompting to edit App.tsx
  - Link to React documentation
- **Styling**: Uses App.css for component-specific styles

### Entry Point (index.tsx)
- **Purpose**: Application bootstrapping and DOM rendering
- **Features**:
  - React 18+ createRoot API usage
  - Strict Mode enabled for development warnings
  - Performance monitoring via reportWebVitals
  - Renders App component into DOM element with id "root"

### HTML Template (public/index.html)
- **Purpose**: Base HTML structure for SPA
- **Features**:
  - Responsive viewport meta tag
  - PWA-ready with manifest.json link
  - Favicon and touch icons configured
  - Fallback message for users without JavaScript

## Architecture Patterns

### Component Architecture
- **Pattern**: Functional components with hooks
- **Structure**: Single-level component hierarchy (App only)
- **State Management**: None implemented (using React built-ins)
- **Styling**: CSS modules approach with component-specific stylesheets

### Build & Development
- **Development Server**: Uses react-scripts start (webpack dev server)
- **Build Process**: react-scripts build (production optimization)
- **Testing**: Jest + React Testing Library
- **TypeScript**: Strict mode enabled with modern ES features

### Configuration
- **TypeScript**: ES5 target, ESNext modules, strict type checking
- **ESLint**: React app configuration with Jest support
- **Browser Support**: Modern browsers (>0.2% usage, not dead)

## Development Workflow
1. **Start Development**: `npm start` (localhost:3000)
2. **Run Tests**: `npm test` (interactive watch mode)
3. **Build Production**: `npm run build` (optimized bundle)
4. **Eject Configuration**: `npm run eject` (one-way operation)

## Current State Assessment
- **Status**: Fresh CRA installation, unmodified
- **Customizations**: None beyond initial setup
- **Dependencies**: All standard CRA packages, no additional libraries
- **Features**: Basic React app structure ready for development
- **Performance**: Default CRA optimizations (code splitting, minification)

## Notable Characteristics
- PWA-ready structure with manifest.json
- TypeScript enabled with strict configuration
- Modern React patterns (functional components, hooks)
- Standard CRA folder structure maintained
- No custom routing, state management, or API integration
- Ready for feature development and customization