import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  Search,
  RefreshCw,
  UserPlus,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  Crown,
} from "lucide-react";

const UserPermissionSystem = () => {
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    cmndCccd: "",
  });
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("employees"); // "employees" or "managers"
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Confirmation states
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    user: null,
    action: "",
    password: "",
  });

  const API_BASE_URL = "http://localhost:8080/nhanvien";

  // Utility functions
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const resetForm = () => {
    setFormData({ username: "", password: "", fullName: "", cmndCccd: "" });
  };

  const getRoleName = (loaiNQ) => {
    const roles = { "0": "Bán hàng", "1": "Quản lý", "2": "Admin" };
    return roles[loaiNQ] || "Không xác định";
  };

  const canChangeRole = () => {
    return currentUser && currentUser.loaiNQ !== "0";
  };

  // API functions
  const apiCall = async (endpoint, method = "GET", body = null) => {
    try {
      const config = {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      };
      if (body) config.body = JSON.stringify(body);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (response.ok) {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) {
      showMessage("error", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const userData = await apiCall("/dang-nhap", "POST", {
        tenDangNhap: formData.username,
        matKhau: formData.password,
      });
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      showMessage("success", "Đăng nhập thành công!");
      resetForm();
    } catch (error) {
      showMessage("error", "Thông tin đăng nhập không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const { username, password, fullName, cmndCccd } = formData;
    
    if (!username || !password || !fullName) {
      showMessage("error", "Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);
    try {
      await apiCall("/dang-ky", "POST", {
        tenDangNhap: username,
        matKhau: password,
        tenNhanVien: fullName,
        cmndCccd: cmndCccd || null,
      });
      
      showMessage("success", "Đăng ký thành công! Vui lòng đăng nhập.");
      setShowLogin(true);
      resetForm();
    } catch (error) {
      showMessage("error", "Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiCall("");
      setUsers(data);
    } catch (error) {
      showMessage("error", "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (user, action) => {
    if (!canChangeRole()) {
      showMessage("error", "Bạn không có quyền thay đổi vai trò");
      return;
    }
    
    setConfirmDialog({
      show: true,
      user,
      action,
      password: "",
    });
  };

  const confirmRoleChange = async () => {
    const { user, action, password } = confirmDialog;
    
    if (!password) {
      showMessage("error", "Vui lòng nhập mật khẩu xác thực");
      return;
    }

    setLoading(true);
    try {
      const endpoint = action === "promote" ? "/nang-quan-ly" : "/giang-chuc";
      const result = await apiCall(endpoint, "PUT", {
        id: user.maNhanVien,
        password,
      });
      
      const isSuccess = 
        (action === "promote" && result === "Thang chuc thanh cong") ||
        (action === "demote" && result === "giang chuc thanh cong");
      
      if (isSuccess) {
        await fetchUsers();
        showMessage("success", `${action === "promote" ? "Thăng" : "Giáng"} chức thành công!`);
        setConfirmDialog({ show: false, user: null, action: "", password: "" });
      } else {
        throw new Error(result);
      }
    } catch (error) {
      showMessage("error", `Không thể ${action === "promote" ? "thăng" : "giáng"} chức`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUsers();
  }, [isAuthenticated]);

  // Filter users by role and search term
  const employees = users.filter(user => user.loaiNQ === "0");
  const managers = users.filter(user => user.loaiNQ === "1");
  const admins = users.filter(user => user.loaiNQ === "2");

  const getFilteredUsers = () => {
    const targetUsers = activeTab === "employees" ? employees : managers;
    return targetUsers.filter(user =>
      (user.tenNhanVien || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.tenDangNhap || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((user.cmndCccd || "").toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredUsers = getFilteredUsers();
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // Render user table
  const renderUserTable = (userList, showActions = true) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CMND/CCCD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userList.map((user, index) => (
              <tr key={user.maNhanVien} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.tenDangNhap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.tenNhanVien}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.cmndCccd || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.loaiNQ === "2" ? "bg-purple-100 text-purple-800" :
                    user.loaiNQ === "1" ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {getRoleName(user.loaiNQ)}
                  </span>
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {canChangeRole() && user.loaiNQ !== "2" ? (
                      <div className="flex space-x-2">
                        {user.loaiNQ === "0" && (
                          <button
                            onClick={() => handleRoleChange(user, "promote")}
                            className="text-green-600 hover:text-green-900 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Thăng chức
                          </button>
                        )}
                        {user.loaiNQ === "1" && (
                          <button
                            onClick={() => handleRoleChange(user, "demote")}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            Giáng chức
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Không có quyền</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} 
              trong {filteredUsers.length} kết quả
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Auth UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Hệ thống quản lý nhân viên
            </h1>
            <p className="text-gray-600">
              {showLogin ? "Đăng nhập để tiếp tục" : "Tạo tài khoản mới"}
            </p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg mb-4 flex items-center ${
              message.type === "error" 
                ? "bg-red-100 text-red-700 border border-red-200" 
                : "bg-green-100 text-green-700 border border-green-200"
            }`}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            
            <input
              type="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />

            {!showLogin && (
              <>
                <input
                  type="text"
                  placeholder="Họ và tên *"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                
                <input
                  type="text"
                  placeholder="CMND/CCCD (không bắt buộc)"
                  value={formData.cmndCccd}
                  onChange={(e) => setFormData({...formData, cmndCccd: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </>
            )}

            <button
              onClick={showLogin ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                showLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />
              )}
              {loading ? "Đang xử lý..." : (showLogin ? "Đăng nhập" : "Đăng ký")}
            </button>

            <button
              onClick={() => {
                setShowLogin(!showLogin);
                resetForm();
                setMessage({ type: "", text: "" });
              }}
              className="w-full text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Quản lý nhân viên
                </h1>
                <p className="text-sm text-gray-600">
                  Xin chào: <strong>{currentUser.tenNhanVien}</strong> ({getRoleName(currentUser.loaiNQ)})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Làm mới
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                  setUsers([]);
                  resetForm();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 flex items-center ${
            message.type === "error" 
              ? "bg-red-100 text-red-700 border border-red-200" 
              : "bg-green-100 text-green-700 border border-green-200"
          }`}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("employees")}
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "employees"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Nhân viên bán hàng ({employees.length})
              </button>
              <button
                onClick={() => setActiveTab("managers")}
                className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === "managers"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Crown className="w-4 h-4 mr-2" />
                Quản lý ({managers.length})
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Tìm kiếm ${activeTab === "employees" ? "nhân viên" : "quản lý"} theo tên, tên đăng nhập hoặc CMND/CCCD...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {renderUserTable(paginatedUsers)}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-800">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Nhân viên bán hàng</p>
                <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <Crown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quản lý</p>
                <p className="text-2xl font-bold text-gray-800">{managers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-gray-800">{admins.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmDialog.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Xác nhận {confirmDialog.action === "promote" ? "thăng chức" : "giáng chức"}
                </h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  {confirmDialog.action === "promote" ? "Thăng chức" : "Giáng chức"} nhân viên:{" "}
                  <strong>{confirmDialog.user?.tenNhanVien}</strong>
                </p>
                
                <input
                  type="password"
                  placeholder="Nhập mật khẩu để xác thực"
                  value={confirmDialog.password}
                  onChange={(e) => setConfirmDialog({...confirmDialog, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={confirmRoleChange}
                  disabled={!confirmDialog.password || loading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 ${
                    confirmDialog.action === "promote"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading ? "Đang xử lý..." : "Xác nhận"}
                </button>
                <button
                  onClick={() => setConfirmDialog({ show: false, user: null, action: "", password: "" })}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPermissionSystem;