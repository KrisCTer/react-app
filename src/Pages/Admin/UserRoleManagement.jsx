import React, { useState } from "react";
import { Button } from "../../Components/UI/Button";
import { Card, CardContent } from "../../Components/UI/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../Components/UI/Dialog";
import { Input } from "../../Components/UI/Input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import axios from "axios";

const fetchEmployees = async () => {
  const res = await axios.get("/api/employees"); 
  return res.data; // API trả về dạng { managers: [], sales: [] }
};

export default function UserRoleManagement() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["employees"], fetchEmployees, {
    refetchOnWindowFocus: false,
  });

  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, action: null, user: null });
  const [notification, setNotification] = useState(null);
  const [page, setPage] = useState({ managers: 1, sales: 1 });
  const itemsPerPage = 5;

  const mutation = useMutation({
    mutationFn: async ({ action, user }) => {
      if (action === "add") {
        await axios.post(`/api/employees/promote`, { username: user.username });
      } else {
        await axios.post(`/api/employees/demote`, { username: user.username });
      }
    },
    onSuccess: () => queryClient.invalidateQueries(["employees"]),
  });

  const handleAction = (action, user) => {
    setDialog({ open: true, action, user });
  };

  const confirmAction = async () => {
    await mutation.mutateAsync({ action: dialog.action, user: dialog.user });
    setNotification(dialog.action === "add" ? "Cấp quyền thành công!" : "Hủy quyền thành công!");
    setDialog({ open: false, action: null, user: null });
  };

  const filterEmployees = (list) =>
    list?.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.username.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const paginate = (list, type) => {
    const start = (page[type] - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  if (isLoading) return <p className="p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 space-y-6">
      {["managers", "sales"].map((type) => {
        const title = type === "managers" ? "Nhân viên Quản lý" : "Nhân viên Bán hàng";
        const filtered = filterEmployees(data[type]);
        const paginated = paginate(filtered, type);
        const totalPages = Math.ceil(filtered.length / itemsPerPage);

        return (
          <Card key={type}>
            <CardContent>
              <div className="flex justify-between items-center pb-4">
                <h2 className="text-lg font-bold">{title}</h2>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-48"
                  />
                </div>
              </div>

              <AnimatePresence>
                <motion.table
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full border text-left"
                >
                  <thead>
                    <tr className="bg-gray-100">
                      {type === "managers" && <th className="p-2">#</th>}
                      <th className="p-2">Tên đăng nhập</th>
                      <th className="p-2">Tên nhân viên</th>
                      <th className="p-2">Số điện thoại</th>
                      <th className="p-2">Giới tính</th>
                      <th className="p-2">Ngày sinh</th>
                      <th className="p-2">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((emp, i) => (
                      <motion.tr
                        key={emp.username}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t"
                      >
                        {type === "managers" && <td className="p-2">{i + 1 + (page.managers - 1) * itemsPerPage}</td>}
                        <td className="p-2">{emp.username}</td>
                        <td className="p-2">{emp.name}</td>
                        <td className="p-2">{emp.phone}</td>
                        <td className="p-2">{emp.gender}</td>
                        <td className="p-2">{emp.dob}</td>
                        <td className="p-2">
                          {type === "managers" ? (
                            <Button variant="destructive" size="sm" onClick={() => handleAction("remove", emp)}>Hủy quyền</Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleAction("add", emp)}>Cấp quyền</Button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              </AnimatePresence>

              {/* Phân trang */}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  disabled={page[type] === 1}
                  onClick={() => setPage((p) => ({ ...p, [type]: p[type] - 1 }))}
                >
                  Trước
                </Button>
                <span>Trang {page[type]} / {totalPages}</span>
                <Button
                  variant="outline"
                  disabled={page[type] === totalPages}
                  onClick={() => setPage((p) => ({ ...p, [type]: p[type] + 1 }))}
                >
                  Sau
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Xác nhận */}
      <Dialog open={dialog.open} onOpenChange={(o) => setDialog({ ...dialog, open: o })}>
        <DialogContent asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>
                {dialog.action === "add"
                  ? `Xác nhận cấp quyền cho ${dialog.user?.name}?`
                  : `Bạn có chắc muốn hủy quyền của ${dialog.user?.name}?`}
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialog({ open: false, action: null, user: null })}>No</Button>
              <Button onClick={confirmAction} disabled={mutation.isLoading}>Yes</Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Thông báo */}
      <Dialog open={!!notification} onOpenChange={() => setNotification(null)}>
        <DialogContent asChild>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle>{notification}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => setNotification(null)}>OK</Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
