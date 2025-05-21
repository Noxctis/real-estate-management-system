// PaymentList.jsx - displays a list of payments for the current user
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import PaymentForm from "./PaymentForm";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editPayment, setEditPayment] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch payments with lease, property, and tenant info populated
      const res = await apiRequest.get("/payments");
      // Map payments to include property and tenant info for display
      const paymentsWithInfo = res.data.map(payment => ({
        ...payment,
        propertyDisplay: payment.lease?.property?.title
          ? `${payment.lease.property.title} (${payment.lease.property.address})`
          : payment.lease?.propertyId || payment.leaseId,
        tenantDisplay: payment.lease?.tenant?.username
          ? `${payment.lease.tenant.username}${payment.lease.tenant.fullName ? ' - ' + payment.lease.tenant.fullName : ''}`
          : payment.lease?.tenantId || '',
      }));
      setPayments(paymentsWithInfo);
    } catch (err) {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await apiRequest.delete(`/payments/${id}`);
      fetchPayments();
    } catch {
      alert("Failed to delete payment");
    }
  };

  const handleEdit = (payment) => {
    setEditPayment(payment);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditPayment(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditPayment(null);
    fetchPayments();
  };

  const handleMarkPaid = async (payment) => {
    try {
      await apiRequest.put(`/payments/${payment.id}`, { ...payment, status: "paid" });
      fetchPayments();
    } catch {
      alert("Failed to mark as paid");
    }
  };

  return (
    <div className="payment-list">
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h2>Your Payments</h2>
        <button onClick={handleNew}>+ New Payment</button>
      </div>
      {showForm && (
        <div className="modal-bg" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <PaymentForm payment={editPayment} onSuccess={handleFormSuccess} />
            <button onClick={() => setShowForm(false)}>Close</button>
          </div>
        </div>
      )}
      {loading ? <div>Loading payments...</div> : error ? <div>{error}</div> : !payments.length ? <div>No payments found.</div> : (
        <ul>
          {payments.map((payment) => (
            <li key={payment.id} style={{marginBottom: 12, border: "1px solid #eee", padding: 8, borderRadius: 6}}>
              <strong>Lease:</strong> {payment.propertyDisplay} — Tenant: {payment.tenantDisplay}<br />
              <strong>Amount:</strong> ${payment.amount}<br />
              <strong>Date:</strong> {payment.date}<br />
              <strong>Status:</strong> {payment.status}<br />
              <span style={{fontSize: '0.95em', color: '#666'}}>
                {payment.status === 'pending' ? 'This is a payment you owe as the tenant for this lease.' : 'This payment has been marked as paid.'}
              </span><br />
              <button onClick={() => handleEdit(payment)}>Edit</button>
              <button onClick={() => handleDelete(payment.id)} style={{marginLeft: 8}}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentList;
