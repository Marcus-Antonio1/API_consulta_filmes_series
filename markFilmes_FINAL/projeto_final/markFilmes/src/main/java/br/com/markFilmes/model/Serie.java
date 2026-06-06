package br.com.markFilmes.model;

import br.com.markFilmes.service.traducao.ConsultaMyMemory;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "series")
public class Serie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String titulo;

    private Integer totalTemporadas;
    private Double avaliacao;

    @Enumerated(EnumType.STRING)
    private Categoria genero;

    private String atores;
    private String poster;

    @Column(length = 2000)
    private String sinopse;

    @OneToMany(mappedBy = "serie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Episodio> episodios = new ArrayList<>();

    public Serie() {}

    public Serie(DadosSerie d) {
        this.titulo = d.titulo();
        this.totalTemporadas = d.totalTemporadas();
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
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public Integer getTotalTemporadas() { return totalTemporadas; }
    public void setTotalTemporadas(Integer t) { this.totalTemporadas = t; }
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
    public List<Episodio> getEpisodios() { return episodios; }
    public void setEpisodios(List<Episodio> e) { this.episodios = e; }
}
