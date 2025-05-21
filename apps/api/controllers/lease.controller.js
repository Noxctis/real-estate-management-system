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
    const userId = req.userId;
    // Check if user is admin/owner (has properties)
    const userProperties = await prisma.post.findMany({ where: { userId } });
    let leases;
    if (userProperties.length > 0) {
      // User is an owner/admin, show leases for their properties
      const propertyIds = userProperties.map(p => p.id);
      leases = await prisma.lease.findMany({
        where: { propertyId: { in: propertyIds } },
        include: { property: true, tenant: true, payments: true },
      });
    } else {
      // Regular user, show leases where they are the tenant
      leases = await prisma.lease.findMany({
        where: { tenantId: userId },
        include: { property: true, tenant: true, payments: true },
      });
    }
    res.status(200).json(leases);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leases.", error: err.message });
  }
};

export const getLease = async (req, res) => {
  try {
    const lease = await prisma.lease.findUnique({
      where: { id: req.params.id },
      include: {
        property: true,
        tenant: true,
        payments: true,
      },
    });
    if (!lease) return res.status(404).json({ message: "Lease not found." });
    res.status(200).json(lease);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch lease.", error: err.message });
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
