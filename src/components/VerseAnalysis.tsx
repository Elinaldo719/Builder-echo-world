import { useState } from "react";
import { Bot, Sparkles, Send, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { BibleVerse, BibleBookInfo } from "@/types/bible";

// Função para formatar o texto da análise de forma profissional
const formatAnalysisText = (text: string) => {
  // Remove asteriscos, hashtags e tags markdown
  let cleanText = text
    .replace(/\*\*/g, "") // Remove **
    .replace(/\*/g, "") // Remove *
    .replace(/###/g, "") // Remove ###
    .replace(/##/g, "") // Remove ##
    .replace(/#/g, "") // Remove #
    .replace(/\[.*?\]/g, "") // Remove tags [texto]
    .replace(/<.*?>/g, "") // Remove tags HTML
    .trim();

  // Quebra o texto em seções
  const sections = cleanText.split(/\n\s*\n/);

  return sections.map((section, index) => {
    const trimmed = section.trim();
    if (!trimmed) return null;

    // Identifica títulos principais (palavras em MAIÚSCULA ou títulos comuns)
    if (
      trimmed.match(/^[A-ZÀ-Ù\s]{3,}:?\s*$/) ||
      trimmed.match(/^(ANÁLISE|CONTEXTO|SIGNIFICADO|APLICAÇÃO|CONEXÕES|REFLEXÃO|VERSÍCULOS|CONCLUSÃO)/i)
    ) {
      return (
        <div key={index} className="mb-6 first:mt-0">
          <h2 className="text-xl font-bold text-blue-700 mb-3 pb-2 border-b-2 border-blue-200">
            {trimmed.replace(/:/g, "")}
          </h2>
        </div>
      );
    }

    // Identifica subtítulos (linha que termina com : e tem menos de 80 caracteres)
    if (trimmed.endsWith(":") && trimmed.length < 80 && !trimmed.includes(".")) {
      return (
        <h3
          key={index}
          className="text-lg font-semibold text-purple-700 mb-3 mt-5 first:mt-0"
        >
          {trimmed.replace(/:/g, "")}
        </h3>
      );
    }

    // Identifica listas (linhas que começam com -, •, ou números)
    if (trimmed.match(/^[\-•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      const items = trimmed
        .split("\n")
        .filter((line) => line.trim().match(/^[\-•\d]/));

      return (
        <div key={index} className="mb-4">
          <ul className="space-y-2">
            {items.map((item, i) => {
              const cleanItem = item.replace(/^[\-•\d\.\s]+/, "").trim();
              return (
                <li key={i} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <span>{cleanItem}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    // Identifica citações bíblicas (contém nome de livro e números)
    if (trimmed.match(/\b[A-ZÀ-Ù][a-zà-ù]+\s+\d+:\d+/)) {
      return (
        <blockquote
          key={index}
          className="border-l-4 border-green-400 bg-green-50 pl-4 py-3 my-4 italic text-gray-800 rounded-r-lg"
        >
          {trimmed}
        </blockquote>
      );
    }

    // Texto normal com formatação melhorada
    return (
      <div key={index} className="mb-4">
        <p className="text-gray-800 leading-relaxed text-base">
          {trimmed.split('\n').map((line, lineIndex) => (
            <span key={lineIndex}>
              {line.trim()}
              {lineIndex < trimmed.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    );
  });
};

interface VerseAnalysisProps {
  selectedVerses: Array<{
    verse: BibleVerse;
    book: BibleBookInfo;
    chapter: number;
  }>;
  onClose?: () => void;
}

const VerseAnalysis = ({ selectedVerses, onClose }: VerseAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const { toast } = useToast();

  // Verificar configurações da API
  const hasApiKey = localStorage.getItem("gemini_api_key");
  const hasCustomPrompt = localStorage.getItem("gemini_custom_prompt");

  const handleSaveAnalysis = () => {
    if (!analysis) return;

    const analysisData = {
      id: Date.now().toString(),
      title: `Estudo de ${selectedVerses.length} versículo${selectedVerses.length > 1 ? 's' : ''}`,
      verses: selectedVerses.map(({ verse, book, chapter }) => ({
        text: verse.text,
        reference: `${book.name} ${chapter}:${verse.number}`,
      })),
      analysis: analysis,
      date: new Date().toISOString(),
    };

    // Salvar no localStorage
    const existingAnalyses = JSON.parse(localStorage.getItem("saved_analyses") || "[]");
    existingAnalyses.unshift(analysisData); // Adiciona no início da lista
    localStorage.setItem("saved_analyses", JSON.stringify(existingAnalyses));

    toast({
      title: "Análise salva com sucesso!",
      description: "Você pode acessá-la na seção 'Análises Salvas'.",
    });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    try {
      // Obter configurações salvas
      const apiKey = localStorage.getItem("gemini_api_key");
      const customPrompt = localStorage.getItem("gemini_custom_prompt") ||
        "Analise os versículos bíblicos fornecidos considerando contexto histórico, significado teológico e aplicação prática.";

      const aiSettings = JSON.parse(localStorage.getItem("ai_model_settings") || "{}");

      console.log('API Key presente:', !!apiKey);
      console.log('Configurações AI:', aiSettings);
      console.log('Prompt personalizado:', customPrompt);

      // Preparar versículos para análise
      const versesText = selectedVerses
        .map(
          ({ verse, book, chapter }) =>
            `${book.name} ${chapter}:${verse.number} - "${verse.text}"`,
        )
        .join("\n\n");

      // Construir prompt completo
      const fullPrompt = `${customPrompt}

VERSÍCULOS PARA ANÁLISE:
${versesText}

Por favor, forneça uma análise detalhada e bem estruturada destes versículos.`;

      // Validar chave da API
      if (apiKey && apiKey.trim() && apiKey.length > 10) {
        // Fazer chamada real para a API do Gemini
        try {
          // Corrigir o nome do modelo
          const modelName = aiSettings.model === 'gemini-2.5-flash' ? 'gemini-1.5-flash' :
                           aiSettings.model === 'gemini-1.5-pro' ? 'gemini-1.5-pro' :
                           aiSettings.model === 'gemini-1.0-pro' ? 'gemini-1.0-pro' :
                           'gemini-1.5-flash';

          console.log('Fazendo chamada para Gemini API:', modelName);

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: fullPrompt
                }]
              }],
              generationConfig: {
                temperature: aiSettings.temperature ? aiSettings.temperature[0] : 1,
                maxOutputTokens: 4096,
                topP: 0.95,
                topK: 64,
              }
            })
          });

          console.log('Resposta da API:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Dados recebidos:', data);

            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
              // Salva o texto original para formatação posterior
              setAnalysis(generatedText);
              setIsAnalyzing(false);

              toast({
                title: "Análise concluída!",
                description: "Análise gerada com sucesso pelo Gemini.",
              });
              return;
            }
            } else {
              throw new Error("Resposta vazia da API");
            }
          } else {
            const errorData = await response.text();
            console.error("Erro da API:", response.status, errorData);
            throw new Error(`Erro da API: ${response.status} - ${errorData}`);
          }
        } catch (apiError) {
          console.error("Erro na API do Gemini:", apiError);
          let errorMessage = "Erro desconhecido na API";

          if (apiError.message.includes("403")) {
            errorMessage = "Chave da API inválida ou sem permissão";
          } else if (apiError.message.includes("400")) {
            errorMessage = "Requisição inválida - verifique as configurações";
          } else if (apiError.message.includes("429")) {
            errorMessage = "Limite de uso excedido - tente novamente mais tarde";
          } else if (apiError.message.includes("Failed to fetch")) {
            errorMessage = "Erro de conexão - verifique sua internet";
          }

          toast({
            title: "Erro na API do Gemini",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else {
        // Sem API key válida
        toast({
          title: "API key necessária",
          description: "Configure uma chave da API do Gemini válida nas configurações.",
          variant: "destructive",
        });
      }

      // Fallback: Análise local melhorada baseada no prompt personalizado
      setTimeout(() => {
        const analysisTemplate = `ANÁLISE BÍBLICA LOCAL

VERSÍCULOS ANALISADOS:
${versesText}

PROMPT UTILIZADO:
"${customPrompt}"

ANÁLISE:

Contexto Histórico:
Os versículos selecionados fazem parte do rico contexto das Escrituras Sagradas, cada um carregando significado profundo em seu ambiente histórico e cultural.

Significado Teológico:
Estas passagens revelam aspectos fundamentais da relação entre Deus e a humanidade, apresentando verdades eternas que transcendem o tempo.

Aplicação Prática:
Para nossa vida hoje, estes versículos nos convidam à reflexão sobre como podemos viver de acordo com os princípios bíblicos, aplicando seus ensinamentos em nosso cotidiano.

OBSERVAÇÃO:
Esta é uma análise básica gerada localmente. Para análises mais detalhadas e personalizadas com IA:

1. Vá em Configurações (menu)
2. Configure sua chave da API do Gemini
3. Personalize seu prompt de análise
4. Tente novamente

A integração com Gemini proporcionará análises muito mais profundas e contextualizadas conforme seu prompt personalizado.`;

        setAnalysis(analysisTemplate);
        setIsAnalyzing(false);

        toast({
          title: "Análise local concluída",
          description: "Configure a API do Gemini para análises mais detalhadas.",
        });
      }, 2000);

    } catch (error) {
      console.error("Erro na análise:", error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a análise. Tente novamente.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm border-neutral-200/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-medium text-neutral-700 tracking-tight">
              Análise de Versículos
            </h3>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-600 font-medium">Gemini</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selected Verses */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-600">
              Versículos Selecionados
            </h4>
            <Badge
              variant="outline"
              className="bg-white border-neutral-200 text-neutral-600"
            >
              {selectedVerses.length} versículo
              {selectedVerses.length > 1 ? "s" : ""}
            </Badge>
          </div>

          <ScrollArea className="max-h-40 w-full">
            <div className="space-y-2">
              {selectedVerses.map(({ verse, book, chapter }, index) => (
                <div
                  key={index}
                  className="p-3 bg-sage-50 rounded-lg border border-sage-200"
                >
                  <div className="flex items-start gap-2">
                    <Badge
                      variant="secondary"
                      className="mt-0.5 text-xs bg-sage-100 text-sage-700"
                    >
                      {verse.number}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {verse.text}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {book.name} {chapter}:{verse.number}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Analysis Section */}
        {!analysis && !isAnalyzing && (
          <div className="text-center py-6">
            <div className="mb-4">
              <p className="text-sm text-neutral-600 mb-2">
                Clique no botão abaixo para gerar uma análise detalhada dos
                versículos selecionados.
              </p>

              {/* Status das configurações */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-neutral-500">
                    API Key {hasApiKey ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${hasCustomPrompt ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-neutral-500">
                    Prompt {hasCustomPrompt ? 'Personalizado' : 'Padrão'}
                  </span>
                </div>
              </div>

              {!hasApiKey && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md mb-2">
                  ⚠️ Configure sua API key do Gemini nas configurações para análises mais detalhadas
                </p>
              )}
            </div>

            <Button
              onClick={handleAnalyze}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              {hasApiKey ? 'Analisar com Gemini' : 'Análise Local'}
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="animate-pulse space-y-3">
              <Bot className="h-8 w-8 mx-auto text-blue-500 animate-bounce" />
              <p className="text-sm text-neutral-600">
                Analisando versículos com IA...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                Análise Gerada
              </h4>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Gemini IA
              </Badge>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl border border-blue-200 p-6 shadow-sm">
                <div className="prose prose-lg max-w-none">
                  <div className="font-serif leading-relaxed">
                    {formatAnalysisText(analysis)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleSaveAnalysis}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Análise
              </Button>
              <Button
                variant="outline"
                onClick={() => setAnalysis("")}
                className="border-gray-300 hover:bg-gray-50"
              >
                Nova Análise
              </Button>
              <Button
                variant="outline"
                className="border-blue-300 hover:bg-blue-50 text-blue-700"
              >
                Compartilhar
              </Button>
            </div>
          </div>
        )}
        )}
      </CardContent>
    </Card>
  );
};

export default VerseAnalysis;