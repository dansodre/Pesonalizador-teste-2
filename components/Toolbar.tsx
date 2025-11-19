import React, { useRef } from 'react';
import { Type, Image as ImageIcon, Save } from 'lucide-react';

interface ToolbarProps {
  onAddText: () => void;
  onAddImage: (file: File) => void;
  onFinish: () => void;
  isSaving: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddText, onAddImage, onFinish, isSaving }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAddImage(e.target.files[0]);
      // Reset input so the same file can be selected again if deleted
      e.target.value = '';
    }
  };

  return (
    <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shadow-sm z-10">
      <div className="flex flex-col gap-4 w-full px-2">
        <button 
          onClick={onAddText}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors group"
          title="Adicionar Texto"
        >
          <div className="bg-slate-100 p-3 rounded-full group-hover:bg-blue-100 mb-1 transition-colors">
            <Type size={24} />
          </div>
          <span className="text-xs font-medium">Texto</span>
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors group"
          title="Adicionar Imagem"
        >
          <div className="bg-slate-100 p-3 rounded-full group-hover:bg-blue-100 mb-1 transition-colors">
            <ImageIcon size={24} />
          </div>
          <span className="text-xs font-medium">Imagem</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />

        <div className="w-full border-t border-slate-200 my-2"></div>

        <button 
          onClick={onFinish}
          disabled={isSaving}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors group ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50 text-slate-600 hover:text-green-600'}`}
          title="Finalizar Personalização"
        >
          <div className={`p-3 rounded-full mb-1 transition-colors ${isSaving ? 'bg-slate-100' : 'bg-green-100 text-green-600 group-hover:bg-green-200'}`}>
            <Save size={24} />
          </div>
          <span className="text-xs font-bold text-green-600">Finalizar</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;