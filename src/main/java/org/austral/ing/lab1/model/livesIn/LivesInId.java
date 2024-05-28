package org.austral.ing.lab1.model.livesIn;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class LivesInId implements Serializable {

    @Column(name = "USUARIO_ID")
    private Long usuarioId;

    @Column(name = "CASA_ID")
    private Long casaId;

    // Default constructor
    public LivesInId() {}

    // Constructor
    public LivesInId(Long usuarioId, Long casaId) {
        this.usuarioId = usuarioId;
        this.casaId = casaId;
    }

    // Getters and setters
    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getCasaId() {
        return casaId;
    }

    public void setCasaId(Long casaId) {
        this.casaId = casaId;
    }
}