import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import LOOKUP_RAW from "@/data/lookup_compact.json";

type BuildingType =
  | "warehouse"
  | "commercial"
  | "residential"
  | "retail"
  | "hospital";
type RoofCondition = "dark" | "medium" | "light";

interface SavingsPerM2 {
  k: number;
  c: number;
}

interface CityData {
  lat: number;
  lon: number;
  climate: string;
  ghi: number;
  cdd: number;
  grid_ef: number;
  b: Record<
    BuildingType,
    Record<RoofCondition, SavingsPerM2>
  >;
}

const LOOKUP_DATA = LOOKUP_RAW as Record<string, CityData>;

const BUILDING_LABELS: Record<BuildingType, string> = {
  warehouse: "Warehouse / Industrial",
  commercial: "Commercial / Office",
  residential: "Residential / Apartment",
  retail: "Retail / Supermarket",
  hospital: "Hospital / Healthcare",
};

const ROOF_LABELS: Record<RoofCondition, string> = {
  dark: "Dark / Black Roof (SR ≈ 0.10)",
  medium: "Grey / Gravel Roof (SR ≈ 0.35)",
  light: "Existing White / Cool Roof (SR ≈ 0.65)",
};

const CITY_LIST = Object.keys(LOOKUP_DATA).sort();

const CO2_TO_CARS = (mt: number) => (mt / 4.6).toFixed(1);
const CO2_TO_TREES = (mt: number) => Math.round((mt * 1000) / 21.77);
const KWH_TO_HOMES = (kwh: number) => (kwh / 10500).toFixed(2);

export interface CalcResults {
  kwhPerYear: number;
  co2MTPerYear: number;
  costSavings: number;
  carEquiv: string;
  treeEquiv: number;
  homeEquiv: string;
  ghi: number;
  cdd: number;
  gridEf: number;
  climate: string;
  cityName: string;
  countryName: string;
  tenYrKwh: number;
  tenYrCO2: number;
  tenYrCost: number;
}

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04] p-5",
        className
      )}
    >
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-sky-200/80">
        {title}
      </p>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium text-slate-400">{children}</p>
  );
}

function BigStat({
  value,
  unit,
  label,
  colorClass,
  icon,
}: {
  value: string;
  unit: string;
  label: string;
  colorClass: string;
  icon: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-1 text-xl">{icon}</div>
      <div
        className={cn(
          "text-2xl font-extrabold leading-none md:text-3xl",
          colorClass
        )}
      >
        {value}
      </div>
      <div className={cn("mt-1 text-xs opacity-80", colorClass)}>{unit}</div>
      <div className="mt-1 text-[11px] text-slate-500">{label}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-primary focus:ring-1 focus:ring-primary";

export default function EnergyCalculator() {
  const [city, setCity] = useState("Dubai,UAE");
  const [area, setArea] = useState(500);
  const [areaUnit, setAreaUnit] = useState<"m2" | "ft2">("m2");
  const [buildingType, setBuildingType] = useState<BuildingType>("warehouse");
  const [roofCondition, setRoofCondition] =
    useState<RoofCondition>("dark");
  const [electricityPrice, setElectricityPrice] = useState(0.12);
  const [results, setResults] = useState<CalcResults | null>(null);
  const [animating, setAnimating] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const areaM2 = areaUnit === "ft2" ? area * 0.0929 : area;

  const calculate = useCallback(() => {
    const cityData = LOOKUP_DATA[city];
    if (!cityData) return;
    const perM2 = cityData.b[buildingType]?.[roofCondition];
    if (!perM2) return;

    const kwhPerYear = Math.round(perM2.k * areaM2);
    const co2KgPerYear = perM2.c * areaM2;
    const co2MTPerYear = co2KgPerYear / 1000;
    const costSavings = kwhPerYear * electricityPrice;
    const cityName = city.split(",")[0];
    const countryName = city.split(",")[1] ?? "";

    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 600);
    setResults({
      kwhPerYear,
      co2MTPerYear: parseFloat(co2MTPerYear.toFixed(2)),
      costSavings: parseFloat(costSavings.toFixed(0)),
      carEquiv: CO2_TO_CARS(co2MTPerYear),
      treeEquiv: CO2_TO_TREES(co2MTPerYear),
      homeEquiv: KWH_TO_HOMES(kwhPerYear),
      ghi: cityData.ghi,
      cdd: cityData.cdd,
      gridEf: cityData.grid_ef,
      climate: cityData.climate.replace(/_/g, " "),
      cityName,
      countryName,
      tenYrKwh: Math.round(kwhPerYear * 10),
      tenYrCO2: parseFloat((co2MTPerYear * 10).toFixed(1)),
      tenYrCost: Math.round(costSavings * 10),
    });
  }, [city, areaM2, buildingType, roofCondition, electricityPrice]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const filteredCities = CITY_LIST.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 50);

  const handleCitySelect = (c: string) => {
    setCity(c);
    setCitySearch(`${c.split(",")[0]}, ${c.split(",")[1]}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (city) {
      setCitySearch(`${city.split(",")[0]}, ${city.split(",")[1]}`);
    }
  }, [city]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(220,18%,8%)] text-slate-100">
      <div className="relative overflow-hidden border-b border-sky-500/20 bg-gradient-to-br from-[hsl(220,24%,12%)] via-[hsl(220,22%,10%)] to-[hsl(220,18%,8%)] px-6 py-10 text-center">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(56,189,248,0.12),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
            PDRC energy savings estimator
          </div>
          <h1 className="bg-gradient-to-r from-slate-100 via-sky-200 to-sky-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
            Passive cooling energy calculator
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-[15px]">
            Estimate annual kWh saved and CO₂ avoided for your roof — using
            pre-computed lookup tables from NASA POWER solar data, IEA grid
            emission factors, and PDRC-style physics (see methodology below).
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 px-5 py-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card title="Location">
            <Label>City / country</Label>
            <div className="relative" ref={dropdownRef}>
              <input
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search city…"
                className={inputClass}
                aria-autocomplete="list"
                aria-expanded={showDropdown}
              />
              {showDropdown && filteredCities.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] max-h-56 overflow-y-auto rounded-xl border border-sky-500/30 bg-[#111827] shadow-xl"
                  role="listbox"
                >
                  {filteredCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="option"
                      onClick={() => handleCitySelect(c)}
                      className={cn(
                        "flex w-full cursor-pointer border-b border-white/5 px-3.5 py-2.5 text-left text-sm transition-colors last:border-0",
                        c === city
                          ? "bg-sky-500/15 text-sky-300"
                          : "text-slate-300 hover:bg-sky-500/10"
                      )}
                    >
                      <span className="font-semibold">{c.split(",")[0]}</span>
                      <span className="ml-2 text-xs text-slate-500">
                        {c.split(",")[1]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {results && (
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  ["GHI", `${results.ghi} kWh/m²/yr`],
                  ["CDD", `${results.cdd}`],
                  ["Grid EF", `${results.gridEf} kg/kWh`],
                  ["Climate", results.climate],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-md border border-sky-500/20 bg-sky-500/5 px-2.5 py-1 text-xs"
                  >
                    <span className="text-slate-500">{k}: </span>
                    <span className="font-semibold text-sky-400">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Building details">
            <Label>Roof / surface area</Label>
            <div className="mb-3 flex gap-2">
              <input
                type="number"
                value={area}
                min={10}
                max={1_000_000}
                onChange={(e) => setArea(Number(e.target.value))}
                className={cn(inputClass, "flex-1")}
              />
              <select
                value={areaUnit}
                onChange={(e) =>
                  setAreaUnit(e.target.value as "m2" | "ft2")
                }
                className={cn(inputClass, "w-24 shrink-0")}
              >
                <option value="m2">m²</option>
                <option value="ft2">ft²</option>
              </select>
            </div>
            {areaUnit === "ft2" && (
              <p className="mb-3 text-xs text-slate-500">
                = {areaM2.toFixed(1)} m²
              </p>
            )}

            <Label>Building type</Label>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {(Object.keys(BUILDING_LABELS) as BuildingType[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setBuildingType(k)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-xs transition-all",
                    buildingType === k
                      ? "border-sky-400 bg-sky-500/15 font-semibold text-sky-300"
                      : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20"
                  )}
                >
                  {BUILDING_LABELS[k]}
                </button>
              ))}
            </div>

            <Label>Current roof condition</Label>
            <div className="flex flex-col gap-2">
              {(Object.keys(ROOF_LABELS) as RoofCondition[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setRoofCondition(k)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-all",
                    roofCondition === k
                      ? "border-sky-400 bg-sky-500/15 font-semibold text-sky-300"
                      : "border-white/10 bg-white/[0.04] text-slate-400"
                  )}
                >
                  <span
                    className={cn(
                      "h-5 w-5 shrink-0 rounded border border-white/20",
                      k === "dark" && "bg-[#1a1a1a]",
                      k === "medium" && "bg-[#7a7a7a]",
                      k === "light" && "bg-[#e8e8e8]"
                    )}
                  />
                  {ROOF_LABELS[k]}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Financial (optional)">
            <Label>Electricity price ($/kWh)</Label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.04}
                max={0.5}
                step={0.01}
                value={electricityPrice}
                onChange={(e) =>
                  setElectricityPrice(Number(e.target.value))
                }
                className="h-2 flex-1 cursor-pointer accent-primary"
              />
              <div className="min-w-[3.5rem] rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-center text-sm font-bold text-sky-400">
                ${electricityPrice.toFixed(2)}
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Global average ≈ $0.12/kWh · US ≈ $0.16 · UK ≈ $0.28 · India ≈
              $0.08
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {results ? (
            <>
              <div
                className={cn(
                  "rounded-2xl border border-sky-500/25 bg-gradient-to-br from-[#0d2137] to-[#091a2d] p-6 transition-all duration-300",
                  animating && "scale-[0.98] opacity-90"
                )}
              >
                <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-sky-400">
                  Annual savings estimate
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <BigStat
                    value={results.kwhPerYear.toLocaleString()}
                    unit="kWh / yr"
                    label="Energy saved"
                    colorClass="text-sky-400"
                    icon="⚡"
                  />
                  <BigStat
                    value={results.co2MTPerYear.toLocaleString()}
                    unit="MT CO₂e / yr"
                    label="Carbon avoided"
                    colorClass="text-emerald-400"
                    icon="🌿"
                  />
                  <BigStat
                    value={`$${results.costSavings.toLocaleString()}`}
                    unit="/ yr"
                    label="Cost savings"
                    colorClass="text-amber-300"
                    icon="💰"
                  />
                  <BigStat
                    value={results.homeEquiv}
                    unit="homes"
                    label="Equivalent homes (US avg.)"
                    colorClass="text-violet-300"
                    icon="🏠"
                  />
                </div>
              </div>

              <Card title="10-year cumulative impact">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["⚡", results.tenYrKwh.toLocaleString(), "kWh", "Energy"],
                    ["🌿", results.tenYrCO2.toLocaleString(), "MT CO₂e", "Carbon"],
                    ["💰", `$${results.tenYrCost.toLocaleString()}`, "saved", "Cost"],
                  ].map(([icon, val, unit, label]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-3 text-center"
                    >
                      <div className="text-lg">{icon}</div>
                      <div className="text-base font-extrabold text-slate-100">
                        {val}
                      </div>
                      <div className="text-[11px] text-slate-500">{unit}</div>
                      <div className="text-[11px] text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Real-world equivalents">
                <div className="flex flex-col gap-2">
                  {[
                    {
                      icon: "🚗",
                      text: `Removing ${results.carEquiv} average cars’ emissions for a year`,
                    },
                    {
                      icon: "🌳",
                      text: `Planting ${results.treeEquiv.toLocaleString()} trees (rough CO₂ uptake analog)`,
                    },
                    {
                      icon: "🏠",
                      text: `Powering ${results.homeEquiv} average US homes for a year`,
                    },
                  ].map(({ icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5 text-xs text-emerald-100/90"
                    >
                      <span className="text-lg">{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Per m² breakdown">
                {(() => {
                  const d =
                    LOOKUP_DATA[city].b[buildingType][roofCondition];
                  return (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ["kWh/m²/yr", d.k.toFixed(1), "text-sky-400"],
                        ["kg CO₂/m²/yr", d.c.toFixed(2), "text-emerald-400"],
                        ["Area (m²)", areaM2.toFixed(0), "text-amber-300"],
                      ].map(([label, val, col]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-3 text-center"
                        >
                          <div className={cn("text-base font-extrabold", col)}>
                            {val}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Card>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-slate-500">
                <strong className="text-slate-400">Methodology:</strong> Results
                use a pre-computed lookup (PDRC-style cooling physics, NASA POWER
                GHI, IEA grid factors, ASHRAE CDD, climate humidity corrections).
                For bankable or compliance-grade numbers, run a full
                EnergyPlus / ORNL Roof Savings Calculator study for your site.
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/15 text-slate-500">
              Configure inputs to see results
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
