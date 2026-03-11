'use client';

import React, { useState, useCallback } from 'react';
import {
  FileText, BarChart3, Calculator, RefreshCw,
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, ArrowLeft,
  Home as HomeIcon, ClipboardList, ChevronUp, ChevronDown
} from 'lucide-react';
import SANSGraph from '@/components/SANSGraph';
import {
  allGraphs, selectFigure, determineCategory,
  getConformityModules, getCategoryColor, getCategoryRisk,
  type GraphConfig,
} from '@/lib/graphData';

type EquipmentType = 'Pressure Vessels' | 'Piping' | null;
type StateOfContents = 'Gas' | 'Liquid' | null;
type FluidGroup = 'Dangerous' | 'Non-Dangerous' | null;

export default function Home() {
  // Navigation - direct page switching (no carousel)
  const [currentPage, setCurrentPage] = useState(1); // 0=Tables, 1=Home, 2=Graphs, 3=Results
  const [showHeader, setShowHeader] = useState(true);

  // Input state
  const [equipmentType, setEquipmentType] = useState<EquipmentType>(null);
  const [stateOfContents, setStateOfContents] = useState<StateOfContents>(null);
  const [fluidGroup, setFluidGroup] = useState<FluidGroup>(null);
  const [designPressure, setDesignPressure] = useState('');
  const [volumeOrDiameter, setVolumeOrDiameter] = useState('');

  // Graph carousel
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);

  // Results
  const [result, setResult] = useState<{
    category: string;
    figureId: number;
    product: number;
    ps: number;
    vOrDn: number;
  } | null>(null);

  const isFormValid = equipmentType && stateOfContents && fluidGroup &&
    designPressure && volumeOrDiameter &&
    parseFloat(designPressure) > 0 && parseFloat(volumeOrDiameter) > 0;

  const handleCalculate = useCallback(() => {
    if (!equipmentType || !stateOfContents || !fluidGroup) return;
    const ps = parseFloat(designPressure);
    const vOrDn = parseFloat(volumeOrDiameter);
    if (isNaN(ps) || isNaN(vOrDn) || ps <= 0 || vOrDn <= 0) return;

    const figureId = selectFigure(equipmentType, stateOfContents, fluidGroup);
    const category = determineCategory(figureId, ps, vOrDn);
    const product = ps * vOrDn;

    setResult({ category, figureId, product, ps, vOrDn });
    setCurrentPage(3);
  }, [equipmentType, stateOfContents, fluidGroup, designPressure, volumeOrDiameter]);

  const handleClear = () => {
    setEquipmentType(null);
    setStateOfContents(null);
    setFluidGroup(null);
    setDesignPressure('');
    setVolumeOrDiameter('');
    setResult(null);
  };

  const isPiping = equipmentType === 'Piping';
  const volumeLabel = isPiping ? 'Diameter' : 'Volume';
  const volumeUnit = isPiping ? 'DN' : 'L';
  const volumePlaceholder = isPiping ? 'Enter diameter' : 'Enter volume';
  const volumeDesc = isPiping ? 'Nominal pipe diameter' : 'Internal volume capacity';

  // Render the active page directly (no carousel/swipe)
  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <div className="h-full overflow-y-auto custom-scrollbar" style={{ backgroundColor: '#111827' }}>
            <TablesPage />
          </div>
        );
      case 1:
        return (
          <div className="h-full overflow-y-auto hide-scrollbar bg-gray-100">
            <InputPage
              equipmentType={equipmentType}
              setEquipmentType={setEquipmentType}
              stateOfContents={stateOfContents}
              setStateOfContents={setStateOfContents}
              fluidGroup={fluidGroup}
              setFluidGroup={setFluidGroup}
              designPressure={designPressure}
              setDesignPressure={setDesignPressure}
              volumeOrDiameter={volumeOrDiameter}
              setVolumeOrDiameter={setVolumeOrDiameter}
              volumeLabel={volumeLabel}
              volumeUnit={volumeUnit}
              volumePlaceholder={volumePlaceholder}
              volumeDesc={volumeDesc}
              isFormValid={!!isFormValid}
              onCalculate={handleCalculate}
              onClear={handleClear}
              hasResult={!!result}
              onGoToResults={() => setCurrentPage(3)}
            />
          </div>
        );
      case 2:
        return (
          <div className="h-full overflow-y-auto hide-scrollbar bg-white">
            <GraphsPage
              currentIndex={currentGraphIndex}
              setCurrentIndex={setCurrentGraphIndex}
            />
          </div>
        );
      case 3:
        return (
          <ResultsPage result={result} onBack={() => setCurrentPage(1)} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 flex flex-col">
      {/* Header - toggleable */}
      <header className="flex-shrink-0 transition-all duration-300 overflow-hidden" style={{ backgroundColor: '#0F0F0F' }}>
        {showHeader ? (
          <div className="flex items-center justify-between px-4 py-2">
            <button
              onClick={() => setCurrentPage(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-gray-700"
              style={{ color: '#d1d5db' }}
            >
              <FileText size={16} />
              Tables
            </button>
            <button onClick={() => setCurrentPage(1)} className="text-center cursor-pointer">
              <div className="text-white font-bold text-lg">SANS 347</div>
              <div className="text-xs font-medium" style={{ color: '#00C2FF' }}>2024 3rd Edition</div>
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-gray-700"
              style={{ color: '#d1d5db' }}
            >
              Graphs
              <BarChart3 size={16} />
            </button>
          </div>
        ) : null}
        <button
          onClick={() => setShowHeader(!showHeader)}
          className="w-full flex items-center justify-center py-0.5 hover:bg-gray-800 transition-colors"
          style={{ color: '#6b7280' }}
        >
          {showHeader ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </header>

      {/* Page content - direct render, no carousel */}
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="flex-shrink-0 flex items-center justify-around py-1.5 border-t border-gray-800" style={{ backgroundColor: '#0F0F0F' }}>
        {[
          { page: 1, icon: HomeIcon, label: 'Home' },
          { page: 3, icon: ClipboardList, label: 'Results' },
          { page: 2, icon: BarChart3, label: 'Graphs' },
          { page: 0, icon: FileText, label: 'Tables' },
        ].map(({ page, icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => setCurrentPage(page)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[60px]"
            style={{
              color: currentPage === page ? '#00C2FF' : '#6b7280',
            }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ============================
// TABLES PAGE
// ============================
function TablesPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
      {/* Header */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#374151', borderColor: '#4b5563' }}>
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid #4b5563' }}>
          <FileText className="text-white" size={22} />
          <div>
            <h1 className="text-white font-bold text-xl">Reference Tables</h1>
            <p className="text-gray-400 text-sm">SANS 347 - 2024 3rd Edition</p>
          </div>
        </div>
      </div>

      {/* Table 1 */}
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#374151', border: '1px solid #4b5563' }}>
        <div className="p-4" style={{ backgroundColor: '#4b5563' }}>
          <h2 className="text-white font-bold text-lg">Table 1 — Categorization Figures</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #4b5563' }}>
                <th className="text-left p-2 text-gray-300 font-semibold">Equipment Type</th>
                <th className="text-center p-2 text-white font-semibold" colSpan={4}>Pressure Vessels</th>
                <th className="text-center p-2 text-white font-semibold">Steam Generator</th>
                <th className="text-center p-2 text-white font-semibold" colSpan={4}>Piping</th>
                <th className="text-center p-2 text-white font-semibold">Transportable Gas Containers</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #4b5563' }}>
                <td className="p-2 text-gray-300 font-medium">State of Contents</td>
                <td className="text-center p-2 text-gray-200" colSpan={2}>Gas</td>
                <td className="text-center p-2 text-gray-200" colSpan={2}>Liquid</td>
                <td className="text-center p-2 text-gray-200">Gas</td>
                <td className="text-center p-2 text-gray-200">Liquid</td>
                <td className="text-center p-2 text-gray-200" colSpan={2}>Gas</td>
                <td className="text-center p-2 text-gray-200">Liquid<sup>b</sup></td>
                <td className="text-center p-2 text-gray-200">Gas</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #4b5563' }}>
                <td className="p-2 text-gray-300 font-medium">Fluid Group<sup>c</sup></td>
                <td className="text-center p-2 text-gray-200">1</td>
                <td className="text-center p-2 text-gray-200">2</td>
                <td className="text-center p-2 text-gray-200">1</td>
                <td className="text-center p-2 text-gray-200">2</td>
                <td className="text-center p-2 text-gray-200">1 | 2</td>
                <td className="text-center p-2 text-gray-200">1 | 2</td>
                <td className="text-center p-2 text-gray-200">1</td>
                <td className="text-center p-2 text-gray-200">2</td>
                <td className="text-center p-2 text-gray-200">1 | 2</td>
                <td className="text-center p-2 text-gray-200">1</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-300 font-medium">Refer to Figure</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>1</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>2</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>3</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>4</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>5</td>
                <td className="text-center p-2 text-gray-200">—</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>6</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>7</td>
                <td className="text-center p-2 font-bold" style={{ color: '#3b82f6' }}>8 | 9</td>
                <td className="text-center p-2 text-gray-200">a</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4 space-y-1">
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">NOTE:</strong> For two-phase flow, the equipment should be categorized to the higher risk.</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">a</strong> Transportable gas container and their safety and pressure accessories shall be assessed using table 3.</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">b</strong> No pockets of gas may form above the liquid in the equipment, including steam.</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">c</strong> Fluid group 1 = dangerous; fluid group 2 = not dangerous.</p>
        </div>
      </div>

      {/* Table 2 */}
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#374151', border: '1px solid #4b5563' }}>
        <div className="p-4" style={{ backgroundColor: '#4b5563' }}>
          <h2 className="text-white font-bold text-lg">Table 2 — Conformity Assessment Modules for Each Category</h2>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #4b5563' }}>
                <th className="text-left p-3 text-gray-300 font-semibold">Hazard Category</th>
                <th className="text-center p-3 text-white font-semibold">Manufacturer without Certified Quality System</th>
                <th className="text-center p-3 text-white font-semibold">Manufacturer with Certified Quality System</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'I', color: '#3b82f6', without: 'A', with: 'A' },
                { cat: 'II', color: '#eab308', without: 'A2', with: 'A2 or D1 or E1' },
                { cat: 'III', color: '#f97316', without: 'B (design type) + F or\nB (production type) + C2', with: 'H or\nB (production type) + E or\nB (design type) + D' },
                { cat: 'IV', color: '#ef4444', without: 'G or\nB (production type) + F', with: 'H1 or\nB (production type) + D' },
              ].map(row => (
                <tr key={row.cat} style={{ borderBottom: '1px solid #4b5563' }}>
                  <td className="p-3 font-bold text-lg" style={{ color: row.color }}>{row.cat}</td>
                  <td className="text-center p-3 text-gray-200 whitespace-pre-line">{row.without}</td>
                  <td className="text-center p-3 text-gray-200 whitespace-pre-line">{row.with}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4 space-y-1">
          <p className="text-gray-300 text-xs font-semibold mt-2">Module Definitions:</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">A</strong> = internal production control</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">A2</strong> = internal production control plus supervised pressure equipment checks at random intervals</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">B</strong> = type examination — production type or type examination — design type</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">C2</strong> = conformity to type based on internal production control plus supervised pressure equipment checks at random intervals</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">D</strong> = conformity to type based on quality assurance of the production process</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">D1</strong> = quality assurance of the production process</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">E</strong> = conformity to type based on pressure equipment quality assurance</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">E1</strong> = product quality assurance for final pressure equipment inspection and testing</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">F</strong> = conformity to type based on pressure equipment verification</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">G</strong> = conformity based on unit verification</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">H</strong> = conformity based on full quality assurance</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">H1</strong> = conformity based on full quality assurance plus design examination</p>
          <div className="mt-2 space-y-1">
            <p className="text-gray-400 text-xs"><strong className="text-gray-300">NOTE 1:</strong> For RSA/CI/OHSA marked pressure equipment intended for non-nuclear use, refer to annex B.</p>
            <p className="text-gray-400 text-xs"><strong className="text-gray-300">NOTE 2:</strong> For RSA/CI/OHSA marked pressure equipment intended for nuclear use, refer to annex C.</p>
            <p className="text-gray-400 text-xs"><strong className="text-gray-300">NOTE 3:</strong> For non-RSA/CI/OHSA marked pressure equipment intended for nuclear use, refer to annex C.</p>
          </div>
        </div>
      </div>

      {/* Table 3 */}
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#374151', border: '1px solid #4b5563' }}>
        <div className="p-4" style={{ backgroundColor: '#4b5563' }}>
          <h2 className="text-white font-bold text-lg">Table 3 — Conformity Assessment Modules for Transportable Gas Containers</h2>
        </div>
        <div className="px-4 pt-3 pb-1">
          <p className="text-gray-300 text-xs">National legislation requires that all pressure equipment, including transportable gas containers, shall be categorized in accordance with this standard. Transportable gas containers manufactured in accordance with a relevant health and safety standard shall be deemed to comply with the categorization requirements of this standard.</p>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #4b5563' }}>
                <th className="text-left p-3 text-gray-300 font-semibold">Hazard Category</th>
                <th className="text-center p-3 text-white font-semibold">Conformity Assessment Modules<sup className="text-gray-400"> a and b</sup></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 font-bold text-lg" style={{ color: '#f97316' }}>III</td>
                <td className="text-center p-3 text-gray-200">B + F</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4 space-y-1">
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">NOTE:</strong> Table 3 covers test pressures 0 kPa to 300 000 kPa and volume 0,5 L to 3 000 L (water capacity).</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">B</strong> = type examination — design type</p>
          <p className="text-gray-400 text-xs"><strong className="text-gray-300">F</strong> = conformity to type based on pressure equipment verification</p>
          <div className="mt-2 space-y-1">
            <p className="text-gray-400 text-xs"><strong className="text-gray-300"><sup>a</sup></strong> Imported transportable gas containers from the European Union shall comply with the Transportable Pressure Equipment Directive (TPED) 2010/35/EU requirements.</p>
            <p className="text-gray-400 text-xs"><strong className="text-gray-300"><sup>b</sup></strong> Imported transportable gas containers from the United Kingdom shall bear the Rho (&#x3C0;) symbol and the UKCA mark in accordance with the UK Carriage of Dangerous Goods and Use of Transportable Pressure Equipment Regulations 2009.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// INPUT PAGE (HOME)
// ============================
interface InputPageProps {
  equipmentType: EquipmentType;
  setEquipmentType: (v: EquipmentType) => void;
  stateOfContents: StateOfContents;
  setStateOfContents: (v: StateOfContents) => void;
  fluidGroup: FluidGroup;
  setFluidGroup: (v: FluidGroup) => void;
  designPressure: string;
  setDesignPressure: (v: string) => void;
  volumeOrDiameter: string;
  setVolumeOrDiameter: (v: string) => void;
  volumeLabel: string;
  volumeUnit: string;
  volumePlaceholder: string;
  volumeDesc: string;
  isFormValid: boolean;
  onCalculate: () => void;
  onClear: () => void;
  hasResult: boolean;
  onGoToResults: () => void;
}

function InputPage({
  equipmentType, setEquipmentType,
  stateOfContents, setStateOfContents,
  fluidGroup, setFluidGroup,
  designPressure, setDesignPressure,
  volumeOrDiameter, setVolumeOrDiameter,
  volumeLabel, volumeUnit, volumePlaceholder, volumeDesc,
  isFormValid, onCalculate, onClear,
  hasResult, onGoToResults,
}: InputPageProps) {
  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-4">
      {/* Title Block */}
      <div className="rounded-t-xl px-3 pt-4 pb-3 text-center" style={{ backgroundColor: '#353e43' }}>
        <h1 className="text-white text-2xl md:text-3xl font-bold">Pressure Equipment Categorization</h1>
        <p className="text-sm font-medium mt-1" style={{ color: '#00C2FF' }}>
          Determine the appropriate category and conformity assessment requirements for your pressure equipment according to SANS 347:2024
        </p>
      </div>

      {/* Equipment Type */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h2 className="text-center font-bold text-lg text-black">Equipment Type</h2>
        <p className="text-center text-gray-500 text-sm mb-3">Select the type of pressure equipment</p>
        <div className="grid grid-cols-2 gap-4">
          <SelectButton
            selected={equipmentType === 'Pressure Vessels'}
            onClick={() => setEquipmentType('Pressure Vessels')}
            title="Pressure Vessels"
            subtitle="Tanks, containers, boilers"
          />
          <SelectButton
            selected={equipmentType === 'Piping'}
            onClick={() => setEquipmentType('Piping')}
            title="Piping"
            subtitle="Pipes, fittings, assemblies"
          />
        </div>
      </div>

      {/* State of Contents */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h2 className="text-center font-bold text-lg text-black">State of Contents</h2>
        <p className="text-center text-gray-500 text-sm mb-3">What state will the fluid be in?</p>
        <div className="grid grid-cols-2 gap-4">
          <SelectButton
            selected={stateOfContents === 'Gas'}
            onClick={() => setStateOfContents('Gas')}
            title="Gas"
            subtitle="Gaseous state"
          />
          <SelectButton
            selected={stateOfContents === 'Liquid'}
            onClick={() => setStateOfContents('Liquid')}
            title="Liquid"
            subtitle="Liquid state"
          />
        </div>
      </div>

      {/* Fluid Group */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h2 className="text-center font-bold text-lg text-black">Fluid Group</h2>
        <p className="text-center text-gray-500 text-sm mb-3">Classification based on hazard level</p>
        <div className="grid grid-cols-2 gap-4">
          <SelectButton
            selected={fluidGroup === 'Dangerous'}
            onClick={() => setFluidGroup('Dangerous')}
            title="Dangerous"
            subtitle="Group 1 - Higher risk"
          />
          <SelectButton
            selected={fluidGroup === 'Non-Dangerous'}
            onClick={() => setFluidGroup('Non-Dangerous')}
            title="Non-Dangerous"
            subtitle="Group 2 - Lower risk"
          />
        </div>
      </div>

      {/* Design Pressure & Volume/Diameter - fixed alignment */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <h3 className="font-bold text-center text-black text-sm sm:text-base">Design Pressure</h3>
            <p className="text-center text-gray-500 text-xs mb-2 min-h-[2rem] flex items-center justify-center">Maximum allowable pressure</p>
            <div className="relative mt-auto">
              <input
                type="number"
                value={designPressure}
                onChange={(e) => setDesignPressure(e.target.value)}
                placeholder="Enter pr..."
                className="w-full h-12 sm:h-14 rounded-xl border border-gray-200 px-3 pr-14 text-sm text-black focus:outline-none focus:border-[#00C2FF] focus:ring-2 focus:ring-[#00C2FF]/20"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#00C2FF' }}>
                kPa
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-center text-black text-sm sm:text-base">{volumeLabel}</h3>
            <p className="text-center text-gray-500 text-xs mb-2 min-h-[2rem] flex items-center justify-center">{volumeDesc}</p>
            <div className="relative mt-auto">
              <input
                type="number"
                value={volumeOrDiameter}
                onChange={(e) => setVolumeOrDiameter(e.target.value)}
                placeholder="Enter vol..."
                className="w-full h-12 sm:h-14 rounded-xl border border-gray-200 px-3 pr-14 text-sm text-black focus:outline-none focus:border-[#00C2FF] focus:ring-2 focus:ring-[#00C2FF]/20"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#00C2FF' }}>
                {volumeUnit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={onCalculate}
        disabled={!isFormValid}
        className="w-full h-16 rounded-xl flex items-center justify-center gap-2 text-lg font-bold transition-all"
        style={{
          backgroundColor: isFormValid ? '#00C2FF' : '#e5e7eb',
          color: isFormValid ? '#ffffff' : '#9ca3af',
          cursor: isFormValid ? 'pointer' : 'not-allowed',
        }}
      >
        <Calculator size={22} />
        Calculate Category
      </button>

      {/* Clear Button */}
      <button
        onClick={onClear}
        className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
        style={{ backgroundColor: '#4A5568', color: '#ffffff' }}
      >
        <RefreshCw size={16} style={{ color: '#00C2FF' }} />
        <span style={{ color: '#00C2FF' }}>Clear All</span>{' '}
        <span>Fields</span>
      </button>

      {/* Results Button */}
      <button
        onClick={onGoToResults}
        disabled={!hasResult}
        className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
        style={{
          backgroundColor: hasResult ? '#10b981' : '#e5e7eb',
          color: hasResult ? '#ffffff' : '#9ca3af',
          cursor: hasResult ? 'pointer' : 'not-allowed',
        }}
      >
        <ClipboardList size={18} />
        View Results
      </button>

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
        <p className="font-bold text-black">SANS 347:2024 Edition 3.1</p>
        <p className="text-gray-500 text-sm">Categorization and conformity assessment criteria for all pressure equipment</p>
        <p className="text-gray-400 text-xs mt-1">South African National Standard</p>
      </div>
    </div>
  );
}

// Selection button component
function SelectButton({ selected, onClick, title, subtitle }: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className="h-[4.5rem] rounded-xl flex flex-col items-center justify-center transition-all font-medium"
      style={{
        backgroundColor: selected ? '#00C2FF' : '#4A5568',
        color: '#ffffff',
      }}
    >
      <span className="font-bold text-sm">{title}</span>
      <span className="text-xs mt-0.5" style={{ color: selected ? '#ffffff' : '#00C2FF' }}>{subtitle}</span>
    </button>
  );
}

// ============================
// GRAPHS PAGE
// ============================
function GraphsPage({ currentIndex, setCurrentIndex }: {
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
}) {
  const graph = allGraphs[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 space-y-4">
      {/* Graph Header with navigation */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg text-black">{graph.title}</h2>
            <p style={{ color: '#00C2FF' }} className="font-medium">{graph.subtitle}</p>
          </div>
          <span className="text-gray-400 text-sm bg-gray-200 px-2 py-1 rounded-full flex-shrink-0">
            {currentIndex + 1} of 9
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-500 text-sm">Figure {graph.id}</p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-0.5 px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors text-xs"
            >
              <ChevronLeft size={12} /> Prev
            </button>
            <button
              onClick={() => setCurrentIndex(Math.min(8, currentIndex + 1))}
              disabled={currentIndex === 8}
              className="flex items-center gap-0.5 px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors text-xs"
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Graph - responsive container */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="w-full responsive-graph-container">
          <SANSGraph config={graph} width={750} height={520} />
        </div>
      </div>

      {/* Application text */}
      <div className="text-sm text-gray-600 bg-white rounded-xl border border-gray-200 p-4">
        {graph.applicationText}
      </div>

      {/* Footer text */}
      <div className="text-center text-gray-400 text-sm border-t border-gray-200 pt-3">
        {graph.footerText}
      </div>


      {/* Thumbnail Grid - responsive for mobile */}
      <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
        {allGraphs.map((g, i) => (
          <button
            key={g.id}
            onClick={() => setCurrentIndex(i)}
            className="flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-xs"
            style={{
              borderColor: i === currentIndex ? '#00C2FF' : '#e5e7eb',
              backgroundColor: i === currentIndex ? '#ecfeff' : '#ffffff',
            }}
          >
            <span className="font-bold" style={{ color: i === currentIndex ? '#00C2FF' : '#374151' }}>
              Fig {g.id}
            </span>
            <span className="text-gray-400 text-[10px] truncate w-full text-center">
              {g.equipmentType === 'Pressure Vessels' ? 'Vessels' : g.equipmentType === 'Steam Generator' ? 'Steam Gen' : 'Piping'}
            </span>
          </button>
        ))}
      </div>

      {/* Category Legend */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-black mb-3">Category Legend</h3>
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'SEP', color: '#10b981', desc: 'Sound Engineering Practice' },
            { label: 'I', color: '#3b82f6', desc: 'Category I' },
            { label: 'II', color: '#eab308', desc: 'Category II' },
            { label: 'III', color: '#f97316', desc: 'Category III' },
            { label: 'IV', color: '#ef4444', desc: 'Category IV' },
          ].map(cat => (
            <div key={cat.label} className="text-center">
              <div className="rounded-lg py-2 px-1 text-white font-bold text-sm" style={{ backgroundColor: cat.color }}>
                {cat.label}
              </div>
              <p className="text-gray-500 text-xs mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================
// RESULTS PAGE
// ============================
function ResultsPage({ result, onBack }: {
  result: {
    category: string;
    figureId: number;
    product: number;
    ps: number;
    vOrDn: number;
  } | null;
  onBack: () => void;
}) {
  const [showResultCard, setShowResultCard] = useState(true);

  if (!result) return null;

  const graph = allGraphs.find(g => g.id === result.figureId);
  if (!graph) return null;

  const catColor = getCategoryColor(result.category);
  const catRisk = getCategoryRisk(result.category);
  const conformity = getConformityModules(result.category);
  const isPiping = graph.xVariable === 'DN';
  const productLabel = isPiping
    ? `PS\u00D7DN = ${result.ps.toLocaleString()} \u00D7 ${result.vOrDn.toLocaleString()} = ${result.product.toLocaleString()} kPa\u00B7DN`
    : `PS\u00D7V = ${result.ps.toLocaleString()} \u00D7 ${result.vOrDn.toLocaleString()} = ${result.product.toLocaleString()} kPa\u00B7L`;

  return (
    <div className="h-full overflow-y-auto hide-scrollbar bg-white">
      <div className="max-w-4xl mx-auto p-4 pb-24 space-y-4">
        {/* Results Header */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={24} style={{ color: '#10b981' }} />
            <h1 className="font-bold text-lg text-black">Calculation Results</h1>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm transition-colors"
          >
            <ArrowLeft size={14} /> Back to Input
          </button>
        </div>

        {/* Category Display */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <h2 className="text-xl font-bold text-black mb-4">Your Equipment Category</h2>
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: catColor }}
          >
            <span className="text-white font-bold" style={{
              fontSize: result.category.length <= 3 ? '3rem' : result.category.length <= 5 ? '1.5rem' : '0.85rem',
              lineHeight: 1.2,
              textAlign: 'center',
              padding: '0.25rem',
            }}>
              {result.category}
            </span>
          </div>
          <h3 className="text-xl font-bold" style={{ color: catColor }}>
            {result.category === 'Not regulated' ? 'Not Regulated' : `Category ${result.category}`}
          </h3>
          <p className="text-gray-500 mt-1">{catRisk}</p>
        </div>

        {/* Graph with plot point */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
            <BarChart3 size={18} className="text-gray-500" />
            <span className="font-bold text-black">Applicable Categorization Graph</span>
          </div>
          <div className="text-center mb-2">
            <h3 className="font-bold text-lg text-black">
              {graph.title} — {graph.subtitle}
            </h3>
            <p style={{ color: '#00C2FF' }} className="text-sm">Figure {graph.id}</p>
          </div>

          <div className="relative">
            <div className="w-full responsive-graph-container">
              <SANSGraph
                config={graph}
                plotPoint={{
                  x: result.vOrDn,
                  y: result.ps,
                  category: result.category,
                  color: catColor,
                }}
                width={750}
                height={520}
              />
            </div>

            {/* Toggleable floating result card — compact */}
            <button
              onClick={() => setShowResultCard(!showResultCard)}
              className="absolute top-1 right-1 bg-white rounded-lg shadow-md border transition-all cursor-pointer select-none"
              style={{
                borderColor: '#00C2FF',
                padding: showResultCard ? '0.375rem 0.5rem' : '0.25rem 0.375rem',
                maxWidth: showResultCard ? '120px' : 'auto',
              }}
            >
              {showResultCard ? (
                <>
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: catColor }} />
                    <span className="font-bold text-black" style={{ fontSize: '0.55rem' }}>Your Result</span>
                  </div>
                  <p className="text-gray-600 mb-1 text-left" style={{ fontSize: '0.5rem', lineHeight: 1.3 }}>{productLabel}</p>
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: catColor }}>
                      <span className="text-white font-bold" style={{
                        fontSize: result.category.length <= 3 ? '0.4rem' : '0.3rem',
                        lineHeight: 1.2,
                        textAlign: 'center',
                      }}>
                        {result.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-gray-500 mt-0.5" style={{ fontSize: '0.45rem' }}>
                    {result.category === 'Not regulated' ? 'Not Regulated' : `Cat ${result.category}`}
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: catColor }}>
                    <span className="text-white font-bold" style={{
                      fontSize: result.category.length <= 3 ? '0.35rem' : '0.25rem',
                    }}>
                      {result.category}
                    </span>
                  </div>
                  <span className="font-bold text-gray-600" style={{ fontSize: '0.45rem' }}>Result</span>
                </div>
              )}
            </button>
          </div>

          {/* Application text */}
          <div className="mt-3 rounded-lg p-3" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <p className="text-sm">
              <span className="font-bold" style={{ color: '#2563eb' }}>Application:</span>{' '}
              <span className="text-gray-700">{graph.applicationText}</span>
            </p>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="font-bold text-black mb-3">Input Parameters</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-gray-500">Equipment Type:</span>
              <span className="text-gray-800 font-medium">{graph.equipmentType === 'Pressure Vessels' ? 'Vessels' : graph.equipmentType}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-gray-500">Design Pressure:</span>
              <span style={{ color: '#00C2FF' }} className="font-medium">{result.ps.toLocaleString()} kPa</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-gray-500">State Contents:</span>
              <span className="text-gray-800 font-medium">{graph.fluidType.includes('gas') || graph.fluidType.includes('Gas') ? 'Gas' : 'Liquid'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 py-2">
              <span className="text-gray-500">{isPiping ? 'Diameter:' : 'Volume:'}</span>
              <span style={{ color: '#00C2FF' }} className="font-medium">
                {result.vOrDn.toLocaleString()} {isPiping ? 'DN' : 'L'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Fluid Group:</span>
              <span className="text-gray-800 font-medium">
                {graph.fluidType.toLowerCase().includes('dangerous') && !graph.fluidType.toLowerCase().includes('non') ? 'Dangerous' : 'Non-Dangerous'}
              </span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-3 flex items-center gap-2" style={{ backgroundColor: '#fefce8', borderBottom: '1px solid #fde68a' }}>
            <AlertCircle size={18} style={{ color: '#d97706' }} />
            <span className="font-bold text-black">Important Notes</span>
          </div>
          <div className="p-4 space-y-2 text-sm text-gray-600">
            <p><strong className="text-black">Note:</strong> This categorization is based on SANS 347:2024 Edition 3.1 standards.</p>
            <p><strong className="text-black">Compliance:</strong> All pressure equipment must comply with the applicable conformity assessment procedures for the determined category.</p>
            <p><strong className="text-black">Professional Review:</strong> It is recommended to have these results reviewed by a qualified pressure equipment engineer.</p>
          </div>
        </div>

        {/* Conformity Assessment */}
        {result.category !== 'SEP' && result.category !== 'Not regulated' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-black mb-3">Required Conformity Assessment Modules</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Manufacturer without Certified Quality System</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
                  {conformity.withoutQuality}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Manufacturer with Certified Quality System</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
                  {conformity.withQuality}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} /> New Calculation
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-colors"
            style={{ backgroundColor: '#00C2FF' }}
          >
            <FileText size={16} /> Export Results
          </button>
        </div>
      </div>
    </div>
  );
}
