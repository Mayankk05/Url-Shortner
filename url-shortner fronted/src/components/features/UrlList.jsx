import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  BarChart3, 
  Copy, 
  Trash2, 
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatters } from '../../utils/formatters';
import { copyToClipboard } from '../../utils/helpers';
import { useToastContext } from '../../context/ToastContext';
import Button from '../common/Button';

/**
 * URL list component with sorting, pagination, and actions
 * Displays URLs in a responsive table format
 */
const UrlList = ({ 
  urls, 
  onDelete, 
  onSort, 
  sortField, 
  sortDirection,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const { success, error } = useToastContext();

  const handleCopy = async (shortUrl) => {
    const copied = await copyToClipboard(shortUrl);
    if (copied) {
      success('URL copied to clipboard');
    } else {
      error('Failed to copy URL');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <BarChart3 className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs found</h3>
        <p className="text-gray-500 mb-6">
          Create your first shortened URL to get started
        </p>
        <Link to="/urls/create">
          <Button variant="primary">Create URL</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('title')}
              >
                URL {getSortIcon('title')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('clickCount')}
              >
                Clicks {getSortIcon('clickCount')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('createdAt')}
              >
                Created {getSortIcon('createdAt')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {urls.map((url) => (
              <tr key={url.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {url.title || 'Untitled'}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {url.originalUrl}
                    </div>
                    <div className="text-xs text-primary-600 font-mono">
                      {url.shortUrl}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatters.number(url.clickCount)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                      {formatters.relativeTime(url.createdAt)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    url.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {url.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {url.expiresAt && new Date(url.expiresAt) < new Date() && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Expired
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleCopy(url.shortUrl)}
                      className="text-gray-400 hover:text-gray-500"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-500"
                      title="Open URL"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Link
                      to={`/urls/${url.shortCode}/analytics`}
                      className="text-primary-600 hover:text-primary-500"
                      title="View Analytics"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(url.shortCode)}
                      className="text-red-400 hover:text-red-500"
                      title="Delete URL"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = currentPage < 3 ? i : currentPage - 2 + i;
                    if (page >= totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlList;