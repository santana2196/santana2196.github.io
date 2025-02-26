const new_set = new Set();

    new_set.add("<a href='#!' id='Hacks_shell' class='category'>Hacks_shell</a>")

    new_set.add("<a href='#!' id='Shell' class='category'>Shell</a>")

    new_set.add("<a href='#!' id='Kubernets' class='category'>Kubernets</a>")

    new_set.add("<a href='#!' id='Kubernets' class='category'>Kubernets</a>")

    new_set.add("<a href='#!' id='Kubernets' class='category'>Kubernets</a>")

    new_set.add("<a href='#!' id='Vagrant' class='category'>Vagrant</a>")

    new_set.add("<a href='#!' id='Shell' class='category'>Shell</a>")

    new_set.add("<a href='#!' id='Alexa' class='category'>Alexa</a>")

    new_set.add("<a href='#!' id='TriggerCMD' class='category'>TriggerCMD</a>")

    new_set.add("<a href='#!' id='Raspberry' class='category'>Raspberry</a>")

    new_set.add("<a href='#!' id='Rabbitmq' class='category'>Rabbitmq</a>")

    new_set.add("<a href='#!' id='Python' class='category'>Python</a>")

    new_set.add("<a href='#!' id='Docker' class='category'>Docker</a>")

    new_set.add("<a href='#!' id='Flask' class='category'>Flask</a>")

    new_set.add("<a href='#!' id='Python' class='category'>Python</a>")

    new_set.add("<a href='#!' id='Firestore' class='category'>Firestore</a>")


tags = "";
for (const array_set of new_set){
tags += array_set;
}
document.getElementById("newinner").innerHTML = tags
