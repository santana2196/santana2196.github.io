const categories = { Flask: [{ url: `/posts/crud-utilizando-python-flask-firestore-copy/`, date: `21 Nov 2023`, title: `Exemplo de crud utilizando o python, flask e firestore`},],Python: [{ url: `/posts/exemplo-rabbitmq-publish-consumer/`, date: `21 Nov 2023`, title: `Exemplo de publish e consumer utilizando rabbitmq`},{ url: `/posts/crud-utilizando-python-flask-firestore-copy/`, date: `21 Nov 2023`, title: `Exemplo de crud utilizando o python, flask e firestore`},],Firestore: [{ url: `/posts/crud-utilizando-python-flask-firestore-copy/`, date: `21 Nov 2023`, title: `Exemplo de crud utilizando o python, flask e firestore`},],rabbitmq: [{ url: `/posts/exemplo-rabbitmq-publish-consumer/`, date: `21 Nov 2023`, title: `Exemplo de publish e consumer utilizando rabbitmq`},], }

console.log(categories)

window.onload = function () {
  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", function (e) {
      const posts = categories[e.target.innerText.replace(" ","_")];
      let html = ``
      posts.forEach(post=>{
        html += `
        <a class="modal-article" href="${post.url}">
          <h4>${post.title}</h4>
          <small class="modal-article-date">${post.date}</small>
        </a>
        `
      })
      document.querySelector("#category-modal-title").innerText = e.target.innerText;
      document.querySelector("#category-modal-content").innerHTML = html;
      document.querySelector("#category-modal-bg").classList.toggle("open");
      document.querySelector("#category-modal").classList.toggle("open");
    });
  });

  document.querySelector("#category-modal-bg").addEventListener("click", function(){
    document.querySelector("#category-modal-title").innerText = "";
    document.querySelector("#category-modal-content").innerHTML = "";
    document.querySelector("#category-modal-bg").classList.toggle("open");
    document.querySelector("#category-modal").classList.toggle("open");
  })
};