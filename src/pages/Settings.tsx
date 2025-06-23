import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Key, MessageSquare, Info } from "lucide-react";
import BibleHeader from "@/components/BibleHeader";
import AISettings from "@/components/AISettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [hasCustomPrompt, setHasCustomPrompt] = useState(false);
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // Carregar configurações salvas
    const savedApiKey = localStorage.getItem("gemini_api_key");
    const savedPrompt = localStorage.getItem("gemini_custom_prompt");

    if (savedApiKey) {
      setApiKey(savedApiKey);
      setHasApiKey(true);
    }

    if (savedPrompt) {
      setCustomPrompt(savedPrompt);
      setHasCustomPrompt(true);
    } else {
      // Prompt padrão para análise bíblica
      setCustomPrompt(
        "Você é um assistente especializado em estudos bíblicos. Analise o(s) versículo(s) fornecido(s) considerando:\n\n" +
          "1. Contexto histórico e cultural\n" +
          "2. Significado teológico\n" +
          "3. Aplicação prática para hoje\n" +
          "4. Conexões com outras passagens bíblicas\n\n" +
          "Forneça uma análise clara, respeitosa e educativa.",
      );
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim() && !customPrompt.trim()) {
      toast({
        title: "Aviso",
        description: "Adicione pelo menos uma configuração para salvar.",
        variant: "destructive",
      });
      return;
    }

    // Salvar configurações no localStorage
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey);
      setHasApiKey(true);
    }

    if (customPrompt.trim()) {
      localStorage.setItem("gemini_custom_prompt", customPrompt);
      setHasCustomPrompt(true);
    }

    // Feedback detalhado sobre o que foi salvo
    let message = "Configurações salvas: ";
    const saved = [];

    if (apiKey.trim()) saved.push("Chave da API");
    if (customPrompt.trim()) saved.push("Prompt personalizado");

    message += saved.join(" e ");

    toast({
      title: "Sucesso",
      description: message,
    });
  };

  const handleSaveAll = () => {
    // Salvar API key e prompt
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey);
      setHasApiKey(true);
    }

    if (customPrompt.trim()) {
      localStorage.setItem("gemini_custom_prompt", customPrompt);
      setHasCustomPrompt(true);
    }

    // Salvar configurações do modelo IA também
    const aiSettings = JSON.parse(
      localStorage.getItem("ai_model_settings") || "{}",
    );

    // Atualizar timestamp das configurações
    const allSettings = {
      apiKey: apiKey || "",
      customPrompt: customPrompt || "",
      aiModelSettings: aiSettings,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("all_app_settings", JSON.stringify(allSettings));

      toast({
        title: "Todas as configurações salvas!",
        description:
          "API key, prompt personalizado e configurações do modelo IA foram salvos com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar todas as configurações.",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = () => {
    // Simular teste de conexão
    if (apiKey.trim()) {
      toast({
        title: "Conexão testada",
        description: "Chave de API válida! (simulação)",
      });
    } else {
      toast({
        title: "Erro",
        description: "Insira uma chave de API para testar.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen modern-gradient">
      <BibleHeader onMenuClick={handleBack} hideMenuButton={true} />

      <div className="px-2 sm:px-4 lg:px-6 py-8 max-w-none mx-auto">
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
            <h1 className="text-2xl font-medium text-neutral-700 tracking-tight">
              Configurações
            </h1>
          </div>

          {/* AI Model Settings */}
          <div className="w-full">
            <AISettings />
          </div>

          {/* API Configuration */}
          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <Key className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium text-neutral-700">
                    Configuração da API
                  </h2>
                  {hasApiKey && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      ✓ Salva
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="apiKey"
                  className="text-sm font-medium text-neutral-600"
                >
                  Chave da API do Gemini
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Insira sua chave da API do Google Gemini"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 bg-white border-neutral-200 focus:border-sage-300 focus:ring-sage-100"
                  />
                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    className="border-neutral-200 hover:bg-sage-50"
                  >
                    Testar
                  </Button>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs text-neutral-600">
                    Sua chave de API é armazenada localmente no seu dispositivo.
                    Obtenha sua chave em:
                    https://makersuite.google.com/app/apikey
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Configuration */}
          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium text-neutral-700">
                    Prompt Personalizado
                  </h2>
                  {hasCustomPrompt && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      ✓ Salvo
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="customPrompt"
                  className="text-sm font-medium text-neutral-600"
                >
                  Instruções para Análise Bíblica
                </Label>
                <Textarea
                  id="customPrompt"
                  placeholder="Personalize como o assistente deve analisar os versículos..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[200px] bg-white border-neutral-200 focus:border-sage-300 focus:ring-sage-100 resize-none"
                />
                <p className="text-xs text-neutral-500">
                  Este prompt será usado quando você solicitar análise de
                  versículos selecionados.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save All Button */}
          <div className="flex flex-col gap-3">
            <div className="text-center">
              <h3 className="text-lg font-medium text-neutral-700 mb-2">
                Salvar Todas as Configurações
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                Salva a chave da API, prompt personalizado e todas as
                configurações do modelo IA
              </p>
            </div>

            <Button
              onClick={handleSaveAll}
              className="w-full bg-gradient-to-r from-sage-500 to-blue-500 hover:from-sage-600 hover:to-blue-600 text-white py-3 text-lg font-semibold shadow-lg"
            >
              <Save className="h-5 w-5 mr-3" />
              Salvar Todas as Configurações
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                variant="outline"
                className="flex-1 border-sage-200 hover:bg-sage-50 text-sage-700"
              >
                Salvar API e Prompt
              </Button>
              <Button
                onClick={() => {
                  // Trigger save from AISettings component
                  const event = new CustomEvent("saveAISettings");
                  window.dispatchEvent(event);
                }}
                variant="outline"
                className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-700"
              >
                Salvar Modelo IA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
