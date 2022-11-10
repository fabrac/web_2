
let categories;
let filtersSet = new Set();
let galerySet = new Set();
let gallery;


fetch("http://localhost:5678/api/categories")
    .then(data => categories = data.json())
    .then(categories => {
        filters = document.querySelector("#filters")
        createFilter("Tous", true);
        for (let categorie of categories) {
            createFilter(categorie.name, false);
        }        
    })

    function createFilter(name, selected) {
        let f = createElementFromHTML(`<div class="filter"><h2>${name}</h2></div>`);
    
        if (selected)
            f.className = "filter-selected";
        f.onclick = clickevent;
        f.style.cursor = 'pointer';
        filtersSet.add(f);
        filters.appendChild(f);
    }

    function clickevent(event) {
        let i = 0;
        let j = 0;
        filtersSet.forEach((element) => {
            element.className =  'filter';
            let x = event.target || event.srcElement;
            console.log(x.textContent);
            console.log(element.textContent);
            if (x.textContent == element.textContent)
                i = j;
            j++;
        });
        this.className = 'filter-selected';
        gallery.innerHTML = '';
        console.log(i);
        galerySet.forEach(element => {
            if (element.category == i || i == 0)
                gallery.appendChild(element.element);
        });
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');

        div.innerHTML = htmlString.trim();
        return div.firstChild;
      }


fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then( jsonListArticle => {
        gallery = document.querySelector(".gallery");
        for (let jsonArticle of jsonListArticle) {
            let element = createElementFromHTML(`<figure>
                    <img crossorigin="anonymous" src="${jsonArticle.imageUrl}" alt=${jsonArticle.title}>
                    <figcaption>${jsonArticle.title}</figcaption>
                </figure>`);
            let article = new Article(element, jsonArticle.categoryId);
            galerySet.add(article);
            gallery.appendChild(element);
            console.log(jsonArticle);
        }
    });




for (var i = 0; i < filters.length; i++) {
    filters[i].style.cursor = 'pointer';
    filters[i].onclick = function() {
        this.className = 'filter-selected';
    };
    filters[i].onmouseover = function() {
        this.style.backgroundColor = 'red';
    };
    filters[i].onmouseout = function() {
        this.style.backgroundColor = '';
    };
}

let login = document.querySelector("#login");
login.onclick = function() {
    window.location.href = "login.html"
}
