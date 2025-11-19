export interface CanvasItem {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  // Text properties
  text?: string;
  fontSize?: number;
  fill?: string;
  fontFamily?: string;
  // Image properties
  src?: string;
  width?: number;
  height?: number;
}

export interface ProductTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  previewImage: string;
  bgImage?: string;
}

export interface Order {
  id: string;
  cliente_nome: string;
  cliente_email: string;
  produto: string | null;
  status: string;
}

export interface CustomizationData {
  items: CanvasItem[];
  canvasWidth: number;
  canvasHeight: number;
  background: string | null;
}
