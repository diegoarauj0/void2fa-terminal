

<div align="center">
 <img width="100" height="100" alt="bot" src="https://github.com/user-attachments/assets/9bc91f2b-eb4b-4d81-9df7-9f5e7b3f3173" />
 <h1><b>Void-2FA Terminal</b></h1>
</div>


## 📖 Descrição

Um **gerenciador de códigos 2FA (HOTP/TOTP) direto do terminal**, rápido e leve.

---

## 🚀 Instalação

### Pelo NPM
```bash
npm install -g void2fa-terminal && void-2fa
```

---

## 🧰 Comandos disponíveis

| Comando                              | Descrição                                                 |
| ------------------------------------ | ----------------------------------------------------------|
| `register <nome> <issuer> <secreto>` | Adiciona uma nova conta 2FA                               |
| `delete <id>`                        | Remove uma conta pelo ID                                  |
| `find <id>`                          | Mostra informações de uma conta específica                |
| `find-all`                           | Lista todas as contas salvas                              |
| `edit <id>`                          | Editar os valores da conta pelo ID                        |
| `code <id>`                          | Mostra o código atual                                     |

