import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Camera } from 'lucide-react';

export default function BlogPostDebugger() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageTest, setImageTest] = useState(null);

  const testBlogPost = async () => {
    setLoading(true);
    const info = {
      steps: [],
      errors: [],
      warnings: []
    };

    try {
      // Step 1: Test manifest
      info.steps.push({ step: 1, name: 'Checking manifest.json', status: 'checking' });
      
      const manifestPath = '/content/blog/en/manifest.json';
      const manifestResponse = await fetch(manifestPath);
      
      if (!manifestResponse.ok) {
        info.errors.push('Manifest not found or not accessible');
        info.steps[0].status = 'error';
      } else {
        const manifest = await manifestResponse.json();
        info.steps[0].status = 'success';
        info.steps[0].data = manifest;
      }

      // Step 2: Test fetching the markdown file
      info.steps.push({ step: 2, name: 'Fetching markdown file', status: 'checking' });
      
      const mdPath = '/content/blog/en/2025-12-17-navigating-the-sky-the-complete-tourist-guide-to-la-paz\'s-cable-cars-mi-teleférico.md';
      const mdResponse = await fetch(mdPath);
      
      if (!mdResponse.ok) {
        info.errors.push(`Markdown file not accessible: ${mdResponse.status} ${mdResponse.statusText}`);
        info.steps[1].status = 'error';
        info.steps[1].httpStatus = mdResponse.status;
      } else {
        const mdContent = await mdResponse.text();
        info.steps[1].status = 'success';
        info.steps[1].contentLength = mdContent.length;
        info.steps[1].preview = mdContent.substring(0, 800);

        // Step 3: Try to extract YAML manually
        info.steps.push({ step: 3, name: 'Extracting YAML frontmatter', status: 'checking' });
        
        const yamlMatch = mdContent.match(/^---\n([\s\S]*?)\n---/);
        if (yamlMatch) {
          const yamlContent = yamlMatch[1];
          info.steps[2].status = 'success';
          info.steps[2].yamlContent = yamlContent;
          
          // Extract image paths manually
          const featuredImageMatch = yamlContent.match(/featuredImage:\s*\n\s+src:\s*(.+)\n\s+alt:\s*(.+)/);
          const imageMatch = yamlContent.match(/^image:\s*(.+)$/m);
          
          info.steps.push({ step: 4, name: 'Analyzing image paths', status: 'success' });
          info.steps[3].data = {
            featuredImageSrc: featuredImageMatch ? featuredImageMatch[1].trim() : null,
            featuredImageAlt: featuredImageMatch ? featuredImageMatch[2].trim() : null,
            imageFallback: imageMatch ? imageMatch[1].trim() : null
          };
          
          // Test image accessibility
          const imagePath = featuredImageMatch ? featuredImageMatch[1].trim() : (imageMatch ? imageMatch[1].trim() : null);
          
          if (imagePath) {
            info.steps.push({ step: 5, name: 'Testing image accessibility', status: 'checking', path: imagePath });
            
            const imgResponse = await fetch(imagePath);
            
            if (!imgResponse.ok) {
              info.errors.push(`Image not accessible: ${imgResponse.status} ${imgResponse.statusText}`);
              info.steps[4].status = 'error';
              info.steps[4].httpStatus = imgResponse.status;
            } else {
              info.steps[4].status = 'success';
              info.steps[4].contentType = imgResponse.headers.get('content-type');
              setImageTest(imagePath);
            }
          } else {
            info.errors.push('No image path found in frontmatter');
          }
        } else {
          info.errors.push('Could not extract YAML frontmatter');
          info.steps[2].status = 'error';
        }
      }

      // Additional checks - test all possible image paths
      info.steps.push({ step: 6, name: 'Testing all possible image paths', status: 'checking' });
      
      const possiblePaths = [
        '/images/blog/mi-teleferico-sunset-view.webp',
        '/images/blog/mi-teleferico-sunset-view.jpg',
        '/images/blog/mi-teleferico-sunset-view.jpeg',
        '/images/blog/mi-teleferico-sunset-view.png'
      ];

      const pathTests = [];
      for (const path of possiblePaths) {
        try {
          const response = await fetch(path);
          pathTests.push({
            path,
            exists: response.ok,
            status: response.status,
            contentType: response.headers.get('content-type')
          });
        } catch (error) {
          pathTests.push({
            path,
            exists: false,
            error: error.message
          });
        }
      }
      
      info.steps[5].status = 'success';
      info.steps[5].data = pathTests;

    } catch (error) {
      info.errors.push(`Critical error: ${error.message}`);
    }

    setDebugInfo(info);
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'checking':
        return <AlertCircle className="h-5 w-5 text-blue-600 animate-pulse" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔍 Blog Post Image Debugger
          </h1>
          <p className="text-gray-600 mb-6">
            Diagnostic complet pour comprendre pourquoi l'image ne s'affiche pas
          </p>

          <button
            onClick={testBlogPost}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? '🔄 Diagnostic en cours...' : '▶️ Lancer le diagnostic'}
          </button>
        </div>

        {debugInfo && (
          <div className="space-y-4">
            {/* Errors Summary */}
            {debugInfo.errors.length > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                  <XCircle className="h-6 w-6" />
                  Erreurs détectées ({debugInfo.errors.length})
                </h2>
                <ul className="space-y-2">
                  {debugInfo.errors.map((error, idx) => (
                    <li key={idx} className="text-red-800 text-sm">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Steps Detail */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                📋 Étapes du diagnostic
              </h2>
              
              <div className="space-y-4">
                {debugInfo.steps.map((step, idx) => (
                  <div key={idx} className="border-l-4 border-gray-300 pl-4">
                    <div className="flex items-start gap-3 mb-2">
                      {getStatusIcon(step.status)}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          Step {step.step}: {step.name}
                        </div>
                        
                        {step.httpStatus && (
                          <div className="text-sm text-gray-600 mt-1">
                            HTTP Status: {step.httpStatus}
                          </div>
                        )}
                        
                        {step.path && (
                          <div className="text-sm text-gray-600 mt-1">
                            Path: <code className="bg-gray-100 px-2 py-1 rounded">{step.path}</code>
                          </div>
                        )}
                        
                        {step.contentLength && (
                          <div className="text-sm text-gray-600 mt-1">
                            Size: {step.contentLength} bytes
                          </div>
                        )}
                        
                        {step.contentType && (
                          <div className="text-sm text-gray-600 mt-1">
                            Type: {step.contentType}
                          </div>
                        )}
                        
                        {step.data && (
                          <details className="mt-2">
                            <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                              Voir les données
                            </summary>
                            <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                              {JSON.stringify(step.data, null, 2)}
                            </pre>
                          </details>
                        )}
                        
                        {step.yamlContent && (
                          <details className="mt-2">
                            <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                              Voir le YAML brut
                            </summary>
                            <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                              {step.yamlContent}
                            </pre>
                          </details>
                        )}
                        
                        {step.preview && (
                          <details className="mt-2">
                            <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                              Voir l'aperçu du contenu
                            </summary>
                            <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                              {step.preview}
                            </pre>
                          </details>
                        )}
                        
                        {step.error && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            Error: {step.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Test */}
            {imageTest && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="h-6 w-6" />
                  Test de chargement de l'image
                </h2>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Path: <code className="bg-gray-100 px-2 py-1 rounded">{imageTest}</code>
                  </div>
                </div>
                
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <img
                    src={imageTest}
                    alt="Test image"
                    className="max-w-full rounded-lg shadow-md"
                    onLoad={() => console.log('✅ Image loaded successfully')}
                    onError={(e) => {
                      console.error('❌ Image failed to load');
                      e.target.outerHTML = '<div class="text-red-600 p-4 text-center bg-red-50 rounded">❌ L\'image n\'a pas pu être chargée</div>';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">
                💡 Actions recommandées
              </h2>
              <ol className="space-y-3 text-sm text-blue-800">
                <li>1. Vérifiez que le manifest.json contient bien le nom exact du fichier .md</li>
                <li>2. Vérifiez que l'image existe dans public/images/blog/ (même casse, même extension)</li>
                <li>3. Relancez le script generate-manifests.js : <code className="bg-white px-2 py-1 rounded">npm run generate-manifests</code></li>
                <li>4. Vérifiez les permissions du fichier sur GitHub</li>
                <li>5. Re-déployez sur Netlify après les modifications</li>
                <li>6. Videz le cache du navigateur (Ctrl+Shift+R)</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}