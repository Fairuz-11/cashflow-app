# PWA Setup Guide

## ✅ Yang Sudah Dikonfigurasi

1. **Manifest.json** - Konfigurasi PWA di `/public/manifest.json`
2. **Service Worker** - Offline support di `/public/sw.js`
3. **Meta tags** - PWA metadata di `app/layout.tsx`
4. **Icons** - Template SVG di `/public/icon.svg`

## 📱 Cara Install di HP

### Android (Chrome/Edge)
1. Buka website di Chrome
2. Klik menu (3 titik) → "Add to Home screen"
3. App akan muncul di launcher seperti native app

### iOS (Safari)
1. Buka website di Safari
2. Klik tombol Share → "Add to Home Screen"
3. App akan muncul di home screen

## 🎨 Generate Icon PNG (PENTING!)

File `icon-192.png` dan `icon-512.png` sekarang masih placeholder. Cara generate:

### Option 1: Online Tool
1. Buka https://realfavicongenerator.net/
2. Upload file `/public/icon.svg`
3. Download hasil PNG 192x192 dan 512x512
4. Replace file di `/public/`

### Option 2: Menggunakan Design Tool
1. Buka Figma/Canva/Photoshop
2. Import `/public/icon.svg`
3. Export sebagai PNG dengan ukuran:
   - `icon-192.png` → 192x192px
   - `icon-512.png` → 512x512px

### Option 3: Command Line (ImageMagick)
```bash
# Jika punya ImageMagick installed
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png
```

## 🧪 Test PWA

### Chrome DevTools
1. Buka DevTools (F12)
2. Tab "Application" → "Manifest"
3. Cek semua field terisi dengan benar
4. Tab "Service Workers" → pastikan SW registered

### Lighthouse Audit
1. DevTools → Tab "Lighthouse"
2. Pilih "Progressive Web App"
3. Run audit → score harus >80

## 🚀 Deploy Production

PWA akan otomatis aktif setelah:
1. Generate icon PNG yang proper
2. Deploy ke HTTPS domain (required untuk PWA)
3. User bisa install app di HP

## 📋 Checklist

- [x] manifest.json configured
- [x] Service worker created
- [x] Meta tags added
- [ ] Generate proper PNG icons (192x192 & 512x512)
- [ ] Test install on real device
- [ ] Deploy to HTTPS domain

## 🔗 Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Manifest Generator](https://www.simicart.com/manifest-generator.html/)
- [Icon Generator](https://realfavicongenerator.net/)
