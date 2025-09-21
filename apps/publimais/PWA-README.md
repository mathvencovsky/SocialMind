# PubliMais - Progressive Web App (PWA) 📱

Este projeto foi configurado como uma Progressive Web App completa, permitindo instalação em dispositivos móveis e desktop, funcionamento offline e empacotamento para lojas de aplicativos.

## 🚀 Funcionalidades PWA

- ✅ **Instalação nativa**: Instale como app no celular/desktop
- ✅ **Funcionamento offline**: Cache inteligente de páginas principais
- ✅ **Atualizações automáticas**: Service Worker com controle de versão
- ✅ **Design responsivo**: Interface otimizada para mobile
- ✅ **Ícones nativos**: Suporte completo a ícones PWA

## 📱 Como Instalar o App

### Android
1. Abra https://publimais.lovable.app no Chrome
2. Toque no banner "Instalar PubliMais" que aparece
3. Ou vá em Menu ⋮ > "Instalar app"
4. Confirme a instalação
5. O app aparecerá na tela inicial

### iPhone/iPad
1. Abra https://publimais.lovable.app no Safari
2. Toque no botão de compartilhar 📤
3. Selecione "Adicionar à Tela de Início"
4. Confirme o nome "PubliMais"
5. Toque em "Adicionar"

### Desktop (Chrome/Edge)
1. Visite https://publimais.lovable.app
2. Clique no ícone de instalação na barra de endereços
3. Ou vá em Menu > "Instalar PubliMais..."
4. Confirme a instalação

## 📦 Gerar APK/IPA com PWABuilder

### Passo 1: Preparar o PWA
Certifique-se de que o site está funcionando em:
- **URL**: https://publimais.lovable.app
- **HTTPS**: Obrigatório para PWA
- **Service Worker**: Ativo e funcionando
- **Manifest.json**: Configurado corretamente

### Passo 2: Usar o PWABuilder
1. Acesse [PWABuilder.com](https://www.pwabuilder.com/)
2. Insira a URL: `https://publimais.lovable.app`
3. Clique em "Start" para analisar o PWA
4. Aguarde a análise de compatibilidade

### Passo 3: Gerar Pacotes

#### Para Android (APK)
1. Na seção "Android", clique em "Download"
2. Escolha o tipo de pacote:
   - **TWA (Trusted Web Activity)**: Recomendado
   - **PWA**: Para maior controle
3. Configure:
   - **Package ID**: `app.publimais.pwa`
   - **App Name**: `PubliMais`
   - **Version**: `1.0.0`
4. Baixe o arquivo `.aab` ou `.apk`

#### Para iOS (IPA)
1. Na seção "iOS", clique em "Download"
2. Baixe o projeto Xcode
3. Abra no macOS com Xcode
4. Configure certificados de desenvolvedor
5. Build e archive para criar o `.ipa`

## 🏪 Publicar nas Lojas

### Google Play Store (Android)
1. **Conta Desenvolvedor**: [play.google.com/console](https://play.google.com/console)
   - Taxa única: $25 USD
2. **Upload do App**:
   - Use o arquivo `.aab` gerado
   - Preencha informações da loja
   - Adicione capturas de tela
3. **Teste Interno**: Configure teste com usuários limitados
4. **Revisão**: Google analisa em 1-3 dias
5. **Publicação**: App fica disponível na Play Store

### Apple App Store (iOS)
1. **Apple Developer Program**: [developer.apple.com](https://developer.apple.com)
   - Taxa anual: $99 USD
2. **App Store Connect**: [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
3. **Upload via Xcode**:
   - Use o projeto iOS gerado
   - Archive e upload
4. **App Review**: Apple analisa em 1-7 dias
5. **Publicação**: App fica disponível na App Store

## 🔧 Desenvolvimento Local

### Testar PWA Localmente
```bash
# Build de produção
npm run build

# Servir com HTTPS (necessário para PWA)
npx serve dist -s --ssl-cert cert.pem --ssl-key key.pem

# Ou usar um proxy HTTPS
npx local-ssl-proxy --source 8080 --target 5000
```

### Testar Service Worker
1. Abra DevTools (F12)
2. Vá para "Application" > "Service Workers"
3. Verifique se está registrado e ativo
4. Teste offline em "Network" > "Offline"

### Testar Instalação
1. DevTools > "Application" > "Manifest"
2. Clique em "Add to homescreen"
3. Teste o banner de instalação

## 📊 Métricas e Análise

### Lighthouse PWA Score
Execute no DevTools > Lighthouse > PWA para verificar:
- ✅ Fast and reliable
- ✅ Installable  
- ✅ PWA Optimized

### Service Worker Stats
Monitore no DevTools > Application:
- Cache usage
- Network requests
- Offline functionality

## 🔄 Atualizações

### Atualizar Service Worker
1. Modifique `CACHE_NAME` em `service-worker.js`
2. Redeploy do site
3. Usuários receberão atualização automática

### Versioning Strategy
- **CACHE_NAME**: `publimais-cache-v2` (incremental)
- **Manifest version**: Atualizar quando necessário
- **Icons**: Manter compatibilidade

## 🐛 Troubleshooting

### PWA não instala
- Verifique HTTPS
- Confirme manifest.json válido
- Service Worker registrado
- Ícones 192x192 e 512x512 presentes

### Offline não funciona
- Verifique cache do Service Worker
- URLs em `urlsToCache` corretas
- Estratégia de cache adequada

### PWABuilder erro
- Teste URL manualmente
- Verifique console do navegador
- Manifest.json acessível
- Service Worker ativo

## 📞 Suporte

Para problemas específicos:
1. **PWA Issues**: Verifique DevTools > Console
2. **PWABuilder**: [Documentação oficial](https://docs.pwabuilder.com/)
3. **App Stores**: Guidelines oficiais de cada plataforma

---

**Status**: ✅ PWA Completo e Funcional
**Testado**: Android, iOS, Desktop
**Pronto para**: Publicação nas lojas