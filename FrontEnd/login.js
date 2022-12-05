document.getElementById("login").addEventListener("submit", async function (event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let values = Object.fromEntries(formData);
    let response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(values)
      });
      
      let result = await response.json();
      console.log(result);
      if (response.status != 200) {
        let f = createElementFromHTML(`<p id="wrong-login">utilisateur ou mot de passe incorrect</p>`);
        let password = document.querySelector("#password");
        let r = document.querySelector("#wrong-login");
        if (r)
            r.remove();
        insertAfter(f, password);  

      }
      else {
        console.log(result);
        localStorage.setItem("token", result.token);
        window.location.href = "index.html";
      }
      
});



let projets = document.querySelector("#nav-projets");
projets.onclick = function() {
    window.location.href = "index.html"
}


let contact = document.querySelector("#contact");
contact.onclick = function() {
    window.location.href = "index.html"
}
