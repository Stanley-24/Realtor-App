import { useEffect } from "react"
import Container from "../../components/Container"
import About from "./components/About"
import Copyright from "./components/Copyright"
import ContactForm from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import ProductGrid from "./components/ProductGrids"
import HowItWorks from "./components/HowItWork."

export default function HomePage() {
  useEffect(() => {
    if (window.location.hash === "#contact") {
      setTimeout(() => {
        const el = document.getElementById("contact");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, []);

  return (
    <div>
      <Container>
        <Header/>
        <Hero/>
        <About/>
        <ProductGrid/>
        <HowItWorks/>
      </Container>
      <ContactForm/>
      <Copyright/>

    </div>
  )
}

 
