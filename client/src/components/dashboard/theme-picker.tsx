import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Paintbrush } from "lucide-react";
import { useWidgetStore, type Widget } from "./widget-store";

interface ThemePickerProps {
  widgetId: string;
  currentTheme?: Widget['theme'];
}

const THEME_OPTIONS = {
  blue: { 
    primary: '#2563eb',  // Proper blue
    background: '#eff6ff', 
    text: '#1e40af' 
  },
  green: { 
    primary: '#16a34a',  // Proper green
    background: '#f0fdf4', 
    text: '#166534' 
  },
  purple: { 
    primary: '#9333ea',  // Proper purple
    background: '#faf5ff', 
    text: '#6b21a8' 
  },
  orange: { 
    primary: '#ea580c',  // Proper orange
    background: '#fff7ed', 
    text: '#9a3412' 
  },
  dark: { 
    primary: '#334155',  // Proper dark slate
    background: '#1e293b', 
    text: '#f8fafc' 
  },
};

export function ThemePicker({ widgetId, currentTheme }: ThemePickerProps) {
  const { updateWidgetTheme } = useWidgetStore();

  const getCurrentThemeName = () => {
    if (!currentTheme?.primary) return 'blue';
    return Object.entries(THEME_OPTIONS).find(
      ([_, theme]) => theme.primary === currentTheme.primary
    )?.[0] || 'blue';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(THEME_OPTIONS).map(([name, theme]) => (
          <DropdownMenuItem
            key={name}
            onClick={() => updateWidgetTheme(widgetId, theme)}
            className="flex items-center gap-2"
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="capitalize">{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}