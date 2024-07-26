import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'

const Footer: React.FC = () => {
    return (
        <div className="col-10 offset-2">
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div className="flex-column flex-nowrap">
                            <p className="fw-bold fs-6 mt-5">Fra SINTEF</p>

                            <p>
                                <a className="text-secondary fs-6 text-decoration-none" href="https://www.sintef.no/" target="_blank">SINTEF</a>
                            </p>

                            <p>
                                <a className="text-secondary fs-6 text-decoration-none" href="https://byggforsk.no/byggforskserien" target="_blank">Byggforskserien</a>
                            </p>
                        </div>
                    </div>

                    <div className="col">
                        <div className="flex-column flex-nowrap">
                            <p className="fw-bold fs-6 mt-5">Om Krios</p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Hva er Krios
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Finn fram i Krios
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Om min side
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Informasjon
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Om byggereglene
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Humorforvaltning
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Filmer
                            </p>
                        </div>
                    </div>

                    <div className="col">
                        <div className="flex-column flex-nowrap">
                            <p className="fw-bold fs-6 mt-5">Kundeservice</p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Bestill abonnement
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Abonnementsvilkår
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Priser
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Prøv Krios gratis
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Kjøp enkeltanvisninger
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Kontakt kundeservice
                            </p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Personvernerklæring
                            </p>
                        </div>
                    </div>

                    <div className="col">
                        <div className="flex-column flex-nowrap">
                            <p className="fw-bold fs-6 mt-5">Nyhetsbrev</p>

                            <p className="text-secondary fs-6 text-decoration-none">
                                Få fagartikler, nyheter om forskning, bøker og kurs rett i inboksen
                            </p>

                            
                        </div>
                    </div>
                </div>
            </div>

            <FontAwesomeIcon className="col fs-1 me-2" icon={faFacebook} />
            <FontAwesomeIcon className="col fs-1 me-2" icon={faLinkedin} />
            <FontAwesomeIcon className="col fs-1" icon={faInstagram} />

            <hr />

        </div>
    );
}

export default Footer;