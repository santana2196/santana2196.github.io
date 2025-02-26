const categories = { Flask: [{ url: `/posts/crud-utilizando-python-flask-firestore/`, date: `21 Nov 2023`, title: `Exemplo de crud utilizando o python, flask e firestore`},],Python: [{ url: `/posts/exemplo-rabbitmq-publish-consumer/`, date: `21 Nov 2023`, title: `Exemplo de publish e consumer utilizando rabbitmq e python`},{ url: `/posts/crud-utilizando-python-flask-firestore/`, date: `21 Nov 2023`, title: `Exemplo de crud utilizando o python, flask e firestore`},],Firestore: [{ url: `/posts/crud-utilizando-python-flask-firestore/`, date: `21 Nov 2023`, title: `Exemplo de crud utilizando o python, flask e firestore`},],Rabbitmq: [{ url: `/posts/exemplo-rabbitmq-publish-consumer/`, date: `21 Nov 2023`, title: `Exemplo de publish e consumer utilizando rabbitmq e python`},],Docker: [{ url: `/posts/exemplo-rabbitmq-publish-consumer/`, date: `21 Nov 2023`, title: `Exemplo de publish e consumer utilizando rabbitmq e python`},],Alexa: [{ url: `/posts/configurando-alexa-triggercmd/`, date: `08 Jan 2024`, title: `Exemplo de utilizar alexa e executar comando de voz para ser executado no linux`},],TriggerCMD: [{ url: `/posts/configurando-alexa-triggercmd/`, date: `08 Jan 2024`, title: `Exemplo de utilizar alexa e executar comando de voz para ser executado no linux`},],Raspberry: [{ url: `/posts/configurando-alexa-triggercmd/`, date: `08 Jan 2024`, title: `Exemplo de utilizar alexa e executar comando de voz para ser executado no linux`},],Kubernets: [{ url: `/posts/kuberntes-taint-no-master/`, date: `18 Apr 2024`, title: `Como permitir que o Nó master deixe agendar os pods`},{ url: `/posts/kubenets-ip-local-com-metallb/`, date: `17 Apr 2024`, title: `Como expor app do kubernets utilizando ip local com "Metallb"`},{ url: `/posts/criando-cluster-com-kubeadmin/`, date: `12 Apr 2024`, title: `Exemplo de como provisionar cluster "Kubernets" local com "KubeAdmin"`},],Vagrant: [{ url: `/posts/criando-cluster-com-kubeadmin/`, date: `12 Apr 2024`, title: `Exemplo de como provisionar cluster "Kubernets" local com "KubeAdmin"`},],Shell: [{ url: `/posts/hacks-shell/`, date: `26 Feb 2025`, title: `Alguns Hacks Shell`},{ url: `/posts/criando-cluster-com-kubeadmin/`, date: `12 Apr 2024`, title: `Exemplo de como provisionar cluster "Kubernets" local com "KubeAdmin"`},],Hacks_shell: [{ url: `/posts/hacks-shell/`, date: `26 Feb 2025`, title: `Alguns Hacks Shell`},], }


// console.log(categories)
// console.log("teste")

window.onload = function () {
  document.querySelectorAll(".category").forEach((category) => {
    category.addEventListener("click", function (e) {
      const posts = categories[e.target.innerText.replace(" ","_")];
      let html = ``
      posts.forEach(post=>{
        html += `
        <a class="modal-article" href="${post.url}">
          <h1>${post.title}</h1>
          <small class="modal-article-date">${post.date}</small>
        </a>
        `
        // console.log(post)
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