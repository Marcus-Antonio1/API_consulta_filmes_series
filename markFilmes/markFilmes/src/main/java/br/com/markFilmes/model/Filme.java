package br.com.markFilmes.model;

import br.com.markFilmes.service.traducao.ConsultaMyMemory;
import jakarta.persistence.*;

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

    public Filme(){}

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
        this.sinopse = ConsultaMyMemory.obterTraducao(dadosFilme.sinopse()).trim();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public Integer getAnoLancamento() { return anoLancamento; }
    public void setAnoLancamento(Integer a) { this.anoLancamento = a; }
    public String getDuracao() { return duracao; }
    public void setDuracao(String d) { this.duracao = d; }
    public Double getAvaliacao() { return avaliacao; }
    public void setAvaliacao(Double a) { this.avaliacao = a; }
    public Categoria getGenero() { return genero; }
    public void setGenero(Categoria g) { this.genero = g; }
    public String getAtores() { return atores; }
    public void setAtores(String a) { this.atores = a; }
    public String getPoster() { return poster; }
    public void setPoster(String p) { this.poster = p; }
    public String getSinopse() { return sinopse; }
    public void setSinopse(String s) { this.sinopse = s; }

    @Override
    public String toString() {
        return "Filme{titulo='" + titulo + "', anoLancamento=" + anoLancamento + ", genero=" + genero + '}';
    }
}
