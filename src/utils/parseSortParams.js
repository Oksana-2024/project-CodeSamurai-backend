export const parseSortParams = (query) => {
  const sortOrder = ['asc', 'desc'].includes(query.sortOrder?.toLowerCase())
    ? query.sortOrder.toLowerCase()
    : 'desc';

  const sortBy = ['date'].includes(query.sortBy?.toLowerCase())
    ? query.sortBy.toLowerCase()
    : 'date';

  return {
    sortBy,
    sortOrder,
  };
};
