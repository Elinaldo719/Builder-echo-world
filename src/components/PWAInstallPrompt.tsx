import { useState, useEffect } from "react";
import { X, Download, Smartphone, Share, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePWA } from "@/hooks/usePWA";

interface PWAInstallPromptProps {
  onClose?: () => void;
}

const PWAInstallPrompt = ({ onClose }: PWAInstallPromptProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isStandalone,
    supportsPWA,
    installPWA,
    shareApp,
  } = usePWA();

  useEffect(() => {
    // Show prompt if installable and not dismissed
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = wasDismissed ? parseInt(wasDismissed) : 0;
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

    // Show prompt if:
    // - PWA is installable
    // - Not already installed
    // - Not dismissed recently (within a week)
    // - Supports PWA features
    if (
      isInstallable &&
      !isInstalled &&
      !isStandalone &&
      supportsPWA &&
      now - dismissedTime > oneWeek
    ) {
      // Delay showing prompt by 3 seconds for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, isStandalone, supportsPWA]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      toast({
        title: "App instalado!",
        description:
          "Verso Diário foi instalado com sucesso no seu dispositivo.",
      });
      setShowPrompt(false);
      onClose?.();
    } else {
      toast({
        title: "Erro na instalação",
        description: "Não foi possível instalar o app. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const success = await shareApp();
    if (success) {
      toast({
        title: "Compartilhado!",
        description: "Link do app foi compartilhado com sucesso.",
      });
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    setDismissed(true);
    setShowPrompt(false);
    onClose?.();
  };

  // iOS specific instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  // Don't show if dismissed or not needed
  if (!showPrompt || dismissed || isInstalled || isStandalone) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  Instalar Verso Diário
                </h3>
                <p className="text-sm text-neutral-600">
                  Acesso rápido e offline
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span className="text-neutral-700">
                Acesso rápido na tela inicial
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span className="text-neutral-700">Funciona sem internet</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span className="text-neutral-700">
                Notificações de novos versos
              </span>
            </div>
          </div>

          {/* Offline status */}
          {isOffline && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700">
                Você está offline. Instale para acesso completo!
              </span>
            </div>
          )}

          {/* iOS specific instructions */}
          {isIOS && isSafari && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                <strong>No Safari:</strong>
              </p>
              <ol className="text-xs text-blue-600 space-y-1">
                <li>1. Toque no ícone de compartilhar (↗)</li>
                <li>2. Selecione "Adicionar à Tela de Início"</li>
                <li>3. Confirme tocando em "Adicionar"</li>
              </ol>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {!isIOS && (
              <Button
                onClick={handleInstall}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar App
              </Button>
            )}
            <Button
              onClick={handleShare}
              variant="outline"
              className={isIOS ? "flex-1" : "flex-none"}
            >
              <Share className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          {/* Dismiss button */}
          <Button
            onClick={handleDismiss}
            variant="ghost"
            className="w-full text-neutral-500 hover:text-neutral-700"
            size="sm"
          >
            Agora não
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
