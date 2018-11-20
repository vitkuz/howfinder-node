module.exports = function(req) {

    let {limit, page, sort} = req.query;
    let skip;

    console.log(limit, page, sort);

    if (page && Number.isNaN(parseInt(page))) {
        return res.json({
            error: 'Page should be a number'
        })
    } else if (!page) {
        page = 1;
    }

    if (limit && Number.isNaN(parseInt(limit))) {
        return res.json({
            error: 'Limit should be a valid number'
        })
    } else if (!limit) {
        limit = 50;
    }

    if (parseInt(page) !== 0) {
        page = parseInt(page);
    } else {
        page = 1
    }

    if (limit || parseInt(limit) !== 0) {
        limit = parseInt(limit);
    } else {
        limit = 50
    }

    if (page !== 1) {
        skip = (page-1)*limit;
    } else {
        skip = 0
    }

    if (!sort) {
        sort = '-created'; // default sort
    }

    return {
        limit,
        page,
        skip,
        sort
    }
};