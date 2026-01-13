import { ClipboardList, CreditCard, MessageSquareShare } from "lucide-react";

export default function HowWorks() {
return (
    <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Como funciona</h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">Siga os passos abaixo para garantir sua vaga no campeonato</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 -mr-4 -mt-4">1</div>
                    <div className="pt-6 relative">
                        <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                        <ClipboardList />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Preencha seus dados</h3>
                        <p className="text-sm text-muted-foreground">Insira suas informações pessoais e dados para competição</p>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 -mr-4 -mt-4">2</div>
                    <div className="pt-6 relative">
                        <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                        <CreditCard />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Pague via PIX</h3>
                        <p className="text-sm text-muted-foreground">Realize o pagamento usando a chave PIX fornecida</p>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 -mr-4 -mt-4">3</div>
                    <div className="pt-6 relative">
                        <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                        <MessageSquareShare />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Envie o comprovante</h3>
                        <p className="text-sm text-muted-foreground">Mande o comprovante no WhatsApp com seu nome completo</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}