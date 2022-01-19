const langService = require('@services/langService');
const dateService = require('@services/dateService');

class PostPresenter{
    constructor(post){
        this.post = post;
    }

    jalaliCreatedAt(){
        return langService.toPersianNumber(dateService.toPersianDate(this.post.created_at));
    }

    persianView(){
        return langService.toPersianNumber(this.post.views);
    }

    excerpt(words_limit = 20){
        const words = this.post.content.split(' ');
        return words.slice(0, words_limit - 1).join(' ') + '...';
    }
}

module.exports = PostPresenter;