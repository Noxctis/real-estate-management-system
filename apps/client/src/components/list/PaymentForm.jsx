// PaymentForm.jsx - create or edit a payment
import React, { useState } from "react";
import apiRequest from "../../lib/apiRequest";

const PaymentForm = ({ onSuccess, payment, leaseId }) => {
  // This form allows you to create or edit a payment for a lease. Instead of showing only lease IDs, you can search by property name and tenant username for more context.
  const [form, setForm] = useState({
    leaseId: leaseId || payment?.leaseId || "",
    amount: payment?.amount || "",
    date: payment?.date || "",
    status: payment?.status || "pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaseOptions, setLeaseOptions] = useState([]);
  const [leaseSearch, setLeaseSearch] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLeaseSearch = async (e) => {
    const q = e.target.value;
    setLeaseSearch(q);
    if (q.length < 2) return;
    try {
      const res = await apiRequest.get(`/leases?q=${encodeURIComponent(q)}`);
      setLeaseOptions(res.data);
    } catch {}
  };

  const handleSelectLease = (e) => {
    setForm({ ...form, leaseId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Convert amount to number and date to ISO, map 'date' to 'dueDate'
      const payload = {
        leaseId: form.leaseId,
        amount: form.amount ? Number(form.amount) : undefined,
        dueDate: form.date ? new Date(form.date).toISOString() : (form.dueDate ? new Date(form.dueDate).toISOString() : undefined),
        paidDate: form.status === 'paid' ? (form.date ? new Date(form.date).toISOString() : new Date().toISOString()) : undefined,
        status: form.status,
      };
      if (payment) {
        await apiRequest.put(`/payments/${payment.id}`, payload);
      } else {
        await apiRequest.post("/payments", payload);
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError("Failed to save payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>{payment ? "Edit Payment" : "New Payment"}</h3>
      <p style={{fontSize: "0.97em", color: "#666", marginBottom: 10}}>
        {payment ? "Update payment details for this lease." : "Create a new payment for a lease. Search by property name and tenant username for context."}
      </p>
      {!leaseId && (
        <>
          <label>Lease</label>
          <input
            type="text"
            placeholder="Search lease by property or tenant..."
            value={leaseSearch}
            onChange={handleLeaseSearch}
            autoComplete="off"
          />
          <select name="leaseId" value={form.leaseId} onChange={handleSelectLease} required>
            <option value="">Select lease...</option>
            {leaseOptions.map((l) => (
              <option key={l.id} value={l.id}>
                {l.propertyTitle || l.propertyId} ({l.propertyAddress || l.propertyId}) - {l.tenantUsername || l.tenantId}
              </option>
            ))}
          </select>
        </>
      )}
      <label>Amount</label>
      <input name="amount" type="number" value={form.amount} onChange={handleChange} required />
      <label>Date</label>
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <label>Status</label>
      <select name="status" value={form.status} onChange={handleChange} required>
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="failed">Failed</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Payment"}</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default PaymentForm;
