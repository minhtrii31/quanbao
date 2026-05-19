const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePagination = (query, defaults = {}) => {
  const defaultLimit = defaults.limit || 10;
  const maxLimit = defaults.maxLimit || 100;
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);

  return { page, limit, skip: (page - 1) * limit };
};

const buildSearchQuery = (search, fields) => {
  if (!search || typeof search !== 'string' || search.trim().length === 0) return {};

  const regex = new RegExp(escapeRegExp(search.trim()), 'i');
  return { $or: fields.map((field) => ({ [field]: regex })) };
};

const buildSort = (query, allowedFields, defaultSort = { createdAt: -1 }) => {
  const sortBy = typeof query.sortBy === 'string' ? query.sortBy : '';
  if (!allowedFields.includes(sortBy)) return defaultSort;

  return { [sortBy]: query.sortOrder === 'asc' ? 1 : -1 };
};

const formatPagination = ({ page, limit, total }) => ({
  total,
  totalPages: Math.max(Math.ceil(total / limit), 1),
  currentPage: page,
  limit,
});

module.exports = {
  buildSearchQuery,
  buildSort,
  formatPagination,
  parsePagination,
};
