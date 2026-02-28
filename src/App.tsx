import { RepositorySection } from "./components";
import { allReports } from "./utils/transform";
import { sortRepositories } from "./utils/sorting";
import "./App.css";

const sortedReports = sortRepositories(allReports);

export const App = () => {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          OpenMRS Dependency Vulnerability Report
        </h1>
        <div className="app__accent" />
        <p className="app__description">
          A summary of known security vulnerabilities detected across OpenMRS
          modules by automated dependency scanning. Each module lists its
          vulnerable dependencies, severity levels, and recommended fix
          versions to help maintainers prioritize upgrades.
        </p>
      </header>

      <main className="app__content">
        {sortedReports.map((report) => (
          <RepositorySection key={report.name} report={report} />
        ))}
      </main>
    </div>
  );
};
