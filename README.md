# Frontend Project

Proyek frontend ini dibangun menggunakan React, TypeScript, dan Vite dengan berbagai fitur modern dan dependensi yang powerful.

## 🔗 Demo & Kredensial

Demo: [https://react-cart-simple.vercel.app/](https://react-cart-simple.vercel.app/)

Kredensial Login:
- Email: john@example.com
- Password: password123

## 🚀 Teknologi Utama

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- Zustand
- Ant Design
- Material-UI
- React Router DOM
- Axios

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- Node.js (versi terbaru)
- Yarn (versi 1.22.22 atau lebih tinggi)

## 🛠️ Instalasi

1. Clone repositori ini
```bash
git clone [url-repositori]
```

2. Masuk ke direktori proyek
```bash
cd frontend
```

3. Install dependensi
```bash
yarn install
```

## 🚦 Menjalankan Aplikasi

### Mode Development
```bash
yarn dev
```

### Build untuk Production
```bash
yarn build
```

### Preview Build
```bash
yarn preview
```

### Menjalankan Linter
```bash
yarn lint
```

## 🏗️ Struktur Proyek

```
frontend/
├── src/            # Kode sumber aplikasi
├── public/         # Aset statis
├── node_modules/   # Dependensi
└── ...konfigurasi
```

## 🔧 Konfigurasi

Proyek ini menggunakan beberapa file konfigurasi penting:

- `vite.config.ts` - Konfigurasi Vite
- `tsconfig.json` - Konfigurasi TypeScript
- `tailwind.config.js` - Konfigurasi Tailwind CSS
- `postcss.config.js` - Konfigurasi PostCSS
- `eslint.config.js` - Konfigurasi ESLint

## 📚 Fitur Utama

- ⚡️ Vite sebagai build tool yang super cepat
- 🎨 Styling dengan Tailwind CSS
- 📱 Komponen UI dari Ant Design dan Material-UI
- 🔄 State management dengan Redux Toolkit dan Zustand
- 🛣️ Routing dengan React Router DOM
- 🌐 HTTP Client dengan Axios
- 📝 Type safety dengan TypeScript
- 🧹 Linting dengan ESLint

## 📝 Catatan Pengembangan

- Proyek menggunakan TypeScript untuk type safety
- Menggunakan Yarn sebagai package manager
- Mendukung hot module replacement (HMR)
- Konfigurasi ESLint untuk menjaga kualitas kode

## 🤝 Kontribusi

Silakan berkontribusi dengan membuat pull request atau melaporkan issues.

## 📄 Lisensi

[Sesuaikan dengan lisensi proyek Anda]

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
