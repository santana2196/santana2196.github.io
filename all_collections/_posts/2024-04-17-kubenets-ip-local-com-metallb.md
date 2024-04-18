---
layout: post
title: Como expor app do kubernets utilizando ip local com "Metallb"
date: 2024-04-17
categories: ["Kubernets"]
---

##### Nesse post vamos expor app utilizando ip local utilizando `Metallb` no Kubernets

###### Segue pre-requisitos:
- lab ja esta criado -> [Lab Kubernets](https://santana2196.github.io/posts/criando-cluster-com-kubeadmin/).


### `Mãos a Obra`

![Dummy Image 8]({{site.baseurl}}/assets/icons/imgs/cat.gif)

###### Vamos partir do principio que o lab ja esta funcionando e que ja esteja rodando o nginx:
```js
root@master:~# kubectl get pods -n nginx
NAME                     READY   STATUS    RESTARTS   AGE
nginx-7c5ddbdf54-2wdjn   1/1     Running   0          6s

root@master:~# kubectl get service -n nginx
NAME    TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
nginx   NodePort   10.102.253.207   <none>        80:30000/TCP   4d11h

mint@mint:~$ curl 192.168.0.20:30000
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```
###### Vamos criar um deployment a partir de uma imagem do dockerhub:
```js
root@master:~# kubectl get deploy
No resources found in default namespace.

root@master:~# kubectl  create deployment sample-nginx-app --image=santana2196/metallb-nginx-google-sample:1.0
deployment.apps/sample-nginx-app created

root@master:~# kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
sample-nginx-app-6f6df4846b-gx844   1/1     Running   0          51s
```
###### Agora vamos expor o app:

```js
root@master:~# kubectl expose deployment sample-nginx-app --type LoadBalancer --port 80 --target-port 8080
service/sample-nginx-app exposed

root@master:~# kubectl get service
NAME               TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes         ClusterIP      10.96.0.1        <none>        443/TCP        4d21h
sample-nginx-app   LoadBalancer   10.103.148.143   <pending>     80:32354/TCP   20s

```


###### Validando esta como pendente o "External-Ip", agora vamos configurar o "MetalLib":

```js
root@master:~# kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.7/config/manifests/metallb-native.yaml
namespace/metallb-system created
customresourcedefinition.apiextensions.k8s.io/addresspools.metallb.io created
customresourcedefinition.apiextensions.k8s.io/bfdprofiles.metallb.io created
customresourcedefinition.apiextensions.k8s.io/bgpadvertisements.metallb.io created
customresourcedefinition.apiextensions.k8s.io/bgppeers.metallb.io created
customresourcedefinition.apiextensions.k8s.io/communities.metallb.io created
customresourcedefinition.apiextensions.k8s.io/ipaddresspools.metallb.io created
customresourcedefinition.apiextensions.k8s.io/l2advertisements.metallb.io created
serviceaccount/controller created
serviceaccount/speaker created
role.rbac.authorization.k8s.io/controller created
role.rbac.authorization.k8s.io/pod-lister created
clusterrole.rbac.authorization.k8s.io/metallb-system:controller created
clusterrole.rbac.authorization.k8s.io/metallb-system:speaker created
rolebinding.rbac.authorization.k8s.io/controller created
rolebinding.rbac.authorization.k8s.io/pod-lister created
clusterrolebinding.rbac.authorization.k8s.io/metallb-system:controller created
clusterrolebinding.rbac.authorization.k8s.io/metallb-system:speaker created
secret/webhook-server-cert created
service/webhook-service created
deployment.apps/controller created
daemonset.apps/speaker created
validatingwebhookconfiguration.admissionregistration.k8s.io/metallb-webhook-configuration created

```
###### No arquivo "ipaddresspool.yaml" informamos um range de ip:

```js
cat ipaddresspool.yaml

apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.0.100-192.168.0.110

```
###### Vamos aplicar outro resorce:

```js
cat l2advertisement.yaml

apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default
  namespace: metallb-system
spec:
  ipAddressPools:
  - default-pool

```

###### Vamos agora aplicar os dois resources:
```js
root@master:~# ls -lh
total 16K
-rw-r--r-- 1 root root  452 Apr 13 09:48 deploy-nginx.yaml
-rw-r--r-- 1 root root  161 Apr 17 21:47 ipaddresspool.yaml
-rw-r--r-- 1 root root  148 Apr 17 21:47 l2advertisement.yaml

root@master:~# kubectl apply -f ipaddresspool.yaml
ipaddresspool.metallb.io/default-pool created
root@master:~# kubectl apply -f l2advertisement.yaml
l2advertisement.metallb.io/default created
```

###### Vamos validar:
```js
root@master:~# kubectl get service
NAME               TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE
kubernetes         ClusterIP      10.96.0.1        <none>          443/TCP        4d21h
sample-nginx-app   LoadBalancer   10.103.148.143   192.168.0.100   80:32354/TCP   9m5s

mint@mint:~$ curl 192.168.0.100 
Hello, world!
Version: 1.0.0
Hostname: sample-nginx-app-6f6df4846b-gx844

```

###### Vamos escalar os pods, e realizar os teste:
```js
root@master:~# kubectl scale   deployment/sample-nginx-app --replicas=4
deployment.apps/sample-nginx-app scaled

root@master:~# kubectl get pods
NAME                                READY   STATUS              RESTARTS   AGE
sample-nginx-app-6f6df4846b-cg475   0/1     ContainerCreating   0          3s
sample-nginx-app-6f6df4846b-ddnpp   0/1     ContainerCreating   0          3s
sample-nginx-app-6f6df4846b-dmb8s   0/1     ContainerCreating   0          3s
sample-nginx-app-6f6df4846b-gx844   1/1     Running             0          16m

mint@mint:~$ curl 192.168.0.100 
Hello, world!
Version: 1.0.0
Hostname: sample-nginx-app-6f6df4846b-ddnpp

mint@mint:~$ curl 192.168.0.100 
Hello, world!
Version: 1.0.0
Hostname: sample-nginx-app-6f6df4846b-dmb8s

mint@mint:~$ curl 192.168.0.100 
Hello, world!
Version: 1.0.0
Hostname: sample-nginx-app-6f6df4846b-dmb8s

mint@mint:~$ curl 192.168.0.100 
Hello, world!
Version: 1.0.0
Hostname: sample-nginx-app-6f6df4846b-cg475
```

###### Vamos provisionar um pod mysql:

```js
cat deploy-mysql.yaml

apiVersion: v1                  
kind: Pod                       
metadata:
  name: mysql-openshift
  labels:
    name: mysql-openshift
spec:
  containers:
    - resources:
        limits:
            cpu: 0.5
      image: centos/mysql-57-centos7:5.7
      name: mysql
      env:
        - name: "MYSQL_ROOT_PASSWORD"
          value: "senha"         
      ports:
        - containerPort: 3306
          name: mysql

root@master:~# kubectl apply -f deploy-mysql.yaml 
pod/mysql-openshift created

root@master:~# kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
mysql-openshift                     1/1     Running   0          27s
sample-nginx-app-6f6df4846b-cg475   1/1     Running   0          3m37s
sample-nginx-app-6f6df4846b-ddnpp   1/1     Running   0          3m37s
sample-nginx-app-6f6df4846b-dmb8s   1/1     Running   0          3m37s
sample-nginx-app-6f6df4846b-gx844   1/1     Running   0          19m

root@master:~# kubectl expose pod mysql-openshift --type LoadBalancer --port 3306 --target-port 3306
service/mysql-openshift exposed

NAME               TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)          AGE
kubernetes         ClusterIP      10.96.0.1        <none>          443/TCP          4d21h
mysql-openshift    LoadBalancer   10.106.14.178    192.168.0.101   3306:30523/TCP   26s
sample-nginx-app   LoadBalancer   10.103.148.143   192.168.0.100   80:32354/TCP     18m

mint@mint:~$ telnet 192.168.0.101 3306
Trying 192.168.0.101...
Connected to 192.168.0.101.
Escape character is '^]'.
J
5.7.24]8MNj7aDp.MV}=4xmysql_native_password

root@master:~# mysql --password=senha --user=root --host=192.168.0.101
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.24 MySQL Community Server (GPL)

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 

```

#     !!!!!!!!!!!!!!!!!!!!!!!!!!
#     !!!!!!!!!! FIM !!!!!!!!!!!
#     !!!!!!!!!!!!!!!!!!!!!!!!!!