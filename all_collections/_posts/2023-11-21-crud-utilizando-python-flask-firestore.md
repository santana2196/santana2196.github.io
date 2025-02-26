---
layout: post
title: Exemplo de crud utilizando o python, flask e firestore
date: 2023-11-21
categories: ["Flask", "Python", "Firestore"]
---

#### `Mãos a Obra`

![Dummy Image 8]({{site.baseurl}}/assets/icons/imgs/work2.gif)

###### Clone do repositorio:
`git clone https://github.com/santana2196/flask_firestore_api.git`

###### Criar o ambiente virtual:
`python3 -m venv venv`

###### Acessar o ambiente virtual:
`source venv/bin/activate`

###### Instalar dependências:
`pip install -r req.txt`

###### Arquivo de configuracao:
`app/__init__.py`

###### Baixa e adicionar o arquivo com as credencial do google, linha:
`cred = credentials.Certificate('./firebase-admin.json')`

###### Executar projeto na porta 8080:
`python run.py`

##### Segue payloads, as collection a ser criada ja definida no app/__init__.py chamada users

###### Adicionar:
> curl --location --request POST 'localhost:8080/add' \ --header 'Content-Type: application/json' \ --data-raw '{ "nome": "fabricio", "idade": 35, "cidade": "BA", "linguagens": ["Java script","Java"] }'

###### Listar:
> curl --location --request GET 'localhost:8080/list'

###### Listar passando argumento:
> curl --location --request GET 'localhost:8080/list?nome=fabricio' --data-raw ''

###### Atualizar:
> curl --location --request PUT 'localhost:8080/update' \ --header 'Content-Type: application/json' \ --data-raw '{ "id": "fD6BFOBmVsIbUjY7OUFq" , "nome": "ronaldo", "idade": 32, "cidade": "SP", "linguagens": ["python"] }'

###### Delete com argumento id:
> curl --location --request DELETE 'localhost:8080/delete?id=60LnTY0jSTmibWSc3b5S' \ --data-raw ''

###### Deletar todo
> curl --location --request DELETE 'localhost:8080/delete?id=all' \ --data-raw ''

##### Pontos a melhorar
1. msg de erro 
1. filtro 
1. output de logs 
1. uso de OOP 
1. adicionar wsgi 