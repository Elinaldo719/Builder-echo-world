import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isStandalone: boolean;
  supportsPWA: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    isStandalone: false,
    supportsPWA: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Check if PWA is supported
    const supportsPWA = "serviceWorker" in navigator && "PushManager" in window;

    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://");

    // Check if already installed
    const isInstalled =
      isStandalone || localStorage.getItem("pwa-installed") === "true";

    setPwaState((prev) => ({
      ...prev,
      supportsPWA,
      isStandalone,
      isInstalled,
    }));

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;

      setPwaState((prev) => ({
        ...prev,
        isInstallable: true,
        installPrompt: installEvent,
      }));
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setPwaState((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null,
      }));
      localStorage.setItem("pwa-installed", "true");
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setPwaState((prev) => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setPwaState((prev) => ({ ...prev, isOffline: true }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const installPWA = async (): Promise<boolean> => {
    if (!pwaState.installPrompt) {
      return false;
    }

    try {
      await pwaState.installPrompt.prompt();
      const choiceResult = await pwaState.installPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setPwaState((prev) => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          installPrompt: null,
        }));
        localStorage.setItem("pwa-installed", "true");
        return true;
      }
    } catch (error) {
      console.error("Error during PWA installation:", error);
    }

    return false;
  };

  const shareApp = async () => {
    const shareData = {
      title: "Verso Diário - Bíblia",
      text: "Aplicativo para estudo bíblico diário com versículos e análise de IA",
      url: window.location.origin,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return true;
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        return true;
      }
    } catch (error) {
      console.error("Error sharing:", error);
      return false;
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const checkForUpdates = async (): Promise<boolean> => {
    if (!("serviceWorker" in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }

    return false;
  };

  return {
    ...pwaState,
    installPWA,
    shareApp,
    requestNotificationPermission,
    checkForUpdates,
  };
};

export default usePWA;
