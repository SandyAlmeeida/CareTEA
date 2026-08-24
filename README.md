# CareTEA Login em React 

Esta versão foi convertida para React com Vite.

## Como executar

Abra o terminal dentro desta pasta e rode:

```bash
npm install
npm run dev
```

Depois abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

## Estrutura principal

```text
src/
├── assets/
│   ├── familia-caretea.png
│   └── logo-caretea.png
├── pages/
│   └── Login/
│       ├── Login.jsx
│       └── Login.css
├── App.jsx
├── index.css
└── main.jsx
```

## Para colocar em outro projeto React

Copie:

- `src/pages/Login`
- `src/assets/logo-caretea.png`
- `src/assets/familia-caretea.png`

Depois importe a página no seu `App.jsx`:

```jsx
import Login from "./pages/Login/Login.jsx";

function App() {
  return <Login />;
}
```

O componente aceita estas funções opcionais:

```jsx
<Login
  onLogin={(dados) => console.log(dados)}
  onForgotPassword={() => console.log("Recuperar senha")}
  onGoogleLogin={() => console.log("Google")}
  onRegister={() => console.log("Cadastro")}
/>
```

O login ainda não está conectado ao backend. O ponto de conexão já está preparado na função `handleLogin` do arquivo `src/App.jsx`.
