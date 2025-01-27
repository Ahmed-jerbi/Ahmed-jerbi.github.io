---
layout: default
title: About
---
# About Me

Hello, I'm Ahmed Jerbi!
This is a space where I share the stuff I’ve done, whether it’s work-related, fun personal projects, or just somethings I’m excited about. 

______________________________________________

### Current Role
- **Software Engineer @VIOSO, Germany.**\
I help build tech solutions for the world's leader in computer vision for projection mapping. Working on projects around the globe and creating visual systems for media, audiovisual and simulation clients.

### Education
- The hard part: **Industrial Software Engineering graduate @INSAT, Tunisia**

- The fun part: **Business & Marketing graduate @CCGA, USA** \
    Awarded the Thomas Jefferson Scholarship to study in the United States and achieved a double major in Business and Engineering.

______________________________________________

### Let's Connect

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