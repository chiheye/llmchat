"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Settings, Save, RotateCcw } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export interface ModelParameters {
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  maxTokens: number
  systemPrompt: string
  stopSequences: string[]
  responseFormat: string
  seed?: number
  useJsonMode: boolean
}

interface ModelParametersProps {
  parameters: ModelParameters
  onParametersChange: (parameters: ModelParameters) => void
  modelId: string
}

export function ModelParameters({ parameters, onParametersChange, modelId }: ModelParametersProps) {
  const [localParameters, setLocalParameters] = useState<ModelParameters>({ ...parameters })
  const [stopSequence, setStopSequence] = useState("")

  const handleSave = () => {
    onParametersChange(localParameters)
  }

  const handleReset = () => {
    // Reset to default values based on model
    const defaults = getDefaultParameters(modelId)
    setLocalParameters(defaults)
  }

  const addStopSequence = () => {
    if (stopSequence && !localParameters.stopSequences.includes(stopSequence)) {
      setLocalParameters({
        ...localParameters,
        stopSequences: [...localParameters.stopSequences, stopSequence],
      })
      setStopSequence("")
    }
  }

  const removeStopSequence = (sequence: string) => {
    setLocalParameters({
      ...localParameters,
      stopSequences: localParameters.stopSequences.filter((s) => s !== sequence),
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-blue-950/40 border-blue-500/30 hover:bg-blue-900/50 hover:border-blue-400/40 text-blue-300"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Model Parameters</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto border-blue-500/30 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>

        <SheetHeader className="relative z-10">
          <SheetTitle className="text-2xl font-bold text-white">Model Parameters</SheetTitle>
          <SheetDescription className="text-blue-200">
            Configure parameters for the selected AI model. These settings affect how the model generates responses.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6 relative z-10">
          <Accordion type="single" collapsible className="w-full" defaultValue="generation">
            <AccordionItem value="generation" className="border-blue-500/30">
              <AccordionTrigger className="text-white hover:text-blue-200">Generation Parameters</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 text-blue-100">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature" className="text-blue-100">
                      Temperature: {localParameters.temperature.toFixed(2)}
                    </Label>
                    <span className="text-xs text-blue-300">Controls randomness (0 = deterministic, 2 = random)</span>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={2}
                    step={0.01}
                    value={[localParameters.temperature]}
                    onValueChange={([value]) => setLocalParameters({ ...localParameters, temperature: value })}
                    className="[&>span]:bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="top-p" className="text-blue-100">
                      Top P: {localParameters.topP.toFixed(2)}
                    </Label>
                    <span className="text-xs text-blue-300">Controls diversity via nucleus sampling</span>
                  </div>
                  <Slider
                    id="top-p"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[localParameters.topP]}
                    onValueChange={([value]) => setLocalParameters({ ...localParameters, topP: value })}
                    className="[&>span]:bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="frequency-penalty" className="text-blue-100">
                      Frequency Penalty: {localParameters.frequencyPenalty.toFixed(2)}
                    </Label>
                    <span className="text-xs text-blue-300">Reduces repetition of tokens</span>
                  </div>
                  <Slider
                    id="frequency-penalty"
                    min={-2}
                    max={2}
                    step={0.01}
                    value={[localParameters.frequencyPenalty]}
                    onValueChange={([value]) => setLocalParameters({ ...localParameters, frequencyPenalty: value })}
                    className="[&>span]:bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="presence-penalty" className="text-blue-100">
                      Presence Penalty: {localParameters.presencePenalty.toFixed(2)}
                    </Label>
                    <span className="text-xs text-blue-300">Encourages discussing new topics</span>
                  </div>
                  <Slider
                    id="presence-penalty"
                    min={-2}
                    max={2}
                    step={0.01}
                    value={[localParameters.presencePenalty]}
                    onValueChange={([value]) => setLocalParameters({ ...localParameters, presencePenalty: value })}
                    className="[&>span]:bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens" className="text-blue-100">
                    Max Tokens
                  </Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    min={1}
                    max={32000}
                    value={localParameters.maxTokens}
                    onChange={(e) =>
                      setLocalParameters({
                        ...localParameters,
                        maxTokens: Number.parseInt(e.target.value) || 1024,
                      })
                    }
                    className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                  />
                  <p className="text-xs text-blue-300">
                    Maximum number of tokens to generate. Higher values may result in longer responses.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seed" className="text-blue-100">
                    Random Seed (optional)
                  </Label>
                  <Input
                    id="seed"
                    type="number"
                    placeholder="Leave empty for random"
                    value={localParameters.seed || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number.parseInt(e.target.value)
                      setLocalParameters({ ...localParameters, seed: value })
                    }}
                    className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                  />
                  <p className="text-xs text-blue-300">
                    Set a specific seed for deterministic outputs. Same seed with same prompt produces similar results.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prompt" className="border-blue-500/30">
              <AccordionTrigger className="text-white hover:text-blue-200">System Prompt</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 text-blue-100">
                <div className="space-y-2">
                  <Label htmlFor="system-prompt" className="text-blue-100">
                    System Prompt
                  </Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Instructions for the AI model..."
                    value={localParameters.systemPrompt}
                    onChange={(e) => setLocalParameters({ ...localParameters, systemPrompt: e.target.value })}
                    rows={6}
                    className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                  />
                  <p className="text-xs text-blue-300">
                    The system prompt provides context and instructions to the AI model about how it should behave.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advanced" className="border-blue-500/30">
              <AccordionTrigger className="text-white hover:text-blue-200">Advanced Settings</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 text-blue-100">
                <div className="space-y-2">
                  <Label htmlFor="response-format" className="text-blue-100">
                    Response Format
                  </Label>
                  <Select
                    value={localParameters.responseFormat}
                    onValueChange={(value) => setLocalParameters({ ...localParameters, responseFormat: value })}
                  >
                    <SelectTrigger
                      id="response-format"
                      className="bg-blue-950/50 border-blue-500/30 text-white focus:ring-blue-400/30"
                    >
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-950 border-blue-500/30 text-white">
                      <SelectItem value="text" className="focus:bg-blue-800 focus:text-white">
                        Text
                      </SelectItem>
                      <SelectItem value="json" className="focus:bg-blue-800 focus:text-white">
                        JSON
                      </SelectItem>
                      <SelectItem value="markdown" className="focus:bg-blue-800 focus:text-white">
                        Markdown
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-blue-300">Preferred format for the model's response.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="json-mode" className="text-blue-100">
                      JSON Mode
                    </Label>
                    <Switch
                      id="json-mode"
                      checked={localParameters.useJsonMode}
                      onCheckedChange={(checked) => setLocalParameters({ ...localParameters, useJsonMode: checked })}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                  <p className="text-xs text-blue-300">
                    Forces the model to output valid JSON. Only works with compatible models.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-100">Stop Sequences</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a stop sequence..."
                      value={stopSequence}
                      onChange={(e) => setStopSequence(e.target.value)}
                      className="bg-blue-950/50 border-blue-500/30 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/30"
                    />
                    <Button
                      type="button"
                      onClick={addStopSequence}
                      disabled={!stopSequence}
                      className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2">
                    {localParameters.stopSequences.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {localParameters.stopSequences.map((sequence, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-blue-900/50 border border-blue-500/30 rounded-md px-2 py-1 text-sm"
                          >
                            <code>{sequence}</code>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1 text-blue-300 hover:text-white hover:bg-transparent"
                              onClick={() => removeStopSequence(sequence)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-blue-300">No stop sequences defined</p>
                    )}
                  </div>
                  <p className="text-xs text-blue-300">
                    The model will stop generating text when it encounters any of these sequences.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <SheetFooter className="relative z-10 border-t border-blue-500/30 pt-4">
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="border-blue-400 text-blue-200 hover:bg-blue-800/20 hover:text-white"
                >
                  Cancel
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Helper function to get default parameters based on model
function getDefaultParameters(modelId: string): ModelParameters {
  // Default parameters for different models
  switch (modelId) {
    case "gpt-4":
    case "gpt-4o":
      return {
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        maxTokens: 4096,
        systemPrompt: "You are a helpful assistant.",
        stopSequences: [],
        responseFormat: "text",
        useJsonMode: false,
      }
    case "claude-3-opus":
    case "claude-3-sonnet":
      return {
        temperature: 0.7,
        topP: 0.9,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        maxTokens: 4096,
        systemPrompt: "You are Claude, a helpful AI assistant created by Vercel.",
        stopSequences: [],
        responseFormat: "text",
        useJsonMode: false,
      }
    default:
      return {
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        maxTokens: 2048,
        systemPrompt: "You are a helpful assistant.",
        stopSequences: [],
        responseFormat: "text",
        useJsonMode: false,
      }
  }
}

