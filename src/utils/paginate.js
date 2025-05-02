const ITEM_PER_PAGE = 5;

/**
 * Pagina um array de usuários.
 * @param {Array} items - lista completa de usuários
 * @param {number} page - número da página (1-index)
 * @returns {Object} contexto de paginação
 */
function paginate(items, page = 1) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEM_PER_PAGE));
  const startIndex = (page - 1) * ITEM_PER_PAGE;
  const endIndex   = startIndex + ITEM_PER_PAGE;
  const pagedUsers = items.slice(startIndex, endIndex);

  return {
    users: pagedUsers,           
    page,                       
    itemPerPage: ITEM_PER_PAGE,  
    totalItems,                 
    totalPages,                  
    firstItemPage: totalItems ? startIndex + 1 : 0,
    lastItemPage: Math.min(totalItems, endIndex),
    previousPage: page > 1 ? page - 1 : null,
    nextPage:     page < totalPages ? page + 1 : null,
  };
}

module.exports = { paginate };
