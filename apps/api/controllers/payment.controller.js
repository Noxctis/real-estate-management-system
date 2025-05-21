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
    // Include lease, and for lease include property and tenant
    const payments = await prisma.payment.findMany({
      include: {
        lease: {
          include: {
            property: true,
            tenant: true,
          },
        },
      },
    });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments." });
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
    const data = { leaseId, amount, dueDate, paidDate, status };
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
