---
layout: default
title: Ahmed Jerbi
paginate: false
---
  <div class="post-grid">
            {% for post in site.posts %}
            <div class="post-box">
                <a href="{{ post.url | relative_url }}">
                  <img src="{{ post.thumbnail }}" alt="{{ post.title }}">
                  <div class="post-title">{{ post.title }}</div>
                  <div class="post-date">{{ post.date | date: "%B %d, %Y" }} </div>
                </a>
            </div>
            {% endfor %}
  </div>
