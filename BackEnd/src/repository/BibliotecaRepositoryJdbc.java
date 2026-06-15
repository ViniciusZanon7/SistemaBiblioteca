package BackEnd.src.repository;

import BackEnd.src.database.ConexaoBanco;
import BackEnd.src.model.Emprestimo;
import BackEnd.src.model.Livro;
import BackEnd.src.model.Usuario;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BibliotecaRepositoryJdbc implements BibliotecaRepository {

    private final ConexaoBanco conexaoBanco;

    public BibliotecaRepositoryJdbc(ConexaoBanco conexaoBanco) {
        this.conexaoBanco = conexaoBanco;
    }

    @Override
    public void cadastrarLivro(Livro livro) throws SQLException {
        String sql = """
            insert into livros (nome_autor, titulo_livro, editora, quantidade, ano_publicacao, genero)
            values (?, ?, ?, ?, ?, ?)
            """;

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setString(1, livro.getAutor());
            comando.setString(2, livro.getTitulo());
            comando.setString(3, livro.getEditora());
            comando.setInt(4, livro.getQuantidade());
            comando.setInt(5, livro.getAnoPublicacao());
            comando.setString(6, livro.getGenero());

            comando.executeUpdate();
        }
    }

    @Override
    public List<Livro> listarLivros() throws SQLException {
        String sql = """
            select id, nome_autor, titulo_livro, editora, quantidade, ano_publicacao, genero
            from livros
            order by id
            """;

        List<Livro> livros = new ArrayList<>();

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()) {
                livros.add(montarLivro(resultado));
            }
        }

        return livros;
    }

    @Override
    public void atualizarLivro(long id, Livro livro) throws SQLException {
        String sql = """
            update livros
            set nome_autor = ?, titulo_livro = ?, editora = ?, quantidade = ?, ano_publicacao = ?, genero = ?
            where id = ?
            """;

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setString(1, livro.getAutor());
            comando.setString(2, livro.getTitulo());
            comando.setString(3, livro.getEditora());
            comando.setInt(4, livro.getQuantidade());
            comando.setInt(5, livro.getAnoPublicacao());
            comando.setString(6, livro.getGenero());
            comando.setLong(7, id);

            comando.executeUpdate();
        }
    }

    @Override
    public void excluirLivro(long id) throws SQLException {
        String sql = "delete from livros where id = ?";

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setLong(1, id);
            comando.executeUpdate();
        }
    }

    @Override
    public Livro buscarLivroPorId(long id) throws SQLException {
        String sql = """
            select id, nome_autor, titulo_livro, editora, quantidade, ano_publicacao, genero
            from livros
            where id = ?
            """;

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setLong(1, id);

            try (ResultSet resultado = comando.executeQuery()) {
                if (resultado.next()) {
                    return montarLivro(resultado);
                }
            }
        }

        return null;
    }

    @Override
    public void cadastrarUsuario(Usuario usuario) throws SQLException {
        String sql = """
            insert into usuarios (nome, email, telefone, CPF)
            values (?, ?, ?, ?)
            """;

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setString(1, usuario.getNome());
            comando.setString(2, usuario.getEmail());
            comando.setString(3, usuario.getTelefone());
            comando.setString(4, usuario.getCPF());

            comando.executeUpdate();
        }
    }

    @Override
    public List<Usuario> listarUsuarios() throws SQLException {
        String sql = """
            select id, nome, email, telefone, CPF
            from usuarios
            order by id
            """;

        List<Usuario> usuarios = new ArrayList<>();

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()) {
                usuarios.add(new Usuario(
                    resultado.getLong("id"),
                    resultado.getString("nome"),
                    resultado.getString("email"),
                    resultado.getString("telefone"),
                    resultado.getString("CPF")
                ));
            }
        }

        return usuarios;
    }

    @Override
    public void atualizarUsuario(long id, Usuario usuario) throws SQLException {
        String sql = """
            update usuarios
            set nome = ?, email = ?, telefone = ?, CPF = ?
            where id = ?
            """;

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setString(1, usuario.getNome());
            comando.setString(2, usuario.getEmail());
            comando.setString(3, usuario.getTelefone());
            comando.setString(4, usuario.getCPF());
            comando.setLong(5, id);

            int linhasAlteradas = comando.executeUpdate();

            if (linhasAlteradas == 0) {
                throw new IllegalArgumentException("Usuario nao encontrado");
            }
        }
    }

    @Override
    public void excluirUsuario(long id) throws SQLException {
        String devolverEstoque = """
            update livros
            set quantidade = quantidade + emprestimos_ativos.total
            from (
                select livro_id, count(*) as total
                from emprestimos
                where usuario_id = ? and status = 'emprestado'
                group by livro_id
            ) emprestimos_ativos
            where livros.id = emprestimos_ativos.livro_id
            """;

        String excluirEmprestimos = "delete from emprestimos where usuario_id = ?";
        String excluirUsuario = "delete from usuarios where id = ?";

        try (Connection conexao = conexaoBanco.conectar()) {
            conexao.setAutoCommit(false);

            try (PreparedStatement comandoEstoque = conexao.prepareStatement(devolverEstoque);
                 PreparedStatement comandoEmprestimos = conexao.prepareStatement(excluirEmprestimos);
                 PreparedStatement comandoUsuario = conexao.prepareStatement(excluirUsuario)) {

                comandoEstoque.setLong(1, id);
                comandoEstoque.executeUpdate();

                comandoEmprestimos.setLong(1, id);
                comandoEmprestimos.executeUpdate();

                comandoUsuario.setLong(1, id);
                int linhasAlteradas = comandoUsuario.executeUpdate();

                if (linhasAlteradas == 0) {
                    throw new IllegalArgumentException("Usuario nao encontrado");
                }

                conexao.commit();
            } catch (SQLException | RuntimeException erro) {
                conexao.rollback();
                throw erro;
            }
        }
    }

    @Override
    public boolean autenticarAdministrador(String username, String password) throws SQLException {
        String sql = """
            select 1
            from admins
            where username = ? and password = ?
            limit 1
            """;

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setString(1, username);
            comando.setString(2, password);

            try (ResultSet resultado = comando.executeQuery()) {
                return resultado.next();
            }
        }
    }

    @Override
    public void registrarEmprestimo(long usuarioId, long livroId) throws SQLException {
        String baixarQuantidade = """
            update livros
            set quantidade = quantidade - 1
            where id = ? and quantidade > 0
            """;

        String inserirEmprestimo = """
            insert into emprestimos (usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, status, valor_devedor)
            values (?, ?, current_date, current_date + interval '14 days', 'emprestado', 0.0)
            """;

        try (Connection conexao = conexaoBanco.conectar()) {
            conexao.setAutoCommit(false);

            try (PreparedStatement comandoLivro = conexao.prepareStatement(baixarQuantidade);
                 PreparedStatement comandoEmprestimo = conexao.prepareStatement(inserirEmprestimo)) {

                comandoLivro.setLong(1, livroId);

                int linhasAlteradas = comandoLivro.executeUpdate();

                if (linhasAlteradas == 0) {
                    throw new IllegalArgumentException("Livro indisponivel ou nao encontrado");
                }

                comandoEmprestimo.setLong(1, usuarioId);
                comandoEmprestimo.setLong(2, livroId);
                comandoEmprestimo.executeUpdate();

                conexao.commit();
            } catch (SQLException | RuntimeException erro) {
                conexao.rollback();
                throw erro;
            }
        }
    }

    @Override
    public void registrarDevolucao(long emprestimoId) throws SQLException {
        String buscarLivro = """
            select livro_id
            from emprestimos
            where id = ? and status = 'emprestado'
            """;

        String devolverEmprestimo = """
            update emprestimos
            set status = 'devolvido', data_devolucao = current_date
            where id = ?
            """;

        String aumentarQuantidade = """
            update livros
            set quantidade = quantidade + 1
            where id = ?
            """;

        try (Connection conexao = conexaoBanco.conectar()) {
            conexao.setAutoCommit(false);

            try {
                Long livroId = null;

                try (PreparedStatement comandoBuscar = conexao.prepareStatement(buscarLivro)) {
                    comandoBuscar.setLong(1, emprestimoId);

                    try (ResultSet resultado = comandoBuscar.executeQuery()) {
                        if (resultado.next()) {
                            livroId = resultado.getLong("livro_id");
                        }
                    }
                }

                if (livroId == null) {
                    throw new IllegalArgumentException("Emprestimo nao encontrado ou ja devolvido");
                }

                try (PreparedStatement comandoDevolver = conexao.prepareStatement(devolverEmprestimo);
                     PreparedStatement comandoLivro = conexao.prepareStatement(aumentarQuantidade)) {

                    comandoDevolver.setLong(1, emprestimoId);
                    comandoDevolver.executeUpdate();

                    comandoLivro.setLong(1, livroId);
                    comandoLivro.executeUpdate();
                }

                conexao.commit();
            } catch (SQLException | RuntimeException erro) {
                conexao.rollback();
                throw erro;
            }
        }
    }

    @Override
    public List<Emprestimo> listarEmprestimos() throws SQLException {
        String sql = """
            select id, usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao, status, valor_devedor as multa
            from emprestimos
            order by id
            """;

        return buscarEmprestimos(sql);
    }

    @Override
    public List<Emprestimo> listarEmprestimosAtrasados() throws SQLException {
        String sql = """
            select id, usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao, status, valor_devedor as multa
            from emprestimos
            where status = 'emprestado'
            and data_emprestimo < current_date - interval '7 days'
            order by data_emprestimo
            """;

        return buscarEmprestimos(sql);
    }

    private List<Emprestimo> buscarEmprestimos(String sql) throws SQLException {
        List<Emprestimo> emprestimos = new ArrayList<>();

        try (Connection conexao = conexaoBanco.conectar();
             PreparedStatement comando = conexao.prepareStatement(sql);
             ResultSet resultado = comando.executeQuery()) {

            while (resultado.next()) {
                Date dataDevolucao = resultado.getDate("data_devolucao");

                emprestimos.add(new Emprestimo(
                    resultado.getLong("id"),
                    resultado.getLong("usuario_id"),
                    resultado.getLong("livro_id"),
                    resultado.getDate("data_emprestimo").toLocalDate(),
                    resultado.getDate("data_prevista_devolucao").toLocalDate(),
                    dataDevolucao == null ? null : dataDevolucao.toLocalDate(),
                    resultado.getString("status"),
                    resultado.getDouble("multa")
                ));
            }
        }

        return emprestimos;
    }

    private Livro montarLivro(ResultSet resultado) throws SQLException {
        return new Livro(
            resultado.getLong("id"),
            resultado.getString("titulo_livro"),
            resultado.getString("nome_autor"),
            resultado.getString("editora"),
            resultado.getInt("quantidade"),
            resultado.getInt("ano_publicacao"),
            resultado.getString("genero")
        );
    }
}
