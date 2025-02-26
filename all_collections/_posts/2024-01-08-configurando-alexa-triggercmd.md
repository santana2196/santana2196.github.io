---
layout: post
title: Exemplo de utilizar alexa e executar comando de voz para ser executado no linux
date: 2024-01-08
categories: ["Alexa", "TriggerCMD", "Raspberry"]
---

###### Recentemente adquirir uma Alexa da 5 geracao, assim podendo fazer alguma coisa com meu raspberry que estava parado a um tempo.
###### Vamos esta configurando configurando a Alexa e o TriggerCmd para conseguimos executar comando de voz ao raspberry.

### `Mãos a Obra`

![Dummy Image 8]({{site.baseurl}}/assets/icons/imgs/cat-da.gif)

###### Cria uma conta, TriggerCmd:
https://www.triggercmd.com/user/auth/login

###### Onde localizar o token:

https://www.triggercmd.com/user/computer/create

![Image8]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa8.png)

#### Vamos comeca a configurar onde sera executado o triggerCmd

###### Segue linhas para instalar, executar como root porque precisa de permissoes:
```bash
sudo su -
apt-get -y update
apt-get -y upgrade
apt -y install npm nodejs
```

```bash
wget https://agents.triggercmd.com/triggercmdagent_1.0.1_all.deb
dpkg -i triggercmdagent_1.0.1_all.deb
```

###### Executar o comando para configurar o token:
```js
triggercmdagent
```
>( colar o token, e pressionar o ENTER e aguardar)
>( ao finalizar, precione CTRL-C para sair. )

###### instalar e configurar o Daemon dos servicos:
bash /usr/share/triggercmdagent/app/src/installdaemon.sh

###### Lista de comando para executar como servico:
```sh
systemctl stop triggercmdagent
systemctl start triggercmdagent
systemctl status triggercmdagent
```
###### Arquivo onde e amarzenado os comandos, e ja com uns exemplos:
```sh
/root/.TRIGGERcmdData/commands.json

root@raspberrypi:~# cat /root/.TRIGGERcmdData/commands.json
[
  {"trigger":"Reboot","command":"shutdown -r","ground":"background","voice":"reboot","allowParams": "false"},
  {"trigger":"yum update","command":"yum -y update","ground":"background","voice":"yum update","allowParams": "false"},
  {"trigger":"apt update","command":"apt-get -y update","ground":"background","voice":"update","allowParams": "false"},
  {"trigger":"desligar","command":"shutdown now","ground":"background","voice":"desligar pi","allowParams": "false"}
]
```

###### Agora vamos configura no app da alexa:

![Dummy Image 1]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa1.png)

![Dummy Image 2]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa2.png)

![Dummy Image 3]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa3.png)

![Dummy Image 4]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa4.png)

![Dummy Image 5]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa5.png)

![Dummy Image 6]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa6.png)

![Dummy Image 7]({{site.baseurl}}/assets/icons/alexa-triggercmd-smarthome/alexa7.png)


Para executar basta dizer: **Alexa, desligar pi**.


#### Obs.

>para adicionar comandos, precisa seguir exemplo acima e sempre da um restart no servico que a alexa ja auto reconhece comando novo

###### Para remover:
`desabilitar a skill que foi habilitada`

###### Remover os servicos
`systemctl stop triggercmdagent`
`bash /usr/share/triggercmdagent/app/src/removedaemon.sh`
`apt remove triggercmdagent`