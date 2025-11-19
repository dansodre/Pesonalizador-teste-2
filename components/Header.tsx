import React from 'react';
import { Palette, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-blue-600">
          <Palette className="w-6 h-6" />
          <h1 className="font-handwriting text-2xl text-slate-800">Vem Colando <span className="text-sm font-sans text-slate-400 font-normal ml-2">Studio de Criação</span></h1>
        </div>
      </div>
    </header>
  );
};

export default Header;