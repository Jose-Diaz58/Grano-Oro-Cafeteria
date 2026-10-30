# Grano de Oro Café

Menú para clientes y panel de administración (React + Vite + Tailwind).

## Uso

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

La URL del API sale de `VITE_API_URL` (por defecto `http://localhost:4000/api`). Todas las peticiones están en `src/config/api.js`.

- Cliente: `/`
- Admin: `/admin` (pedidos, catálogo, categorías, extras, configuración)

## Estructura

```
src/
├── assets/            Logotipos
├── components/        UI compartida (ui/: Modal, Toggle, Skeletons) y ClosedNotice
├── config/            api.js y constants.js
├── context/           AuthContext
├── features/
│   ├── admin/         components/, hooks/, pages/
│   └── customer/      components/, modals/, hooks/, pages/
├── store/             cartStore (Zustand)
└── utils/             alerta, avisoPedidos, imagen, tienda
```
