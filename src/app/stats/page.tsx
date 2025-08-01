"use client";

import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

export default function StatsPage() {
  const [totalNodes, setTotalNodes] = useState<number | null>(null);
  const [nodesOverTime, setNodesOverTime] = useState<any[]>([]);
  const [popularChannels, setPopularChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const [totalNodesRes, nodesOverTimeRes, popularChannelsRes] = await Promise.all([
        fetch(buildApiUrl("/api/stats/total-nodes")).then(r => r.json()),
        fetch(buildApiUrl("/api/stats/nodes-over-time")).then(r => r.json()),
        fetch(buildApiUrl("/api/stats/popular-channels")).then(r => r.json()),
      ]);
      setTotalNodes(totalNodesRes.total_nodes ?? null);
      setNodesOverTime(nodesOverTimeRes.data ?? []);
      setPopularChannels(popularChannelsRes.data ?? []);
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">MeshCore Network Stats</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Total Unique Nodes</h2>
            <div className="text-3xl font-mono">{totalNodes}</div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Nodes Heard Over Time</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Shows nodes heard within the last 7 days by date.
            </p>
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Day</th>
                  <th className="border px-2 py-1">Total Nodes</th>
                  <th className="border px-2 py-1">With Location</th>
                  <th className="border px-2 py-1">Without Location</th>
                </tr>
              </thead>
              <tbody>
                {nodesOverTime.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{row.day}</td>
                    <td className="border px-2 py-1">{row.cumulative_unique_nodes}</td>
                    <td className="border px-2 py-1">{row.nodes_with_location}</td>
                    <td className="border px-2 py-1">{row.nodes_without_location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Most Popular Channels</h2>
            <table className="w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Channel Hash</th>
                  <th className="border px-2 py-1">Message Count</th>
                </tr>
              </thead>
              <tbody>
                {popularChannels.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{row.channel_hash}</td>
                    <td className="border px-2 py-1">{row.message_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 