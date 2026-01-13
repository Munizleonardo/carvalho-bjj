import Link from "next/link";
import { Button } from "../ui/button";
import { Trophy } from "lucide-react";

export default function HeroSection() {
    return (
        <section id="home" className="">
            <div className="absolute">
            </div>
            <div className="container mx-auto px-4 py-20 md:py-32 relative">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <Trophy />
                        <span className="text-sm font-medium text-primary">Inscrições Abertas</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">Campeonato de<span className="block text-primary">Jiu-Jitsu 2026</span></h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Participe do maior evento de Jiu-Jitsu da região dos lagos. Inscreva-se agora e mostre todo o seu potencial no tatame!</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="rounded-xl h-14 px-8 text-base font-medium w-full sm:w-auto">
              <Link href="/inscricao">Fazer Inscrição</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl h-14 px-8 text-base font-medium w-full sm:w-auto">
              <Link href="/login">Área Administrativa</Link>
            </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}