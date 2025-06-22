import { useQuery } from "@tanstack/react-query";
import { RotateCcw, Share2, Bookmark } from "lucide-react";
import { RandomVerseResponse } from "@/types/bible";
import { bibleApi } from "@/lib/bible-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DailyVerseProps {
  version?: string;
  onRefresh?: () => void;
}

const DailyVerse = ({ version = "nvi", onRefresh }: DailyVerseProps) => {
  const {
    data: verse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["daily-verse", version],
    queryFn: () => bibleApi.getRandomVerse(version),
  });

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  if (error) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4 text-center text-red-600">
          Erro ao carregar o verso diário
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-primary shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Verso do Dia</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Badge variant="secondary" className="text-xs">
            {verse?.number}
          </Badge>
          <p className="text-gray-800 leading-relaxed text-base font-medium">
            "{verse?.text}"
          </p>
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 font-medium">
              {verse?.book.name} {verse?.chapter}:{verse?.number}
            </p>
            <p className="text-xs text-gray-500">
              {verse?.book.author} • {verse?.book.version?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Bookmark className="h-4 w-4 mr-1" />
            Salvar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyVerse;
