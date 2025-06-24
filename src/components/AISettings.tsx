import { useState, useEffect } from "react";
import { X, Settings, ChevronDown, Edit, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AISettingsProps {
  onClose?: () => void;
}

const AISettings = ({ onClose }: AISettingsProps) => {
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState([1]);
  const [outputLength, setOutputLength] = useState(65536);
  const [topP, setTopP] = useState([0.95]);
  const [thinkingMode, setThinkingMode] = useState(true);
  const [thinkingBudget, setThinkingBudget] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [codeExecution, setCodeExecution] = useState(false);
  const [functionCalling, setFunctionCalling] = useState(false);
  const [googleSearch, setGoogleSearch] = useState(true);
  const [urlContext, setUrlContext] = useState(false);
  const { toast } = useToast();

  const tokenCount = "0 / 1.048.576";

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem("ai_model_settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setModel(settings.model || "gemini-2.5-flash");
        setTemperature(settings.temperature || [1]);
        setOutputLength(settings.outputLength || 65536);
        setTopP(settings.topP || [0.95]);
        setThinkingMode(settings.thinkingMode ?? true);
        setThinkingBudget(settings.thinkingBudget ?? false);
        setStructuredOutput(settings.structuredOutput ?? false);
        setCodeExecution(settings.codeExecution ?? false);
        setFunctionCalling(settings.functionCalling ?? false);
        setGoogleSearch(settings.googleSearch ?? true);
        setUrlContext(settings.urlContext ?? false);
      } catch (error) {
        console.error("Erro ao carregar configurações da IA:", error);
      }
    }

    // Listen for save event from Settings page
    const handleSaveEvent = () => {
      handleSave();
    };

    window.addEventListener("saveAISettings", handleSaveEvent);

    return () => {
      window.removeEventListener("saveAISettings", handleSaveEvent);
    };
  }, [
    model,
    temperature,
    outputLength,
    topP,
    thinkingMode,
    thinkingBudget,
    structuredOutput,
    codeExecution,
    functionCalling,
    googleSearch,
    urlContext,
    toast,
  ]);

  // Função para salvar configurações
  const handleSave = () => {
    const settings = {
      model,
      temperature,
      outputLength,
      topP,
      thinkingMode,
      thinkingBudget,
      structuredOutput,
      codeExecution,
      functionCalling,
      googleSearch,
      urlContext,
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("ai_model_settings", JSON.stringify(settings));
      toast({
        title: "Configurações IA salvas!",
        description: `Modelo ${model} e configurações foram salvos com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-none bg-white/95 backdrop-blur-sm border-neutral-200/50 shadow-lg">
      <CardHeader className="pb-2 px-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sage-100 rounded-md">
              <Settings className="h-4 w-4 text-sage-600" />
            </div>
            <h3 className="text-lg font-medium text-neutral-700 tracking-tight">
              Configurações IA
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-700 hover:bg-sage-50 rounded-lg transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-2 pb-2">
        {/* Model Selection */}
        <div className="space-y-3">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-full bg-white border-neutral-200 focus:border-sage-300 focus:ring-sage-100 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Token Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600">
            Token count
          </span>
          <Badge
            variant="outline"
            className="bg-white border-neutral-200 text-neutral-600"
          >
            {tokenCount}
          </Badge>
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">
              Temperature
            </span>
            <div className="w-12 h-8 bg-white border border-neutral-200 rounded-md flex items-center justify-center">
              <span className="text-sm text-neutral-700">{temperature[0]}</span>
            </div>
          </div>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            max={2}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Output length */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600">
            Output length
          </span>
          <div className="w-20 h-8 bg-white border border-neutral-200 rounded-md flex items-center justify-center">
            <input
              type="number"
              value={outputLength}
              onChange={(e) => setOutputLength(Number(e.target.value))}
              className="w-full h-full text-sm text-neutral-700 text-center bg-transparent border-none outline-none"
            />
          </div>
        </div>

        {/* Top P */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">Top P</span>
            <div className="w-12 h-8 bg-white border border-neutral-200 rounded-md flex items-center justify-center">
              <span className="text-sm text-neutral-700">{topP[0]}</span>
            </div>
          </div>
          <Slider
            value={topP}
            onValueChange={setTopP}
            max={1}
            min={0}
            step={0.01}
            className="w-full"
          />
        </div>

        <Separator className="my-4" />

        {/* Thinking Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-neutral-700">Thinking</h4>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Thinking mode</span>
            <Switch
              checked={thinkingMode}
              onCheckedChange={setThinkingMode}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">
              Set thinking budget
            </span>
            <Switch
              checked={thinkingBudget}
              onCheckedChange={setThinkingBudget}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </div>

        <Separator className="my-4" />

        {/* Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-neutral-700">Tools</h4>
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">
                  Structured output
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-neutral-400 hover:text-neutral-600 h-6 px-2"
                >
                  Edit
                </Button>
              </div>
              <Switch
                checked={structuredOutput}
                onCheckedChange={setStructuredOutput}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Code execution</span>
              <Switch
                checked={codeExecution}
                onCheckedChange={setCodeExecution}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">
                  Function calling
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-neutral-400 hover:text-neutral-600 h-6 px-2"
                >
                  Edit
                </Button>
              </div>
              <Switch
                checked={functionCalling}
                onCheckedChange={setFunctionCalling}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">
                  Grounding with Google Search
                </span>
                <Switch
                  checked={googleSearch}
                  onCheckedChange={setGoogleSearch}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
              {googleSearch && (
                <div className="pl-4">
                  <span className="text-xs text-neutral-500">
                    Source: Google Search
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">URL context</span>
              <Switch
                checked={urlContext}
                onCheckedChange={setUrlContext}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full bg-sage-500 hover:bg-sage-600 text-white transition-all duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettings;
