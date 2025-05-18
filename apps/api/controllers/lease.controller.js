import prisma from "../lib/prisma.js";

export const createLease = async (req, res) => {
  try {
    console.log('LEASE CREATE BODY:', req.body);
    const lease = await prisma.lease.create({ data: req.body });
    res.status(201).json(lease);
  } catch (err) {
    console.error('LEASE CREATE ERROR:', err);
    res.status(500).json({ message: "Failed to create lease.", error: err.message });
  }
};

export const getLeases = async (req, res) => {
  try {
    const leases = await prisma.lease.findMany({ include: { payments: true } });
    res.status(200).json(leases);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leases." });
  }
};

export const getLease = async (req, res) => {
  try {
    const lease = await prisma.lease.findUnique({
      where: { id: req.params.id },
      include: { payments: true },
    });
    if (!lease) return res.status(404).json({ message: "Lease not found." });
    res.status(200).json(lease);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lease." });
  }
};

export const updateLease = async (req, res) => {
  try {
    const lease = await prisma.lease.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(lease);
  } catch (err) {
    res.status(500).json({ message: "Failed to update lease." });
  }
};

export const deleteLease = async (req, res) => {
  try {
    await prisma.lease.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Lease deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete lease." });
  }
};

export const searchLeases = async (req, res) => {
  const { q } = req.query;
  try {
    const leases = await prisma.lease.findMany({
      where: {
        OR: [
          { propertyId: { contains: q, mode: "insensitive" } },
          { tenantId: { contains: q, mode: "insensitive" } }
        ]
      },
      select: { id: true, propertyId: true, tenantId: true }
    });
    res.status(200).json(leases);
  } catch (err) {
    res.status(500).json({ message: "Failed to search leases!" });
  }
};
