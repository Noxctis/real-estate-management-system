// LeaseList.jsx - displays a list of leases for the current user
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import LeaseForm from "./LeaseForm";

const LeaseList = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editLease, setEditLease] = useState(null);

  const fetchLeases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest.get("/leases");
      setLeases(res.data);
    } catch (err) {
      setError("Failed to load leases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lease?")) return;
    try {
      await apiRequest.delete(`/leases/${id}`);
      fetchLeases();
    } catch {
      alert("Failed to delete lease");
    }
  };

  const handleEdit = (lease) => {
    setEditLease(lease);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditLease(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditLease(null);
    fetchLeases();
  };

  return (
    <div className="lease-list">
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2>Your Leases</h2>
        <button onClick={handleNew}>+ New Lease</button>
      </div>
      {showForm && (
        <div className="modal-bg" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <LeaseForm lease={editLease} onSuccess={handleFormSuccess} />
            <button onClick={() => setShowForm(false)}>Close</button>
          </div>
        </div>
      )}
      {loading ? <div>Loading leases...</div> : error ? <div>{error}</div> : !leases.length ? <div>No leases found.</div> : (
        <ul>
          {leases.map((lease) => (
            <li key={lease.id} style={{marginBottom: 12, border: "1px solid #eee", padding: 8, borderRadius: 6}}>
              <strong>Property:</strong> {lease.propertyAddress || lease.propertyId}<br />
              <strong>Tenant:</strong> {lease.tenantName || lease.tenantId}<br />
              <strong>Start:</strong> {lease.startDate}<br />
              <strong>End:</strong> {lease.endDate}<br />
              <strong>Rent:</strong> ${lease.rentAmount}<br />
              <button onClick={() => handleEdit(lease)}>Edit</button>
              <button onClick={() => handleDelete(lease.id)} style={{marginLeft: 8}}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaseList;
