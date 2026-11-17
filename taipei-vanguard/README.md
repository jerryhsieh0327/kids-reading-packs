# Taipei Vanguard: Skyline Alert — Playable Web Campaign V1

A self-contained, English-language single-player browser FPS designed for landscape iPad Safari. All twelve missions and eight specified Taipei map themes are included. No sign-in, ads, network API, third-party JS library, or purchase system.

## Run and publish

- **GitHub Pages:** Upload the *contents* of this directory to the root of a GitHub repository, then enable Pages from the main branch root. Open the resulting HTTPS URL in iPad Safari. All asset references are relative.
- **Add to Home Screen:** In iPad Safari use Share → Add to Home Screen. The supplied manifest and icons provide an app-like launch experience. The game loads without network calls after static files are available; it does not currently include an offline service-worker cache, so an initial network connection and cached files may be required for later launches.
- **Other static hosting:** Upload the entire folder unchanged to any static web host.
- Opening `index.html` directly may work on some desktop browsers, but Safari's local-file rules vary. Static hosting is the supported method.

## Gameplay

Use the left touch pad to walk forward/back and to turn your view left/right (turning, not sidestepping). Hold RUN to sprint, tap JUMP to leap over low cover, and hold HIDE next to a low wall to take cover and reduce incoming fire. Drag in the right-side view area to look around; tap FIRE to shoot. When you are next to a rescue target or device, INTERACT completes that objective. Aim, Reload, Switch, Shield, Drone and Arc Key are visible in the HUD. When an objective is near, an INTERACT button appears. Rescue targets and disable consoles are marked on the mini-map. Escort personnel follow when nearby. Enemies deal non-graphic damage, never blood effects. Completing a mission unlocks the next and saves stars in browser localStorage.

Desktop testing: W/S or Up/Down walk forward and back; A/D or Left/Right turn the view (no sidestep strafe). Shift to run, V or J to jump, C or Ctrl to hide/take cover. Space to shoot, R to reload, F interact, Q shield, E drone, 1/2 weapons, Esc to pause.

## Included campaign (latest approved mapping)

| # | Mission | Location | Difficulty |
|---|---|---|---|
| 01 | Tower Lobby Sweep | Taipei 101 | Casual |
| 02 | Express Lift Rescue | Taipei 101 | Tight |
| 03 | Memorial Hall Approach | National Chiang Kai-shek Memorial Hall | Casual |
| 04 | Honor Gate Escort | Liberty Square | Tight |
| 05 | Temple Courtyard Watch | Mengjia Longshan Temple | Casual |
| 06 | Palace Archive Lockdown | National Palace Museum | Tight |
| 07 | Liberty Route Clear | Liberty Square | Casual |
| 08 | Dome Concourse Push | Taipei Dome | Tight |
| 09 | Night Lantern Rescue | Raohe Street Night Market | Casual |
| 10 | Market Exit Escort | Raohe Street Night Market | Tight |
| 11 | Mountain Signal Break | Yangmingshan | Casual |
| 12 | Skyline Final Stand | Taipei 101 | Tight |

## Implementation notes and limitations

- This is an **independently playable 2.5D canvas ray-cast FPS**, not a WebGL/Unity-quality true 3D production. Distinct landmark facades are procedurally painted and supplemented by small thumbnail crops from the *two user-provided approved art samples*. The image references represent stylistic concepts, not fully modeled authentic landmark interiors.
- Dynamic hostile units that run, patrol, and chase; shooting, hits, armor, aiming, collision, mission objectives, rescues, escorts, timed device interactions, defense waves, HUD, recognizable Taipei landmark backdrops and facade textures, touch controls, generated Web Audio effects and save progress are included.
- The story, dialogue and mission labels are English. No external resources are loaded by the code.
- Combat rules and mission flows are implemented at an arcade level; advanced NPC pathfinding, detailed environmental art, story cutscenes, professional animation, fully voiced dialogue, and detailed building geometry are not yet available.
- Audio begins only after a user action when permitted by browser autoplay policies.
- This build has been checked in a Chromium browser for opening every mission, starting play, and pausing. A live iPad Safari device QA pass has **not** been performed.

## Files

- `index.html` — main entry point and interactive screens
- `style.css` — UI, touch layouts, responsive styles
- `game.js` — renderer, simulation, all 12 missions, input, audio, saves
- `manifest.webmanifest` — web-app manifest
- `assets/icon.svg`, `assets/icon-180.png`, `assets/icon-512.png` — original app icons
- `assets/approved-fps.png`, `assets/approved-briefing.png` — provided approved reference artwork (also used on menu)
- `assets/landmark-1.png` … `assets/landmark-8.png` — eight thumbnail crops from the approved briefing artwork
- `assets/place-1.png` … `assets/place-8.png` — fallback landmark plates if a scene plate is missing
- `assets/scene-1.png` … `assets/scene-8.png` — official ChatGPT first-person environment plates for the eight Taipei landmarks (used as in-game backdrops)
- `assets/veil-guard.png`, `assets/veil-bot.png` — character cutouts from the approved FPS artwork

All files remain local to this package. Copyrights for user-supplied imagery remain with their respective owners.

## Local preview (this box / a computer)

From this directory, serve the files over HTTP and open `index.html` in a desktop browser window rotated or sized like landscape iPad, for example:

    python3 -m http.server 8765

then visit `http://127.0.0.1:8765/`. Opening the file path directly can work in some browsers, but a static server is more reliable.

Publish only as the `taipei-vanguard/` folder on the existing GitHub Pages site. Do not overwrite 風信谷, 胡蘿蔔園, or 潮燈塔.

## Known variances

- Mission locations and difficulties were aligned to the approved English copy: Honor Gate Escort is at Liberty Square; Skyline Final Stand is at Taipei 101; Night Lantern Rescue is Casual; Market Exit Escort is Tight. Memorial Hall and Liberty Square remain two separate maps. No Taichung or Kaohsiung levels are included.
- Visuals are a stylized 2.5D ray-cast renderer using landmark thumbnails and the approved sample art, not a fully modeled cartoon-3D scene matching the sample finish.
- Sound is synthesized with Web Audio; there are no separate audio files.
