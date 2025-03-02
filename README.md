# Neatflix IINA Plugin

A plugin for IINA that enables integration with the Neatflix Tauri media library app. This plugin allows Neatflix to track playback progress and control IINA playback.

## Features

- Launches IINA to play local files or HTTP streams with specific parameters (e.g., starting timestamp)
- Reports playback progress back to the Neatflix app
- Sends player status updates (play, pause, stop) to enable resume functionality

## Installation

### Manual Installation

1. Download the latest release from the GitHub repository
2. Open the `.iinaplgz` file with IINA to install the plugin
3. Restart IINA

### Development Installation

1. Clone this repository
2. Create a symlink to IINA's plugin folder:
   ```bash
   ln -s /path/to/neatflix-iina-plugin ~/Library/Application\ Support/com.colliderli.iina/plugins/neatflix-iina-plugin.iinaplugin-dev
   ```
3. Restart IINA

## Usage

### From Neatflix App

The Neatflix app will automatically launch IINA with the correct parameters when you play a video. The plugin will report playback progress back to the Neatflix app.

### Command Line Usage

You can also launch IINA with the plugin from the command line:

```bash
/Applications/IINA.app/Contents/MacOS/iina-cli /path/to/video.mp4 -- --start=120
```

To include a media ID for tracking:

```bash
/Applications/IINA.app/Contents/MacOS/iina-cli "http://example.com/video.mp4?mediaId=movie-1234" -- --start=120
```

## Configuration

The plugin communicates with the Neatflix app via HTTP. By default, it connects to `http://127.0.0.1:8080`. If you need to change this, edit the `config.js` file.

## License

See the LICENSE file for details.