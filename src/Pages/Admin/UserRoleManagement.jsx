import React, { useState, useEffect } from 'react';
import { User, Shield, Eye, EyeOff, AlertTriangle, X, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

// Framer Motion-like animations using CSS transitions and transforms
const fadeInUp = {
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  exit: { opacity: 0, transform: 'translateY(-20px)' }
};

const scaleIn = {
  initial: { opacity: 0, transform: 'scale(0.9)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  exit: { opacity: 0, transform: 'scale(0.9)' }
};

const UserPermissionSystem = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPageManager, setCurrentPageManager] = useState(1);
  const [currentPageSales, setCurrentPageSales] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTermManager, setSearchTermManager] = useState('');
  const [searchTermSales, setSearchTermSales] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [sortConfigManager, setSortConfigManager] = useState({ key: null, direction: 'asc' });
  const [sortConfigSales, setSortConfigSales] = useState({ key: null, direction: 'asc' });
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
  
  const mockUsers = [
    { id: 1, username: 'camthuy', name: 'Lê Cẩm Thúy', phone: '0964732243', gender: 'Nữ', birthDate: '24/02/2001', role: 'Quản lý', email: 'camthuy@company.com' },
    { id: 2, username: 'duchau', name: 'Nguyễn Đức Hậu', phone: '0964732245', gender: 'Nam', birthDate: '24/02/2001', role: 'Quản lý', email: 'duchau@company.com' },
    { id: 3, username: 'thanhhao', name: 'Trần Thanh Hảo', phone: '0964732244', gender: 'Khác', birthDate: '18/02/2001', role: 'Quản lý', email: 'thanhhao@company.com' },
    { id: 4, username: 'nguyentu', name: 'Nguyễn Tú', phone: '0964732242', gender: 'Nam', birthDate: '18/02/2001', role: 'Bán hàng', email: 'nguyentu@company.com' },
    { id: 5, username: 'vandat', name: 'Nguyễn Văn Đạt', phone: '0964732246', gender: 'Nam', birthDate: '18/02/2001', role: 'Bán hàng', email: 'vandat@company.com' },
    { id: 6, username: 'minhanh', name: 'Trần Minh Anh', phone: '0964732247', gender: 'Nữ', birthDate: '15/03/2000', role: 'Bán hàng', email: 'minhanh@company.com' },
    { id: 7, username: 'hoanglong', name: 'Lê Hoàng Long', phone: '0964732248', gender: 'Nam', birthDate: '10/05/1999', role: 'Quản lý', email: 'hoanglong@company.com' },
    { id: 8, username: 'thuylinh', name: 'Phạm Thùy Linh', phone: '0964732249', gender: 'Nữ', birthDate: '22/08/2001', role: 'Bán hàng', email: 'thuylinh@company.com' }
  ];

  // API Functions
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // For demonstration, we'll use the mock data
      // In real implementation, replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/users`);
      // const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setUsers(mockUsers);
    } catch (err) {
      setError('Không thể tải dữ liệu người dùng. Vui lòng thử lại.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      // In real implementation, make API call:
      // const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ role: newRole })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      showSuccess('Cập nhật quyền thành công!');
    } catch (err) {
      setError('Không thể cập nhật quyền. Vui lòng thử lại.');
      console.error('Error updating user role:', err);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
    showSuccess('Dữ liệu đã được làm mới!');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
  // Giả lập việc lấy thông tin user từ API hoặc form đăng nhập
  const loggedInUser = {
    id: 1,
    username: 'admin',
    role: 'Admin', // hoặc 'Quản lý' hoặc 'Bán hàng'
    password: '123456' // Trong thực tế, không nên lưu password như này
  };
  
  setCurrentUser(loggedInUser);
  setIsAuthenticated(true);
  showSuccess('Đăng nhập thành công!');
};

  const handlePermissionChange = (user) => {
  if (!hasPermissionToChangeRole()) {
    setError('Bạn không có quyền thay đổi vị trí nhân viên.');
    return;
  }
  setSelectedUser(user);
  setShowConfirmDialog(true);
};

  const hasPermissionToChangeRole = () => {
  return currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Quản lý');
};

  const confirmPermissionChange = async () => {
  if (!hasPermissionToChangeRole()) {
    setError('Bạn không có quyền thay đổi vị trí nhân viên.');
    setShowConfirmDialog(false);
    return;
  }
  
  // Đóng dialog xác nhận và mở dialog nhập password
  setShowConfirmDialog(false);
  setShowPasswordDialog(true);
  setConfirmPassword('');
  setPasswordError('');
};

  // Sorting function for managers
  const handleSortManager = (key) => {
    let direction = 'asc';
    if (sortConfigManager.key === key && sortConfigManager.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigManager({ key, direction });
  };

  // Sorting function for sales
  const handleSortSales = (key) => {
    let direction = 'asc';
    if (sortConfigSales.key === key && sortConfigSales.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfigSales({ key, direction });
  };

  const handlePasswordConfirmation = async () => {
  // Kiểm tra password (trong thực tế, bạn sẽ gọi API để verify)
  if (confirmPassword !== currentUser.password && confirmPassword !== '123456') {
    setPasswordError('Mật khẩu không chính xác!');
    return;
  }
  
  // Nếu password đúng, thực hiện thay đổi quyền
  const newRole = selectedUser.role === 'Quản lý' ? 'Bán hàng' : 'Quản lý';
  await updateUserRole(selectedUser.id, newRole);
  
  // Đóng dialog và reset
  setShowPasswordDialog(false);
  setSelectedUser(null);
  setConfirmPassword('');
  setPasswordError('');
};

const handleCancelPasswordDialog = () => {
  setShowPasswordDialog(false);
  setSelectedUser(null);
  setConfirmPassword('');
  setPasswordError('');
};

  // Filter and sort managers
  const managerUsers = users.filter(user => user.role === 'Quản lý');
  const filteredManagers = managerUsers.filter(user =>
    user.name.toLowerCase().includes(searchTermManager.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTermManager.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTermManager.toLowerCase())
  );

  const sortedManagers = [...filteredManagers].sort((a, b) => {
    if (!sortConfigManager.key) return 0;
    
    const aValue = a[sortConfigManager.key];
    const bValue = b[sortConfigManager.key];
    
    if (aValue < bValue) return sortConfigManager.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfigManager.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter and sort sales
  const salesUsers = users.filter(user => user.role === 'Bán hàng');
  const filteredSales = salesUsers.filter(user =>
    user.name.toLowerCase().includes(searchTermSales.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTermSales.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTermSales.toLowerCase())
  );

  const sortedSales = [...filteredSales].sort((a, b) => {
    if (!sortConfigSales.key) return 0;
    
    const aValue = a[sortConfigSales.key];
    const bValue = b[sortConfigSales.key];
    
    if (aValue < bValue) return sortConfigSales.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfigSales.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPagesManager = Math.ceil(sortedManagers.length / itemsPerPage);
  const startIndexManager = (currentPageManager - 1) * itemsPerPage;
  const paginatedManagers = sortedManagers.slice(startIndexManager, startIndexManager + itemsPerPage);

  const totalPagesSales = Math.ceil(sortedSales.length / itemsPerPage);
  const startIndexSales = (currentPageSales - 1) * itemsPerPage;
  const paginatedSales = sortedSales.slice(startIndexSales, startIndexSales + itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPageManager(1);
  }, [searchTermManager]);

  useEffect(() => {
    setCurrentPageSales(1);
  }, [searchTermSales]);

  // Render table function
  const renderTable = (users, title, iconColor, searchTerm, setSearchTerm, currentPage, setCurrentPage, totalPages, startIndex, sortConfig, handleSort) => (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-500 ease-out mb-6"
      style={fadeInUp.animate}
    >
      <div className={`${iconColor} text-white p-4`}>
        <h2 className="text-lg font-semibold flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          {title} ({users.length})
        </h2>
      </div>

      {/* Search for this table */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, tên đăng nhập hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('username')}
              >
                Tên đăng nhập {sortConfig.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('name')}
              >
                Tên nhân viên {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.01]"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {hasPermissionToChangeRole() ? (
    <button
      onClick={() => handlePermissionChange(user)}
      className="text-blue-600 hover:text-blue-900 transition-all duration-200 flex items-center transform hover:scale-105"
    >
      <Eye className="w-4 h-4 mr-1" />
      Thay đổi
    </button>
  ) : (
    <span className="text-gray-400 flex items-center">
      <EyeOff className="w-4 h-4 mr-1" />
      Không có quyền
    </span>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
          >
            Trước
          </button>
          <span className="text-sm text-gray-700 flex items-center">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, users.length)}
              </span>{' '}
              trong <span className="font-medium">{users.length}</span> kết quả
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      currentPage === pageNum
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transition-all duration-700 ease-out"
          style={fadeInUp.animate}
        >
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 transition-transform duration-500 hover:scale-110">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Hệ thống phân quyền</h1>
            <p className="text-gray-600">Vui lòng xác thực để tiếp tục</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start transition-all duration-300 hover:shadow-md">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Để thực hiện cấp quyền, bạn vui lòng xác thực</p>
            </div>
          </div>

          <div className="space-y-4">
  <input
    type="text"
    placeholder="Tên đăng nhập"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 transform focus:scale-105"
  />
  <input
    type="password"
    placeholder="Mật khẩu"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 transform focus:scale-105"
  />
  <select
    value={selectedRole}
    onChange={(e) => setSelectedRole(e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
  >
    <option value="Admin">Admin</option>
    <option value="Quản lý">Quản lý</option>
    <option value="Bán hàng">Bán hàng</option>
  </select>
            <div className="flex space-x-3">
              <button
                onClick={handleLogin}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Đăng nhập
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 transform hover:scale-105">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="bg-white rounded-lg shadow-sm p-6 mb-6 transition-all duration-500 ease-out"
          style={fadeInUp.animate}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600 mr-3" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Phân quyền người dùng</h1>
      {currentUser && (
        <p className="text-sm text-gray-600">
          Xin chào: <strong>{currentUser.username}</strong> ({currentUser.role})
        </p>
      )}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600">Hiển thị:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div 
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 transition-all duration-500 ease-out transform"
            style={fadeInUp.animate}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              {successMessage}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 transition-all duration-500 ease-out"
            style={fadeInUp.animate}
          >
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-3" />
              {error}
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            {/* Manager Table */}
            {renderTable(
              paginatedManagers,
              'Danh sách Quản lý',
              'bg-blue-600',
              searchTermManager,
              setSearchTermManager,
              currentPageManager,
              setCurrentPageManager,
              totalPagesManager,
              startIndexManager,
              sortConfigManager,
              handleSortManager
            )}

            {/* Sales Table */}
            {renderTable(
              paginatedSales,
              'Danh sách Bán hàng',
              'bg-green-600',
              searchTermSales,
              setSearchTermSales,
              currentPageSales,
              setCurrentPageSales,
              totalPagesSales,
              startIndexSales,
              sortConfigSales,
              handleSortSales
            )}
          </>
        )}

        {/* Enhanced Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center transition-opacity duration-300">
            <div 
              className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 transition-all duration-300 transform"
              style={scaleIn.animate}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-3 w-full">
                  <h3 className="text-lg font-medium text-gray-900">Xác nhận thay đổi quyền</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn thay đổi quyền của nhân viên:{' '}
                      <strong className="text-gray-900">{selectedUser?.name}</strong>{' '}
                      từ <strong className="text-blue-600">{selectedUser?.role}</strong>{' '}
                      thành <strong className="text-green-600">
                        {selectedUser?.role === 'Quản lý' ? 'Bán hàng' : 'Quản lý'}
                      </strong> không?
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowConfirmDialog(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={confirmPermissionChange}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Confirmation Dialog */}
{showPasswordDialog && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center transition-opacity duration-300">
    <div 
      className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 transition-all duration-300 transform"
      style={scaleIn.animate}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Shield className="h-6 w-6 text-blue-400" />
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-lg font-medium text-gray-900">Xác thực mật khẩu</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-4">
              Để thay đổi quyền của nhân viên{' '}
              <strong className="text-gray-900">{selectedUser?.name}</strong>,
              vui lòng nhập mật khẩu của bạn:
            </p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError(''); // Clear error when typing
              }}
              placeholder="Nhập mật khẩu của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordConfirmation();
                }
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {passwordError}
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancelPasswordDialog}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
            >
              Hủy
            </button>
            <button
              onClick={handlePasswordConfirmation}
              disabled={!confirmPassword.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default UserPermissionSystem;