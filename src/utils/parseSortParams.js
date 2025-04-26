export const parseSortParams = (query) => {
  const sortOrder = ['asc', 'desc'].includes(query.sortOrder?.toLowerCase())
    ? query.sortOrder.toLowerCase()
    : 'desc';

  return {
    sortBy: 'data',
    sortOrder,
  };
};
