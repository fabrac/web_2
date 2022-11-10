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
      alert(result.message);
});
  