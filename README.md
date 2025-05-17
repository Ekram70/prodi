# Prodi Chrome Extension

A productivity Chrome extension built with React, TypeScript, and shadcn/ui. It helps you manage your time by setting website time limits and enabling a grayscale bedtime mode.

## Features

- **Website Time Limits**: Set daily and monthly time limits for specific websites.
- **Bedtime Mode**: Automatically enable grayscale mode during your bedtime hours.
- **Usage Statistics**: Track your time spent on different websites.

## Tech Stack

- **React**: For building the UI components.
- **TypeScript**: For type safety and better developer experience.
- **shadcn/ui**: For beautiful and accessible UI components.
- **Vite**: For fast and efficient development and building.
- **Tailwind CSS**: For styling.

## Project Structure

```
prodi/
├── dist/              # Built extension files
├── src/               # Source code
│   ├── background/    # Background service worker
│   ├── components/    # React components
│   ├── content/       # Content scripts
│   ├── lib/           # Utility functions and types
│   ├── pages/         # Popup and options pages
│   ├── manifest.json  # Extension manifest
│   └── styles.css     # Global styles
├── scripts/           # Build scripts
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── README.md          # Project documentation
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/prodi.git
   cd prodi
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Development

Run the development server:

```sh
npm run dev
```

### Building

Build the extension:

```sh
npm run build
```

The built files will be in the `dist/` directory.

### Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked" and select the `dist/` directory

## License

MIT
