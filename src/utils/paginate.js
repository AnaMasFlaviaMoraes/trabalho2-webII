const ITEMPERPAGE = 5

function paginate(users, pageNumber) {
    let paginate = {}
    let statingItem = (pageNumber - 1) * ITEMPERPAGE
    let lastItem = (pageNumber * ITEMPERPAGE)

    let paginatesUsers = users.slice(statingItem, lastItem)

    paginate.users = paginatesUsers
    paginate.totalPages = Math.ceil(users.length)
    if(paginate.totalPages == 0) paginate.totalPages = 1
    paginate.pageNumber = pageNumber
    paginate.totalItems = users.length
    paginate.itemPerPage = ITEMPERPAGE
    paginate.firtItemPage = ITEMPERPAGE * (pageNumber - 1) + 1

    if((ITEMPERPAGE * pageNumber) > paginatesUsers.length) paginate.lastItemPage = paginatesUsers.length
    else paginate.lastItemPage = ITEMPERPAGE * pageNumber

    if(pageNumber - 1 == 0) paginate.previous = null
    else paginate.previousPage = paginate.pageNumber - 1

    if(pageNumber + 1 > paginate.totalPages) paginate.nextPage = null
    else paginate.nextPage = paginate.pageNumber + 1

    return paginate
}

module.exports = { paginate }