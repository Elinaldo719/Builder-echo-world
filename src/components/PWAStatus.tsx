import { useEffect, useState } from "react";
import { Wifi, WifiOff, Download, Smartphone, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePWA } from "@/hooks/usePWA";

const PWAStatus = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { toast } = useToast();
  const {
    isOffline,
    isInstalled,
    isStandalone,
    supportsPWA,
    installPWA,
    checkForUpdates,
  } = usePWA();

  useEffect(() => {
    // Register service worker and check for updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("SW registration failed:", error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "UPDATE_AVAILABLE") {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  const handleUpdate = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        window.location.reload();
      }
    }
  };

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      toast({
        title: "App instalado!",
        description: "Verso Diário foi instalado com sucesso.",
      });
    }
  };

  // Don't render if PWA not supported
  if (!supportsPWA) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      {/* Offline indicator */}
      {isOffline && (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-700 border-orange-300 px-3 py-1 shadow-lg"
        >
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      )}

      {/* Online indicator */}
      {!isOffline && (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 border-green-300 px-3 py-1 shadow-lg opacity-80"
        >
          <Wifi className="h-3 w-3 mr-1" />
          Online
        </Badge>
      )}

      {/* Update available */}
      {updateAvailable && (
        <Button
          onClick={handleUpdate}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      )}

      {/* Install prompt for mobile */}
      {!isInstalled && !isStandalone && (
        <Button
          onClick={handleInstall}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg md:hidden"
        >
          <Download className="h-4 w-4 mr-2" />
          Instalar
        </Button>
      )}

      {/* Installed indicator */}
      {(isInstalled || isStandalone) && (
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-700 border-purple-300 px-3 py-1 shadow-lg"
        >
          <Smartphone className="h-3 w-3 mr-1" />
          Instalado
        </Badge>
      )}
    </div>
  );
};

export default PWAStatus;
