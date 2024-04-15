---
layout: post
title: Exemplo de como provisionar cluster "Kubernets" local com "KubeAdmin"
date: 2024-04-12
categories: ["Kubernets", "Vagrant", "Shell"]
---

###### Nesse post vamos provisionar cluster Kubernets utilizando Vagrant KubeAdmin e ShellScript

##### Segue pre-requisitos:
1. Linux
1. VirtualBox

1. 192.168.0.30 - no master
1. 192.168.0.20 - no escravo

### `Mãos a Obra`

![Dummy Image 8]({{site.baseurl}}/assets/icons/imgs/work.gif)

###### Instalar o Vagrant:
```js
sudo apt-get update && sudo apt install vagrant
```
###### Criar um diretorio e iniciar o vangrat:
```js
mkdir projeto-cluster-kubernets
cd projeto-cluster-kubernets
```
###### Vamos agora criar o arquivo Vagrantfile no diretorio raiz do projeto, alguns pontos :

1. Vm Master vai ter 2 Cpus e 2Gbs
1. as Vms vai ter 1 cpu e 1GB
1. "provision.sh" sera nosso script de instalação, sera entregue as 3 vms ja com o kubeadmin instalado
1. Validar gateway que esta utilizando, nesse exemplo estou utilizando 192.168.0.1, consegue com o comando "ifconfig"
1. Imagem que vamos utilizar "ubuntu/focal64"

###### Segue Vagrantfile:

```ruby

vim Vagrantfile

# -*- mode: ruby -*-
# vi: set ft=ruby :

vms = {
  'master' => {'memory' => '2048', 'cpus' => 2, 'ip' => '30', 'provision' => 'provision.sh'},
  'node1' => {'memory' => '3072', 'cpus' => 2, 'ip' => '20', 'provision' => 'provision.sh'}
}

Vagrant.configure('2') do |config|

  config.vm.box = 'ubuntu/focal64'
  config.vm.box_check_update = false
  
  vms.each do |name, conf|
    config.vm.define "#{name}" do |k|
      k.vm.hostname = "#{name}.example.com"
      k.vm.network 'public_network', ip: "192.168.0.#{conf['ip']}", bridge: "wlp2s0"
      k.vm.provider 'virtualbox' do |vb|
        vb.memory = conf['memory']
        vb.cpus = conf['cpus']
        vb.name = "#{name}"
      end
      k.vm.provision 'shell', path: "provision/#{conf['provision']}"
      # k.vm.provision "file", source: "./provision/debian.sh", destination: "/home/ubuntu/provision_teste"
    end
  end
end

```
###### Segue script para configurar e instalar todos os pacotes necessario:

###### Alguns pontos
1. Se quiser adicionar sua chave, adicione sua chave pub na variavel "KEY"
1. Sera criado um usuario chamado "super" contendo a chave pub mencionada na variavel, fique a vontade para escolher o nome de usuario, mais nao sera necessario porque o vagrant ja tem um usuario ssh que conecta as Vm provisionada
1. Nao precisamos do docker mais sim da versao do containerd mais recente

###### Segue estrutura:

```bash
mint@mint:~/projeto-cluster-kubernets$ tree
├── provision
│   ├── provision.sh
├── Vagrantfile
```

###### Segue arquivo provision.sh
```sh
#!/bin/bash

echo " ############## Inicio ###############"

KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDrhj1fZIf/VIgXYkDI/2w4q72I5ATts5sqVTtT8WWCsmpQxS0IxtzSb5i2/Ds20RSWqsZrBd/6Ay4kouqXAIFxX+k9pgrSdvSGPZ2UFsFu1iLpZKnf10PZjUiY5FbaQuPz8K+UmWd6dsDJjfbOtir544QpUEk/ddBKplLyzXxFUo73CEanF96xlFAoSIrFjxrgdnA4GKm0mJuFY/vTEM6A5G9ZmpJ/9ZZlmWAQ+St6//epLScMnhz3Z9k61WWK0LiQ8GX5yxjVVgVCgisURUMPAOAQiusD3FqDlTXniLcCnOTL3itDijuCT2jATCWLanj6VvRglJFXP46LgXCpC8/h6x0PCb1lMSMFCWppMJseEd6zj9fneO4gibWsAL2OOS5nwfT5Q1fGL76ZSjJ1+fn81ihc0sczDO2IjvXZVXPLTwt1o8eyvFx7BFLWrurIgHq+W+zGl5/yY+6cdsdasdasdasdadads= chave@chave"
sudo useradd -m -s /bin/bash super 
sudo su -c "mkdir /home/super/.ssh/" -s /bin/bash super
sudo su -c "echo $KEY >> /home/super/.ssh/authorized_keys" -s /bin/bash super
sudo sh -c "echo 'super ALL=NOPASSWD:ALL' >> /etc/sudoers"

echo " ############## Configurando A Vm ###############"

sudo cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter
sudo cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
sudo sysctl --system
sudo apt-get update

echo " ############## Instalando o Docker e Containerid ###############"

sudo apt-get install ca-certificates curl gnupg --yes
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt update && sudo apt install containerd.io -y
sudo mkdir -p /etc/containerd && containerd config default | sudo tee /etc/containerd/config.toml 
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
sudo systemctl restart containerd

echo " ############## Instalando Kubernets ###############"

sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update && sudo apt-get install -y kubelet kubeadm kubectl 
sudo apt-mark hold kubelet kubeadm kubectl 

echo " ############## Fim ###############"
```

###### Caso precise provisionar apenas um dos no apenas o nome no provisionamento do vagrant
```sh
vagrant up master
```

###### Se for provisionar as 3 Vms:
```sh
vagrant up 
```
###### Para ver o status
```sh
vagrant status
```

###### Outra dica seria criar um snapshot quando finalizar o provisionamento:
```sh
vagrant snapshot save master snapshot-master-01
```

###### Para listar os snapshot:
```sh
vagrant snapshot list
```

###### Para restaura vm a partir do snapshot:
```sh
vagrant snapshot restore snapshot-master-01
```

###### Para destruir todas as Vms, -f e pra forcar:
```sh
vagrant destroy -f
```

###### Para destruir apenas 1 Vm:
```sh
vagrant destroy master -f
```

#### Vamos comecar entao:

###### Segue linhas para instalar, executar como root porque precisa de permissoes:
```bash
mint@mint:~/projeto-cluster-kubernets$ vagrant up 
Bringing machine 'master' up with 'virtualbox' provider...
Bringing machine 'node1' up with 'virtualbox' provider...
==> master: Importing base box 'ubuntu/focal64'...
==> master: Matching MAC address for NAT networking...
==> master: Setting the name of the VM: master
==> master: Clearing any previously set network interfaces...
==> master: Preparing network interfaces based on configuration...
```

```bash
mint@mint:~/projeto-cluster-kubernets$ vagrant status
Current machine states:

master                    running (virtualbox)
node1                     running (virtualbox)

```

```bash
mint@mint:~/projeto-cluster-kubernets$ vagrant snapshot save master snapshot-master-01
==> master: Snapshotting the machine as 'snapshot-master-01'...
==> master: Snapshot saved! You can restore the snapshot at any time by
==> master: using `vagrant snapshot restore`. You can delete it using
==> master: `vagrant snapshot delete`.
mint@mint:~/projeto-cluster-kubernets$ vagrant snapshot save node1 snapshot-node1
==> node1: Snapshotting the machine as 'snapshot-node1'...
==> node1: Snapshot saved! You can restore the snapshot at any time by
==> node1: using `vagrant snapshot restore`. You can delete it using
==> node1: `vagrant snapshot delete`.
```

###### Para acessar as vms utilizando vagrant ssh:

```bash
mint@mint:~/projeto-cluster-kubernets$ vagrant ssh master
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-173-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

  System information as of Fri Apr 12 23:15:30 UTC 2024

  System load:             0.09
  Usage of /:              5.5% of 38.70GB
  Memory usage:            12%
  Swap usage:              0%
  Processes:               120
  Users logged in:         0
  IPv4 address for enp0s3: 10.0.2.15
  IPv4 address for enp0s8: 192.168.0.30
  IPv6 address for enp0s8: 2804:14c:111:92b5::1004
  IPv6 address for enp0s8: 2804:14c:111:92b5:a00:27ff:fe43:5c78


Expanded Security Maintenance for Applications is not enabled.

35 updates can be applied immediately.
28 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status

New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


vagrant@master:~$ 
```

```js
mint@mint:~/projeto-cluster-kubernets$ ssh super@192.168.0.30
The authenticity of host '192.168.0.30 (192.168.0.30)' can't be established.
ED25519 key fingerprint is SHA256:Vi7oAttqISwoevo1fjBgAmEOkuXPICXAIxlAfKJ5K1A.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.30' (ED25519) to the list of known hosts.
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-173-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

  System information as of Fri Apr 12 23:51:26 UTC 2024

  System load:             0.22
  Usage of /:              5.5% of 38.70GB
  Memory usage:            12%
  Swap usage:              0%
  Processes:               128
  Users logged in:         0
  IPv4 address for enp0s3: 10.0.2.15
  IPv4 address for enp0s8: 192.168.0.30
  IPv6 address for enp0s8: 2804:14c:111:92b5::1003
  IPv6 address for enp0s8: 2804:14c:111:92b5:a00:27ff:fe5c:d669


Expanded Security Maintenance for Applications is not enabled.

35 updates can be applied immediately.
28 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status

New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.
```
#### Instalando Kubernets:

###### Vamos utilizar o kubeadmin pra provisionar o kubernets passando o ip do no master e a subrede:
```js
root@master:~# sudo kubeadm init --apiserver-advertise-address=192.168.0.30 --pod-network-cidr=10.244.0.0/16
[init] Using Kubernetes version: v1.29.3
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
W0413 00:03:57.382608    5203 checks.go:835] detected that the sandbox image "registry.k8s.io/pause:3.6" of the container runtime is inconsistent with that used by kubeadm. It is recommended that using "registry.k8s.io/pause:3.9" as the CRI sandbox image.
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local master] and IPs [10.96.0.1 192.168.0.30]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [localhost master] and IPs [192.168.0.30 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [localhost master] and IPs [192.168.0.30 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "super-admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 12.004514 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node master as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node master as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: xnsijh.6l9vu6g605tifatg
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.0.30:6443 --token xnsijh.6l9vu6g605tifatg \
	--discovery-token-ca-cert-hash sha256:6bf31f9188e0d4ebc67dd6a09dfd89167570fffeb14e2cda5465e552863e4108 
```

```js
root@master:~# mkdir -p $HOME/.kube
root@master:~# sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
root@master:~# sudo chown $(id -u):$(id -g) $HOME/.kube/config
root@master:~# kubectl get pods -A
NAMESPACE     NAME                             READY   STATUS    RESTARTS   AGE
kube-system   coredns-76f75df574-ntbsk         0/1     Pending   0          73s
kube-system   coredns-76f75df574-sgqw2         0/1     Pending   0          73s
kube-system   etcd-master                      1/1     Running   0          86s
kube-system   kube-apiserver-master            1/1     Running   0          86s
kube-system   kube-controller-manager-master   1/1     Running   0          86s
kube-system   kube-proxy-2hgxn                 1/1     Running   0          72s
kube-system   kube-scheduler-master            1/1     Running   0          
```

```js
root@master:~# kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.0/manifests/calico.yaml
poddisruptionbudget.policy/calico-kube-controllers created
serviceaccount/calico-kube-controllers created
serviceaccount/calico-node created
serviceaccount/calico-cni-plugin created
configmap/calico-config created
customresourcedefinition.apiextensions.k8s.io/bgpconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/bgpfilters.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/bgppeers.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/blockaffinities.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/caliconodestatuses.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/clusterinformations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/felixconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/globalnetworkpolicies.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/globalnetworksets.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/hostendpoints.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamblocks.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamconfigs.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamhandles.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ippools.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipreservations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/kubecontrollersconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/networkpolicies.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/networksets.crd.projectcalico.org created
clusterrole.rbac.authorization.k8s.io/calico-kube-controllers created
clusterrole.rbac.authorization.k8s.io/calico-node created
clusterrole.rbac.authorization.k8s.io/calico-cni-plugin created
clusterrolebinding.rbac.authorization.k8s.io/calico-kube-controllers created
clusterrolebinding.rbac.authorization.k8s.io/calico-node created
clusterrolebinding.rbac.authorization.k8s.io/calico-cni-plugin created
daemonset.apps/calico-node created
deployment.apps/calico-kube-controllers created
```
```js
root@master:~# kubectl get pods -A
NAMESPACE     NAME                                       READY   STATUS     RESTARTS   AGE
kube-system   calico-kube-controllers-74d5f9d7bb-9cknt   0/1     Pending    0          26s
kube-system   calico-node-6kd96                          0/1     Init:2/3   0          26s
kube-system   coredns-76f75df574-ntbsk                   0/1     Pending    0          2m29s
kube-system   coredns-76f75df574-sgqw2                   0/1     Pending    0          2m29s
kube-system   etcd-master                                1/1     Running    0          2m42s
kube-system   kube-apiserver-master                      1/1     Running    0          2m42s
kube-system   kube-controller-manager-master             1/1     Running    0          2m42s
kube-system   kube-proxy-2hgxn                           1/1     Running    0          2m28s
kube-system   kube-scheduler-master                      1/1     Running    0          2m43s

root@master:~# kubectl get pods -A
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-74d5f9d7bb-9cknt   1/1     Running   0          117s
kube-system   calico-node-6kd96                          1/1     Running   0          117s
kube-system   coredns-76f75df574-ntbsk                   1/1     Running   0          4m
kube-system   coredns-76f75df574-sgqw2                   1/1     Running   0          4m
kube-system   etcd-master                                1/1     Running   0          4m13s
kube-system   kube-apiserver-master                      1/1     Running   0          4m13s
kube-system   kube-controller-manager-master             1/1     Running   0          4m13s
kube-system   kube-proxy-2hgxn                           1/1     Running   0          3m59s
kube-system   kube-scheduler-master                      1/1     Running   0          4m14s
```

```js
mint@mint:~/projeto-cluster-kubernets$ vagrant ssh node1
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-173-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

  System information as of Sat Apr 13 00:10:07 UTC 2024

  System load:             0.0
  Usage of /:              5.5% of 38.70GB
  Memory usage:            20%
  Swap usage:              0%
  Processes:               106
  Users logged in:         0
  IPv4 address for enp0s3: 10.0.2.15
  IPv4 address for enp0s8: 192.168.0.20
  IPv6 address for enp0s8: 2804:14c:111:92b5::1007
  IPv6 address for enp0s8: 2804:14c:111:92b5:a00:27ff:fe8c:f6b5


Expanded Security Maintenance for Applications is not enabled.

35 updates can be applied immediately.
28 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status

New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


vagrant@node1:~$ sudo su -
root@node1:~# kubeadm join 192.168.0.30:6443 --token xnsijh.6l9vu6g605tifatg \
> --discovery-token-ca-cert-hash sha256:6bf31f9188e0d4ebc67dd6a09dfd89167570fffeb14e2cda5465e552863e4108 
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

```js
root@master:~# kubectl get node
NAME     STATUS     ROLES           AGE     VERSION
master   Ready      control-plane   6m15s   v1.29.3
node1    NotReady   <none>          34s     v1.29.3

root@master:~# kubectl get node
NAME     STATUS     ROLES           AGE     VERSION
master   Ready      control-plane   6m17s   v1.29.3
node1    NotReady   <none>          36s     v1.29.3

root@master:~# kubectl get node
NAME     STATUS     ROLES           AGE     VERSION
master   Ready      control-plane   6m20s   v1.29.3
node1    NotReady   <none>          39s     v1.29.3

root@master:~# kubectl get node
NAME     STATUS   ROLES           AGE     VERSION
master   Ready    control-plane   6m54s   v1.29.3
node1    Ready    <none>          73s     v1.29.3
```

```sh
vim deploy-nginx.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
--- 
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30000
  type: NodePort
```
###### Vamos Agora provisionar o nginx pra ver se esta tudo funcionando
```bash
root@master:~# kubectl create namespace nginx
namespace/nginx created

root@master:~# kubectl apply -f deploy-nginx.yaml -n nginx
deployment.apps/nginx created
service/nginx created

root@master:~# kubectl get pods -n nginx
NAME                     READY   STATUS    RESTARTS   AGE
nginx-7c5ddbdf54-hrs4t   1/1     Running   0          50s

root@master:~# kubectl get service -n nginx
NAME    TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
nginx   NodePort   10.102.253.207   <none>        80:30000/TCP   84s

#Pra validar precisamos pegar o ip do No e executar utilizando o parta mencionada
root@master:~# curl 192.168.0.20:30000
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

#     !!!!!!!!!!!!!!!!!!!!!!!!!!
#     !!!!!!!!!! FIM !!!!!!!!!!!
#     !!!!!!!!!!!!!!!!!!!!!!!!!!