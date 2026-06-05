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

    @Column(length = 2000)
    private String sinopse;

    public Filme() {}

    public Filme(DadosFilme d) {
        this.titulo = d.titulo();
        this.anoLancamento = d.anoLancamento();
        this.duracao = d.duracaoFilme();
        try {
            this.avaliacao = Double.valueOf(d.avaliacao());
        } catch (NumberFormatException e) {
            this.avaliacao = 0.0;
        }
        this.genero = Categoria.fromString(d.genero().split(",")[0].trim());
        this.atores = d.atores();
        this.poster = d.poster();
        this.sinopse = ConsultaMyMemory.obterTraducao(d.sinopse()).trim();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String t) { this.titulo = t; }
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
}
