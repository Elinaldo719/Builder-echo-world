import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Calendar, Trash2, Share2 } from "lucide-react";
import BibleHeader from "@/components/BibleHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SavedAnalysis {
  id: string;
  verses: Array<{
    text: string;
    reference: string;
  }>;
  analysis: string;
  date: string;
  title: string;
}

const SavedAnalyses = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    // Carregar análises salvas do localStorage
    const saved = localStorage.getItem("saved_analyses");
    if (saved) {
      setAnalyses(JSON.parse(saved));
    }
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  const deleteAnalysis = (id: string) => {
    const updated = analyses.filter((analysis) => analysis.id !== id);
    setAnalyses(updated);
    localStorage.setItem("saved_analyses", JSON.stringify(updated));
  };

  const formatAnalysisText = (text: string) => {
    // Remove asteriscos e formata o texto
    let formatted = text.replace(/\*/g, "");

    // Quebra o texto em seções
    const sections = formatted.split("\n\n");

    return sections.map((section, index) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      // Identifica títulos (linhas que começam com **texto**)
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        const title = trimmed.slice(2, -2);
        return (
          <h3
            key={index}
            className="text-lg font-semibold text-blue-700 mb-3 mt-4 first:mt-0"
          >
            {title}
          </h3>
        );
      }

      // Identifica listas (linhas que começam com -)
      if (trimmed.includes("- ")) {
        const items = trimmed
          .split("\n")
          .filter((line) => line.trim().startsWith("- "));
        return (
          <ul key={index} className="list-disc list-inside space-y-1 mb-3">
            {items.map((item, i) => (
              <li key={i} className="text-neutral-700">
                {item.replace("- ", "")}
              </li>
            ))}
          </ul>
        );
      }

      // Texto normal
      return (
        <p key={index} className="text-neutral-700 leading-relaxed mb-3">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen modern-gradient">
      <BibleHeader onMenuClick={handleBack} hideMenuButton={true} />

      <div className="px-6 py-8 pb-24 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-medium text-neutral-700 tracking-tight">
                Análises Salvas
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Histórico de estudos bíblicos com IA
              </p>
            </div>
          </div>

          {/* Analyses List */}
          {analyses.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/50">
              <CardContent className="p-8 text-center">
                <Bot className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-2">
                  Nenhuma análise salva
                </h3>
                <p className="text-neutral-500 mb-4">
                  Quando você analisar versículos com IA, eles aparecerão aqui.
                </p>
                <Button
                  onClick={handleBack}
                  className="bg-sage-500 hover:bg-sage-600 text-white"
                >
                  Começar Estudo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 pb-8">
              {analyses.map((analysis) => (
                <Card
                  key={analysis.id}
                  className="bg-white/80 backdrop-blur-sm border-neutral-200/50"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                          <h3 className="font-medium text-neutral-700">
                            {analysis.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(analysis.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteAnalysis(analysis.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Selected Verses */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {analysis.verses.length} versículo
                          {analysis.verses.length > 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {analysis.verses.map((verse, index) => (
                          <div
                            key={index}
                            className="p-3 bg-sage-50 rounded-lg border border-sage-200"
                          >
                            <p className="text-sm text-neutral-700 italic">
                              "{verse.text}"
                            </p>
                            <p className="text-xs text-sage-600 mt-1 font-medium">
                              {verse.reference}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Content */}
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="w-full">
                        <div className="prose prose-sm max-w-none">
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                            {formatAnalysisText(analysis.analysis)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedAnalyses;
