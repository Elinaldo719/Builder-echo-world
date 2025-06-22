import { Book, RotateCcw, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BibleHeaderProps {
  onRandomVerse?: () => void;
  onMenuClick?: () => void;
}

const BibleHeader = ({ onRandomVerse, onMenuClick }: BibleHeaderProps) => {
  return (
    <header className="purple-gradient text-white px-4 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Verso Diário</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRandomVerse}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default BibleHeader;
