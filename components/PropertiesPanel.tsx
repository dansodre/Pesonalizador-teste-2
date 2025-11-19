import React from 'react';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { CanvasItem } from '../types';
import { COLORS, AVAILABLE_FONTS } from '../constants';

interface PropertiesPanelProps {
  selectedItem: CanvasItem | null;
  onChange: (attrs: Partial<CanvasItem>) => void;
  onDelete: () => void;
  onMoveLayer: (direction: 'up' | 'down') => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedItem, onChange, onDelete, onMoveLayer }) => {
  if (!selectedItem) {
    return (
      <div className="w-72 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <p>Selecione um item no canvas para editar.</p>
      </div>
    );
  }

  return (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col h-full overflow-y-auto shadow-sm z-10">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-700">
          Editar {selectedItem.type === 'text' ? 'Texto' : 'Imagem'}
        </h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Text Controls */}
        {selectedItem.type === 'text' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Conteúdo</label>
              <textarea
                value={selectedItem.text}
                onChange={(e) => onChange({ text: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Fonte</label>
              <select
                value={selectedItem.fontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-md text-sm"
              >
                {AVAILABLE_FONTS.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tamanho da Fonte ({selectedItem.fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="120"
                value={selectedItem.fontSize}
                onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Cor</label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onChange({ fill: color })}
                    className={`w-8 h-8 rounded-full border ${selectedItem.fill === color ? 'ring-2 ring-blue-500 ring-offset-1' : 'border-slate-200'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Common Controls */}
        <div className="pt-4 border-t border-slate-100">
           <label className="block text-xs font-medium text-slate-500 mb-2">Camadas</label>
           <div className="flex gap-2">
             <button 
              onClick={() => onMoveLayer('up')}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-xs transition-colors"
             >
               <ArrowUp size={14} /> Para Frente
             </button>
             <button 
              onClick={() => onMoveLayer('down')}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-xs transition-colors"
             >
               <ArrowDown size={14} /> Para Trás
             </button>
           </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            Excluir Elemento
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
