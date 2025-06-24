# 🚀 Guia de Deploy - Verso Diário PWA

## 📋 Pré-requisitos

1. **Conta no GitHub** (gratuita)
2. **Conta no Netlify** (gratuita) - [netlify.com](https://netlify.com)

## 🛠️ Passo a Passo para Deploy

### 1. **Preparar o Código**

```bash
# Testar build local
npm run build

# Verificar se gerou a pasta 'dist'
ls dist/
```

### 2. **Deploy via Netlify (Método Simples)**

#### Opção A: Drag & Drop

1. Execute `npm run build`
2. Acesse [netlify.com/drop](https://app.netlify.com/drop)
3. Arraste a pasta `dist` para o site
4. ✅ **Deploy imediato!**

#### Opção B: Deploy via Git (Recomendado)

1. **Criar repositório no GitHub:**

   - Vá em [github.com/new](https://github.com/new)
   - Nome: `verso-diario-pwa`
   - Marque "Public"
   - Clique "Create repository"

2. **Subir código para GitHub:**

   ```bash
   git init
   git add .
   git commit -m "PWA Verso Diário completo"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/verso-diario-pwa.git
   git push -u origin main
   ```

3. **Conectar ao Netlify:**
   - Acesse [app.netlify.com](https://app.netlify.com)
   - Clique "New site from Git"
   - Escolha "GitHub"
   - Selecione o repositório `verso-diario-pwa`
   - Configure:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Clique "Deploy site"

### 3. **Configurar Domínio Personalizado**

```bash
# No painel do Netlify:
# 1. Site settings > Domain management
# 2. Add custom domain
# 3. Exemplo: verso-diario.netlify.app
```

### 4. **Verificar PWA**

Após deploy, teste:

- ✅ **HTTPS automático** habilitado
- ✅ **Manifest.json** acessível
- ✅ **Service Worker** registrado
- ✅ **Ícones** carregando
- ✅ **Prompt de instalação** funcionando

## 🌐 URLs de Exemplo

Após deploy, você terá:

- **Site:** `https://nome-do-site.netlify.app`
- **Manifest:** `https://nome-do-site.netlify.app/manifest.json`
- **Service Worker:** `https://nome-do-site.netlify.app/sw.js`

## 📱 Teste de Instalação

### Android

1. Abra no Chrome mobile
2. Aguarde prompt de instalação
3. Toque "Instalar"

### iOS

1. Abra no Safari
2. Compartilhar > "Adicionar à Tela de Início"

## 🔧 Troubleshooting

### Service Worker não registra:

- Verificar se está em HTTPS
- Confirmar `sw.js` na raiz do site

### Ícones não aparecem:

- Verificar paths no manifest.json
- Confirmar ícones na pasta `/icons/`

### Prompt não aparece:

- Aguardar 3 segundos
- Verificar se já não está instalado
- Usar modo anônimo para testar

## 🎉 Deploy Automático

Com a configuração criada, cada push para GitHub:

1. **Rebuilda automaticamente**
2. **Atualiza o PWA**
3. **Service Worker se auto-atualiza**
4. **Usuários recebem nova versão**

## 💡 Dicas Extras

- **Custom Domain:** Registre um domínio para URL personalizada
- **Analytics:** Adicione Google Analytics ao site
- **Performance:** Netlify otimiza automaticamente
- **SSL:** Certificado automático e renovação

**Seu PWA estará online em menos de 5 minutos!** 🚀
