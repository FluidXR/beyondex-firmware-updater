# Beyondex Firmware Updater (WebUSB)

This is a tiny static site (no build step) that:

- Lets users click **Connect device** → **Enter Update Mode**
- Sends a single WebUSB vendor control request to reboot the RP2040 into **BOOTSEL**
- Provides a **Download latest firmware (.uf2)** link to the latest GitHub Release asset

## Browser support

- Supported: **Chrome / Edge** (desktop)
- Not supported: Safari / Firefox (no WebUSB)

## Firmware compatibility

This page assumes the device firmware implements a vendor control request:

- **VID**: `0xCAFE`
- **bmRequestType**: vendor-to-device
- **bRequest**: `0x42`
- **wValue**: `0xB007`

If you change these in firmware, update them in `index.html`.

## Vercel deployment

Deploy this repo to Vercel as a static site.

- Framework preset: **Other**
- Build command: *(none)*
- Output directory: *(root)*

`vercel.json` sets:

- `Permissions-Policy: usb=(self)`

## Run locally (Node)

WebUSB requires a secure context, and Chromium treats `http://localhost` as secure.

```bash
cd <install_dir>/beyondex-webusb-updater
npm run dev
```

Then open `http://localhost:8000` in Chrome/Edge.

## Latest firmware download link

In `index.html`, update `LATEST_FIRMWARE_URL` if:

- the GitHub org/repo changes, or
- the UF2 asset filename changes


