---
layout: post
title: Exemplo de publish e consumer utilizando rabbitmq 
date: 2023-11-21
categories: ["rabbitmq", "Python"]
---

#### `Mãos a Obra`

![Dummy Image 1](https://camo.githubusercontent.com/4191faa8c3f466fc5352fba86bacb48d3d9050cfa1c29f56dbfa003c11c4121a/68747470733a2f2f6d656469612e67697068792e636f6d2f6d656469612f6c394a687a77646930395665302f67697068792e676966)

###### Clone do repositorio:
> git clone https://github.com/santana2196/rabbitmq_publish_consumer.git

###### Criar o ambiente virtual:
`python3 -m venv venv`

###### Acessar o ambiente virtual:
`source venv/bin/activate`

###### Instalar dependências:
`pip3 install pika`

###### docker-compose:
```
version: '3.4'

services:
  rabbitmq:
    image: rabbitmq:3.8-management
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
        - app
    volumes:
        - ./rabbitmq/data/:/var/lib/rabbitmq/
        - ./rabbitmq/log/:/var/log/rabbitmq/

networks:
  app:
    driver: bridge
```

###### subir o ambiente utilizando docker-compose:
`docker-compose up -d`

###### Acessar rabbitmq:
`localhost:15672`

##### Login:
`login: guest`
`pass: guest`


###### Exemplo de publicação:
`python3 publish_rabbitmq.py`

###### Exemplo de consumer:
`python3 consumer-rabbitmq.py`

###### Validando a insersao no banco sqlite3:
`sqlite3 operation/banco/db.sqlite3`
`sqlite> select count(*) from population;`