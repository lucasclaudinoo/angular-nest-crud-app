# Frontend

Este projeto é um frontend gerado com Angular CLI na versão 17.3.8.

## Dockerização e Execução

Para rodar a aplicação usando Docker, você pode usar Docker Compose. Certifique-se de ter o Docker e o Docker Compose instalados em seu sistema.

1. Certifique-se de estar na raiz do projeto.

2. Construa a imagem do Docker executando o seguinte comando:
   
docker-compose build

3. Após a construção bem-sucedida da imagem, inicie a aplicação executando o seguinte comando:

docker-compose up


Isso irá iniciar a aplicação e você poderá acessá-la em `http://localhost:4200/`.

O aplicativo será automaticamente recarregado se você fizer qualquer alteração nos arquivos de origem.

Para mais informações sobre o Docker e o Docker Compose, consulte a documentação oficial:

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

