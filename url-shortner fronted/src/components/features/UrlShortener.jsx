import React, { useState } from 'react';
import { Copy, ExternalLink, QrCode } from 'lucide-react';
import { UrlService } from '../../services/urlService';
import { useToastContext } from '../../context/ToastContext';
import { copyToClipboard, generateQRCodeUrl } from '../../utils/helpers';
import { validators } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';

/**
 * URL shortening widget for quick URL creation
 * Can be used on landing page or dashboard
 */
const UrlShortener = ({ onSuccess }) => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  const { success, error: showError } = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate URL
    const urlError = validators.url(url);
    if (urlError) {
      setError(urlError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await UrlService.createUrl({
        originalUrl: url,
        title: null,
        description: null,
        expiresAt: null
      });

      setResult(response);
      success('URL shortened successfully!');
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to shorten URL');
      showError(err.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      const copied = await copyToClipboard(result.shortUrl);
      if (copied) {
        success('URL copied to clipboard');
      } else {
        showError('Failed to copy URL');
      }
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter your long URL here (e.g., https://example.com/very/long/url)"
              error={error}
              className="text-lg py-3"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading || !url.trim()}
              className="px-8"
            >
              Shorten URL
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          {/* Success Message */}
          <div className="text-green-600">
            <h3 className="text-lg font-medium">URL shortened successfully!</h3>
          </div>

          {/* Short URL Display */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={result.shortUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-lg font-mono"
                  />
                  <Button variant="ghost" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => window.open(result.shortUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" onClick={() => setShowQR(true)}>
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL
                </label>
                <p className="text-sm text-gray-600 break-all bg-white p-2 rounded border">
                  {result.originalUrl}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button variant="primary" onClick={handleReset}>
              Shorten Another URL
            </Button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="QR Code"
        size="sm"
      >
        {result && (
          <div className="text-center">
            <img
              src={generateQRCodeUrl(result.shortUrl, 200)}
              alt="QR Code"
              className="mx-auto mb-4"
            />
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code to access: {result.shortUrl}
            </p>
            <Button
              variant="primary"
              onClick={() => {
                const link = document.createElement('a');
                link.href = generateQRCodeUrl(result.shortUrl, 400);
                link.download = `qr-${result.shortCode}.png`;
                link.click();
              }}
            >
              Download QR Code
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UrlShortener;