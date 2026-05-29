package BackEnd.src.util;

import BackEnd.src.model.Emprestimo;
import BackEnd.src.model.Livro;
import BackEnd.src.model.Usuario;

import java.time.LocalDate;
import java.util.List;

public class JsonUtil {

    public static Livro jsonParaLivro(String json) {
        return new Livro(
            0,
            lerTexto(json, "titulo"),
            lerTexto(json, "autor"),
            lerTexto(json, "editora"),
            lerInt(json, "quantidade"),
            lerInt(json, "anoPublicacao"),
            lerTexto(json, "genero")
        );
    }

    public static Usuario jsonParaUsuario(String json) {
        return new Usuario(
            0,
            lerTexto(json, "nome"),
            lerTexto(json, "email"),
            lerTexto(json, "telefone")
        );
    }

    public static String livrosParaJson(List<Livro> livros) {
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < livros.size(); i++) {
            Livro livro = livros.get(i);

            json.append("{")
                .append("\"id\":").append(livro.getId()).append(",")
                .append("\"titulo\":").append(texto(livro.getTitulo())).append(",")
                .append("\"autor\":").append(texto(livro.getAutor())).append(",")
                .append("\"editora\":").append(texto(livro.getEditora())).append(",")
                .append("\"quantidade\":").append(livro.getQuantidade()).append(",")
                .append("\"anoPublicacao\":").append(livro.getAnoPublicacao()).append(",")
                .append("\"genero\":").append(texto(livro.getGenero()))
                .append("}");

            if (i < livros.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");
        return json.toString();
    }

    public static String usuariosParaJson(List<Usuario> usuarios) {
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < usuarios.size(); i++) {
            Usuario usuario = usuarios.get(i);

            json.append("{")
                .append("\"id\":").append(usuario.getId()).append(",")
                .append("\"nome\":").append(texto(usuario.getNome())).append(",")
                .append("\"email\":").append(texto(usuario.getEmail())).append(",")
                .append("\"telefone\":").append(texto(usuario.getTelefone()))
                .append("}");

            if (i < usuarios.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");
        return json.toString();
    }

    public static String emprestimosParaJson(List<Emprestimo> emprestimos) {
        StringBuilder json = new StringBuilder("[");

        for (int i = 0; i < emprestimos.size(); i++) {
            Emprestimo emprestimo = emprestimos.get(i);

            json.append("{")
                .append("\"id\":").append(emprestimo.getId()).append(",")
                .append("\"usuarioId\":").append(emprestimo.getUsuarioId()).append(",")
                .append("\"livroId\":").append(emprestimo.getLivroId()).append(",")
                .append("\"dataEmprestimo\":").append(data(emprestimo.getDataEmprestimo())).append(",")
                .append("\"dataDevolucao\":").append(data(emprestimo.getDataDevolucao())).append(",")
                .append("\"status\":").append(texto(emprestimo.getStatus()))
                .append("}");

            if (i < emprestimos.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");
        return json.toString();
    }

    public static String lerTexto(String json, String campo) {
        String valor = lerCampo(json, campo);

        if (valor == null || valor.equals("null")) {
            return null;
        }

        return valor;
    }

    public static int lerInt(String json, String campo) {
        String valor = lerCampo(json, campo);

        if (valor == null || valor.isBlank()) {
            return 0;
        }

        return Integer.parseInt(valor);
    }

    public static long lerLong(String json, String campo) {
        return Long.parseLong(lerCampo(json, campo));
    }

    private static String lerCampo(String json, String campo) {
        String chave = "\"" + campo + "\"";
        int inicio = json.indexOf(chave);

        if (inicio == -1) {
            return null;
        }

        int doisPontos = json.indexOf(":", inicio);
        int inicioValor = doisPontos + 1;

        while (inicioValor < json.length() && Character.isWhitespace(json.charAt(inicioValor))) {
            inicioValor++;
        }

        if (json.charAt(inicioValor) == '"') {
            int fim = json.indexOf("\"", inicioValor + 1);
            return json.substring(inicioValor + 1, fim);
        }

        int fim = inicioValor;

        while (fim < json.length() && json.charAt(fim) != ',' && json.charAt(fim) != '}') {
            fim++;
        }

        return json.substring(inicioValor, fim).trim();
    }

    private static String texto(String valor) {
        if (valor == null) {
            return "null";
        }

        return "\"" + valor.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private static String data(LocalDate valor) {
        if (valor == null) {
            return "null";
        }

        return texto(valor.toString());
    }
}