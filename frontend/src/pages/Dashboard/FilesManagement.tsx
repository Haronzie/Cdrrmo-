import React, { useState, useEffect } from "react";
import { 
  Folder, 
  File, 
  FolderPlus, 
  Upload, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  X, 
  Save, 
  ArrowLeft, 
  Home, 
  ChevronRight,
  Grid3X3,
  List,
  Calendar,
  FileText,
  Image,
  Archive,
  Video,
  Music,
  Code,
  FileX,
  Building2,
  BookOpen,
  GraduationCap,
  ArrowRight
} from "lucide-react";

// Types
interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified: string;
  parent_id: string | null;
  mime_type?: string;
  path: string;
}

interface DashboardFolder {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  fileCount?: number;
  totalSize?: number;
}

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType?: string, fileName?: string) => {
  if (!mimeType && !fileName) return <File className="h-6 w-6" />;
  
  const extension = fileName?.split('.').pop()?.toLowerCase();
  
  if (mimeType?.startsWith('image/')) return <Image className="h-6 w-6 text-green-500" />;
  if (mimeType?.startsWith('video/')) return <Video className="h-6 w-6 text-red-500" />;
  if (mimeType?.startsWith('audio/')) return <Music className="h-6 w-6 text-purple-500" />;
  if (mimeType?.includes('pdf')) return <FileText className="h-6 w-6 text-red-600" />;
  if (mimeType?.includes('zip') || mimeType?.includes('rar')) return <Archive className="h-6 w-6 text-yellow-600" />;
  
  // Extension-based detection
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'html', 'css'].includes(extension || '')) {
    return <Code className="h-6 w-6 text-blue-500" />;
  }
  if (['txt', 'doc', 'docx'].includes(extension || '')) {
    return <FileText className="h-6 w-6 text-blue-600" />;
  }
  
  return <File className="h-6 w-6 text-gray-500" />;
};

// Dashboard folders configuration
const dashboardFolders: DashboardFolder[] = [
  {
    id: 'operation',
    name: 'Operation',
    path: '/CDRRMO/Operation',
    icon: <Building2 className="h-8 w-8" />,
    color: 'blue',
    description: 'Operational documents, reports, and daily activities'
  },
  {
    id: 'research',
    name: 'Research',
    path: '/CDRRMO/Research',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'green',
    description: 'Research papers, studies, and analysis documents'
  },
  {
    id: 'training',
    name: 'Training',
    path: '/CDRRMO/Training',
    icon: <GraduationCap className="h-8 w-8" />,
    color: 'purple',
    description: 'Training materials, courses, and educational resources'
  }
];

export default function FilesManagement() {
  const [fileSystem, setFileSystem] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [selectedDashboard, setSelectedDashboard] = useState<string>('');

  // Mock API calls (replace with actual API integration)
  const mockApi = {
    get: async (url: string) => {
      // Mock response - replace with actual API call
      return {
        data: {
          success: true,
          data: []
        }
      };
    },
    post: async (url: string, data: any) => {
      return { data: { success: true } };
    },
    delete: async (url: string, config: any) => {
      return { data: { success: true } };
    }
  };

  // Load files from backend on component mount and path change
  useEffect(() => {
    if (!showDashboard) {
      loadFiles();
    }
  }, [currentPath, showDashboard]);

  // Load dashboard statistics
  useEffect(() => {
    if (showDashboard) {
      loadDashboardStats();
    }
  }, [showDashboard]);

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    // This would load file counts and sizes for each dashboard folder
    try {
      // Mock implementation - replace with actual API calls
      for (const folder of dashboardFolders) {
        // const response = await api.get(`/files/?path=${encodeURIComponent(folder.path)}`);
        // Update folder stats here
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  // Load files from backend
  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await mockApi.get(`/files/?path=${encodeURIComponent(currentPath)}`);
      
      if (response.data.success) {
        setFileSystem(response.data.data);
      } else {
        console.error('Failed to load files:', response.data.error);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to dashboard folder
  const navigateToDashboard = (folderId: string) => {
    const folder = dashboardFolders.find(f => f.id === folderId);
    if (folder) {
      setSelectedDashboard(folderId);
      setCurrentPath(folder.path);
      setShowDashboard(false);
    }
  };

  // Return to dashboard
  const returnToDashboard = () => {
    setShowDashboard(true);
    setSelectedDashboard('');
    setCurrentPath('/');
    setSelectedItems(new Set());
  };

  // Get current folder items (now filtered from API data)
  const getCurrentItems = (): FileItem[] => {
    return fileSystem;
  };

  // Get filtered items based on search
  const getFilteredItems = (): FileItem[] => {
    const currentItems = getCurrentItems();
    if (!searchTerm) return currentItems;
    
    return currentItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Navigate to folder
  const navigateToFolder = (folderId: string) => {
    const folder = fileSystem.find(item => item.id === folderId && item.type === "folder");
    if (folder) {
      setCurrentPath(folder.path === "/" ? `/${folder.name}` : `${folder.path}/${folder.name}`);
    }
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    if (currentPath === "/") return [];
    
    const parts = currentPath.split("/").filter(part => part !== "");
    const breadcrumbs = [];
    let path = "";
    
    for (const part of parts) {
      path += "/" + part;
      // Skip CDRRMO in breadcrumbs since it's not user-facing
      if (part !== "CDRRMO") {
        breadcrumbs.push({ name: part, path });
      }
    }
    
    return breadcrumbs;
  };

  // Navigate up one level
  const navigateUp = () => {
    if (currentPath === "/") return;
    
    const parts = currentPath.split("/").filter(part => part !== "");
    parts.pop();
    const newPath = parts.length === 0 ? "/" : "/" + parts.join("/");
    
    // Check if we're going back to a dashboard folder level
    const isDashboardPath = dashboardFolders.some(folder => folder.path === newPath);
    if (isDashboardPath || newPath === '/CDRRMO') {
      returnToDashboard();
    } else {
      setCurrentPath(newPath);
    }
  };

  // Navigate to root
  const navigateToRoot = () => {
    returnToDashboard();
  };

  // Navigate to specific breadcrumb
  const navigateToBreadcrumb = (path: string) => {
    const isDashboardPath = dashboardFolders.some(folder => folder.path === path);
    if (isDashboardPath || path === '/CDRRMO') {
      returnToDashboard();
    } else {
      setCurrentPath(path);
    }
  };

  // Create new folder - NOW WITH API CALL
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      setLoading(true);
      const response = await mockApi.post('/files/create_folder/', {
        name: newFolderName.trim(),
        path: currentPath
      });

      if (response.data.success) {
        await loadFiles();
        setNewFolderName("");
        setIsCreateFolderModalOpen(false);
      } else {
        console.error('Failed to create folder');
        alert('Failed to create folder. Please try again.');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Error creating folder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload - NOW WITH API CALL
  const handleFileUpload = async (files: FileList) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('path', currentPath);
      
      const response = await mockApi.post('/files/upload/', formData);

      if (response.data.success) {
        await loadFiles();
        setIsUploadModalOpen(false);
      } else {
        console.error('Failed to upload files');
        alert('Failed to upload files. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Delete selected items - NOW WITH API CALL
  const deleteSelectedItems = async () => {
    try {
      setLoading(true);
      const response = await mockApi.delete('/files/bulk_delete/', {
        data: {
          items: Array.from(selectedItems)
        }
      });

      if (response.data.success) {
        await loadFiles();
        setSelectedItems(new Set());
      } else {
        console.error('Failed to delete items');
        alert('Failed to delete items. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting items:', error);
      alert('Error deleting items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle item selection
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredItems = getFilteredItems();
  const breadcrumbs = getBreadcrumbs();
  const currentDashboard = dashboardFolders.find(f => f.id === selectedDashboard);

  // Dashboard View
  if (showDashboard) {
    return (
      <div className="h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Folder className="h-6 w-6 text-blue-600" />
              File Management Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Choose a department to manage files and folders</p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardFolders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => navigateToDashboard(folder.id)}
              className={`bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-${folder.color}-400 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
            >
              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${folder.color}-100 rounded-lg mb-4 group-hover:bg-${folder.color}-200 transition-colors`}>
                  <div className={`text-${folder.color}-600`}>
                    {folder.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{folder.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{folder.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{folder.fileCount || 0}</span> files
                  </div>
                  <div className={`flex items-center gap-1 text-${folder.color}-600 group-hover:translate-x-1 transition-transform`}>
                    <span className="text-sm font-medium">Open</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">3</div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">0 MB</div>
              <div className="text-sm text-gray-600">Total Size</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // File Management View
  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={returnToDashboard}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </button>
            {currentDashboard && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <div className={`flex items-center gap-2 text-${currentDashboard.color}-600`}>
                  <div className="scale-75">{currentDashboard.icon}</div>
                  <span className="font-medium">{currentDashboard.name}</span>
                </div>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Folder className="h-6 w-6 text-blue-600" />
            {currentDashboard?.name || 'File Management'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentDashboard?.description || 'Organize and manage your files and folders'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateFolderModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={navigateToRoot}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-blue-600"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </button>
          {currentDashboard && (
            <>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="px-2 py-1 text-blue-600 font-medium">{currentDashboard.name}</span>
            </>
          )}
          {/* Only show additional breadcrumbs if we're deeper than the department root */}
          {breadcrumbs.length > 1 && breadcrumbs.slice(1).map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <button
                onClick={() => navigateToBreadcrumb(crumb.path)}
                className="px-2 py-1 rounded hover:bg-gray-100 text-blue-600"
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
          {currentPath !== "/" && !dashboardFolders.some(f => f.path === currentPath) && (
            <button
              onClick={navigateUp}
              className="ml-auto flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
            
            {selectedItems.size > 0 && (
              <button
                onClick={deleteSelectedItems}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedItems.size})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {/* File Area */}
      <div
        className={`bg-white rounded-xl shadow-sm border-2 flex-1 overflow-hidden ${
          dragOver ? "border-blue-400 border-dashed bg-blue-50" : "border-gray-200"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {filteredItems.length === 0 && !loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No files found" : "This folder is empty"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : "Create a new folder or upload files to get started"
                }
              </p>
              {!searchTerm && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsCreateFolderModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FolderPlus className="h-4 w-4" />
                    Create Folder
                  </button>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {viewMode === "list" ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(new Set(filteredItems.map(item => item.id)));
                          } else {
                            setSelectedItems(new Set());
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.type === "folder" ? (
                            <Folder className="h-6 w-6 text-blue-500 mr-3" />
                          ) : (
                            <div className="mr-3">{getFileIcon(item.mime_type, item.name)}</div>
                          )}
                          <button
                            onClick={() => item.type === "folder" && navigateToFolder(item.id)}
                            className={`text-sm font-medium ${
                              item.type === "folder" 
                                ? "text-blue-600 hover:text-blue-900 cursor-pointer" 
                                : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.type === "folder" ? "-" : formatFileSize(item.size || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.modified).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" title="Download">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50" title="Rename">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`relative p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedItems.has(item.id) ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => item.type === "folder" && navigateToFolder(item.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="absolute top-2 right-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex justify-center">
                        {item.type === "folder" ? (
                          <Folder className="h-12 w-12 text-blue-500" />
                        ) : (
                          <div className="flex justify-center">{getFileIcon(item.mime_type, item.name)}</div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>
                        {item.name}
                      </p>
                      {item.type === "file" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(item.size || 0)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Create New Folder</h2>
                <button
                  onClick={() => setIsCreateFolderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && createFolder()}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsCreateFolderModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!newFolderName.trim() || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Drop files here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Browse Files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}