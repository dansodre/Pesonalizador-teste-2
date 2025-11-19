import React from 'react';
import { Palette, Sparkles, Zap, MousePointerClick } from 'lucide-react';

interface LandingPageProps {
  clientName: string;
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ clientName, onStart }) => {
  const firstName = clientName.split(' ')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs Decoration */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-3xl w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 text-center relative z-10">
        
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-8">
          <Palette className="w-10 h-10 text-blue-500 mr-3" />
          <span className="font-handwriting text-3xl text-slate-800">Vem Colando</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
          Olá, <span className="text-blue-600">{firstName}</span>!<br />
          Vamos criar algo único?
        </h1>

        <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
          Bem-vindo ao nosso Estúdio de Criação. Aqui você pode personalizar etiquetas, adesivos e muito mais com o seu estilo, de forma simples e rápida.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-blue-600">
              <MousePointerClick size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Escolha o Formato</h3>
            <p className="text-sm text-slate-500">Selecione o tamanho ideal para o seu produto.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="bg-pink-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-pink-600">
              <Palette size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Personalize</h3>
            <p className="text-sm text-slate-500">Adicione textos, cores e suas imagens favoritas.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="bg-yellow-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-yellow-600">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">Visualize</h3>
            <p className="text-sm text-slate-500">Veja como fica em tempo real antes de finalizar.</p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-friendly rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        >
          <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
          Começar a Criar Agora
          <div className="absolute inset-0 rounded-full ring-4 ring-white/30 group-hover:ring-8 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        </button>
      </div>
      
      <div className="mt-8 text-slate-400 text-sm">
        Powered by Vem Colando Studio
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;