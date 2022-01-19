exports.create = (request) => {
    const errors = [];

    if(request.title === ""){
        errors.push('عنوان مطلب خالی میباشد.');
    }
    if(request.slug === ""){
        errors.push('نامک مطلب خالی میباشد.');
    }
    if(request.content === ""){
        errors.push('محتوا مطلب خالی میباشد.');
    }

    return errors;
}