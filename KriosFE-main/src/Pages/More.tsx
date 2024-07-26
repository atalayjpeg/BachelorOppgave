import React from 'react';
import Navbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';

interface MoreProps {
    isLoggedIn: boolean;
    toggleLogin: () => void;
  }


const More: React.FC<MoreProps> = ({ isLoggedIn, toggleLogin }) => {
  return (
    <div className='container-fluid' style={{maxHeight:"100vh", overflowY:"auto"}}>
      <div className='row'>
        <Navbar isLoggedIn={isLoggedIn} toggleLogin={toggleLogin}/>

        <div className='col-10 offset-2 bg-dark-subtle'>
            <h2>Lær mer</h2>
            <hr className='my-4'></hr>

                <div className='bg-light p-3 mb-2'>
                    <h3>Hvordan bruker jeg Krios?</h3>
                    <p>
                        Etter du har logget inn, kan du trykke på "Kart"-knappen til venstre og starte applikasjonen. På denne siden kan du navigere deg rundt på kartet av Norge. Her kan du gjøre følgende:
                        <ul>
                            <li>
                                Trykke på kartet:

                                <p>Når du trykker på et område innenfor Norge kommer det et popup vindu, her vises adresse for det trykkede område. Der ligger det en "les mer"-knapp. Når trykket, viser klimadataene fra værstasjonene med de relevante dataene som trengs. Disse dataene blir vist i linjediagrammer.</p>
                            </li>

                            <li>
                            Søke etter et område:

                            <p>Oppe til høyre på siden ligger det et søkefelt. Her kan du skrive inn steder, adresser eller områder. Etter du har søkt vil du få opp det samme popup vinduet og få klimadataet på samme måte.</p>
                            </li>
                        </ul>
                    </p>

                    <p>
                        Nede på høyre siden ligger det "+" og "-" knapper som lar deg zoome inn og ut av kartet. Rundt samme område på siden ligger det to knapper. Den ene knappen viser alle værstasjonene i Norge. Denne funksjonen kan skrus av og på. Den andre knappen endrer kartstilen til et sattelittvisning. Trykker du deretter igjen vil stilen gå tilbake til den vanlige stilen.
                    </p>
                </div>

                <div className='bg-light p-3 mb-2'>
                    <h3>Hvor henter vi data fra?</h3>
                    <p>
                        <ul>
                            <li>
                                Frost API:
                            </li>
                            <p>
                                <a href="https://frost.met.no/index.html">https://frost.met.no/index.html</a>
                            </p>
                        </ul>

                        <ul>
                            <li>
                                Norsk Klimaservicesenter:
                            </li>
                            <p>
                                <a href="https://klimaservicesenter.no/">https://klimaservicesenter.no/</a>
                            </p>
                        </ul>

                        <ul>
                            <li>
                                Norges Geologiske Undersøkelse:
                            </li>
                            <p>
                                <a href="https://www.ngu.no/">https://www.ngu.no/</a>
                            </p>
                        </ul>
                    </p>
                </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default More;