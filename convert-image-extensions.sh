#!/bin/bash

# Version simple et fiable pour macOS
# Usage: ./simple-convert-macos.sh

TARGET_DIR="public/content/museum/es"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Erreur: Le dossier '$TARGET_DIR' n'existe pas."
    exit 1
fi

echo "Conversion des extensions d'images en .webp"
echo "Dossier: $TARGET_DIR"
echo ""

# Utiliser Perl qui fonctionne bien sur macOS
for file in "$TARGET_DIR"/*.md; do
    if [ -f "$file" ]; then
        echo "Traitement: $(basename "$file")"
        
        # Créer une sauvegarde
        cp "$file" "$file.backup"
        
        # Version Perl - remplace toutes les occurrences
        perl -i -pe '
            # Remplacer dans les liens Markdown: ![alt](path/image.jpg)
            s/\.(jpg|jpeg|png|gif|bmp|tiff|tif)(?=\))/.webp/gi;
            
            # Remplacer dans les URLs simples
            s/\.(jpg|jpeg|png|gif|bmp|tiff|tif)(?=\s|$|"|'')/.webp/gi;
            
            # Remplacer dans les balises HTML
            s/\.(jpg|jpeg|png|gif|bmp|tiff|tif)(?=>|\s)/.webp/gi;
        ' "$file"
        
        echo "  ✓ Fichier modifié"
    fi
done

echo ""
echo "Terminé! Les sauvegardes sont dans: *.md.backup"