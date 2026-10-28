# Donna Luiza — site institucional

Landing page responsiva para o Restaurante & Pizzaria Donna Luiza, com identidade praiana em verde-mar, areia e laranja, navegação mobile, cardápio filtrável, carrossel horizontal, formulário de reserva que monta a mensagem do WhatsApp, contato, localização, newsletter encaminhada ao WhatsApp e efeitos suaves de entrada.

## Rodar no Termux

O projeto não usa dependências de npm. Basta ter Node.js instalado.

```bash
cd ~/donna-luiza-site
npm start
```

Abra no navegador do próprio telefone:

```text
http://127.0.0.1:4000
```

Para parar o servidor, use `Ctrl + C` no Termux. O servidor escuta em `0.0.0.0:4000`, então também pode receber conexões da rede local quando o firewall/rede permitir.

## Instalação inicial no Termux

Depois de baixar `donna-luiza-site.zip` para a pasta Downloads do telefone:

```bash
pkg install nodejs unzip -y
termux-setup-storage
unzip /sdcard/Download/donna-luiza-site.zip -d ~
cd ~/donna-luiza-site
npm start
```

Se o sistema salvar o arquivo com outro nome, ajuste somente o caminho do ZIP no comando `unzip`.

## Arquivos principais

- `server.js` — servidor HTTP local na porta 4000, sem Express e sem instalação de pacotes.
- `public/index.html` — estrutura, textos e seções da página.
- `public/styles.css` — identidade visual, responsividade e animações.
- `public/app.js` — renderização e filtros do cardápio, navegação mobile, imagens alternativas e formulários para WhatsApp.
- `public/assets/` — logo provisória, favicon e instruções para inserir as fotos oficiais.

## Fotos e informações

As fotos originais e o arquivo de logo não vieram anexados nesta sessão. Para evitar deixar a página vazia, as imagens estão configuradas para usar fotografias de demonstração hospedadas online quando os arquivos locais ainda não existem. Ao adicionar os arquivos com os nomes listados em `public/assets/README.md`, as fotos locais são utilizadas primeiro.

Os preços não foram inventados: os cards exibem “Valor pelo WhatsApp”. A disponibilidade e o valor real devem ser confirmados com o restaurante. A marca gráfica em SVG é provisória, inspirada apenas na descrição da logo, e não substitui a logo oficial.

O formulário de reserva não confirma automaticamente uma mesa; ele abre o WhatsApp com data, horário e quantidade de pessoas para a equipe confirmar. O campo de newsletter também abre o WhatsApp e informa ao visitante que o e-mail não é armazenado pelo site.

## Alterações futuras no Termux com cat

Para substituir um arquivo sem editor de texto, use o formato abaixo. Exemplo para editar o JavaScript:

```bash
cd ~/donna-luiza-site || exit 1
cat > public/app.js <<'EOF'
// Cole aqui o conteúdo completo atualizado do arquivo app.js.
EOF
```

O conteúdo entre os marcadores `EOF` será escrito literalmente. Use sempre um heredoc com delimitador entre aspas (`<<'EOF'`) para evitar que o shell altere caracteres do código. Para atualizar CSS ou HTML, troque o caminho por `public/styles.css` ou `public/index.html` e cole o conteúdo completo correspondente.
