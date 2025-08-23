// src/hooks/usePosts.ts

import { useState, useEffect } from 'react';
import {  PaginationData } from '../types';
import { useApi } from './useApi';

export const usePosts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  
  const { data: paginationData, loading, error, executeRequest } = useApi<PaginationData>();

  useEffect(() => {
    executeRequest(`/posts?q=${searchQuery}&page=${currentPage}&per_page=${perPage}`, 'GET');
  }, [searchQuery, currentPage, executeRequest]);

  const handleNextPage = () => {
    if (paginationData && paginationData.has_next) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginationData && paginationData.has_prev) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  return {
    posts: paginationData?.posts || [],
    loading,
    error,
    paginationData,
    searchQuery,
    handleSearchChange,
    handleNextPage,
    handlePrevPage,
  };
};