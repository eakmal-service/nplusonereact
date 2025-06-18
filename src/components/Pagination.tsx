import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams: { [key: string]: string | undefined };
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Add all existing search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        params.set(key, value);
      }
    });
    
    // Add the page parameter
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    return `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <Link
          key="1"
          href={buildPageUrl(1)}
          className="px-3 py-2 rounded-md hover:bg-gray-100"
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-3 py-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={buildPageUrl(i)}
          className={`px-3 py-2 rounded-md ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {i}
        </Link>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-3 py-2">
            ...
          </span>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={buildPageUrl(totalPages)}
          className="px-3 py-2 rounded-md hover:bg-gray-100"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center items-center space-x-1">
      {currentPage > 1 && (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Previous
        </Link>
      )}
      
      {renderPageNumbers()}
      
      {currentPage < totalPages && (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded-md hover:bg-gray-100"
        >
          Next
        </Link>
      )}
    </nav>
  );
} 