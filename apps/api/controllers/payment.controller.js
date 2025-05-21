import prisma from "../lib/prisma.js";

export const createPayment = async (req, res) => {
  try {
    console.log('PAYMENT CREATE BODY:', req.body);
    const payment = await prisma.payment.create({ data: req.body });
    res.status(201).json(payment);
  } catch (err) {
    console.error('PAYMENT CREATE ERROR:', err);
    res.status(500).json({ message: "Failed to create payment.", error: err.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const userId = req.userId;
    // Find all properties owned by the user
    const userProperties = await prisma.post.findMany({ where: { userId } });
    let payments = [];
    if (userProperties.length > 0) {
      // User is an owner/admin, show payments for their properties
      const propertyIds = userProperties.map(p => p.id);
      const leases = await prisma.lease.findMany({ where: { propertyId: { in: propertyIds } } });
      const leaseIds = leases.map(l => l.id);
      payments = await prisma.payment.findMany({
        where: { leaseId: { in: leaseIds } },
        include: {
          lease: { include: { property: true, tenant: true } },
        },
      });
      // Filter payments to only those where the property owner is the current user
      payments = payments.filter(payment => payment.lease?.property?.userId === userId);
    } else {
      // Regular user, show payments where they are the tenant
      const leases = await prisma.lease.findMany({ where: { tenantId: userId } });
      const leaseIds = leases.map(l => l.id);
      payments = await prisma.payment.findMany({
        where: { leaseId: { in: leaseIds } },
        include: {
          lease: { include: { property: true, tenant: true } },
        },
      });
    }
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments.", error: err.message });
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        lease: {
          include: {
            property: true,
            tenant: true,
          },
        },
      },
    });
    if (!payment) return res.status(404).json({ message: "Payment not found." });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payment." });
  }
};

export const updatePayment = async (req, res) => {
  try {
    console.log('PAYMENT UPDATE BODY:', req.body);
    // Only allow valid fields for update
    const { leaseId, amount, dueDate, paidDate, status } = req.body;
    let data = { leaseId, amount, dueDate, status };
    // If status is being set to 'paid' and paidDate is not provided, set paidDate to now
    if (status === 'paid' && !paidDate) {
      data.paidDate = new Date();
    } else if (paidDate) {
      data.paidDate = paidDate;
    }
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data,
    });
    res.status(200).json(payment);
  } catch (err) {
    console.error('PAYMENT UPDATE ERROR:', err);
    res.status(500).json({ message: "Failed to update payment.", error: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    await prisma.payment.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Payment deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete payment." });
  }
};
