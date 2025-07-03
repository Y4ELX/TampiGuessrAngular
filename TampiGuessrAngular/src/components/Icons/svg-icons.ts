/**
 * SVG Icons Collection
 * 
 * Pega aquí tus SVGs completos y exporta cada uno como una función.
 * Uso: import { playIcon } from './svg-icons';
 * Luego: <div [innerHTML]="playIcon()"></div>
 * 
 * También puedes usar con tamaños personalizados:
 * <div [innerHTML]="playIcon(24, 24)"></div>
 */

// Función helper para crear SVGs con tamaños personalizados
function createSvgIcon(svgContent: string, defaultWidth: number = 24, defaultHeight: number = 24) {
  return (width: number = defaultWidth, height: number = defaultHeight, className: string = '') => {
    // Extraer el contenido interno del SVG (sin las etiquetas svg y xml)
    const contentMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
    const innerContent = contentMatch ? contentMatch[1] : svgContent;
    
    // Extraer el viewBox del SVG original si existe
    const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
    
    // Extraer atributos de estilo del SVG original
    const fillMatch = svgContent.match(/fill="([^"]+)"/);
    const strokeMatch = svgContent.match(/stroke="([^"]+)"/);
    
    // Construir atributos solo si existen
    let attributes = '';
    if (fillMatch) {
      attributes += ` fill="${fillMatch[1]}"`;
    } else {
      attributes += ' fill="currentColor"';
    }
    
    if (strokeMatch) {
      attributes += ` stroke="${strokeMatch[1]}"`;
    }
    
    // Crear el SVG con los parámetros personalizados
    return `<svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg"${className ? ` class="${className}"` : ''}${attributes}>
      ${innerContent}
    </svg>`;
  };
}

// ========== ICONOS SVG ==========

export const playIcon = createSvgIcon(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
    <path d="M232.3,114.3,88.3,26.4a15.5,15.5,0,0,0-16.1-.3A15.8,15.8,0,0,0,64,40V216a15.8,15.8,0,0,0,8.2,13.9,15.5,15.5,0,0,0,16.1-.3l144-87.9a16,16,0,0,0,0-27.4Z"/>
  </svg>
`, 32, 32);