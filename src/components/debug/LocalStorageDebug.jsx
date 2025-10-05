import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  getStorageInfo,
  clearStorage,
  cartStorage,
  wishlistStorage,
  STORAGE_KEYS
} from '../../utils/localStorage';

const LocalStorageDebug = () => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const refreshStorageInfo = () => {
    setStorageInfo(getStorageInfo());
  };

  useEffect(() => {
    refreshStorageInfo();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearSpecificStorage = (key) => {
    localStorage.removeItem(key);
    refreshStorageInfo();
  };

  const exportData = () => {
    const data = {
      cart: cartStorage.get(),
      wishlist: wishlistStorage.get(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.cart) cartStorage.set(data.cart);
          if (data.wishlist) wishlistStorage.set(data.wishlist);
          refreshStorageInfo();
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs"
        >
          🔧 Storage Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">localStorage Debug</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {storageInfo && (
        <div className="space-y-3 text-xs">
          {/* Storage Overview */}
          <div className="bg-gray-50 p-2 rounded">
            <div><strong>Used:</strong> {formatBytes(storageInfo.used)}</div>
            <div><strong>Available:</strong> {formatBytes(storageInfo.available)}</div>
            <div><strong>Total Keys:</strong> {storageInfo.keys}</div>
          </div>

          {/* Storage Items */}
          <div>
            <strong>Storage Items:</strong>
            <div className="mt-1 space-y-1">
              {storageInfo.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 p-1 rounded">
                  <span className="truncate">{item.key}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">{formatBytes(item.size)}</span>
                    <button
                      onClick={() => clearSpecificStorage(item.key)}
                      className="text-red-500 hover:text-red-700 px-1"
                      title="Delete this item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Button
                onClick={refreshStorageInfo}
                className="flex-1 text-xs py-1 bg-blue-500"
              >
                Refresh
              </Button>
              <Button
                onClick={exportData}
                className="flex-1 text-xs py-1 bg-green-500"
              >
                Export
              </Button>
            </div>

            <div className="flex space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="flex-1 text-xs py-1 px-2 bg-yellow-500 text-white rounded cursor-pointer text-center"
              >
                Import
              </label>
              <Button
                onClick={() => {
                  if (confirm('Clear all localStorage? This cannot be undone!')) {
                    clearStorage();
                    refreshStorageInfo();
                  }
                }}
                className="flex-1 text-xs py-1 bg-red-500"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Quick Data View */}
          <div className="space-y-2">
            <div>
              <strong>Cart Items:</strong> {cartStorage.get().length}
            </div>
            <div>
              <strong>Wishlist Items:</strong> {wishlistStorage.get().length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalStorageDebug;