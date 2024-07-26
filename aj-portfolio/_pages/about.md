---
layout: default
title: About
---
# About Me

Hello, my name is Ahmed Jerbi.
This blog is a collection of some of my personal and professional projects.

______________________________________________

Software Integration Engineer @VIOSO, Germany.

Industrial Software Engineering graduate @INSAT, Tunisia

Business & Marketing graduate @CCGA, USA

______________________________________________

### CONTACT

<!-- Mail -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
    <div onclick="copyToClipboard('Jerbi.Ahmed.95@gmail.com')" style="display: flex; align-items: center; cursor: pointer;">
        <img src="{{ site.baseurl }}/assets/images/IconMail.png" alt="Email" width="25" />
        <span style="margin-left: 5px;">Jerbi.Ahmed.95@gmail.com</span>
    </div>
</div>

<!-- Linkedin -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
    <a href="https://www.linkedin.com/in/jerbi-ahmed/" style="display: flex; align-items: center;">
        <img src="{{ site.baseurl }}/assets/images/IconLinkedin.png" alt="Linkedin" width="25" />
        <span style="margin-left: 5px;"> Linkedin.com/in/jerbi-ahmed</span>
    </a>
</div>

<!-- GITHUB -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
    <a href="https://github.com/Ahmed-jerbi" style="display: flex; align-items: center;">
        <img src="{{ site.baseurl }}/assets/images/IconGithub.png" alt="Github" width="25" />
        <span style="margin-left: 5px;"> Github.com/Ahmed-jerbi</span>
    </a>
</div>

<!-- JS: Copy mail -->
<script>
function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Email address copied to clipboard');
}
</script>