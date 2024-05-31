# Use uma imagem oficial do Node.js
FROM node:alpine

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos de package e instale as dependências
COPY package*.json ./
RUN npm install

# Instale o Angular CLI globalmente
RUN npm install -g @angular/cli

# Copie o restante dos arquivos do projeto
COPY . .

# Exponha a porta que a aplicação irá rodar
EXPOSE 4200

# Comando para iniciar a aplicação
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "--disable-host-check"]
