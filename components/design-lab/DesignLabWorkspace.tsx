"use client";

import React, { useState, useEffect } from "react";
import { DesignLabConfiguration, DesignLabTemplateId } from "@/types/design-lab";
import { DESIGN_TEMPLATES } from "@/lib/design-lab/templateData";
import { saveDesign, getSavedDesigns, exportDesignJSON } from "@/lib/design-lab/designStorage";
import DesignLabNav from "./DesignLabNav";
import DesignLabModelSelector from "./DesignLabModelSelector";
import DesignLabViewport from "./DesignLabViewport";
import DesignLabCustomizerPanel from "./DesignLabCustomizerPanel";
import DesignLabSavedModal from "./DesignLabSavedModal";
import { CheckCircle2 } from "lucide-react";

export default function DesignLabWorkspace() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<DesignLabTemplateId>("f450-quadcopter");
  const [config, setConfig] = useState<DesignLabConfiguration>(
    DESIGN_TEMPLATES["f450-quadcopter"].defaultConfig
  );
  const [savedCount, setSavedCount] = useState<number>(0);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active template metadata
  const currentTemplate = DESIGN_TEMPLATES[selectedTemplateId] || DESIGN_TEMPLATES["f450-quadcopter"];

  // Load saved count on mount
  useEffect(() => {
    setSavedCount(getSavedDesigns().length);
  }, []);

  // Show temporary toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Switch template
  const handleSelectTemplate = (id: DesignLabTemplateId) => {
    setSelectedTemplateId(id);
    const template = DESIGN_TEMPLATES[id];
    if (template) {
      setConfig({
        ...template.defaultConfig,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      showToast(`Loaded ${template.name} (${template.subtitle}) template`);
    }
  };

  // Reset to original template default
  const handleReset = () => {
    setConfig({
      ...currentTemplate.defaultConfig,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    showToast("Reset to template default configuration");
  };

  // Save design configuration
  const handleSave = () => {
    setIsSaving(true);
    const saved = saveDesign(config);
    setConfig(saved);
    setSavedCount(getSavedDesigns().length);
    setIsSaving(false);
    showToast(`Saved "${config.name}" to browser storage`);
  };

  // Export JSON configuration
  const handleExportJSON = () => {
    exportDesignJSON(config);
    showToast(`Exported "${config.name}" JSON specification`);
  };

  // Load saved configuration from modal
  const handleLoadSavedConfig = (loaded: DesignLabConfiguration) => {
    if (DESIGN_TEMPLATES[loaded.templateId]) {
      setSelectedTemplateId(loaded.templateId);
    }
    setConfig(loaded);
    showToast(`Loaded saved design "${loaded.name}"`);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#0c0d12] text-white overflow-hidden select-none font-sans">
      {/* 1. Top Navigation Bar */}
      <DesignLabNav
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onExportJSON={handleExportJSON}
        savedCount={savedCount}
      />

      {/* 2. Main 3-Column Engineering Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left: Template Selector Sidebar */}
        <DesignLabModelSelector
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* Center: 3D Viewport Stage */}
        <DesignLabViewport
          templateId={selectedTemplateId}
          config={config}
          onSelectComponent={(comp) => {
            setConfig((prev) => ({
              ...prev,
              selectedComponentId: comp === prev.selectedComponentId ? null : comp,
            }));
          }}
        />

        {/* Right: Customization & Components Panel */}
        <DesignLabCustomizerPanel
          template={currentTemplate}
          config={config}
          onChangeConfig={setConfig}
          onReset={handleReset}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>

      {/* Saved Configurations Modal */}
      <DesignLabSavedModal
        isOpen={isSavedModalOpen}
        onClose={() => {
          setIsSavedModalOpen(false);
          setSavedCount(getSavedDesigns().length);
        }}
        onLoadConfig={handleLoadSavedConfig}
        currentConfigId={config.id}
      />

      {/* Sleek Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div className="px-4 py-2.5 rounded-2xl bg-[#161922] border border-[#ff5500]/40 text-white shadow-2xl flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 size={15} className="text-[#ff5500]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
