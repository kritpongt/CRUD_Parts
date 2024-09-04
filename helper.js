const TITLE = 'CRUD Parts'

function genPagination(metadata, path, n_link = 6){
    let arr_link = []
    if(metadata && metadata.totalCount && metadata.limit){
        const page_total = Math.ceil(parseInt(metadata.totalCount) / parseInt(metadata.limit))
        const page_current = parseInt(metadata.page)
        const page_start = page_current - Math.floor(n_link / 2)
        let page = page_start <= 0 ? 1 : page_start
        for(let i = 1; i <= n_link; i++){
            if(page <= page_total){
                arr_link.push(`<a class="page-link ${page == page_current ? 'disabled' : ''}" href="${path}&page=${page}">${page}</a>`)
                page++
            }
        }
        if(page_current > 1){
            arr_link.unshift(`<a class="page-link" href="${path}&page=${page_current - 1}">&laquo;</a>`)
        }
        if(page_current < page_total){
            arr_link.push(`<a class="page-link" href="${path}&page=${page_current + 1}">&raquo;</a>`)
        }
    }
    return arr_link
}

module.exports = {
    TITLE,
    genPagination
}