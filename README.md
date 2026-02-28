# OpenMRS Dependency Vulnerability Dashboard

A comprehensive dashboard for visualizing and analyzing security vulnerabilities in OpenMRS repositories.

## Features

- **Dashboard View**: Overview of all repositories with their overall severity and highest vulnerability scores.
- **Repository Details**: Expandable sections for each repository showing detailed vulnerability information.
- **Vulnerability Tables**: Interactive tables for browsing vulnerabilities with sorting and filtering.
- **Severity Tracking**: Visual severity indicators (Critical, High, Medium, Low).
- **Exploit Detection**: Highlights vulnerabilities that have known exploits.
- **Data Sources**: Integrates vulnerability data from multiple sources.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd openmrs-contrib-dependancy-vulnerabilities
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the dashboard in your browser.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── RepositorySection.tsx  # Repository cards with expandable tables
│   ├── CveTable.tsx           # Vulnerability tables
│   └── SeverityTag.tsx        # Severity indicators
├── types/             # TypeScript type definitions
│   └── report.types.ts
├── utils/             # Utility functions
│   ├── transform.ts           # Data transformation logic
│   ├── severity.ts            # Severity normalization
│   └── sorting.ts             # Sorting utilities
└── App.tsx            # Main application component
```

## Data

Vulnerability data is stored in the `data/` directory as JSON files:

- `openmrs-core.json` - Vulnerabilities in OpenMRS Core
- `openmrs-module-billing.json` - Vulnerabilities in Billing Module
- `openmrs-module-idgen.json` - Vulnerabilities in IDGen Module

## Development

### Adding New Repositories

1. Add your vulnerability data JSON file to the `data/` directory
2. Update `src/utils/transform.ts` to include the new data in `allReports` array
3. Run `npm run dev` to see the changes

### Component Development

- Use Carbon Design System components for consistent UI
- Keep components focused and reusable
- Follow the existing styling patterns in `src/components/*.css`

## License

[MIT License](LICENSE)
