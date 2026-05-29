package BackEnd.src.repository;

import BackEnd.src.model.Emprestimo;
import BackEnd.src.model.Livro;
import BackEnd.src.model.Usuario;

import java.sql.SQLException;
import java.util.List;

public interface BibliotecaRepository {
    void cadastrarLivro(Livro livro) throws SQLException;

    List<Livro> listarLivros() throws SQLException;

    void atualizarLivro(long id, Livro livro) throws SQLException;

    void excluirLivro(long id) throws SQLException;

    Livro buscarLivroPorId(long id) throws SQLException;

    void cadastrarUsuario(Usuario usuario) throws SQLException;

    List<Usuario> listarUsuarios() throws SQLException;

    void registrarEmprestimo(long usuarioId, long livroId) throws SQLException;

    void registrarDevolucao(long emprestimoId) throws SQLException;

    List<Emprestimo> listarEmprestimos() throws SQLException;

    List<Emprestimo> listarEmprestimosAtrasados() throws SQLException;
}