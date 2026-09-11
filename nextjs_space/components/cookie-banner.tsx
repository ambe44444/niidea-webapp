'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('niidea_cookies');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('niidea_cookies', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-xl bg-[#181818] border border-[#2a2a2a] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <div className="flex-1 text-sm text-gray-300 leading-relaxed">
          Usamos cookies propias para que la web funcione correctamente.
          Más info en nuestra{' '}
          <a href="/privacidad" className="text-[#FFD54F] underline underline-offset-2 hover:text-yellow-300 transition-colors">
            política de privacidad
          </a>.
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 bg-[#FFD54F] text-black text-sm font-semibold rounded-full hover:bg-yellow-300 transition-colors"
          >
            Aceptar
          </button>
          <button
            onClick={accept}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
