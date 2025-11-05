package com.soict.dto.person.event;

import com.soict.dto.person.BirthDeclareCreateDTO;
import com.soict.dto.person.PersonCreateDTO;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BirthDeclareRequest {
    @NotNull
    private BirthDeclareCreateDTO birthDeclareCreate;

    private Integer personId;
    private PersonCreateDTO personCreate;

    @AssertTrue(message = "Cần personId hoặc personCreate (chỉ một trong hai).")
    public boolean xorPerson() {
        return (personId != null) ^ (personCreate != null);
    }
}
