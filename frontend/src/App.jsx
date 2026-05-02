import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [rootCause, setRootCause] = useState("");
  const [fixApplied, setFixApplied] = useState("");
  const [prevention, setPrevention] = useState("");

  // Fetch Data
  const fetchIncidents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/incidents");

      setIncidents(res.data);

      if (selectedIncident) {
        const updated = res.data.find(
          (item) => item.id === selectedIncident.id
        );
        if (updated) setSelectedIncident(updated);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIncidents();

    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  // RCA Submit
  const submitRCA = async () => {
    if (!selectedIncident) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/submit-rca/${selectedIncident.id}`,
        {
          root_cause: rootCause,
          fix_applied: fixApplied,
          prevention: prevention
        }
      );

      alert("RCA Saved Successfully");

      setRootCause("");
      setFixApplied("");
      setPrevention("");

      fetchIncidents();
    } catch (error) {
      alert("Failed to save RCA");
    }
  };

  const getStatusColor = (status) => {
    if (status === "OPEN") return "#ef4444";
    if (status === "RESOLVED") return "#22c55e";
    if (status === "CLOSED") return "#3b82f6";
    if (status === "INVESTIGATING") return "#f59e0b";
    return "#6b7280";
  };

  const filtered = incidents.filter((item) => {
    const matchSearch =
      item.component_id
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.id.toString().includes(search);

    const matchStatus =
      statusFilter === "ALL"
        ? true
        : item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const card = {
    background: "white",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.07)"
  };

  const input = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        background: "#f3f6fb",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ marginBottom: "5px" }}>
        Incident Management Dashboard
      </h1>

      <p style={{ color: "#6b7280", marginBottom: "20px" }}>
        Real-time monitoring & workflow system
      </p>

      {/* Top Controls */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}
      >
        <input
          style={input}
          placeholder="Search by ID / Component"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={input}
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>ALL</option>
          <option>OPEN</option>
          <option>INVESTIGATING</option>
          <option>RESOLVED</option>
          <option>CLOSED</option>
        </select>

        <button
          onClick={fetchIncidents}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: "15px",
          marginBottom: "25px"
        }}
      >
        <div style={card}>
          <p>Total</p>
          <h2>{incidents.length}</h2>
        </div>

        <div style={card}>
          <p>Open</p>
          <h2 style={{ color: "red" }}>
            {
              incidents.filter(
                (i) => i.status === "OPEN"
              ).length
            }
          </h2>
        </div>

        <div style={card}>
          <p>Investigating</p>
          <h2 style={{ color: "orange" }}>
            {
              incidents.filter(
                (i) =>
                  i.status === "INVESTIGATING"
              ).length
            }
          </h2>
        </div>

        <div style={card}>
          <p>Resolved</p>
          <h2 style={{ color: "green" }}>
            {
              incidents.filter(
                (i) => i.status === "RESOLVED"
              ).length
            }
          </h2>
        </div>

        <div style={card}>
          <p>Closed</p>
          <h2 style={{ color: "blue" }}>
            {
              incidents.filter(
                (i) => i.status === "CLOSED"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Main Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px"
        }}
      >
        {/* Left Table */}
        <div style={card}>
          <h2>Incidents</h2>

          <table
            style={{
              width: "100%",
              marginTop: "15px",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#eef2ff"
                }}
              >
                <th>ID</th>
                <th>Component</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() =>
                    setSelectedIncident(item)
                  }
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    borderBottom:
                      "1px solid #eee",
                    background:
                      selectedIncident?.id ===
                      item.id
                        ? "#dbeafe"
                        : "white"
                  }}
                >
                  <td>{item.id}</td>
                  <td>{item.component_id}</td>
                  <td>{item.severity}</td>
                  <td>
                    <span
                      style={{
                        background:
                          getStatusColor(
                            item.status
                          ),
                        color: "white",
                        padding:
                          "4px 10px",
                        borderRadius:
                          "20px",
                        fontSize: "12px"
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Panel */}
        <div style={card}>
          <h2>Incident Details</h2>

          {!selectedIncident ? (
            <p>Select incident row</p>
          ) : (
            <>
              <p>
                <b>ID:</b>{" "}
                {selectedIncident.id}
              </p>

              <p>
                <b>Component:</b>{" "}
                {
                  selectedIncident.component_id
                }
              </p>

              <p>
                <b>Status:</b>{" "}
                {selectedIncident.status}
              </p>

              <p>
                <b>Severity:</b>{" "}
                {
                  selectedIncident.severity
                }
              </p>

              <p>
                <b>Created:</b>{" "}
                {selectedIncident.created_at
                  ? new Date(
                      selectedIncident.created_at
                    ).toLocaleString()
                  : "N/A"}
              </p>

              <hr />

              <h3>Submit RCA</h3>

              <input
                style={input}
                placeholder="Root Cause"
                value={rootCause}
                onChange={(e) =>
                  setRootCause(
                    e.target.value
                  )
                }
              />

              <input
                style={input}
                placeholder="Fix Applied"
                value={fixApplied}
                onChange={(e) =>
                  setFixApplied(
                    e.target.value
                  )
                }
              />

              <input
                style={input}
                placeholder="Prevention"
                value={prevention}
                onChange={(e) =>
                  setPrevention(
                    e.target.value
                  )
                }
              />

              <button
                onClick={submitRCA}
                style={{
                  width: "100%",
                  padding: "12px",
                  background:
                    "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Submit RCA
              </button>

              {selectedIncident.root_cause && (
                <>
                  <hr />
                  <h3>Saved RCA</h3>

                  <p>
                    <b>Root Cause:</b>{" "}
                    {
                      selectedIncident.root_cause
                    }
                  </p>

                  <p>
                    <b>Fix:</b>{" "}
                    {
                      selectedIncident.fix_applied
                    }
                  </p>

                  <p>
                    <b>Prevention:</b>{" "}
                    {
                      selectedIncident.prevention
                    }
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;