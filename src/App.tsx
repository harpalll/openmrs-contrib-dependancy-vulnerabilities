import { RepositorySection } from "./components";

function App() {
  return (
    <>
      <div
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>OpenMRS Dependency Vulnerability Report</h1>
          <div
            style={{ height: "10px", maxWidth: "30px", background: "##017D79" }}
          ></div>
          <p>
            A summary of known security vulnerabilities detected across OpenMRS
            modules by automated dependency scanning. Each module lists its
            vulnerable dependencies, severity levels, and recommended fix
            versions to help maintainers prioritize upgrades.
          </p>
        </div>
        <RepositorySection name="openmrs-core" severity="critical" />
      </div>
    </>
  );
}

export default App;
