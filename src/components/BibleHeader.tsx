import { Book, RotateCcw, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BibleHeaderProps {
  onRandomVerse?: () => void;
  onMenuClick?: () => void;
}

const BibleHeader = ({ onRandomVerse, onMenuClick }: BibleHeaderProps) => {
  return (
    <header className="subtle-gradient text-neutral-700 px-6 py-5 border-b border-neutral-200/50">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/70 rounded-lg shadow-sm">
            <Book className="h-5 w-5 text-sage-600" />
          </div>
          <h1 className="text-xl font-medium tracking-tight">Verso Diário</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRandomVerse}
            className="text-neutral-600 hover:bg-white/50 hover:text-neutral-700 rounded-lg transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-neutral-600 hover:bg-white/50 hover:text-neutral-700 rounded-lg transition-all duration-200"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default BibleHeader;
