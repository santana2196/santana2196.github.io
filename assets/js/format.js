---
---

const new_set = new Set();
{% for post in site.posts %}{% for tag in post.categories %}
    new_set.add("<a href='#!' id='{{tag}}' class='category'>{{tag}}</a>")
{% endfor %}{% endfor %}

tags = "";
for (const array_set of new_set){
tags += array_set;
}
document.getElementById("newinner").innerHTML = tags
