export const parsePaginationParams = (query) => {
  const parseValue = (value, defaultValue) => {
    const parsedValue = parseInt(value);
    return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
  };

  return {
    page: parseValue(query.page, 1),
    perPage: parseValue(query.perPage, 8),
  };
};
