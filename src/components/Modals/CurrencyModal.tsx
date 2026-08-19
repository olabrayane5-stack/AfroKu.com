import React, { useEffect } from 'react';
import { X, Globe, Check } from 'lucide-react';
import { BeninFlag } from '../BeninFlag';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
  setSelectedCurrency: (curr: string) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  useEffect(() => {
    if (isOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currencies = [
    { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'FCFA', flag: 'BJ' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: 'EU' },
    { code: 'USD', name: 'Dollar américain', symbol: '$', flag: 'US' },
    { code: 'CAD', name: 'Dollar canadien', symbol: 'CA$', flag: 'CA' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in [overscroll-behavior:contain]">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 [overscroll-behavior:contain]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-[#003580]" />
          <h2 className="text-lg font-bold text-slate-900">Choix de la devise & région</h2>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BeninFlag width={28} height={18} />
              <div>
                <div className="text-xs font-bold text-amber-950">Pays principal : Bénin (BJ)</div>
                <div className="text-[11px] text-amber-800">Devise officielle : Franc CFA BCEAO (XOF)</div>
              </div>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-xs">
              Recommandé
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sélectionnez votre devise :
            </label>
            {currencies.map((curr) => {
              const isSel = selectedCurrency === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => {
                    setSelectedCurrency(curr.code);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSel
                      ? 'border-[#003580] bg-blue-50/50 text-[#003580] font-bold shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold w-10 text-slate-900">{curr.code}</span>
                    <span className="text-xs text-slate-600">{curr.name}</span>
                  </div>
                  {isSel && <Check className="w-4 h-4 text-[#003580]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
