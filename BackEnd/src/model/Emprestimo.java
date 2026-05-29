package BackEnd.src.model;

import java.time.LocalDate;

public class Emprestimo {
    private long id;
    private long usuarioId;
    private long livroId;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private String status;

    public Emprestimo(long id, long usuarioId, long livroId, LocalDate dataEmprestimo, LocalDate dataDevolucao, String status) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.livroId = livroId;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucao = dataDevolucao;
        this.status = status;
    }

    public long getId() {
        return id;
    }

    public long getUsuarioId() {
        return usuarioId;
    }

    public long getLivroId() {
        return livroId;
    }

    public LocalDate getDataEmprestimo() {
        return dataEmprestimo;
    }

    public LocalDate getDataDevolucao() {
        return dataDevolucao;
    }

    public String getStatus() {
        return status;
    }
}