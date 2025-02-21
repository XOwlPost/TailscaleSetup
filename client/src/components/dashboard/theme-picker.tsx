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
  blue: { primary: '#3b82f6', background: '#f8fafc', text: '#1e293b' },
  green: { primary: '#22c55e', background: '#f7fee7', text: '#14532d' },
  purple: { primary: '#a855f7', background: '#faf5ff', text: '#581c87' },
  orange: { primary: '#f97316', background: '#fff7ed', text: '#7c2d12' },
  dark: { primary: '#64748b', background: '#1e293b', text: '#f8fafc' },
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