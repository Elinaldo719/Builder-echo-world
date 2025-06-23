import { Settings, Book, Home, Info, HelpCircle, FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MenuDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onNavigateToSettings?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToBooks?: () => void;
  onNavigateToAnalyses?: () => void;
}

const MenuDrawer = ({
  open,
  onOpenChange,
  onNavigateToSettings,
  onNavigateToHome,
  onNavigateToBooks,
  onNavigateToAnalyses,
}: MenuDrawerProps) => {
  const menuItems = [
    {
      label: "Início",
      icon: Home,
      onClick: () => {
        onNavigateToHome?.();
        onOpenChange?.(false);
      },
    },
    {
      label: "Livros da Bíblia",
      icon: Book,
      onClick: () => {
        onNavigateToBooks?.();
        onOpenChange?.(false);
      },
    },
    {
      label: "Análises Salvas",
      icon: FileText,
      onClick: () => {
        onNavigateToAnalyses?.();
        onOpenChange?.(false);
      },
    },
    {
      label: "Configurações",
      icon: Settings,
      onClick: () => {
        onNavigateToSettings?.();
        onOpenChange?.(false);
      },
    },
  ];

  const aboutItems = [
    {
      label: "Sobre o App",
      icon: Info,
      onClick: () => {
        onOpenChange?.(false);
      },
    },
    {
      label: "Ajuda",
      icon: HelpCircle,
      onClick: () => {
        onOpenChange?.(false);
      },
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-72 sm:w-80 bg-white/95 backdrop-blur-sm border-neutral-200/50"
      >
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sage-100 rounded-lg">
              <Book className="h-5 w-5 text-sage-600" />
            </div>
            <SheetTitle className="text-lg font-medium text-neutral-700 tracking-tight">
              Verso Diário
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Navegação
            </h3>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={item.onClick}
                    className="w-full justify-start h-11 text-neutral-700 hover:bg-sage-50 hover:text-sage-700 rounded-lg transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-neutral-200" />

          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Informações
            </h3>
            <div className="space-y-1">
              {aboutItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={item.onClick}
                    className="w-full justify-start h-11 text-neutral-700 hover:bg-sage-50 hover:text-sage-700 rounded-lg transition-all duration-200"
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator className="bg-neutral-200" />

          {/* Footer */}
          <div className="pt-4 space-y-2">
            <p className="text-xs text-neutral-500 text-center">Versão 1.0.0</p>
            <p className="text-xs text-neutral-400 text-center">
              Desenvolvido com ❤️ para estudos bíblicos
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuDrawer;
