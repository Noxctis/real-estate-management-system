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
        // Log error to terminal for debugging
        // eslint-disable-next-line no-console
        console.error("AdminDashboard fetch error:", err, err?.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handler to mark payment as paid
  const handleMarkPaid = async (paymentId) => {
    try {
      await apiRequest.put(`/payments/${paymentId}`, { status: "paid" });
      // Refresh payments after update
      const paymentRes = await apiRequest.get("/payments");
      setPayments(paymentRes.data);
    } catch {
      alert("Failed to mark payment as paid");
    }
  };

  // Helper to get property display string
  const getPropertyDisplay = (lease) => {
    if (!lease) return "Unknown";
    if (lease.property?.title || lease.property?.address) {
      return `${lease.property?.title || ''}${lease.property?.address ? ' (' + lease.property.address + ')' : ''}`;
    }
    return lease.propertyId || lease.id || "Unknown";
  };

  // Helper to get tenant display string
  const getTenantDisplay = (lease) => {
    if (!lease) return "Unknown";
    if (lease.tenant?.username) {
      return lease.tenant.username + (lease.tenant.fullName ? ' - ' + lease.tenant.fullName : '');
    }
    return lease.tenantId || "Unknown";
  };

  // Aggregate reporting
  const totalLeases = leases.length;
  const totalPayments = payments.length;
  const totalPaid = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0);

  // Payments by property (show property name/address)
  const paymentsByProperty = {};
  payments.forEach(p => {
    const lease = leases.find(l => l.id === p.leaseId);
    const propertyKey = getPropertyDisplay(lease);
    if (!paymentsByProperty[propertyKey]) paymentsByProperty[propertyKey] = { paid: 0, pending: 0, count: 0 };
    if (p.status === "paid") paymentsByProperty[propertyKey].paid += p.amount || 0;
    if (p.status === "pending") paymentsByProperty[propertyKey].pending += p.amount || 0;
    paymentsByProperty[propertyKey].count++;
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
                <th>Property</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Payment Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(paymentsByProperty).map(([property, stats]) => (
                <tr key={property}>
                  <td>{property}</td>
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
                <th>Property</th>
                <th>Tenant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Paid Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice().reverse().slice(0, 10).map(p => {
                const lease = leases.find(l => l.id === p.leaseId);
                return (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{getPropertyDisplay(lease)}</td>
                    <td>{getTenantDisplay(lease)}</td>
                    <td>${p.amount}</td>
                    <td>{p.status}</td>
                    <td>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "-"}</td>
                    <td>{p.paidDate ? new Date(p.paidDate).toLocaleDateString() : "-"}</td>
                    <td>
                      {p.status === "pending" && (
                        <button onClick={() => handleMarkPaid(p.id)} style={{background: '#4caf50', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer'}}>Mark as Paid</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
