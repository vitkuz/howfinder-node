module.exports = function (countDocuments, currentPage, limit){
    const numberOfPages = countDocuments / limit + 1;
    const pagination = [];
    const left = currentPage - 3;
    const right = currentPage + 3;

    for (let i =1; i < numberOfPages; i ++) {

        const previous = pagination[pagination.length-1];
        // console.log(previous);

        if (i === 1 && i === currentPage) {
            pagination.push({
                page: 'page'+i,
                active: true
            });
        } else if (i === 1 && i !== currentPage) {
            pagination.push('page'+i);
        }

        if (i > 1 && i < left) {

            if ( previous !== '...') {
                pagination.push('...');
            }
        }

        if (i !== 1 && i >= left && i <= right && i !== numberOfPages - 1) {

            if (i === currentPage) {
                pagination.push({
                    page: 'page'+i,
                    active: true
                });
            } else {
                pagination.push('page'+i);
            }

        }

        if (i > right && i < numberOfPages - 1) {
            if (previous !== '...') {
                pagination.push('...');
            }
        }

        if (i === numberOfPages - 1 && i === currentPage) {
            pagination.push({
                page: 'page'+i,
                active: true
            });
        } else if (i === numberOfPages - 1 && i !== currentPage) {
            pagination.push('page'+i);
        }

        // pages.push('page'+i);
    }

    if (currentPage !== 1) {
        pagination.unshift({
            page: 'previous'
        });
    }

    if (currentPage !== numberOfPages - 1) {
        pagination.push({
            page: 'next'
        });
    }

    return pagination;
}