// MarketAnalysis.jsx - shows real-time market stats for similar properties by address
import React, { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

const MarketAnalysis = ({ address }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError(null);
    apiRequest.get(`/posts/market-analysis?address=${encodeURIComponent(address)}`)
      .then(res => setStats(res.data))
      .catch(() => setError("Failed to load market analysis"))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return null;
  if (loading) return <div>Loading market analysis...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  return (
    <div className="market-analysis">
      <h4>Market Analysis for this Area</h4>
      <div>Similar Listings: <b>{stats.count}</b></div>
      <div>Average Price: <b>${stats.avgPrice ? stats.avgPrice.toLocaleString() : 0}</b></div>
    </div>
  );
};

export default MarketAnalysis;
