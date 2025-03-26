"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=10`);
      setUsers(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success("Cập nhật quyền thành công");
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi cập nhật quyền");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("Xóa người dùng thành công");
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi xóa người dùng");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

      <div className="bg-neutral-900 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-800">
              <th className="px-6 py-3 text-left">Tên</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Quyền</th>
              <th className="px-6 py-3 text-left">Ngày tạo</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-neutral-800">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                    className="bg-neutral-800 rounded px-2 py-1"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-400">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-green-500 text-white" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
