const mysql = require('mysql2');

// Cria a conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'seu_banco_de_dados'
});

// Estabelece a conexão e executa as operações dentro da função de retorno de chamada
connection.connect(function(err) {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados');

  // Executa consulta SQL
  connection.query('SELECT * FROM tabela', function(err, results) {
    if (err) {
      console.error('Erro ao executar a consulta SQL:', err);
      return;
    }
    console.log('Resultados da consulta:', results);

    // Fecha a conexão somente quando não for mais necessária
    connection.end(function(err) {
      if (err) {
        console.error('Erro ao fechar a conexão com o banco de dados:', err);
        return;
      }
      console.log('Conexão com o banco de dados MySQL encerrada');
    });
  });
});

// Exporta a conexão para que ela possa ser utilizada em outros arquivos
module.exports = connection;
