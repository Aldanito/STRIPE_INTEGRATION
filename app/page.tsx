import CardInformation from "@/components/CardInformation";
import Cta from "@/components/Cta";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Hero2 from "@/components/Hero2";

export default function Home() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Hero />
        <Hero2 />
      </main>
      <section>
        <CardInformation />
        <Cta />
      </section>
    </>
  );
}
