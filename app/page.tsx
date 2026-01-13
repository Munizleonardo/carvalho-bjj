import Footer from "./_components/Footer";
import HeroSection from "./_components/home/HeroSection";
import HowWorks from "./_components/home/HowWorks";
import Ready from "./_components/home/Ready";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <HowWorks />
        <Ready />
        <Footer />
      </main>
    </div>
  );
}
