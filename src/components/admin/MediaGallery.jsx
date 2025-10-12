"use client";

import { useState, useEffect, useRef } from "react";
import { FiUpload, FiImage, FiVideo, FiFile, FiTrash2, FiX, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";

const MediaGallery = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  // Fetch all media files
  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch(`/api/v1/admin/media`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch media: ${response.status} ${response.statusText}`
        );
      }

      const { data } = await response.json();
      console.log("Fetched media:", data);

      if (data && Array.isArray(data.media)) {
        const serverFiles = data.media.map((media) => ({
          ...media,
          id: media._id || media.id,
          url: media.path.startsWith("http")
            ? media.path
            : `${process.env.NEXT_PUBLIC_API_URL}${media.path}`,
          type: media.mimetype?.split("/")[0] || "file",
          uploaded: true,
        }));
        setFiles(serverFiles);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media library");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.split("/")[0],
      size: file.size,
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    setFiles((prevFiles) => [...newFiles, ...prevFiles]);
  };

  // Handle file upload
  const handleUpload = async () => {
    const newFiles = files.filter((file) => file.isNew);
    if (newFiles.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = newFiles.map(async (fileObj) => {
        const formData = new FormData();
        formData.append("file", fileObj.file);

        const response = await fetch(`/api/v1/admin/media`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${fileObj.name}`);
        }

        return response.json();
      });

      await Promise.all(uploadPromises);
      toast.success("Files uploaded successfully!");
      
      // Refresh the media list
      const response = await fetch("/api/v1/admin/media", {
        credentials: "include",
      });
      const { data } = await response.json();
      setFiles(data.media || []);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const response = await fetch(`/api/v1/admin/media/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setFiles(files.filter((file) => file._id !== id));
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  // Filter files based on search and active tab
  const filteredFiles = files.filter((file) => {
    const fileName = file.name || '';
    // Handle both server and client file type formats
    const fileType = file.type || (file.mimetype ? file.mimetype.split('/')[0] : '');
    
    const matchesSearch = fileName.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "image" && fileType?.startsWith?.("image")) ||
      (activeTab === "video" && fileType?.startsWith?.("video")) ||
      (activeTab === "other" && fileType && !fileType.startsWith("image") && !fileType.startsWith("video"));
    
    return matchesSearch && matchesTab;
  });

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-sm text-gray-500">
            {files.length} {files.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search files..."
            className="px-4 py-2 border rounded-md w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={isUploading}
            >
              <FiUpload />
              Add New
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            
            {files.some((file) => file.isNew) && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  `Upload ${files.filter(f => f.isNew).length} File${files.filter(f => f.isNew).length !== 1 ? 's' : ''}`
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["all", "image", "video", "other"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Media Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <FiFile className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try a different search term' : 'Upload some files to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div key={file._id || file.id} className="group relative">
              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                {(file.type?.startsWith("image") || file.mimetype?.startsWith("image")) ? (
                  <img
                    src={file.url || (file.path ? `${process.env.NEXT_PUBLIC_API_URL}${file.path}` : URL.createObjectURL(file.file))}
                    alt={file.name || 'Uploaded file'}
                    className="w-full h-full object-cover"
                  />
                ) : (file.type?.startsWith("video") || file.mimetype?.startsWith("video")) ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <FiVideo className="h-12 w-12 text-white" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FiFile className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100"
                    title="View"
                  >
                    <FiImage className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file._id || file.id)}
                    className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 text-red-500"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 truncate">{file.name}</div>
              <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
            </div>
          ))}
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedFile.name}</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              {selectedFile.type.startsWith("image") ? (
                <img
                  src={selectedFile.url || `/uploads/${selectedFile.filename}`}
                  alt={selectedFile.name}
                  className="max-w-full max-h-[70vh] mx-auto"
                />
              ) : selectedFile.type.startsWith("video") ? (
                <video
                  src={selectedFile.url || `/uploads/${selectedFile.filename}`}
                  controls
                  className="max-w-full max-h-[70vh] mx-auto"
                />
              ) : (
                <div className="text-center py-12">
                  <FiFile className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Preview not available for this file type
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 border-t text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">File Name</p>
                  <p className="font-medium">{selectedFile.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">File Size</p>
                  <p className="font-medium">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="text-gray-500">File Type</p>
                  <p className="font-medium">{selectedFile.type || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Uploaded</p>
                  <p className="font-medium">
                    {new Date(selectedFile.uploadDate || selectedFile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
