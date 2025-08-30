import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { UrlService } from '../services/urlService';
import { useToastContext } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import UrlList from '../components/features/UrlList';

/**
 * URL management page with search, filter, and pagination
 * Integrates with Spring Boot URL service with pagination
 */
const UrlManagement = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  const { success, error } = useToastContext();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    loadUrls();
  }, [debouncedSearchTerm, sortField, sortDirection, currentPage]);

  const loadUrls = async () => {
    try {
      setLoading(true);
      const result = await UrlService.getUserUrls({
        page: currentPage,
        size: pageSize,
        sort: sortField,
        direction: sortDirection,
        search: debouncedSearchTerm
      });

      // Spring Data Page object structure
      setUrls(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
    } catch (err) {
      error('Failed to load URLs');
      console.error('URL load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortCode) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      await UrlService.deleteUrl(shortCode);
      success('URL deleted successfully');
      loadUrls(); // Reload the list
    } catch (err) {
      error('Failed to delete URL');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(0); // Reset to first page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExport = async () => {
    try {
      // This would integrate with a backend export endpoint
      success('Export functionality coming soon');
    } catch (err) {
      error('Export failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My URLs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your shortened URLs
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="ghost" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link to="/urls/create">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create URL
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search URLs by title or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="createdAt">Created Date</option>
              <option value="clickCount">Click Count</option>
              <option value="title">Title</option>
            </select>
            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="mt-4 text-sm text-gray-500">
          {loading ? (
            'Loading...'
          ) : (
            `Showing ${urls.length} of ${totalElements} URLs`
          )}
        </div>
      </div>

      {/* URL List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <UrlList
          urls={urls}
          onDelete={handleDelete}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UrlManagement;