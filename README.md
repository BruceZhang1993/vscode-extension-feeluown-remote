# FeelUOwn Remote VSCode Extension

[![Language](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](http://www.gnu.org/licenses/lgpl-3.0)
[![Build Status](https://travis-ci.org/BruceZhang1993/vscode-extension-feeluown-remote.svg?branch=master)](https://travis-ci.org/BruceZhang1993/vscode-extension-feeluown-remote)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3f9afb0ef47b4349a778f01a51eb8ec2)](https://www.codacy.com/app/BruceZhang1993/vscode-extension-feeluown-remote?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=BruceZhang1993/vscode-extension-feeluown-remote&amp;utm_campaign=Badge_Grade)
[![GitHub Release](https://img.shields.io/github/release/BruceZhang1993/vscode-extension-feeluown-remote.svg?label=Release)](https://github.com/BruceZhang1993/vscode-extension-feeluown-remote/releases)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/brucezhang1993.feeluown-remote.svg?label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=brucezhang1993.feeluown-remote)

FeelUOwn player remote control extension for Visual Studio Code.

## Features

- [x]  Show current playing track (title, artists, duration, position, lyrics)
- [x]  Media control (play/pause, prev, next)
- [x]  Configurations (showLyrics, showController, intervalSeconds ...)
- [x]  Current playlist
- [x]  My playlists (Collections)
- [ ]  Play all tracks in playlist
- [ ]  List tracks in playlist
- [ ]  More

## Requirements

You need a running FeelUOwn instance or fuo server.

[FeelUOwn](https://github.com/cosven/FeelUOwn)

## Extension Commands

- `feeluown.start`: Start
- `feeluown.toggle`: Toggle
- `feeluown.prev`: Prev track
- `feeluown.next`: Next track
- `feeluown.playTrack`: Play track
- `feeluown.refreshCurrentPlaying`: Refresh current playing tree view
- `feeluown.refreshPlaylist`: Refresh my playlists tree view
- `feeluown.playall`: Play all tracks in playlist (WIP)

## Extension Settings

- `feeluown.setShowLyrics`: (boolean) Show lyrics on statusbar.
- `feeluown.setStatusInterval`: (integer) Interval ms to watch current playing state.
- `feeluown.setShowController`: (boolean) Show controller on statusbar.

## Known Issues

No known issues now.

## Release Notes

No release for now.

----------------------------------------------------------------------------------------------
