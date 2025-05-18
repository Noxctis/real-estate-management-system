// AdminDashboard.jsx - Admin dashboard and reporting for payments and leases
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import "./adminDashboard.scss";

const AdminDashboard = () => {
  const [leases, setLeases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [leaseRes, paymentRes] = await Promise.all([
          apiRequest.get("/leases"),
          apiRequest.get("/payments")
        ]);
        setLeases(leaseRes.data);
        setPayments(paymentRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Aggregate reporting
  const totalLeases = leases.length;
  const totalPayments = payments.length;
  const totalPaid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0);

  // Payments by property
  const paymentsByProperty = {};
  payments.forEach(p => {
    const lease = leases.find(l => l.id === p.leaseId);
    const propertyId = lease?.propertyId || "Unknown";
    if (!paymentsByProperty[propertyId]) paymentsByProperty[propertyId] = { paid: 0, pending: 0, count: 0 };
    if (p.status === "paid") paymentsByProperty[propertyId].paid += p.amount || 0;
    if (p.status === "pending") paymentsByProperty[propertyId].pending += p.amount || 0;
    paymentsByProperty[propertyId].count++;
  });

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
        <>
          <div className="summary">
            <div>Total Leases: <b>{totalLeases}</b></div>
            <div>Total Payments: <b>{totalPayments}</b></div>
            <div>Total Paid: <b>${totalPaid.toLocaleString()}</b></div>
            <div>Total Pending: <b>${totalPending.toLocaleString()}</b></div>
          </div>
          <h2>Payments by Property</h2>
          <table>
            <thead>
              <tr>
                <th>Property ID</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Payment Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(paymentsByProperty).map(([propertyId, stats]) => (
                <tr key={propertyId}>
                  <td>{propertyId}</td>
                  <td>${stats.paid.toLocaleString()}</td>
                  <td>${stats.pending.toLocaleString()}</td>
                  <td>{stats.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Recent Payments</h2>
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Lease ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice().reverse().slice(0, 10).map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.leaseId}</td>
                  <td>${p.amount}</td>
                  <td>{p.status}</td>
                  <td>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "-"}</td>
                  <td>{p.paidDate ? new Date(p.paidDate).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
