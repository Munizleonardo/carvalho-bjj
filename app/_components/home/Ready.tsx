import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

export default function Ready() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="border border-border rounded-2xl shadow-sm p-6 max-w-3xl mx-auto bg-primary text-primary-foreground overflow-hidden relative">
                    <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent">
                    </div>
                    <div className="py-12 px-8 text-center relative">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Pronto para competir?</h2>
                        <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">Não perca tempo! As vagas são limitadas. Faça sua inscrição agora e garanta sua participação.</p>
                        <Link href="/inscricao">
                            <Button className="cursor-pointer not-only:inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl h-14 px-8 text-base font-medium">
                            Inscrever-se agora
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}