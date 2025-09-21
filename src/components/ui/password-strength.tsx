import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[@$!%*?&]/.test(pwd)) score += 1;
    
    const strengthMap = {
      0: { label: 'Muito Fraca', color: 'destructive' },
      1: { label: 'Muito Fraca', color: 'destructive' },
      2: { label: 'Fraca', color: 'destructive' },
      3: { label: 'Média', color: 'secondary' },
      4: { label: 'Forte', color: 'default' },
      5: { label: 'Muito Forte', color: 'default' },
    };
    
    return {
      score: (score / 5) * 100,
      label: strengthMap[score as keyof typeof strengthMap].label,
      color: strengthMap[score as keyof typeof strengthMap].color
    };
  };

  if (!password) return null;

  const strength = calculateStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Força da senha:</span>
        <Badge variant={strength.color as any} className="text-xs">
          {strength.label}
        </Badge>
      </div>
      <Progress value={strength.score} className="h-2" />
      <div className="text-xs text-muted-foreground space-y-1">
        <div>A senha deve conter:</div>
        <ul className="space-y-1 ml-4">
          <li className={password.length >= 8 ? 'text-green-600' : ''}>
            • Pelo menos 8 caracteres
          </li>
          <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
            • Letras minúsculas
          </li>
          <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
            • Letras maiúsculas
          </li>
          <li className={/\d/.test(password) ? 'text-green-600' : ''}>
            • Números
          </li>
          <li className={/[@$!%*?&]/.test(password) ? 'text-green-600' : ''}>
            • Símbolos (@$!%*?&)
          </li>
        </ul>
      </div>
    </div>
  );
};