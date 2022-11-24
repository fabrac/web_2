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
            createFilter(categorie, false);
        }        
    })

    function createFilter(categorie, selected) {
        let f;
        
        if (selected) {
            f = createElementFromHTML(`<div class="filter"><h2>${categorie}</h2></div>`);
            f.className = "filter-selected";
            filtersSet.add(new Filter(f, 0, 'Tous'));
        }
        else {
            f = createElementFromHTML(`<div class="filter"><h2>${categorie.name}</h2></div>`);
            filtersSet.add(new Filter(f, categorie.id, categorie.name));
        }
        f.onclick = clickevent;
        f.style.cursor = 'pointer';
        filters.appendChild(f);
    }

    function clickevent(event) {
        let i = 0;
        let j = 0;
        filtersSet.forEach((element) => {
            element.element.className =  'filter';
            let x = event.target || event.srcElement;
            console.log(x.textContent);
            console.log(element.element.textContent);
            if (x.textContent == element.element.textContent)
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

fetch("http://localhost:5678/api/works")
    .then(data => data.json())
    .then( jsonListArticle => {
        gallery = document.querySelector(".gallery");
        for (let jsonArticle of jsonListArticle) {
            let element = createElementFromHTML(`<figure>
                    <img crossorigin="anonymous" src="${jsonArticle.imageUrl}" alt=${jsonArticle.title}>
                    <figcaption>${jsonArticle.title}</figcaption>
                </figure>`);
            let article = new Article(element, jsonArticle.categoryId, jsonArticle.imageUrl, jsonArticle.title, jsonArticle.id);
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


if (localStorage.token) {
    headers = { 'Authorization': localStorage.token }
    let header = document.querySelector("header");
    header.style.paddingTop = "60px";
    let f = createElementFromHTML(`<div id="edit"><i class="fa-regular fa-pen-to-square"></i><p>Mode édition</p><div id="publish"><p>publier les changements</p></div></div`);
    header.parentNode.insertBefore(f, header);


    let login = document.querySelector("#login");
    let logout = createElementFromHTML(`<li id="logout">logout</li>`);
    login.parentNode.replaceChild(logout, login);
    logout.onclick = function() {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }

    let photo = document.querySelector("#photo");
    let img = photo.lastElementChild;
    img.style.margin = "0px 0px 0px 0px";
    let photocontainer = createElementFromHTML(`<div class="photo-container"></div>`);
    let edit = createElementFromHTML(`<div class="edit"><i class="fa-regular fa-pen-to-square"></i><p>modifier</p></div>`);
    photocontainer.appendChild(img);
    photocontainer.appendChild(edit);
    photo.appendChild(photocontainer);

    let d = document.querySelector("#introduction article h2");
    d.parentNode.insertBefore(edit.cloneNode(true), d);


    let p = document.querySelector("#portfolio");

    let projets = createElementFromHTML(`<div id="projets""></div>`);
    projets.appendChild(p.firstElementChild);
    p.insertBefore(projets, p.firstChild);
    let editt = edit.cloneNode(true);
    editt.onclick = create_modal;
    projets.appendChild(editt);


}


function create_modal() {
    let background = createElementFromHTML(`<div id="edit-background"></div>`);
    document.querySelector("body").appendChild(background);
    let modal = createElementFromHTML(`<div id="modal"><h2>Galerie photo</h2></div>`);
    let quit = createElementFromHTML(`<i id="quit" class="fa-solid fa-xmark"></i>`);
    quit.style.cursor = 'pointer';
    quit.onclick = function(){   
            background.remove();
        };
    modal.appendChild(quit);
    background.appendChild(modal);
    let modal_galerie = createElementFromHTML(`<div id="modal-galerie"></div>`);
    let first = true;
    let index = 0;
    galerySet.forEach(element => {
        index = element.id;
        let e;
        if (!first) {
            e = createElementFromHTML(`<figure id="${element.id}">
            <img crossorigin="anonymous" src="${element.imageUrl}" alt=${element.title}>
            <figcaption>éditer</figcaption>
            </figure>`);
        }
        else {
            e = createElementFromHTML(`<figure id="${element.id}">
            <img crossorigin="anonymous" src="${element.imageUrl}" alt=${element.title}>
            <figcaption>éditer</figcaption><div class="icon-move"><i class="fa-solid fa-up-down-left-right"></i></div>
            </figure>`);
            first = false;
        }
        let x = createElementFromHTML(`<div id="i-${index}"class="icon"><i class="fa-regular fa-trash-can"></i></div>`);
        x.style.cursor = 'pointer';
        x.onclick = function() {
            let id = x.id.replace('i-', '');
            fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer '+ localStorage.token
            }})
            .then(res => res)
            .then(res => {
                console.log(res);
                if (res.status == 204) {
                    galerySet.forEach(element => {
                        if (element.id == id) {
                            element.element.remove();
                            galerySet.delete(element);
                        }
                    });
                    x.parentElement.remove();
                }
            })
        }
        e.appendChild(x);
        modal_galerie.appendChild(e);
        index++;
    });
    modal.appendChild(modal_galerie);
    let space = createElementFromHTML(`<div id="space"></div>`);
    modal.appendChild(space);
    let add_photo = createElementFromHTML(`<div class="filter-selected"><h2>Ajouter une photo</h2></div>`);
    add_photo.onclick = function() {
        background.remove();
        add_photo_modal();
    }
    add_photo.style.cursor = 'pointer';
    modal.appendChild(add_photo);
    let deleteall = createElementFromHTML(`<h3 id="delete-all">Supprimer la galerie</h3>`);
    deleteall.style.cursor = 'pointer';
    first = true;
    deleteall.onclick = function(){   
        galerySet.forEach(element => {
            if (first) {
                element.element.parentElement.innerHTML = '';
            }
            first = false;
            fetch(`http://localhost:5678/api/works/${element.id}`, {
                method: 'DELETE',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer '+ localStorage.token
                }})
            })
        modal_galerie.innerHTML = '';
        galerySet.clear();
    };
    modal.appendChild(deleteall);


    background.onclick = function(e){   
        if (document.getElementById('modal') && !document.getElementById('modal').contains(e.target)){
            background.remove();
        }
    };
}

function add_photo_modal() {
    let background = createElementFromHTML(`<div id="edit-background"></div>`);
    document.querySelector("body").appendChild(background);
    let modal = createElementFromHTML(`<div id="modal"><h2>Ajouter une photo</h2></div>`);
    let back = createElementFromHTML(`<i id="return" class="fa-solid fa-arrow-left"></i>`);
    background.appendChild(modal);
    back.onclick  = function() {
        background.remove();
        create_modal();
    }
    modal.appendChild(back);
    let quit = createElementFromHTML(`<i id="quit" class="fa-solid fa-xmark"></i>`);
    quit.onclick = function(){   
            background.remove();
        };
    modal.appendChild(quit);
    modal.appendChild(back);
    let select = `<label for="select-categorie">Catégorie</label><select id="select-categorie"><option value=""></option>`;
    filtersSet.forEach((element) => {
        if (element.id != 0)
            select += `<option value="${element.id}">${element.name}</option>`;
    });
    select += '</select>';
    let form = createElementFromHTML(`<form id="photo" method="post" enctype="multipart/form-data"><div
    id="drop_zone"
    ondrop="dropHandler(event);"
    ondragover="dragOverHandler(event);">
    <p></i>.</p>
  </div><label for="titre">Titre</label><input type="text" id="titre" name="titre"></input>${select}</form>`);
    modal.appendChild(form);
    modal.appendChild(createElementFromHTML(`<div id="space"></div>`));
    modal.appendChild(createElementFromHTML(`<div class="submit"><h2>Valider</h2></div>`));
}

function dropHandler(ev) {
    console.log('File(s) dropped');
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
      });
    }
  }

  function dragOverHandler(ev) {
    console.log('File(s) in drop zone');
    ev.preventDefault();
  }