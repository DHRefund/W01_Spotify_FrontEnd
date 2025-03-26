"use client";

import { useEffect, useState } from "react";
import { FaUsers, FaMusic, FaMicrophone } from "react-icons/fa";
import api from "@/lib/axios";

interface StatsData {
  totalUsers: number;
  totalSongs: number;
  totalArtists: number;
  recentUsers: any[];
  popularSongs: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={FaUsers} label="Tổng số người dùng" value={stats?.totalUsers || 0} color="blue" />
        <StatCard icon={FaMusic} label="Tổng số bài hát" value={stats?.totalSongs || 0} color="green" />
        <StatCard icon={FaMicrophone} label="Tổng số nghệ sĩ" value={stats?.totalArtists || 0} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Người dùng mới</h2>
          <div className="space-y-4">
            {stats?.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-neutral-400">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bài hát phổ biến</h2>
          <div className="space-y-4">
            {stats?.popularSongs.map((song) => (
              <div key={song.songId} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-neutral-400">{song._count} lượt nghe</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-neutral-900 rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-${color}-500/10`}>
          <Icon className={`text-${color}-500`} size={24} />
        </div>
        <div>
          <p className="text-sm text-neutral-400">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
