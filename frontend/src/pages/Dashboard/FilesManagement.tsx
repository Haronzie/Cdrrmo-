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
  FileX
} from "lucide-react";

// Types
interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified: string;
  parentId: string | null;
  mimeType?: string;
  path: string;
}

// Mock data structure for demonstration
const initialFileSystem: FileItem[] = [];

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

export default function FilesManagement() {
  const [fileSystem, setFileSystem] = useState<FileItem[]>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Get current folder items
  const getCurrentItems = (): FileItem[] => {
    return fileSystem.filter(item => {
      const itemPath = item.path === "/" ? "/" : item.path + "/";
      return itemPath === currentPath;
    });
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
      breadcrumbs.push({ name: part, path });
    }
    
    return breadcrumbs;
  };

  // Navigate up one level
  const navigateUp = () => {
    if (currentPath === "/") return;
    
    const parts = currentPath.split("/").filter(part => part !== "");
    parts.pop();
    const newPath = parts.length === 0 ? "/" : "/" + parts.join("/");
    setCurrentPath(newPath);
  };

  // Navigate to root
  const navigateToRoot = () => {
    setCurrentPath("/");
  };

  // Navigate to specific breadcrumb
  const navigateToBreadcrumb = (path: string) => {
    setCurrentPath(path);
  };

  // Create new folder
  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      type: "folder",
      modified: new Date().toISOString(),
      parentId: currentPath === "/" ? null : currentPath,
      path: currentPath
    };
    
    setFileSystem(prev => [...prev, newFolder]);
    setNewFolderName("");
    setIsCreateFolderModalOpen(false);
  };

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const newFile: FileItem = {
        id: Date.now().toString() + Math.random().toString(),
        name: file.name,
        type: "file",
        size: file.size,
        modified: new Date().toISOString(),
        parentId: currentPath === "/" ? null : currentPath,
        path: currentPath,
        mimeType: file.type
      };
      
      setFileSystem(prev => [...prev, newFile]);
    });
    setIsUploadModalOpen(false);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Delete selected items
  const deleteSelectedItems = () => {
    setFileSystem(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
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

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Folder className="h-6 w-6 text-blue-600" />
            File Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Organize and manage your files and folders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateFolderModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
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
            Root
          </button>
          {breadcrumbs.map((crumb, index) => (
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
          {currentPath !== "/" && (
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
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedItems.size})
              </button>
            )}
          </div>
        </div>
      </div>

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
        {filteredItems.length === 0 ? (
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
                            <div className="mr-3">{getFileIcon(item.mimeType, item.name)}</div>
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
                          <div className="flex justify-center">{getFileIcon(item.mimeType, item.name)}</div>
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
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Folder
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