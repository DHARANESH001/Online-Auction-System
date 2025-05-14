# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

```
src/
├── components/         # Reusable components
│   ├── Navbar/        # Navigation component
│   └── common/        # Common UI components
├── pages/             # Page components
│   └── Home/          # Home page
├── models/            # Type definitions and models
├── styles/            # Global styles and theme
├── utils/             # Utility functions
├── services/          # API services
└── App.jsx            # Root component
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Import Conventions

This project uses absolute imports with the `@` alias. For example:

```javascript
// Instead of
import Navbar from '../../components/Navbar/Navbar';

// Use
import Navbar from '@/components/Navbar/Navbar';
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
