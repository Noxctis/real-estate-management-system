// LeaseForm.jsx - create or edit a lease
import React, { useState } from "react";
import apiRequest from "../../lib/apiRequest";

const LeaseForm = ({ onSuccess, lease }) => {
  // This form allows you to create or edit a lease agreement between a tenant (by username) and a property (by name/address).
  // Instead of showing only IDs, users can search and select by username and property name for better context.
  const [form, setForm] = useState({
    propertyId: lease?.propertyId || "",
    tenantId: lease?.tenantId || "",
    startDate: lease?.startDate || "",
    endDate: lease?.endDate || "",
    rentAmount: lease?.rentAmount || "",
    status: lease?.status || "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [propertySearch, setPropertySearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePropertySearch = async (e) => {
    const q = e.target.value;
    setPropertySearch(q);
    if (q.length < 2) return;
    try {
      const res = await apiRequest.get(`/posts/search/autocomplete?q=${encodeURIComponent(q)}`);
      setPropertyOptions(res.data);
    } catch {}
  };

  const handleUserSearch = async (e) => {
    const q = e.target.value;
    setUserSearch(q);
    if (q.length < 2) return;
    try {
      const res = await apiRequest.get(`/users/search/autocomplete?q=${encodeURIComponent(q)}`);
      setUserOptions(res.data);
    } catch {}
  };

  const handleSelectProperty = (e) => {
    setForm({ ...form, propertyId: e.target.value });
  };

  const handleSelectUser = (e) => {
    setForm({ ...form, tenantId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Convert dates to ISO and rentAmount to number
      const payload = {
        ...form,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        rentAmount: form.rentAmount ? Number(form.rentAmount) : undefined,
        status: form.status || "active",
      };
      if (lease) {
        await apiRequest.put(`/leases/${lease.id}`, payload);
      } else {
        await apiRequest.post("/leases", payload);
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError("Failed to save lease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="lease-form" onSubmit={handleSubmit}>
      <h3>{lease ? "Edit Lease" : "New Lease"}</h3>
      <p style={{fontSize: "0.97em", color: "#666", marginBottom: 10}}>
        {lease ? "Update details for this lease agreement." : "Create a new lease agreement between a tenant and a property. Search by username and property name for context."}
      </p>
      <label>Property</label>
      <input
        type="text"
        placeholder="Search property by name or address..."
        value={propertySearch}
        onChange={handlePropertySearch}
        autoComplete="off"
      />
      <select name="propertyId" value={form.propertyId} onChange={handleSelectProperty} required>
        <option value="">Select property...</option>
        {propertyOptions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title ? `${p.title}` : p.address ? p.address : p.id}
            {p.address && p.title ? ` (${p.address})` : p.address && !p.title ? ` (${p.address})` : ""}
            {p.ownerUsername ? ` - Owner: ${p.ownerUsername}` : ""}
          </option>
        ))}
      </select>
      <label>Tenant</label>
      <input
        type="text"
        placeholder="Search user by username or email..."
        value={userSearch}
        onChange={handleUserSearch}
        autoComplete="off"
      />
      <select name="tenantId" value={form.tenantId} onChange={handleSelectUser} required>
        <option value="">Select user...</option>
        {userOptions.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username} {u.email ? `(${u.email})` : ""} {u.fullName ? `- ${u.fullName}` : ""}
          </option>
        ))}
      </select>
      <label>Start Date</label>
      <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
      <label>End Date</label>
      <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
      <label>Rent Amount</label>
      <input name="rentAmount" type="number" value={form.rentAmount} onChange={handleChange} required />
      <label>Status</label>
      <select name="status" value={form.status || "active"} onChange={handleChange} required>
        <option value="active">Active</option>
        <option value="terminated">Terminated</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Lease"}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default LeaseForm;
