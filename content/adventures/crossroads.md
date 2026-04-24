---
id: crossroads
title: The Crossroads
scenes:
  - id: start
    text: You stand at a crossroads. The forest path winds to the north, and a cobblestone road leads east toward the distant city lights.
    choices:
      - text: Head into the forest
        nextScene: forest
      - text: Follow the road to the city
        nextScene: city_gates

  - id: forest
    text: The trees close in around you. It's quiet — too quiet. A rustle in the undergrowth catches your attention.
    choices:
      - text: Investigate the sound
        nextScene: forest_creature
      - text: Ignore it and press on
        nextScene: forest_deep

  - id: city_gates
    text: The city gates loom ahead, torches flickering in the evening breeze. A guard eyes you suspiciously.
    choices:
      - text: State your business honestly
        nextScene: city_enter
      - text: Try to slip past unnoticed
        nextScene: city_caught
---

# The Crossroads

An introductory adventure set at a fork in the road. The player chooses between the wilderness and the city.
