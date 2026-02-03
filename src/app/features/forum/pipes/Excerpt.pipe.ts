// pipes/excerpt.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt',
  standalone: true,
  pure: true // Pipe pure par défaut, mais explicite pour la clarté
})
export class ExcerptPipe implements PipeTransform {
  /**
   * Transforme un texte en extrait limité
   * @param value Texte d'entrée
   * @param maxLength Longueur maximale (défaut: 120)
   * @param suffix Suffix à ajouter (défaut: '...')
   * @returns Texte tronqué avec suffix si nécessaire
   */
  transform(value: string | null | undefined, maxLength: number = 120, suffix: string = '...'): string {
    // Gestion des valeurs nulles ou vides
    if (!value) return '';
    
    const trimmed = value.trim();
    
    // Si le texte est plus court que la limite, retourner le texte complet
    if (trimmed.length <= maxLength) {
      return trimmed;
    }
    
    // Trouver le dernier espace avant la limite pour éviter de couper un mot
    let truncated = trimmed.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) { // Si on peut couper à un espace raisonnable
      truncated = truncated.substring(0, lastSpaceIndex);
    }
    
    // Retirer toute ponctuation finale inappropriée
    truncated = truncated.replace(/[.,;:!?\s]+$/, '');
    
    return truncated + suffix;
  }
}