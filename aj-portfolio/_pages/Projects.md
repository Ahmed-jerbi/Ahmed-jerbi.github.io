---
layout: default
title: Portfolio
---

  <div class="post-grid">
    {% for post in site.posts %}
      <div class="post-box">
        <a href="{{ post.url }}">
          <img src="{{ post.thumbnail }}" alt="{{ post.title }}">
          <div class="post-title">{{ post.title }}</div>
        </a>
      </div>
    {% endfor %}
  </div>
