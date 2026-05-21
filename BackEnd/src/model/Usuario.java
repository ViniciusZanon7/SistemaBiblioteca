package BackEnd.src.model;

import java.time.LocalDate;

public class Usuario {

    private String nome;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;
    private String senha;

    public Usuario(String nome, String email, String telefone, LocalDate dataNascimento, String senha) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.senha = senha;
    }
    public String getNome() {
        return nome;
    }
    public String getEmail() {
        return email;
    }
    public String getTelefone() {
        return telefone;
    }
    public LocalDate getDataNascimento() {
        return dataNascimento;
    }
    public String getSenha() {
        return senha;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }

}
