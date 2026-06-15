package BackEnd.src.service;

import BackEnd.src.model.Emprestimo;
import BackEnd.src.model.Livro;
import BackEnd.src.model.Usuario;
import BackEnd.src.repository.BibliotecaRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import java.sql.SQLException;
import java.util.List;

public class BibliotecaService {

    private final BibliotecaRepository repository;

    public BibliotecaService(BibliotecaRepository repository) {
        this.repository = repository;
    }

    public void cadastrarLivro(Livro livro) throws SQLException {
        if (livro.getTitulo() == null || livro.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Titulo do livro e obrigatorio");
        }

        if (livro.getAutor() == null || livro.getAutor().isBlank()) {
            throw new IllegalArgumentException("Autor do livro e obrigatorio");
        }

        if (livro.getQuantidade() < 0) {
            throw new IllegalArgumentException("Quantidade nao pode ser negativa");
        }

        repository.cadastrarLivro(livro);
    }

    public List<Livro> listarLivros() throws SQLException {
        return repository.listarLivros();
    }

    public void atualizarLivro(long id, Livro livro) throws SQLException {
        repository.atualizarLivro(id, livro);
    }

    public void excluirLivro(long id) throws SQLException {
        repository.excluirLivro(id);
    }

    public boolean livroDisponivel(long livroId) throws SQLException {
        Livro livro = repository.buscarLivroPorId(livroId);

        if (livro == null) {
            throw new IllegalArgumentException("Livro nao encontrado");
        }

        return livro.getQuantidade() > 0;
    }

    public void cadastrarUsuario(Usuario usuario) throws SQLException {
        validarUsuario(usuario);
        repository.cadastrarUsuario(usuario);
    }

    public void atualizarUsuario(long id, Usuario usuario) throws SQLException {
        validarUsuario(usuario);
        repository.atualizarUsuario(id, usuario);
    }

    public void excluirUsuario(long id) throws SQLException {
        repository.excluirUsuario(id);
    }

    private void validarUsuario(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do usuario e obrigatorio");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email do usuario e obrigatorio");
        }
        if (usuario.getCPF() == null || usuario.getCPF().isBlank()) {
            throw new IllegalArgumentException("CPF do usuario e obrigatorio");
        }
    }

    public List<Usuario> listarUsuarios() throws SQLException {
        return repository.listarUsuarios();
    }

    public boolean autenticarAdministrador(String username, String password) throws SQLException {
        if (username == null || username.isBlank()) {
            return false;
        }

        if (password == null || password.isBlank()) {
            return false;
        }

        return repository.autenticarAdministrador(username, password);
    }

    public void registrarEmprestimo(long usuarioId, long livroId) throws SQLException {
        if (usuarioPossuiEmprestimoAtivo(usuarioId)) {
            throw new IllegalArgumentException("Usuario ja possui emprestimo ativo");
        }

        if (!livroDisponivel(livroId)) {
            throw new IllegalArgumentException("Livro indisponivel para emprestimo");
        }

        repository.registrarEmprestimo(usuarioId, livroId);
    }

    private boolean usuarioPossuiEmprestimoAtivo(long usuarioId) throws SQLException {
        for (Emprestimo emprestimo : repository.listarEmprestimos()) {
            boolean mesmoUsuario = emprestimo.getUsuarioId() == usuarioId;
            boolean ativo = "emprestado".equals(emprestimo.getStatus()) && emprestimo.getDataDevolucao() == null;

            if (mesmoUsuario && ativo) {
                return true;
            }
        }

        return false;
    }

    public double calcularMulta(Emprestimo emprestimo) {
        if(!emprestimo.getStatus().equals("emprestado")) {
            return 0;
        }
        if (!LocalDate.now().isAfter(
            emprestimo.getDataPrevistaDevolucao())) {
                return 0;
        }

        long diasAtraso = ChronoUnit.DAYS.between(
            emprestimo.getDataPrevistaDevolucao(), LocalDate.now());
        return diasAtraso * 2.0;
    }

    public void registrarDevolucao(long emprestimoId) throws SQLException {
        repository.registrarDevolucao(emprestimoId);
    }

    public List<Emprestimo> listarHistorico() throws SQLException {

        List<Emprestimo> emprestimos = repository.listarEmprestimos();

        for (Emprestimo emprestimo : emprestimos) {
            emprestimo.setMulta(calcularMulta(emprestimo));
        }
        return emprestimos;
    }

    public List<Emprestimo> listarAtrasados() throws SQLException {

        List<Emprestimo> atrasados = repository.listarEmprestimosAtrasados();
        for (Emprestimo emprestimo : atrasados) {
            emprestimo.setMulta(calcularMulta(emprestimo));
        }
        return atrasados;
    }
}
