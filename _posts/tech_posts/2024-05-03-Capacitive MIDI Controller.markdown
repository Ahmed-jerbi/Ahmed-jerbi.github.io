---
layout: post
title:  "Capacitive MIDI Controller"
date:   2017-05-02 22:31:34 +0200
categories: tech music
thumbnail: /assets/images/MIDI.jpg
---
# DIY Midi Controller with Capacitive Touch

& VST development of a Drum Machine.

_____________________________________________________

Tap on the fruit to transmit MIDI messages to the DAW and generate sounds.

This prototype uses ADCtouch Library, Most capacitive touch libraries require two pins and a large resistor to acquire precise readings. This library makes use of the AVRs internal wiring to get decent resolution with just a single pin, therefore WITHOUT external hardware.


Arduino MIDI -> Drum Machine: 

Building a patch with MAX/MSP for Ableton Live (See data-flow on below)

### Tools:

+ ADCtouch : <https://github.com/martin2250/ADCTouch>
+ Midi: <https://github.com/FortySevenEffects/arduino_midi_library>
+ LoopMidi: Virtual Midi Device
+ HairlessMidi: USB -> MIDI
+ Arduino Uno, C++ IDE, MaxMSP, Ableton Live

<img src="/assets/images/midi.jpg"  height="350"/>
<img src="/assets/images/midimax.jpg"  height="350"/>
<img src="/assets/images/midi2.jpg"  height="350"/>
<iframe height="350" src="https://www.youtube.com/embed/2sLoyPQnk64" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>