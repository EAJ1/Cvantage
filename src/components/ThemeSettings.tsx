import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Palette, Moon, Sun, RotateCcw } from 'lucide-react';
import { ThemeSettings as ThemeSettingsType, defaultThemeSettings, saveThemeSettings } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface ThemeSettingsProps {
  themeSettings: ThemeSettingsType;
  onThemeChange: (settings: ThemeSettingsType) => void;
}

const colorPresets = [
  { name: 'Blue', primary: '#2563eb', accent: '#3b82f6' },
  { name: 'Dark Blue', primary: '#1e3a8a', accent: '#3730a3', special: '✨' },
  { name: 'Purple', primary: '#7c3aed', accent: '#8b5cf6' },
  { name: 'Green', primary: '#059669', accent: '#10b981' },
  { name: 'Red', primary: '#dc2626', accent: '#ef4444' },
  { name: 'Orange', primary: '#ea580c', accent: '#f97316' },
  { name: 'Pink', primary: '#db2777', accent: '#ec4899' },
  { name: 'Teal', primary: '#0d9488', accent: '#14b8a6' },
  { name: 'Indigo', primary: '#4f46e5', accent: '#6366f1' },
  { name: 'Stars', primary: '#0f172a', accent: '#1e293b', special: '⭐' },
];

export function ThemeSettings({ themeSettings, onThemeChange }: ThemeSettingsProps) {
  const handleColorChange = (color: string, type: 'primary' | 'accent') => {
    const updatedSettings = {
      ...themeSettings,
      [type === 'primary' ? 'primaryColor' : 'accentColor']: color
    };
    onThemeChange(updatedSettings);
    saveThemeSettings(updatedSettings);
  };

  const handleDarkModeToggle = (isDark: boolean) => {
    const updatedSettings = {
      ...themeSettings,
      isDarkMode: isDark
    };
    onThemeChange(updatedSettings);
    saveThemeSettings(updatedSettings);
    toast.success(isDark ? 'Dark mode enabled' : 'Light mode enabled');
  };

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    const updatedSettings = {
      ...themeSettings,
      primaryColor: preset.primary,
      accentColor: preset.accent
    };
    onThemeChange(updatedSettings);
    saveThemeSettings(updatedSettings);
    toast.success(`${preset.name} theme applied`);
  };

  const resetToDefaults = () => {
    const updatedSettings = {
      ...defaultThemeSettings,
      isDarkMode: themeSettings.isDarkMode // Preserve dark mode setting
    };
    onThemeChange(updatedSettings);
    saveThemeSettings(updatedSettings);
    toast.success('Theme reset to defaults');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {themeSettings.isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
            </div>
            <Switch
              checked={themeSettings.isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>

          {/* Color Presets */}
          <div className="space-y-3">
            <Label>Color Themes</Label>
            <div className="grid grid-cols-4 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className={`relative group p-3 rounded-lg border-2 transition-all ${
                    themeSettings.primaryColor === preset.primary
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-1 relative">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.accent }}
                      />
                      {preset.special && (
                        <span className="absolute -top-1 -right-1 text-xs">{preset.special}</span>
                      )}
                    </div>
                    <span className="text-xs font-medium">{preset.name}</span>
                  </div>
                  {themeSettings.primaryColor === preset.primary && (
                    <div className="absolute -top-1 -right-1">
                      <Badge variant="default" className="text-xs px-1.5 py-0.5">
                        Active
                      </Badge>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="primary-color"
                  type="color"
                  value={themeSettings.primaryColor}
                  onChange={(e) => handleColorChange(e.target.value, 'primary')}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <div className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                  {themeSettings.primaryColor}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="accent-color"
                  type="color"
                  value={themeSettings.accentColor}
                  onChange={(e) => handleColorChange(e.target.value, 'accent')}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <div className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                  {themeSettings.accentColor}
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t">
            <Button variant="outline" onClick={resetToDefaults} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}