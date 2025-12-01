

<div align="center">
  <img width="471" height="134" alt="Captura de tela de 2025-11-30 21-33-36" src="https://github.com/user-attachments/assets/29b9af64-a8af-4623-b604-e6095a399c9f" />
</div>

# Void-2FA Terminal

<div align="center">
    <img src="https://github.com/user-attachments/assets/7bead31d-7f91-4ff8-8cce-dbb13a1f51ae" width="500px" align="center"/>
</div>


## 📖 Descrição

Um **gerenciador de códigos 2FA (HOTP/TOTP) direto do terminal**, rápido e leve.

---

## 🚀 Instalação

### Pelo NPM
```bash
npm install -g void2fa-terminal && void2fa --version
# Deve mostra 1.1.1
```

---

## 🧰 Comandos disponíveis

### 🔐 Pegar o codigo

Gera o código TOTP/HOTP de uma conta e copia copia para seu Ctrl+V.

Uso básico:

```bash
void2fa code [opções] <id_ou_nome> # Copiar código TOTP/HOTP para seu Ctrl+V.
```

Exemplos:

```bash
void2fa code 323e2825-5b92-4bc9-8d3c-57ba2a2a7774
# Gera o código TOTP/HOTP da conta e copia para seu Ctrl+V (usando ID)

void2fa code diegoarauj0
# Gera o código TOTP/HOTP da conta (usando nome)
```

Opções:

- ```--next -n``` → Espera o próximo ciclo TOTP antes de gerar o código

- ```--auto -a``` → Gera código HOTP e incrementa o contador automaticamente

### 🗑️ Deletar a conta

Exclui uma conta salva.

Uso básico:

```bash
void2fa delete <id_ou_nome> # Deletar uma conta salva.
```

Exemplos:

```bash
void2fa delete 323e2825-5b92-4bc9-8d3c-57ba2a2a7774
# Exclui pelo ID

void2fa delete diegoarauj0
# Exclui pelo nome
```

### ✏️ Editar a conta

Edita uma conta salva.
⚠️ O único campo que NÃO pode ser alterado é o tipo (TOTP/HOTP).

Uso básico:

```bash
void2fa edit [opções] <id_ou_nome> # Editar conta salva.
```

Exemplos:

```bash
void2fa edit -n negativo diegoarauj0
# Altera o nome da conta

void2fa edit -i Gitlab diegoarauj0
# Altera o issuer

void2fa edit -i Gitlab -n negativo 323e2825-5b92-4bc9-8d3c-57ba2a2a7774
# Altera issuer e nome ao mesmo tempo
```

Opções:

- ```--name -n``` → Alterar o nome (João, vitor, joão@email.com, @joão_123)

- ```--issuer -i``` → Alterar o emissor (GitHub, Google, Facebook...)

- ```--secret -s``` → Alterar o segredo

- ```--algorithm -a``` → Alterar o algoritimo (sha1, sha256, sha512)

- ```--encoding -e``` → Alteraro codificador (ascii, hex, base32, base64)

- ```--period -p``` → Alterando o periodo 

- ```--digits -d``` → Alterarndo o digitos

- ```--counter -c``` → Alterando o contador

### 🔍 Encontrar uma conta

Exibe informações detalhadas sobre uma conta.

Uso basico:

```bash
void2fa find [opções] <id_ou_nome> # Show detailed information about a specific account.
```

Exemplos:

```bash
void2fa find 323e2825-5b92-4bc9-8d3c-57ba2a2a7774
# Busca pelo ID

void2fa find diegoarauj0
# Busca pelo nome

void2fa find --secret <id>
# Mostra a conta + o segredo (use com cautela)
```

Opções:

- ```--secret -s``` → Exibir detalhes da conta, incluindo a chave secreta (use com cautela).

### 📜 Mostrar todas as contas salva

Lista todas as contas salvas.

Uso basico:

```bash
void2fa find-all [opções] # Mostra todas as contas
```

Exemplos:

```bash
void2fa find-all
# Lista todas as contas

void2fa find-all --secret
# Lista cada conta e EXIBE o segredo + código
```

### ➕ Criar uma nova conta

Cria uma nova conta TOTP ou HOTP.

```void2fa create [opções] <name> <issuer> <secret>```

Exemplos:

```bash
void2fa create @diegoarauj0 Github MRUWKZ3PMFZGC5LKGAQCAIBA
# Cria conta TOTP com configurações padrão

void2fa create --period 30 --type TOTP Github diegoarauj0 MRUWKZ3PMFZGC5LKGAQCAIBA
# Cria conta TOTP com período customizado e tipo definido
```

Opções:

- ```--secret -s``` → Exibir todos os segredos de todas as contas salvas (use com cautela).
