const categories = {

  
  "Flask": [
    
    {
      url: "/posts/crud-utilizando-python-flask-firestore/",
      date: "2023-11-21",
      formatted_date: "21/11/2023",
      title: "Exemplo de crud utilizando o python, flask e firestore"
    }
    
  ],

  
  "Python": [
    
    {
      url: "/posts/exemplo-rabbitmq-publish-consumer/",
      date: "2023-11-21",
      formatted_date: "21/11/2023",
      title: "Exemplo de publish e consumer utilizando rabbitmq e python"
    },
    
    {
      url: "/posts/crud-utilizando-python-flask-firestore/",
      date: "2023-11-21",
      formatted_date: "21/11/2023",
      title: "Exemplo de crud utilizando o python, flask e firestore"
    }
    
  ],

  
  "Firestore": [
    
    {
      url: "/posts/crud-utilizando-python-flask-firestore/",
      date: "2023-11-21",
      formatted_date: "21/11/2023",
      title: "Exemplo de crud utilizando o python, flask e firestore"
    }
    
  ],

  
  "Rabbitmq": [
    
    {
      url: "/posts/exemplo-rabbitmq-publish-consumer/",
      date: "2023-11-21",
      formatted_date: "21/11/2023",
      title: "Exemplo de publish e consumer utilizando rabbitmq e python"
    }
    
  ],

  
  "Docker": [
    
    {
      url: "/posts/exemplo-rabbitmq-publish-consumer/",
      date: "2023-11-21",
      formatted_date: "21/11/2023",
      title: "Exemplo de publish e consumer utilizando rabbitmq e python"
    }
    
  ],

  
  "Alexa": [
    
    {
      url: "/posts/configurando-alexa-triggercmd/",
      date: "2024-01-08",
      formatted_date: "08/01/2024",
      title: "Exemplo de utilizar alexa e executar comando de voz para ser executado no linux"
    }
    
  ],

  
  "TriggerCMD": [
    
    {
      url: "/posts/configurando-alexa-triggercmd/",
      date: "2024-01-08",
      formatted_date: "08/01/2024",
      title: "Exemplo de utilizar alexa e executar comando de voz para ser executado no linux"
    }
    
  ],

  
  "Raspberry": [
    
    {
      url: "/posts/configurando-alexa-triggercmd/",
      date: "2024-01-08",
      formatted_date: "08/01/2024",
      title: "Exemplo de utilizar alexa e executar comando de voz para ser executado no linux"
    }
    
  ],

  
  "Kubernets": [
    
    {
      url: "/posts/kuberntes-taint-no-master/",
      date: "2024-04-18",
      formatted_date: "18/04/2024",
      title: "Como permitir que o Nó master deixe agendar os pods"
    },
    
    {
      url: "/posts/kubenets-ip-local-com-metallb/",
      date: "2024-04-17",
      formatted_date: "17/04/2024",
      title: "Como expor app do kubernets utilizando ip local com \"Metallb\""
    },
    
    {
      url: "/posts/criando-cluster-com-kubeadmin/",
      date: "2024-04-12",
      formatted_date: "12/04/2024",
      title: "Exemplo de como provisionar cluster \"Kubernets\" local com \"KubeAdmin\""
    }
    
  ],

  
  "Vagrant": [
    
    {
      url: "/posts/criando-cluster-com-kubeadmin/",
      date: "2024-04-12",
      formatted_date: "12/04/2024",
      title: "Exemplo de como provisionar cluster \"Kubernets\" local com \"KubeAdmin\""
    }
    
  ],

  
  "Shell": [
    
    {
      url: "/posts/reviver-macbook-air-antigo-linux/",
      date: "2026-08-30",
      formatted_date: "30/08/2026",
      title: "Como Ressuscitei um MacBook Air Antigo (1.8 GB RAM) Otimizando o Linux ao Limite"
    },
    
    {
      url: "/posts/hacks-shell/",
      date: "2025-02-26",
      formatted_date: "26/02/2025",
      title: "Alguns Hacks Shell"
    },
    
    {
      url: "/posts/criando-cluster-com-kubeadmin/",
      date: "2024-04-12",
      formatted_date: "12/04/2024",
      title: "Exemplo de como provisionar cluster \"Kubernets\" local com \"KubeAdmin\""
    }
    
  ],

  
  "Hacks_shell": [
    
    {
      url: "/posts/hacks-shell/",
      date: "2025-02-26",
      formatted_date: "26/02/2025",
      title: "Alguns Hacks Shell"
    }
    
  ],

  
  "Linux": [
    
    {
      url: "/posts/reviver-macbook-air-antigo-linux/",
      date: "2026-08-30",
      formatted_date: "30/08/2026",
      title: "Como Ressuscitei um MacBook Air Antigo (1.8 GB RAM) Otimizando o Linux ao Limite"
    }
    
  ],

  
  "Hardware": [
    
    {
      url: "/posts/reviver-macbook-air-antigo-linux/",
      date: "2026-08-30",
      formatted_date: "30/08/2026",
      title: "Como Ressuscitei um MacBook Air Antigo (1.8 GB RAM) Otimizando o Linux ao Limite"
    }
    
  ]

};

document.addEventListener("DOMContentLoaded", function () {
  // Delegate click event to handle statically rendered or dynamic tags
  document.body.addEventListener("click", function (e) {
    const categoryEl = e.target.closest(".category");
    if (!categoryEl) return;

    e.preventDefault();
    const rawTag = categoryEl.innerText.replace(/^#/, "").trim().replace(/ /g, "_");
    
    // Find category in dictionary (case-insensitive fallback)
    let matchedKey = Object.keys(categories).find(
      key => key.toLowerCase() === rawTag.toLowerCase()
    );

    const posts = matchedKey ? categories[matchedKey] : null;

    if (!posts || posts.length === 0) return;

    // Guarantee sorting from newest date to oldest date
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = ``;
    sortedPosts.forEach(post => {
      html += `
      <a class="modal-article" href="${post.url}">
        <h1>${post.title}</h1>
        <small class="modal-article-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Publicado em ${post.formatted_date}
        </small>
      </a>
      `;
    });

    const modalTitle = document.querySelector("#category-modal-title");
    const modalContent = document.querySelector("#category-modal-content");
    const modalBg = document.querySelector("#category-modal-bg");
    const modal = document.querySelector("#category-modal");

    if (modalTitle && modalContent && modalBg && modal) {
      modalTitle.innerText = `${matchedKey} (${sortedPosts.length} artigo${sortedPosts.length > 1 ? 's' : ''})`;
      modalContent.innerHTML = html;
      modalBg.classList.add("open");
      modal.classList.add("open");
    }
  });

  const modalBg = document.querySelector("#category-modal-bg");
  if (modalBg) {
    modalBg.addEventListener("click", function () {
      document.querySelector("#category-modal-bg")?.classList.remove("open");
      document.querySelector("#category-modal")?.classList.remove("open");
    });
  }
});