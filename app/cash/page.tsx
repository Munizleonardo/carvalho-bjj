import Link from "next/link";
import { Button } from "../_components/ui/button";

export default function Cash() {
    return(
        <div className="min-h-screen bg-background py-8 md:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto">

                        <h1 className="text-3xl font-bold text-foreground mb-2">Pagamento da Inscrição</h1>
                        <p className="text-muted-foreground">Finalize o pagamento para confirmar sua participação</p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-3 p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200">
                            <div className="shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check h-4 w-4">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m9 12 2 2 4-4"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium mb-1">Inscrição registrada com sucesso!</h4>
                                <div className="text-sm">Sua inscrição foi registrada. Para confirmar, realize o pagamento via PIX e envie o comprovante no WhatsApp informado, com o nome completo do atleta.</div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                            <div className="mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-qr-code h-5 w-5 text-primary">
                                        <rect width="5" height="5" x="3" y="3" rx="1"></rect>
                                        <rect width="5" height="5" x="16" y="3" rx="1"></rect>
                                        <rect width="5" height="5" x="3" y="16" rx="1"></rect>
                                        <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                                        <path d="M21 21v.01"></path>
                                        <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                                        <path d="M3 12h.01"></path>
                                        <path d="M12 3h.01"></path>
                                        <path d="M12 16v.01"></path>
                                        <path d="M16 12h1"></path>
                                        <path d="M21 12v.01"></path>
                                        <path d="M12 21v-1"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">Pagamento via PIX</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Copie a chave abaixo para realizar o pagamento</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-3 p-4 bg-muted/50 rounded-xl">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Valor:</span>
                                        <span className="font-semibold text-lg">R$ 100,00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Titular:</span>
                                        <span className="font-medium">Federação de Jiu-Jitsu</span>
                                    </div>
                                    <div className="border-t border-border pt-3">
                                        <span className="text-sm text-muted-foreground block mb-2">Chave PIX: <strong>(Telefone)</strong></span>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 bg-background px-3 py-2 rounded-lg text-sm font-mono break-all border">22999809455</code>
                                            <Button className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none bg-black [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-copy h-4 w-4">
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                            <div className="mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle h-5 w-5 text-emerald-600 dark:text-emerald-400">
                                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-foreground">Envio do Comprovante</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Após pagar, envie o comprovante para confirmar sua inscrição</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                    <p className="text-sm">Envie o comprovante para <strong>(22) 99980-9455 - Bruno Carvalho</strong> informando o nome completo do atleta.</p>
                                    <div className="border-t border-border pt-3">
                                        <span className="text-sm text-muted-foreground block mb-2">Mensagem sugerida:</span>
                                        <div className="flex items-center gap-2">
                                            <code className="flex-1 bg-background px-3 py-2 rounded-lg text-sm border">Pagamento Inscrição - Nome do Atleta</code>
                                        </div>
                                    </div>
                                </div>
                                <Button className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-emerald-100 hover:bg-[#66ff66] hover:text-accent-foreground h-10 px-4 py-2 w-full rounded-xl text-bleck">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-circle mr-2 h-4 w-4">
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                                    </svg>
                                    Abrir WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <Link href="/">
                            <Button className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-house mr-2 h-4 w-4">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                </svg>
                                Voltar para o início
                            </Button>
                        </Link>
                    </div>
                </div>
        </div>
    )
}