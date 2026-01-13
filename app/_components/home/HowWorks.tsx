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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clipboard-list h-6 w-6 text-primary">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <path d="M12 11h4"></path>
            <path d="M12 16h4"></path>
            <path d="M8 11h.01"></path>
            <path d="M8 16h.01"></path>
        </svg>
        </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Preencha seus dados</h3>
            <p className="text-sm text-muted-foreground">Insira suas informações pessoais e dados da competição</p>
        </div>
        </div>
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 -mr-4 -mt-4">2</div>
            <div className="pt-6 relative">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-credit-card h-6 w-6 text-primary">
            <rect width="20" height="14" x="2" y="5" rx="2"></rect>
            <line x1="2" x2="22" y1="10" y2="10"></line>
        </svg>
        </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Pague via PIX</h3>
            <p className="text-sm text-muted-foreground">Realize o pagamento usando a chave PIX fornecida</p>
        </div>
        </div>
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 -mr-4 -mt-4">3</div>
            <div className="pt-6 relative">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle h-6 w-6 text-primary">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z">

        </path>
        </svg>
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