// src/components/TestMarkdown.jsx
import ReactMarkdown from 'react-markdown';

export const TestMarkdown = ({ content }) => {
  const testContent = `# Titre de test

Ceci est un **paragraphe normal** avec du texte en gras.

## Sous-titre

Un autre paragraphe pour tester.

- Item 1
- Item 2
- Item 3

**Dernier paragraphe.**`;

  return (
    <div className="space-y-6">
      <div className="border p-4">
        <h3 className="text-lg font-bold mb-2">Test avec contenu fixe:</h3>
        <ReactMarkdown>{testContent}</ReactMarkdown>
      </div>
      
      <div className="border p-4">
        <h3 className="text-lg font-bold mb-2">Test avec votre contenu:</h3>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      
      <div className="border p-4 bg-gray-50">
        <h3 className="text-lg font-bold mb-2">Contenu brut (debug):</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {content}
        </pre>
      </div>
    </div>
  );
};