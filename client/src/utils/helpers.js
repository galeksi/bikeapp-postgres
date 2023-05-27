// Pagination loader is used for stations and trips page
export const paginationLoader = (data, currentPage, itemsPerPage) => {
  const itemOffset = currentPage * itemsPerPage;
  const endOffset = itemOffset + itemsPerPage;
  const itemsToView = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);
  return {
    items: itemsToView,
    pageCount: pageCount,
  };
};
