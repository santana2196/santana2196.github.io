---
layout: post
title: Alguns Hacks Shell
date: 2025-02-26
categories: ["Hacks_shell", "Shell"]
---

##### Alguns Hacks shell pra ajudar na produtividade no dia dia. 

### `Mãos a Obra`

![Dummy Image 8]({{site.baseurl}}/assets/icons/imgs/sho-cat.gif)

###### Um pouco sobre variaveis:

```js

#Declara variavel
nome_da_variavel=valor

#Printar variavel
echo $nome_da_variavel  

#Para todo os processos do terminal atual exergue a variavel criada, utilize export:
export nome_da_variavel
#ou
export VAR="teste"

#Como remover variavel
unset variavel

```

###### Alguns retorno de comandos:


```js

echo $$ - mostra do pid atual
echo $! - pid do utimo que esta executando em background
top & - vai rodar em background
echo $? - codigo de retorno que executou
0 - executou
1 - erro
2 - ate executou, mais com erro.

#executar comandos em sequencia 
clear ; date ; ls

# && - outra forma de executar comando em sequancia, se o comando foi executado com sucesso, executa o segundo 
ls /tmp/teste && echo linux

!! - repetir o utimo comando
!num do comando - executar ! com o numero no history 

#Help do comando
man ls

#como criar um alias
alias lt='ls /tmp' - 

```
###### Compactar e descompactar com tar:

```js

-c pra criar um aquivo 
-x extrair arquivo 
-t listar aquivos no arquivo compactado 

z - gzip
j - bunzip2
J - xz

-v verbose
-p preservar as permissoes 
-f pra manter ou arquivo compactado


tar cpvf backup.tar novo* -> agrupar aquivos
tar tf backup.tar -> listar dentro de backup.tar

gzip backup.tar - compactar arquivo excluindo o antigo
gunzip backup.tar.gz - descopactar aquivo
gzip -k backup.tar - manter os dois arquivos 

bzip2 -k backup.tar - compacta em bz2
bunzip backup.tar.bz2 - descompactar arquivo

xz -k backup.tar - compacta aquivo em xz
unxz backup.tar.xz - descompactar aquivo

tar zcpvf backup.tg novo* -> chamar e ja compacta arquivo 
tar jcpvf backup.tbz novo* -> chamar e ja compacta arquivo 
tar Jcpvf backup.tarz novo* -> chamar e ja compacta arquivo 
tar Jcpvf backup.txz novo* -> chamar e ja compacta arquivo 

```
###### Shellscript

```js
#Exemplo de como criar um shellscript

export TESTE="meu teste"

vim script.sh

#!/bin/bash
echo "o script le e imprime o valor da variavel TESTE"
echo " " 
echo "o valor da variavel TESTE e:" $TESTE

#Como executar
./script.sh

#Como criar uma funcao

function funcao1 {
date;
uptime;
uname -a;
echo "Fim da função";
}

#Como executar:
funcao1

#Outra forma de criar funcao:
funcao4 () {
uptime;
echo teste;
}

#IF ELSE
if test $var1 -gt $var5 ; then
	echo "O sistema tem mais de $var3 usuarios"
else
	echo "O sistema tem menos de $var3 usuarios"
fim

#IF ELIF ELSE

!/bin/bash
echo "Digite um número"
read numero
if [ $numero -gt 0 ];
then
    echo "Número positivo"
elif [ $numero -lt 0 ]
then
    echo "Número negativo"
elif [ $numero -eq 0 ]
then
    echo "Número é zero"
else
    echo "O valor fornecido não é um número!"
fi

#Utilizando for
for i in $(cat file.txt):
do  
    comando
done

#For em uma linha
for i  in $(cat ips.txt); do ls ; done

#while
variavel="valor"
while [ $variavel = "valor" ]; do
  comando1
  comando2
done

#utilizando array:
array=("A" "B" "ElementC" "ElementE")
echo "${array[@]}"
echo "${array[3]}"
echo "${array[2]}"

```
#     !!!!!!!!!!!!!!!!!!!!!!!!!!
#     !!!!!!!!!! FIM !!!!!!!!!!!
#     !!!!!!!!!!!!!!!!!!!!!!!!!!