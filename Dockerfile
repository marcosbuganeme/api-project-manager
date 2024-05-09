# Imagem base com Node.js 14
FROM node:14

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia o arquivo 'package.json' e 'package-lock.json' (se disponível)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos do projeto para o diretório de trabalho
COPY . .

# Expõe a porta 3000 para acesso externo
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
