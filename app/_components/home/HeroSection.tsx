import Link from "next/link";
import { Button } from "../ui/button";

export default function HeroSection() {
    return (
        <section id="home" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10">
            </div>
            <div className="container mx-auto px-4 py-20 md:py-32 relative">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trophy h-4 w-4 text-primary">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6">
                            </path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18">
                            </path>
                            <path d="M4 22h16">
                            </path>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22">
                            </path>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22">
                            </path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z">
                            </path>
                        </svg>
                        <span className="text-sm font-medium text-primary">Inscrições Abertas</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">Campeonato de<span className="block text-primary">Jiu-Jitsu 2026</span></h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Participe do maior evento de Jiu-Jitsu da região. Inscreva-se agora e mostre todo o seu potencial no tatame!</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="rounded-xl h-14 px-8 text-base font-medium w-full sm:w-auto">
              <Link href="/inscricao">Fazer inscrição</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl h-14 px-8 text-base font-medium w-full sm:w-auto">
              <Link href="/login">Área administrativa</Link>
            </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}