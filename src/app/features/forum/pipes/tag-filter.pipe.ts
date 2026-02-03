// pipes/tag-filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

export interface TagFilterOptions {
  excludeSelected?: boolean;
  limit?: number;
  searchTerm?: string;
  sortBy?: 'alphabetical' | 'popularity';
  categories?: string[];
}

@Pipe({
  name: 'tagFilter',
  standalone: true,
  pure: true
})
export class TagFilterPipe implements PipeTransform {
  /**
   * Filtre et transforme une liste de tags selon les options
   * @param tags Liste des tags d'entrée
   * @param selectedTags Tags déjà sélectionnés (pour exclusion)
   * @param options Options de filtrage
   * @returns Liste filtrée et triée
   */
  transform(
    tags: string[] | null | undefined,
    selectedTags: string[] = [],
    options: TagFilterOptions = {}
  ): string[] {
    // Gestion des valeurs nulles
    if (!tags || !Array.isArray(tags)) {
      return [];
    }
    
    // Copie pour éviter de muter l'entrée
    let filteredTags = [...tags];
    
    // Exclure les tags déjà sélectionnés
    if (options.excludeSelected !== false && selectedTags.length > 0) {
      filteredTags = filteredTags.filter(tag => !selectedTags.includes(tag));
    }
    
    // Filtrer par terme de recherche
    if (options.searchTerm && options.searchTerm.trim()) {
      const searchTerm = options.searchTerm.toLowerCase().trim();
      filteredTags = filteredTags.filter(tag => 
        tag.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrer par catégories si spécifié
    if (options.categories && options.categories.length > 0) {
      // Cette logique dépend de votre implémentation des catégories de tags
      // Exemple: filtrer les tags qui appartiennent à certaines catégories
      filteredTags = filteredTags.filter(tag => {
        return this.tagBelongsToCategory(tag, options.categories!);
      });
    }
    
    // Trier les tags
    if (options.sortBy === 'alphabetical') {
      filteredTags.sort((a, b) => a.localeCompare(b));
    } else if (options.sortBy === 'popularity') {
      // Ici vous pourriez avoir une logique de popularité
      filteredTags.sort((a, b) => this.getTagPopularity(b) - this.getTagPopularity(a));
    }
    
    // Limiter le nombre de résultats
    if (options.limit && options.limit > 0) {
      filteredTags = filteredTags.slice(0, options.limit);
    }
    
    return filteredTags;
  }
  
  /**
   * Méthode helper pour déterminer si un tag appartient à une catégorie
   * @param tag Tag à vérifier
   * @param categories Catégories autorisées
   * @returns boolean
   */
  private tagBelongsToCategory(tag: string, categories: string[]): boolean {
    // Implémentation basée sur votre logique métier
    // Exemple simple: préfixes de catégories
    const tagCategories: Record<string, string[]> = {
      'difficulty': ['beginner', 'intermediate', 'advanced'],
      'type': ['cardio', 'strength', 'flexibility', 'recovery'],
      'goal': ['weight-loss', 'muscle-gain', 'maintenance'],
      'location': ['home-workout', 'gym', 'outdoor'],
      'time': ['morning-routine', 'evening-workout'],
      'diet': ['high-protein', 'low-carb', 'vegetarian', 'vegan'],
      'misc': ['injury', 'form-check', 'plateau', 'equipment']
    };
    
    // Trouver la catégorie du tag
    for (const [category, categoryTags] of Object.entries(tagCategories)) {
      if (categoryTags.includes(tag) && categories.includes(category)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Méthode helper pour obtenir la popularité d'un tag
   * @param tag Tag à évaluer
   * @returns Score de popularité
   */
  private getTagPopularity(tag: string): number {
    // Dans une application réelle, cela viendrait d'un service/API
    // Pour l'instant, on utilise une logique basique
    
    const popularityMap: Record<string, number> = {
      'beginner': 95,
      'intermediate': 75,
      'advanced': 60,
      'cardio': 85,
      'strength': 90,
      'weight-loss': 88,
      'muscle-gain': 82,
      'home-workout': 78,
      'gym': 72,
      'morning-routine': 65,
      'high-protein': 70,
      'injury': 40,
      'form-check': 55,
      'plateau': 50,
      // Valeurs par défaut
      'default': 30
    };
    
    return popularityMap[tag] || popularityMap['default'];
  }
}