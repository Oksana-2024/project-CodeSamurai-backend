export const calculatePaginationData = (page, perPage, totalCount) => {
  const totalPages = Math.ceil(totalCount / perPage);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    perPage,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
