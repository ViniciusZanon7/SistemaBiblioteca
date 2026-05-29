# Banco de Dados - Sistema Biblioteca

Esta pasta guarda os scripts SQL do banco de dados do sistema de biblioteca.

O banco foi pensado para rodar no Supabase, que usa PostgreSQL.

## Tabelas criadas

### usuarios

Guarda os dados dos usuários do sistema.

Campos principais:

- `id`
- `nome`
- `email`
- `telefone`
- `data_nascimento`
- `senha`
- `created_at`

Regra importante:

- O campo `email` não pode repetir.

### livros

Guarda os dados dos livros cadastrados.

Campos principais:

- `id`
- `nome_autor`
- `titulo_livro`
- `editora`
- `quantidade`
- `ano_publicacao`
- `genero`
- `created_at`

Regra importante:

- O campo `quantidade` não pode ser menor que `0`.

### emprestimos

Guarda os empréstimos e devoluções dos livros.

Campos principais:

- `id`
- `usuario_id`
- `livro_id`
- `data_emprestimo`
- `data_devolucao`
- `status`
- `created_at`

Regras importantes:

- `usuario_id` precisa existir na tabela `usuarios`.
- `livro_id` precisa existir na tabela `livros`.
- `status` pode ser apenas `emprestado` ou `devolvido`.

## Exemplos para teste

Depois de criar as tabelas, voce pode testar com estes comandos no `SQL Editor`:

```sql
insert into usuarios (nome, email, telefone, data_nascimento, senha)
values ('Maria Silva', 'maria@email.com', '11999999999', '2000-05-10', '123456');

insert into livros (nome_autor, titulo_livro, editora, quantidade, ano_publicacao, genero)
values ('Machado de Assis', 'Dom Casmurro', 'Editora Exemplo', 3, 1899, 'Romance');

insert into emprestimos (usuario_id, livro_id, data_emprestimo, status)
values (1, 1, current_date, 'emprestado');

update emprestimos
set status = 'devolvido',
    data_devolucao = current_date
where id = 1;
```


