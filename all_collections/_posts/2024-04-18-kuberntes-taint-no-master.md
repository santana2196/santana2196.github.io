---
layout: post
title: Como permitir que o Nó master deixe agendar os pods
date: 2024-04-18
categories: ["Kubernets"]
---

##### Nesse post curto vamos permitir que o No master agende pod

###### Por default o No master nao agendar pod, deixa essa responsabilidade para os nos escravos, com isso vamos configurar para que ele deixe agendar no Nó master tambem.

### `Mãos a Obra`

![Dummy Image 8]({{site.baseurl}}/assets/icons/imgs/angry-cat.gif)

###### Vamos seguir nosso lab e vamos provisionar apenas o master no lab que montamos:
- lab ja esta criado -> [Lab Kubernets](https://santana2196.github.io/posts/criando-cluster-com-kubeadmin/).

```js
root@master:~# kubectl get nodes
NAME     STATUS   ROLES           AGE    VERSION
master   Ready    control-plane   5d8h   v1.29.3
node1    Ready    <none>          5d8h   v1.29.3
```
###### Vamos parar a vm de No, vamos perceber que as aplicação vao parar de responder porque nao tem onde agendar, fica mais nitido quando deleta os pods:
```js
mint@mint:~/projeto-cluster-kubernets$ vagrant halt node1
==> node1: Attempting graceful shutdown of VM...

mint@mint:~/projeto-cluster-kubernets$ vagrant status
Current machine states:

master                    running (virtualbox)
node1                     poweroff (virtualbox)

root@master:~# kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
mysql-openshift                     1/1     Running   0          10h
sample-nginx-app-6f6df4846b-cg475   1/1     Running   0          11h
sample-nginx-app-6f6df4846b-ddnpp   1/1     Running   0          11h
sample-nginx-app-6f6df4846b-dmb8s   1/1     Running   0          11h
sample-nginx-app-6f6df4846b-gx844   1/1     Running   0          11h

mint@mint:~$ curl http://192.168.0.100/
curl: (7) Failed to connect to 192.168.0.100 port 80 after 3055 ms: No route to host

root@master:~# kubectl delete pods --all --force
pod "mysql-openshift" deleted
pod "sample-nginx-app-6f6df4846b-8nq84" deleted
pod "sample-nginx-app-6f6df4846b-cg475" deleted
pod "sample-nginx-app-6f6df4846b-ddnpp" deleted
pod "sample-nginx-app-6f6df4846b-dmb8s" deleted
pod "sample-nginx-app-6f6df4846b-gx844" deleted
pod "sample-nginx-app-6f6df4846b-hbj5z" deleted
pod "sample-nginx-app-6f6df4846b-mtl5m" deleted
pod "sample-nginx-app-6f6df4846b-r4xm6" deleted

root@master:~# kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
sample-nginx-app-6f6df4846b-nwqrw   0/1     Pending   0          3s
sample-nginx-app-6f6df4846b-t4rv8   0/1     Pending   0          3s
sample-nginx-app-6f6df4846b-vmwrf   0/1     Pending   0          3s
sample-nginx-app-6f6df4846b-wcgjw   0/1     Pending   0          3s

```
###### Vamos utilizar o comando taint para configurar o agendamento de pods no nó master:

```js
root@master:~# kubectl taint nodes master node-role.kubernetes.io/control-plane-
node/master untainted

root@master:~# kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
sample-nginx-app-6f6df4846b-nwqrw   1/1     Running   0          2m58s
sample-nginx-app-6f6df4846b-t4rv8   1/1     Running   0          2m58s
sample-nginx-app-6f6df4846b-vmwrf   1/1     Running   0          2m58s
sample-nginx-app-6f6df4846b-wcgjw   1/1     Running   0          2m58s

root@master:~# curl 192.168.0.100
Hello, world!
Version: 1.0.0
Hostname: sample-nginx-app-6f6df4846b-vmwrf

```
#     !!!!!!!!!!!!!!!!!!!!!!!!!!
#     !!!!!!!!!! FIM !!!!!!!!!!!
#     !!!!!!!!!!!!!!!!!!!!!!!!!!