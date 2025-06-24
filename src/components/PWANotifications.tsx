import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { usePWA } from "@/hooks/usePWA";

const PWANotifications = () => {
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [showPrompt, setShowPrompt] = useState(false);
  const { toast } = useToast();
  const { requestNotificationPermission } = usePWA();

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);

      // Show permission prompt after 30 seconds if not granted/denied
      if (Notification.permission === "default") {
        const timer = setTimeout(() => {
          const lastPrompt = localStorage.getItem("notification-prompt-shown");
          const lastPromptTime = lastPrompt ? parseInt(lastPrompt) : 0;
          const oneWeek = 7 * 24 * 60 * 60 * 1000;

          if (Date.now() - lastPromptTime > oneWeek) {
            setShowPrompt(true);
          }
        }, 30000);

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();

    if (granted) {
      setNotificationPermission("granted");
      setShowPrompt(false);
      localStorage.setItem("notification-prompt-shown", Date.now().toString());

      toast({
        title: "Notificações ativadas!",
        description: "Você receberá lembretes diários do verso.",
      });

      // Schedule daily verse notification
      scheduleVerseDailyNotification();
    } else {
      setNotificationPermission("denied");
      setShowPrompt(false);
      localStorage.setItem("notification-prompt-shown", Date.now().toString());

      toast({
        title: "Notificações negadas",
        description: "Você pode ativar nas configurações do navegador.",
        variant: "destructive",
      });
    }
  };

  const scheduleVerseDailyNotification = () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        // Schedule daily notification at 9 AM
        const now = new Date();
        const target = new Date();
        target.setHours(9, 0, 0, 0);

        if (target <= now) {
          target.setDate(target.getDate() + 1);
        }

        const delay = target.getTime() - now.getTime();

        setTimeout(() => {
          registration.showNotification("Verso Diário", {
            body: "Seu novo versículo do dia está disponível!",
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-72x72.png",
            tag: "daily-verse",
            data: { url: "/" },
            actions: [
              {
                action: "view",
                title: "Ver Versículo",
                icon: "/icons/icon-72x72.png",
              },
              {
                action: "dismiss",
                title: "Dispensar",
              },
            ],
          });

          // Schedule next day
          scheduleVerseDailyNotification();
        }, delay);
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("notification-prompt-shown", Date.now().toString());
  };

  if (!("Notification" in window) || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto">
      <Card className="bg-white shadow-xl border-blue-200 animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-neutral-800 text-sm mb-1">
                Receber lembretes diários?
              </h3>
              <p className="text-xs text-neutral-600 mb-3">
                Te lembraremos todos os dias às 9h para ler seu versículo
                diário.
              </p>

              <div className="flex gap-2">
                <Button
                  onClick={handleRequestPermission}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-7"
                >
                  Permitir
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-700 text-xs px-2 py-1 h-7"
                >
                  Agora não
                </Button>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-neutral-400 hover:text-neutral-600 flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWANotifications;
