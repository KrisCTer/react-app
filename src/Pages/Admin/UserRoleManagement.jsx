import React, { useState, useEffect } from 'react';
import { Search, X, AlertTriangle, Info, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock API functions
const mockAPI = {
  async getManagers(page = 1, limit = 5) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const allManagers = [
      { id: 1, username: 'camthuy', fullName: 'Lê Cẩm Thúy', phone: '0964732243', gender: 'Nữ', birthDate: '24/02/2001' },
      { id: 2, username: 'duchau', fullName: 'Nguyễn Đức Hậu', phone: '0964732245', gender: 'Nam', birthDate: '24/02/2001' },
      { id: 3, username: 'thanhhao', fullName: 'Trần Thanh Hảo', phone: '0964732244', gender: 'Khác', birthDate: '18/02/2001' },
      { id: 4, username: 'minhquan', fullName: 'Võ Minh Quân', phone: '0964732247', gender: 'Nam', birthDate: '15/03/2001' },
      { id: 5, username: 'thuytrang', fullName: 'Nguyễn Thùy Trang', phone: '0964732248', gender: 'Nữ', birthDate: '20/04/2001' },
      { id: 6, username: 'hoangnam', fullName: 'Lê Hoàng Nam', phone: '0964732249', gender: 'Nam', birthDate: '10/05/2001' },
      { id: 7, username: 'phuonglinh', fullName: 'Trần Phương Linh', phone: '0964732250', gender: 'Nữ', birthDate: '25/06/2001' },
    ];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = allManagers.slice(startIndex, endIndex);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: allManagers.length,
        totalPages: Math.ceil(allManagers.length / limit)
      }
    };
  },

  async getSalesStaff(page = 1, limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const allSalesStaff = [
      { id: 1, username: 'nguyentu', fullName: 'Nguyễn Tú', phone: '0964732242', gender: 'Nam', birthDate: '18/02/2001' },
      { id: 2, username: 'vandat', fullName: 'Nguyễn Văn Đạt', phone: '0964732246', gender: 'Nam', birthDate: '18/02/2001' },
      { id: 3, username: 'thanhha', fullName: 'Lê Thanh Hà', phone: '0964732251', gender: 'Nữ', birthDate: '12/07/2001' },
      { id: 4, username: 'quocbao', fullName: 'Trần Quốc Bảo', phone: '0964732252', gender: 'Nam', birthDate: '08/08/2001' },
      { id: 5, username: 'mylinh', fullName: 'Phạm Mỹ Linh', phone: '0964732253', gender: 'Nữ', birthDate: '30/09/2001' },
      { id: 6, username: 'ducminh', fullName: 'Ngô Đức Minh', phone: '0964732254', gender: 'Nam', birthDate: '14/10/2001' },
    ];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = allSalesStaff.slice(startIndex, endIndex);
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: allSalesStaff.length,
        totalPages: Math.ceil(allSalesStaff.length / limit)
      }
    };
  },

  async deleteUser(id, type) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Xóa thành công' };
  },

  async updatePermissions(password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (password === 'admin123') {
      return { success: true, message: 'Cập quyền thành công!' };
    }
    return { success: false, message: 'Mật khẩu không đúng!' };
  }
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.3 } })
};

const UserManagementForm = () => {
  // States for dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // States for data and loading
  const [managers, setManagers] = useState([]);
  const [salesStaff, setSalesStaff] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);

  // Pagination states
  const [managerPagination, setManagerPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [salesPagination, setSalesPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Load data on component mount
  useEffect(() => {
    loadManagers(1);
    loadSalesStaff(1);
  }, []);

  const loadManagers = async (page) => {
    setLoadingManagers(true);
    try {
      const result = await mockAPI.getManagers(page);
      setManagers(result.data);
      setManagerPagination(result.pagination);
    } catch (error) {
      console.error('Error loading managers:', error);
    } finally {
      setLoadingManagers(false);
    }
  };

  const loadSalesStaff = async (page) => {
    setLoadingSales(true);
    try {
      const result = await mockAPI.getSalesStaff(page);
      setSalesStaff(result.data);
      setSalesPagination(result.pagination);
    } catch (error) {
      console.error('Error loading sales staff:', error);
    } finally {
      setLoadingSales(false);
    }
  };

  const handleDeleteUser = (user, type) => {
    setSelectedUser({ ...user, type });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await mockAPI.deleteUser(selectedUser.id, selectedUser.type);
      
      if (selectedUser.type === 'manager') {
        await loadManagers(managerPagination.page);
      } else {
        await loadSalesStaff(salesPagination.page);
      }
      
      setShowDeleteConfirm(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdatePermissions = async () => {
    setErrorMessage('');
    try {
      const result = await mockAPI.updatePermissions(password);
      if (result.success) {
        setShowConfirmDialog(false);
        setPassword('');
        setShowSuccessDialog(true);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const Pagination = ({ pagination, onPageChange, loading }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
      <div className="text-sm text-gray-700">
        Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} của {pagination.total} kết quả
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || loading}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {[...Array(pagination.totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            disabled={loading}
            className={`px-3 py-1 border rounded text-sm transition-colors ${
              pagination.page === i + 1 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'hover:bg-gray-100 disabled:opacity-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages || loading}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Đang tải...</span>
    </div>
  );

  const UserTable = ({ title, users, type, loading, pagination, onPageChange }) => (
    <div className="mb-6 transform transition-all duration-300">
      <div className="bg-gray-400 text-white px-4 py-2 font-medium">
        {title}
      </div>
      <div className="border border-gray-300 bg-white rounded-b-lg shadow-sm">
        <div className="bg-gray-100 text-sm text-gray-600 px-4 py-2 border-b">
          Drag a column header here to group by that column
          <Search className="float-right w-4 h-4 mt-0.5" />
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">THAY ĐỔI</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">TÊN ĐĂNG NHẬP</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">TÊN NHÂN VIÊN</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">SỐ ĐIỆN THOẠI</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">GIỚI TÍNH</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">NGÀY SINH</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`transition-colors duration-200 hover:bg-blue-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteUser(user, type)}
                          className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-all duration-200 p-1 rounded hover:bg-red-50"
                          title="Xóa quyền"
                        >
                          🗑️
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium text-blue-600">{user.username}</td>
                      <td className="px-4 py-3">{user.fullName}</td>
                      <td className="px-4 py-3">{user.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.gender === 'Nam' ? 'bg-blue-100 text-blue-800' :
                          user.gender === 'Nữ' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3">{user.birthDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination 
              pagination={pagination}
              onPageChange={onPageChange}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-teal-300 rounded-full animate-pulse"></div>
              <span className="font-semibold text-lg">PHÂN QUYỀN NGƯỜI DÙNG</span>
            </div>
            <div className="flex gap-2">
              <button className="w-5 h-5 bg-teal-400 rounded-full hover:bg-teal-300 transition-colors"></button>
              <button className="w-5 h-5 bg-yellow-400 rounded-full hover:bg-yellow-300 transition-colors"></button>
              <button 
                onClick={() => setShowConfirmDialog(true)} 
                className="w-5 h-5 bg-red-500 rounded-full hover:bg-red-400 transition-colors transform hover:scale-110"
              ></button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            
            <UserTable 
              title="Nhân viên Quản lý" 
              users={managers} 
              type="manager"
              loading={loadingManagers}
              pagination={managerPagination}
              onPageChange={loadManagers}
            />
            
            <UserTable 
              title="Nhân viên bán hàng" 
              users={salesStaff} 
              type="sales"
              loading={loadingSales}
              pagination={salesPagination}
              onPageChange={loadSalesStaff}
            />
          </div>
        </div>
      </div>

      {/* Confirmation Dialog - Main */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100"
            style={{ animation: 'modalSlideIn 0.3s ease-out' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Xác nhận cập quyền</h3>
                <p className="text-sm text-gray-600">Để thực hiện cập quyền, bạn vui lòng xác nhận</p>
              </div>
            </div>
            
            <div className="mb-6">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-teal-500 focus:outline-none transition-colors"
                placeholder="Nhập mật khẩu xác nhận..."
                onKeyPress={(e) => e.key === 'Enter' && handleUpdatePermissions()}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 animate-pulse">{errorMessage}</p>
              )}
            </div>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPassword('');
                  setErrorMessage('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-200"
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdatePermissions}
                disabled={!password.trim()}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all duration-300"
            style={{ animation: 'modalSlideIn 0.3s ease-out' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800">Thông báo</h3>
              <button 
                onClick={() => setShowSuccessDialog(false)}
                className="text-gray-400 hover:text-gray-600 transform hover:scale-110 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-green-100 rounded-full">
                <Info className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-green-700 font-medium">Cập quyền thành công!</span>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => setShowSuccessDialog(false)}
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300"
            style={{ animation: 'modalSlideIn 0.3s ease-out' }}
          >
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Xác nhận xóa quyền</h3>
            </div>
            
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-yellow-100 rounded-full flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-700 mb-2">Bạn có chắc chắn muốn hủy quyền Quản lý của nhân viên:</p>
                <p className="font-semibold text-gray-900">{selectedUser?.fullName}?</p>
                <p className="text-sm text-gray-500 mt-1">Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transform hover:scale-105 transition-all duration-200"
              >
                Hủy
              </button>
              <button 
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserManagementForm;