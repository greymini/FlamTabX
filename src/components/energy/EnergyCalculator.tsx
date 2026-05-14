import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import LOOKUP_RAW from "@/data/lookup_compact.json";

type BuildingType =
  | "warehouse"
  | "commercial"
  | "residential"
  | "retail"
  | "hospital";
type RoofCondition = "dark" | "medium" | "light";
type MaintenanceRegime = "none" | "annual" | "biannual";
type StoreyClass = "single" | "low_rise" | "mid_rise";

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
  b: Record<BuildingType, Record<RoofCondition, SavingsPerM2>>;
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

const MAINTENANCE_LABELS: Record<MaintenanceRegime, string> = {
  none: "No maintenance",
  annual: "Annual cleaning",
  biannual: "Biannual cleaning",
};

const STOREY_LABELS: Record<StoreyClass, string> = {
  single: "Single-storey",
  low_rise: "Low-rise (1–3 fl.)",
  mid_rise: "Mid-rise (4 + fl.)",
};

// Default storey class per building type — mid-rise for office/hospital is the research default
const DEFAULT_STOREY: Record<BuildingType, StoreyClass> = {
  warehouse: "single",
  retail: "single",
  residential: "low_rise",
  commercial: "mid_rise",
  hospital: "mid_rise",
};

// ── PHYSICS CORRECTION FACTORS (per research.md) ──────────────────────────────

// f_field: real-world field-to-lab performance gap, by climate class
// Source: Fan et al. 2022; Hossain et al. 2021; Tang et al. 2021 field studies
const F_FIELD: Record<string, number> = {
  hot_dry: 0.73,
  hot_humid: 0.63,
  tropical: 0.58,
  marine: 0.68,
  warm_marine: 0.68,
  very_cold: 0.72,
  cold: 0.72,
  cold_dry: 0.73,
  mixed_humid: 0.65,
  hot_mixed: 0.67,
  temperate: 0.69,
};

// α_age: soiling/aging factor, by maintenance regime and climate
// Source: CRRC 3-year aged reflectance data; ScienceDirect 2025 Mediterranean study
function getAlphaAge(climate: string, maintenance: MaintenanceRegime): number {
  const table: Record<MaintenanceRegime, Record<string, number>> = {
    none: {
      hot_dry: 0.82, hot_humid: 0.75, tropical: 0.70,
      marine: 0.80, warm_marine: 0.80, very_cold: 0.80,
      cold: 0.80, cold_dry: 0.82, mixed_humid: 0.78,
      hot_mixed: 0.78, temperate: 0.80,
    },
    annual: {
      hot_dry: 0.91, hot_humid: 0.88, tropical: 0.85,
      marine: 0.90, warm_marine: 0.90, very_cold: 0.90,
      cold: 0.90, cold_dry: 0.91, mixed_humid: 0.89,
      hot_mixed: 0.89, temperate: 0.90,
    },
    biannual: {
      hot_dry: 0.95, hot_humid: 0.93, tropical: 0.92,
      marine: 0.94, warm_marine: 0.94, very_cold: 0.94,
      cold: 0.94, cold_dry: 0.95, mixed_humid: 0.94,
      hot_mixed: 0.94, temperate: 0.94,
    },
  };
  return table[maintenance][climate] ?? table[maintenance]["marine"];
}

// Seasonal COP correction: ratio of old_COP / new_seasonal_COP
// Lookup was generated with nominal COPs; seasonal (IPLV) values per research.md §2.4
// warehouse: 3.0→2.5, commercial: 3.2→3.5, residential: 3.4→3.0, retail: 3.1→3.0, hospital: 4.0→4.0
// Lower seasonal COP → more kWh saved per unit thermal reduction (correct physics)
const COP_CORRECTION: Record<BuildingType, number> = {
  warehouse: 3.0 / 2.5,    // 1.20
  commercial: 3.2 / 3.5,   // 0.914
  residential: 3.4 / 3.0,  // 1.133
  retail: 3.1 / 3.0,       // 1.033
  hospital: 4.0 / 4.0,     // 1.0
};

// f_roof storey correction: multiplier applied to lookup value
// Lookup was generated with: warehouse=0.55, commercial=0.35, residential=0.30, retail=0.40, hospital=0.28
// Research recommends: commercial mid-rise 0.12–0.22, hospital mid-rise 0.08–0.16 (§2.3)
const F_ROOF_FACTOR: Record<BuildingType, Record<StoreyClass, number>> = {
  warehouse:   { single: 1.00, low_rise: 1.00, mid_rise: 0.82 },
  retail:      { single: 1.10, low_rise: 1.05, mid_rise: 1.00 },
  residential: { single: 1.25, low_rise: 1.00, mid_rise: 0.77 },
  commercial:  { single: 1.00, low_rise: 0.63, mid_rise: 0.49 },
  hospital:    { single: 1.00, low_rise: 0.64, mid_rise: 0.43 },
};

// 10-year degradation-adjusted multiplier (not ×10) — research.md §2.7
const M10: Record<MaintenanceRegime, number> = {
  none: 7.5,
  annual: 9.0,
  biannual: 9.5,
};

// Climates where heating penalty warning should appear — research.md §2.5
const COLD_CLIMATE_SET = new Set([
  "very_cold", "cold", "cold_dry",
]);

const CITY_LIST = Object.keys(LOOKUP_DATA).sort();

const CO2_TO_CARS = (mt: number) => (mt / 4.6).toFixed(1);
const CO2_TO_TREES = (mt: number) => Math.round((mt * 1000) / 21.77);
const KWH_TO_HOMES = (kwh: number) => (kwh / 10500).toFixed(2);

export interface CalcResults {
  // Central estimates
  kwhPerYear: number;
  co2MTPerYear: number;
  costSavings: number;
  // Uncertainty range
  kwhLow: number;
  kwhHigh: number;
  co2Low: number;
  co2High: number;
  costLow: number;
  costHigh: number;
  // Equivalents
  carEquiv: string;
  treeEquiv: number;
  homeEquiv: string;
  // Location metadata
  ghi: number;
  cdd: number;
  gridEf: number;
  climate: string;
  cityName: string;
  countryName: string;
  // 10-year (degradation-adjusted)
  tenYrKwh: number;
  tenYrCO2: number;
  tenYrCost: number;
  tenYrMultiplier: number;
  // Flags
  heatingWarning: boolean;
  // Per-m² (adjusted)
  kwhPerM2: number;
  co2PerM2: number;
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
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-primary">
        {title}
      </p>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium text-muted-foreground">{children}</p>
  );
}

function BigStat({
  value,
  unit,
  label,
  colorClass,
  icon,
  low,
  high,
}: {
  value: string;
  unit: string;
  label: string;
  colorClass: string;
  icon: string;
  low?: string;
  high?: string;
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
      <div className={cn("mt-1 text-xs opacity-90", colorClass)}>{unit}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
      {low && high && (
        <div className="mt-1.5 text-[10px] text-muted-foreground/70">
          {low} – {high}
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-secondary/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring";

export interface EnergyCalculatorProps {
  /** Omit full-page chrome when embedded in the marketing site. */
  embedded?: boolean;
}

export default function EnergyCalculator({ embedded = false }: EnergyCalculatorProps) {
  const [city, setCity] = useState("Dubai,UAE");
  const [area, setArea] = useState(500);
  const [areaUnit, setAreaUnit] = useState<"m2" | "ft2">("m2");
  const [buildingType, setBuildingType] = useState<BuildingType>("warehouse");
  const [roofCondition, setRoofCondition] = useState<RoofCondition>("dark");
  const [electricityPrice, setElectricityPrice] = useState(0.12);
  const [maintenance, setMaintenance] = useState<MaintenanceRegime>("annual");
  const [storeyClass, setStoreyClass] = useState<StoreyClass>(DEFAULT_STOREY["warehouse"]);
  const [conditionedPct, setConditionedPct] = useState(100);
  const [results, setResults] = useState<CalcResults | null>(null);
  const [animating, setAnimating] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const areaM2 = areaUnit === "ft2" ? area * 0.0929 : area;

  // Reset storey class to building-type default when building type changes
  useEffect(() => {
    setStoreyClass(DEFAULT_STOREY[buildingType]);
  }, [buildingType]);

  const calculate = useCallback(() => {
    const cityData = LOOKUP_DATA[city];
    if (!cityData) return;
    const perM2 = cityData.b[buildingType]?.[roofCondition];
    if (!perM2) return;

    const climate = cityData.climate;

    // Apply research-calibrated correction factors (research.md Part 4)
    const fField = F_FIELD[climate] ?? 0.68;
    const alphaAge = getAlphaAge(climate, maintenance);
    const copFactor = COP_CORRECTION[buildingType];
    const fRoofFactor = F_ROOF_FACTOR[buildingType][storeyClass];
    const condFrac = conditionedPct / 100;

    const centralFactor = fField * alphaAge * copFactor * fRoofFactor * condFrac;

    // Adjusted per-m² values
    const kwhPerM2Central = perM2.k * centralFactor;
    const co2PerM2Central = kwhPerM2Central * cityData.grid_ef; // kg CO2/m²/yr

    // Scale to total area
    const kwhPerYear = Math.round(kwhPerM2Central * areaM2);
    const co2MTPerYear = parseFloat(((co2PerM2Central * areaM2) / 1000).toFixed(2));
    const costSavings = parseFloat((kwhPerYear * electricityPrice).toFixed(0));

    // Uncertainty range: ±35% envelope (research.md §4.4)
    const kwhLow = Math.round(kwhPerYear * 0.65);
    const kwhHigh = Math.round(kwhPerYear * 1.40);
    const co2Low = parseFloat((co2MTPerYear * 0.65).toFixed(2));
    const co2High = parseFloat((co2MTPerYear * 1.40).toFixed(2));
    const costLow = Math.round(costSavings * 0.65);
    const costHigh = Math.round(costSavings * 1.40);

    // 10-year degradation-adjusted (research.md §2.7)
    const m10 = M10[maintenance];
    const tenYrKwh = Math.round(kwhPerYear * m10);
    const tenYrCO2 = parseFloat((co2MTPerYear * m10).toFixed(1));
    const tenYrCost = Math.round(costSavings * m10);

    const cityName = city.split(",")[0];
    const countryName = city.split(",")[1] ?? "";

    setAnimating(true);
    window.setTimeout(() => setAnimating(false), 600);
    setResults({
      kwhPerYear,
      co2MTPerYear,
      costSavings,
      kwhLow,
      kwhHigh,
      co2Low,
      co2High,
      costLow,
      costHigh,
      carEquiv: CO2_TO_CARS(co2MTPerYear),
      treeEquiv: CO2_TO_TREES(co2MTPerYear),
      homeEquiv: KWH_TO_HOMES(kwhPerYear),
      ghi: cityData.ghi,
      cdd: cityData.cdd,
      gridEf: cityData.grid_ef,
      climate: cityData.climate.replace(/_/g, " "),
      cityName,
      countryName,
      tenYrKwh,
      tenYrCO2,
      tenYrCost,
      tenYrMultiplier: m10,
      heatingWarning: COLD_CLIMATE_SET.has(climate),
      kwhPerM2: parseFloat(kwhPerM2Central.toFixed(1)),
      co2PerM2: parseFloat(co2PerM2Central.toFixed(3)),
    });
  }, [city, areaM2, buildingType, roofCondition, electricityPrice, maintenance, storeyClass, conditionedPct]);

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

  const fmtNum = (n: number) => n.toLocaleString();

  return (
    <div
      className={cn(
        embedded ? "pb-4" : "min-h-screen bg-background pb-12"
      )}
    >
      {!embedded && (
        <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-secondary/20 to-background px-6 py-10 text-center">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.15),transparent_70%)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Energy savings estimator
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Passive cooling energy calculator
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              Conservative field-calibrated estimates of annual kWh saved and CO₂ avoided when upgrading to a passive cooling roof.
              Results shown as conservative / central / optimistic ranges.{" "}
              <Link
                to="/blog/energy-calculator"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                How we built this
              </Link>
              {" · "}
              <Link
                to="/blog/pdrc-engineering"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Formulas
              </Link>
            </p>
          </div>
        </div>
      )}

      <div
        className={cn(
          "mx-auto grid max-w-[1100px] grid-cols-1 gap-6 lg:grid-cols-2",
          embedded ? "px-0 py-2" : "px-5 py-8"
        )}
      >
        {/* ── LEFT COLUMN: INPUTS ── */}
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
                  className="absolute left-0 right-0 top-[calc(100%+6px)] z-[100] max-h-56 overflow-y-auto rounded-xl border border-border bg-popover shadow-lg"
                  role="listbox"
                >
                  {filteredCities.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="option"
                      onClick={() => handleCitySelect(c)}
                      className={cn(
                        "flex w-full cursor-pointer border-b border-border px-3.5 py-2.5 text-left text-sm transition-colors last:border-0",
                        c === city
                          ? "bg-primary/15 text-primary"
                          : "text-foreground hover:bg-primary/10"
                      )}
                    >
                      <span className="font-semibold">{c.split(",")[0]}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
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
                    className="rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1 text-xs"
                  >
                    <span className="text-muted-foreground">{k}: </span>
                    <span className="font-semibold text-primary">{v}</span>
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
              <p className="mb-3 text-xs text-muted-foreground">
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
                      ? "border-primary bg-primary/15 font-semibold text-primary"
                      : "border-border bg-secondary/20 text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {BUILDING_LABELS[k]}
                </button>
              ))}
            </div>

            <Label>Building height</Label>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {(Object.keys(STOREY_LABELS) as StoreyClass[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setStoreyClass(k)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-xs transition-all",
                    storeyClass === k
                      ? "border-primary bg-primary/15 font-semibold text-primary"
                      : "border-border bg-secondary/20 text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {STOREY_LABELS[k]}
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
                      ? "border-primary bg-primary/15 font-semibold text-primary"
                      : "border-border bg-secondary/20 text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "h-5 w-5 shrink-0 rounded border border-border",
                      k === "dark" && "bg-zinc-900",
                      k === "medium" && "bg-zinc-500",
                      k === "light" && "bg-zinc-100"
                    )}
                  />
                  {ROOF_LABELS[k]}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Performance assumptions">
            <Label>Coating maintenance regime</Label>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {(Object.keys(MAINTENANCE_LABELS) as MaintenanceRegime[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMaintenance(k)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-xs transition-all",
                    maintenance === k
                      ? "border-primary bg-primary/15 font-semibold text-primary"
                      : "border-border bg-secondary/20 text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {MAINTENANCE_LABELS[k]}
                </button>
              ))}
            </div>
            <p className="mb-4 text-[11px] leading-relaxed text-muted-foreground">
              Passive cooling coatings lose 20–30 % of initial solar reflectance within 3–5 years without cleaning.
              Affects the aging factor (α<sub>age</sub>) and the 10-year adjusted projection.
            </p>

            <Label>
              Conditioned area fraction —{" "}
              <span className="font-semibold text-primary">{conditionedPct} %</span>
            </Label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={conditionedPct}
              onChange={(e) => setConditionedPct(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-primary"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Passive comfort benefit applies to the full roof area.
              HVAC electricity savings apply only to the fraction over mechanically cooled space.
              Set to 0 % for naturally ventilated / unconditioned buildings.
            </p>
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
              <div className="min-w-[3.5rem] rounded-lg border border-primary/35 bg-primary/10 px-3 py-1 text-center text-sm font-bold text-primary">
                ${electricityPrice.toFixed(2)}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Global average ≈ $0.12/kWh · US ≈ $0.16 · UK ≈ $0.28 · India ≈ $0.08
            </p>
          </Card>
        </div>

        {/* ── RIGHT COLUMN: RESULTS ── */}
        <div className="flex flex-col gap-4">
          {results ? (
            <>
              {/* Heating penalty warning */}
              {results.heatingWarning && (
                <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-xs leading-relaxed text-foreground">
                  <span className="mt-0.5 shrink-0 text-base">⚠️</span>
                  <span>
                    <strong>Heating-dominant climate.</strong> In cold / very cold climates,
                    winter solar gain loss from a high-reflectance roof may offset part or all
                    of the cooling benefit. Net annual savings may be near zero or negative
                    without adequate roof insulation (R-value). Treat these figures as an
                    upper bound for warm-season savings only.
                  </span>
                </div>
              )}

              {/* Annual savings — central + range */}
              <div
                className={cn(
                  "rounded-2xl border border-primary/25 bg-gradient-to-br from-card to-secondary/30 p-6 transition-all duration-300",
                  animating && "scale-[0.98] opacity-90"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Annual savings — central estimate
                  </p>
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                    ± 35 % range shown
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <BigStat
                    value={fmtNum(results.kwhPerYear)}
                    unit="kWh / yr"
                    label="Energy saved"
                    colorClass="text-energy"
                    icon="⚡"
                    low={fmtNum(results.kwhLow)}
                    high={fmtNum(results.kwhHigh)}
                  />
                  <BigStat
                    value={results.co2MTPerYear.toLocaleString()}
                    unit="MT CO₂e / yr"
                    label="Carbon avoided"
                    colorClass="text-impact"
                    icon="🌿"
                    low={results.co2Low.toLocaleString()}
                    high={results.co2High.toLocaleString()}
                  />
                  <BigStat
                    value={`$${fmtNum(results.costSavings)}`}
                    unit="/ yr"
                    label="Cost savings"
                    colorClass="text-highlight"
                    icon="💰"
                    low={`$${fmtNum(results.costLow)}`}
                    high={`$${fmtNum(results.costHigh)}`}
                  />
                  <BigStat
                    value={results.homeEquiv}
                    unit="homes"
                    label="Equiv. US homes (avg.)"
                    colorClass="text-climate"
                    icon="🏠"
                  />
                </div>

                {/* Range legend */}
                <div className="mt-4 rounded-lg border border-border bg-secondary/20 px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
                  <strong className="text-foreground/80">Range:</strong>{" "}
                  Conservative (low) · Central · Optimistic (high) —
                  reflecting ±35 % model uncertainty typical of simplified physics-based roof energy tools.
                  Central estimate applies field-calibration (f<sub>field</sub>), coating aging (α<sub>age</sub>),
                  seasonal COP, and storey-adjusted roof fraction.
                </div>
              </div>

              {/* 10-year adjusted */}
              <Card title={`10-year adjusted impact (${results.tenYrMultiplier}× degradation factor)`}>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["⚡", fmtNum(results.tenYrKwh), "kWh", "Energy"],
                    ["🌿", results.tenYrCO2.toLocaleString(), "MT CO₂e", "Carbon"],
                    ["💰", `$${fmtNum(results.tenYrCost)}`, "saved", "Cost"],
                  ].map(([icon, val, unit, label]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-border bg-secondary/20 px-2 py-3 text-center"
                    >
                      <div className="text-lg">{icon}</div>
                      <div className="text-base font-extrabold text-foreground">
                        {val}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {unit}
                      </div>
                      <div className="text-[11px] text-muted-foreground/90">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                  Uses a degradation-adjusted multiplier ({results.tenYrMultiplier}× for{" "}
                  <em>{MAINTENANCE_LABELS[maintenance].toLowerCase()}</em>) rather than a
                  simple ×10, reflecting real-world soiling and aging over the project life.
                </p>
              </Card>

              {/* Real-world equivalents */}
              <Card title="Real-world equivalents">
                <div className="flex flex-col gap-2">
                  {[
                    {
                      icon: "🚗",
                      text: `Removing ${results.carEquiv} average cars' emissions for a year`,
                    },
                    {
                      icon: "🌳",
                      text: `Planting ${fmtNum(results.treeEquiv)} trees (rough CO₂ uptake analog)`,
                    },
                    {
                      icon: "🏠",
                      text: `Powering ${results.homeEquiv} average US homes for a year`,
                    },
                  ].map(({ icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 rounded-lg border border-impact/25 bg-impact/10 px-3 py-2.5 text-xs text-foreground"
                    >
                      <span className="text-lg">{icon}</span>
                      {text}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Per m² breakdown */}
              <Card title="Per m² breakdown (adjusted)">
                {(() => {
                  return (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ["kWh/m²/yr", results.kwhPerM2.toFixed(1), "text-energy"],
                        ["kg CO₂/m²/yr", results.co2PerM2.toFixed(3), "text-impact"],
                        ["Area (m²)", areaM2.toFixed(0), "text-highlight"],
                      ].map(([label, val, col]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-border bg-secondary/20 px-2 py-3 text-center"
                        >
                          <div className={cn("text-base font-extrabold", col)}>
                            {val}
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Card>

              {/* Methodology note */}
              <div className="rounded-xl border border-border bg-secondary/15 p-4 text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Methodology:</strong>{" "}
                Field-calibrated lookup using passive cooling physics (Q<sub>net</sub> = (Δρ·I<sub>avg</sub> + ε·R<sub>base</sub>) × h × f<sub>field</sub> × α<sub>age</sub>),
                NASA POWER GHI, IEA 2023 grid factors, ASHRAE CDD, and building-type seasonal COP.
                Central estimate reflects real-world field performance; ±35 % range covers typical
                model uncertainty. For bankable or compliance-grade numbers, run EnergyPlus or the
                ORNL Roof Savings Calculator for your specific site.{" "}
                <span className="text-foreground/60">
                  Grid factor: IEA 2023 · {results.gridEf} kg CO₂e/kWh for {results.cityName}.
                </span>
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
              Configure inputs to see results
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "mx-auto mt-4 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-xs text-muted-foreground",
          embedded ? "px-0" : "px-5"
        )}
      >
        <span>NASA POWER</span>
        <span className="text-border">·</span>
        <span>IEA 2023 grid factors</span>
        <span className="text-border">·</span>
        <span>ASHRAE CDD</span>
        <span className="text-border">·</span>
        <span>CRRC aged reflectance</span>
        <span className="text-border">·</span>
        <Link
          to="/blog/energy-calculator"
          className="font-medium text-primary hover:underline"
        >
          Research write-up
        </Link>
        <span className="text-border">·</span>
        <Link
          to="/blog/pdrc-engineering"
          className="font-medium text-primary hover:underline"
        >
          Formulas
        </Link>
      </div>
    </div>
  );
}
