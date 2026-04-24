package br.com.markFilmes.model;

import jakarta.persistence.*;
import java.util.OptionalDouble;

@Entity
@Table(name = "filmes")
public class Filme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String titulo;

    private Integer anoLancamento;
    private String duracao;
    private Double avaliacao;

    @Enumerated(EnumType.STRING)
    private Categoria genero;

    private String atores;
    private String poster;
    private String sinopse;

    public Filme(DadosFilme dadosFilme){
        this.titulo = dadosFilme.titulo();
        this.anoLancamento = dadosFilme.anoLancamento();
        this.duracao = dadosFilme.duracaoFilme();

        try {
            this.avaliacao = Double.valueOf(dadosFilme.avaliacao());
        } catch (NumberFormatException e) {
            this.avaliacao = 0.0;
        }

        this.genero = Categoria.fromString(dadosFilme.genero().split(",")[0].trim());
        this.atores = dadosFilme.atores();
        this.poster = dadosFilme.poster();
        this.sinopse = dadosFilme.sinopse(); //Caso for usar a API do Chat GPT basta alterar o ConsultaMyMemory para ConsultaChatGPT
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Integer getAnoLancamento() {
        return anoLancamento;
    }

    public void setAnoLancamento(Integer anoLancamento) {
        this.anoLancamento = anoLancamento;
    }

    public String getDuracao() {
        return duracao;
    }

    public void setDuracao(String duracao) {
        this.duracao = duracao;
    }

    public Double getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(Double avaliacao) {
        this.avaliacao = avaliacao;
    }

    public Categoria getGenero() {
        return genero;
    }

    public void setGenero(Categoria genero) {
        this.genero = genero;
    }

    public String getAtores() {
        return atores;
    }

    public void setAtores(String atores) {
        this.atores = atores;
    }

    public String getPoster() {
        return poster;
    }

    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getSinopse() {
        return sinopse;
    }

    public void setSinopse(String sinopse) {
        this.sinopse = sinopse;
    }

    @Override
    public String toString() {
        return "Filme{" +
                "titulo='" + titulo + '\'' +
                ", anoLancamento=" + anoLancamento +
                ", duracao='" + duracao + '\'' +
                ", avaliacao=" + avaliacao +
                ", genero=" + genero +
                '}';
    }
}