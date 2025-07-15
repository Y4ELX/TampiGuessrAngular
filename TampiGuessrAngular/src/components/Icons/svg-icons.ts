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
    return `<svg width="${width}" height="${height}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" style="display: block;"${className ? ` class="${className}"` : ''}${attributes}>
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

export const trophyIcon = createSvgIcon(`
  <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_3_55)">
    <path d="M101.25 6.75H81C81 3.01219 77.9811 0 74.25 0H33.75C30.0189 0 27 3.01219 27 6.75H6.75C3.01894 6.75 0 9.76219 0 13.5V27C0 41.9108 12.0892 54 27 54C27.3172 54 27.6126 53.9139 27.9231 53.9004C30.348 63.3994 37.7646 70.8294 47.25 73.2881V94.5H33.75C30.0189 94.5 27 97.5122 27 101.25V108H81V101.25C81 97.5122 77.9811 94.5 74.25 94.5H60.75V73.2881C70.2354 70.8294 77.652 63.4011 80.0769 53.9021C80.3874 53.9139 80.6827 54 81 54C95.9108 54 108 41.9108 108 27V13.5C108 9.76219 104.981 6.75 101.25 6.75ZM13.5 27V20.25H27V40.5C19.5446 40.5 13.5 34.4486 13.5 27ZM94.5 27C94.5 34.4486 88.4554 40.5 81 40.5V20.25H94.5V27Z" fill="#F59C49"/>
    </g>
    <defs>
    <clipPath id="clip0_3_55">
    <rect width="108" height="108" fill="white"/>
    </clipPath>
    </defs>
  </svg>
`, 30, 30);
