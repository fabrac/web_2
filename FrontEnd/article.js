class Article {
    constructor(element, category, imageUrl, title, id) {
        this.element = element;
        this.category = category;
        this.imageUrl = imageUrl;
        this.title = title;
        this.id = id;
                                    
    }
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');

    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }