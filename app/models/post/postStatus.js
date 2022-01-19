const postStatus = {
    DRAFT: 0,
    REVIEW: 1,
    PUBLISHED: 2
}

const statusAsText = {
    [postStatus.DRAFT]:'پیش نویس',
    [postStatus.REVIEW]:'در حال بررسی',
    [postStatus.PUBLISHED]:'منتشر شده',
};

exports.statuses = () => {
    return postStatus;
}

exports.readableStatuses = (status=null) => {
    return status ? statusAsText[status] : statusAsText;
}