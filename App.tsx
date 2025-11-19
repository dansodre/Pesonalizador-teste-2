import React, { useState, useEffect, useRef } from 'react';
import Konva from 'konva';
import { v4 as uuidv4 } from 'uuid';
import { CanvasItem, ProductTemplate, Order } from './types';
import { PRODUCT_TEMPLATES, DEFAULT_FONT_SIZE, DEFAULT_TEXT_COLOR, DEFAULT_FONT_FAMILY, CHECKOUT_REDIRECT_URL, SUPABASE_URL } from './constants';
import { getOrderById, saveCustomization, uploadPreviewImage } from './services/customizationService';

import Header from './components/Header';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import CanvasStage from './components/CanvasStage';
import LoadingSpinner from './components/LoadingSpinner';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  // App State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  // Added 'landing' step
  const [step, setStep] = useState<'loading' | 'landing' | 'select-product' | 'editor' | 'success'>('loading');

  // Editor State
  const [template, setTemplate] = useState<ProductTemplate | null>(null);
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const stageRef = useRef<Konva.Stage>(null);

  // Initialization
  useEffect(() => {
    const init = async () => {
      // Parse query params manually
      const searchParams = new URLSearchParams(window.location.search);
      const pedidoId = searchParams.get('pedidoId');
      
      // Check if Supabase is in placeholder mode (Environment variables missing)
      const isSupabaseUnconfigured = !SUPABASE_URL || SUPABASE_URL.includes('placeholder');

      // DEMO MODE: If no ID provided OR Supabase is not configured, load demo data
      if (!pedidoId || isSupabaseUnconfigured) {
        console.warn("App running in DEMO MODE (No ID or No Supabase Config).");
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));

        setOrder({
          id: pedidoId || 'demo-order-123',
          cliente_nome: 'Cliente Demo',
          cliente_email: 'demo@vemcolando.com.br',
          produto: null,
          status: 'rascunho'
        });
        
        // Go to landing instead of select-product immediately
        setStep('landing');
        setIsLoading(false);
        
        if (isSupabaseUnconfigured && pedidoId) {
            // Warn user in console if they expected it to work but env vars are missing
            console.warn("Supabase URL is missing. Operations will be simulated.");
        }
        return;
      }

      // REAL MODE: Fetch from Supabase
      const orderData = await getOrderById(pedidoId);
      
      if (!orderData) {
        setError('Pedido não encontrado no sistema.');
        setIsLoading(false);
        return;
      }

      setOrder(orderData);
      setStep('landing'); // Show landing page first
      setIsLoading(false);
    };

    init();
  }, []);

  // Handlers
  const handleStartCustomization = () => {
    setStep('select-product');
  };

  const handleSelectTemplate = (tpl: ProductTemplate) => {
    setTemplate(tpl);
    
    // Add an initial text element centered on the canvas for better UX
    const textWidthEstimate = 110; // Approx width for "Seu Texto" @ 24px
    const textHeightEstimate = 24;

    const initialText: CanvasItem = {
        id: uuidv4(),
        type: 'text',
        x: (tpl.width / 2) - (textWidthEstimate / 2),
        y: (tpl.height / 2) - (textHeightEstimate / 2),
        text: 'Seu Texto',
        fontSize: DEFAULT_FONT_SIZE,
        fill: DEFAULT_TEXT_COLOR,
        fontFamily: DEFAULT_FONT_FAMILY,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
    };

    setItems([initialText]);
    setSelectedId(initialText.id);
    setStep('editor');
  };

  const handleBack = () => {
    // Check if there are changes to warn user
    const hasChanges = items.length > 0;
    
    if (hasChanges) {
      if (!window.confirm('Tem certeza que deseja voltar? Seu design atual será perdido.')) {
        return;
      }
    }
    
    // Reset editor state
    setItems([]);
    setSelectedId(null);
    setTemplate(null);
    setStep('select-product');
  };

  const handleAddText = () => {
    if (!template) return;
    
    const textWidthEstimate = 110; 
    const textHeightEstimate = 24;

    const newItem: CanvasItem = {
      id: uuidv4(),
      type: 'text',
      x: (template.width / 2) - (textWidthEstimate / 2),
      y: (template.height / 2) - (textHeightEstimate / 2),
      text: 'Seu Texto',
      fontSize: DEFAULT_FONT_SIZE,
      fill: DEFAULT_TEXT_COLOR,
      fontFamily: DEFAULT_FONT_FAMILY,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const handleAddImage = (file: File) => {
    if (!template) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newItem: CanvasItem = {
        id: uuidv4(),
        type: 'image',
        x: template.width / 2 - 100,
        y: template.height / 2 - 100,
        src: reader.result as string,
        width: 200,
        height: 200,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      };
      setItems([...items, newItem]);
      setSelectedId(newItem.id);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateItem = (id: string, newAttrs: Partial<CanvasItem>) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, ...newAttrs };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleDeleteItem = () => {
    if (selectedId) {
      setItems(items.filter((i) => i.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleMoveLayer = (direction: 'up' | 'down') => {
    if (!selectedId) return;
    const index = items.findIndex((i) => i.id === selectedId);
    if (index < 0) return;

    const newItems = [...items];
    if (direction === 'up' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    } else if (direction === 'down' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    }
    setItems(newItems);
  };

  const handleFinish = async () => {
    if (!order || !template || !stageRef.current) return;
    
    if (items.length === 0) {
        if(!window.confirm("Seu design está vazio. Deseja enviar assim mesmo?")) {
            return;
        }
    }

    setIsSaving(true);
    
    // Deselect everything to remove transformer handles from screenshot
    setSelectedId(null);
    
    // Small delay to allow React to render the deselection
    setTimeout(async () => {
      try {
        // 1. Generate Data URL
        const dataUrl = stageRef.current!.toDataURL({ pixelRatio: 2 }); 
        
        // Check for DEMO Mode (Supabase Unconfigured)
        const isDemo = !SUPABASE_URL || SUPABASE_URL.includes('placeholder');

        if (isDemo) {
            console.log("DEMO MODE: Simulation saving...");
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setStep('success');
            setTimeout(() => {
                 window.location.href = CHECKOUT_REDIRECT_URL;
            }, 3000);
            return;
        }

        // REAL MODE
        // 2. Upload to Storage
        const publicUrl = await uploadPreviewImage(order.id, dataUrl);
        
        if (!publicUrl) {
           throw new Error('Falha ao fazer upload da imagem.');
        }

        // 3. Save to Database
        const customizationData = {
          items,
          canvasWidth: template.width,
          canvasHeight: template.height,
          background: null 
        };
        
        const success = await saveCustomization(order.id, customizationData, publicUrl);
        
        if (success) {
          setStep('success');
          setTimeout(() => {
             window.location.href = CHECKOUT_REDIRECT_URL;
          }, 3000);
        } else {
          throw new Error('Falha ao salvar dados no banco.');
        }

      } catch (err) {
        console.error(err);
        alert('Ocorreu um erro ao salvar sua personalização. Tente novamente.');
      } finally {
        setIsSaving(false);
      }
    }, 100);
  };

  // Render Logic
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4 text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ops! Algo deu errado.</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || step === 'loading') return <LoadingSpinner />;

  if (step === 'landing') {
    return (
      <LandingPage 
        clientName={order?.cliente_nome || 'Visitante'} 
        onStart={handleStartCustomization} 
      />
    );
  }

  if (step === 'select-product') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 max-w-6xl mx-auto w-full p-8">
          <div className="text-center mb-10">
             <h2 className="text-3xl font-bold text-slate-800 mb-2">Selecione o Modelo</h2>
             <p className="text-slate-500">Escolha o formato ideal para começar sua criação</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PRODUCT_TEMPLATES.map((tpl) => (
              <button 
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 text-left group"
              >
                <div className="h-48 bg-slate-100 overflow-hidden relative">
                   <img src={tpl.previewImage} alt={tpl.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>
                <div className="p-5">
                   <h3 className="font-semibold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{tpl.name}</h3>
                   <p className="text-sm text-slate-400 mt-1">{tpl.width} x {tpl.height}px</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
         <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-lg transform animate-in fade-in zoom-in duration-300">
           <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
           </div>
           <h2 className="text-2xl font-bold text-slate-800 mb-4">Personalização Concluída!</h2>
           <p className="text-slate-600 mb-6">Seu design foi salvo com sucesso. Redirecionando para o checkout...</p>
           <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
             <div className="h-full bg-green-500 animate-[loading_2s_ease-in-out_infinite] w-full"></div>
           </div>
           <style>{`
             @keyframes loading {
               0% { transform: translateX(-100%); }
               100% { transform: translateX(100%); }
             }
           `}</style>
         </div>
       </div>
     );
  }

  const selectedItem = items.find((i) => i.id === selectedId) || null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header onBack={handleBack} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Tools (Left) */}
        <Toolbar 
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          onFinish={handleFinish}
          isSaving={isSaving}
        />

        {/* Main Canvas Area */}
        <main className="flex-1 relative z-0 flex items-center justify-center bg-slate-100/50">
          {template && (
             <CanvasStage 
               template={template}
               items={items}
               selectedId={selectedId}
               onSelect={setSelectedId}
               onChange={handleUpdateItem}
               stageRef={stageRef}
             />
          )}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200 text-xs text-slate-500 pointer-events-none flex gap-2">
            <span className="font-semibold">{template?.name}</span>
            <span>|</span>
            <span>{template?.width} x {template?.height}px</span>
          </div>
        </main>

        {/* Properties (Right) */}
        <PropertiesPanel 
          selectedItem={selectedItem}
          onChange={(attrs) => selectedId && handleUpdateItem(selectedId, attrs)}
          onDelete={handleDeleteItem}
          onMoveLayer={handleMoveLayer}
        />
      </div>
      
      {isSaving && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-all">
           <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-pulse border border-slate-100">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-600 font-bold text-lg">Salvando Design...</p>
              <p className="text-slate-400 text-sm mt-2">Gerando prévia e enviando arquivos</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;