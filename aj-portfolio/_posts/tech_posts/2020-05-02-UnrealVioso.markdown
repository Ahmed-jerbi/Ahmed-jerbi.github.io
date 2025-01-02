---
layout: post
title:  "Unreal VIOSO Integration"
date:   2020-06-02 22:31:34 +0200
categories: tech
thumbnail: /assets/images/UnrealVIOSO.gif
---


# Unreal - VIOSO Integration (nDisplay)

*At [VIOSO GmbH](https://vioso.com/), 2020.*
<center>
<img src="/assets/images/UnrealVIOSO2.jpg"  height="200"/>
</center>
Integrating multi-projector warp and blend calibration data into the Unreal nDisplay rendering system.

The implementation uses two methods:
-  the [VIOSO API](https://docs.vioso.com/integration/vioso-warpblend-api) as a native plugin to process calibration data and create corrected perspectives for multiple viewports and a post-processing for warping and blending.
- the standardized [VESA MPCDI format](https://vesa.org/featured-articles/vesa-completes-specifications-for-new-multiple-projector-common-data-interchange-standard-mpcdi/)
The plugin allows multi-perspective and dynamic eyepoint projections into calibrated surfaces, used notably in simulations screens, CAVEs, Immersive rooms..etc

_____________________________________________________

### About
- The integration is published and maintained directly inside the official Unreal engine releases. INo extra plugin or download is required. 
- Documentation: [Online guide](https://docs.vioso.com/integration/real-time-engines/unreal-engine)

### Tools:

+ Unreal Engine v4 , v5 , nDisplay
+ C++


<img src="/assets/images/UnrealVIOSO.gif"  height="300"/>
<img src="/assets/images/UnrealVIOSO3.jpg"  height="300"/>

You can check out this video where I demonstrate usage in a 1x Master + 3x Clients cluster:

<iframe width="450"  height="300" src="https://www.youtube.com/embed/tR2BrrZkclA" title="VIOSO Tutorial: Unreal Engine &amp; Blend" frameborder="0" allow="clipboard-write; encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
