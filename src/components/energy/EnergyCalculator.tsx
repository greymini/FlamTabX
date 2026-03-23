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
      <div className={cn("mt-1 text-xs opacity-90", colorClass)}>{unit}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-input bg-secondary/30 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring";

export default function EnergyCalculator() {
  const [city, setCity] = useState("Dubai,UAE");
  const [area, setArea] = useState(500);
  const [areaUnit, setAreaUnit] = useState<"m2" | "ft2">("m2");
  const [buildingType, setBuildingType] = useState<BuildingType>("warehouse");
  const [roofCondition, setRoofCondition] = useState<RoofCondition>("dark");
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
    <div className="min-h-screen bg-background pb-12">
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card via-secondary/20 to-background px-6 py-10 text-center">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.15),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            PDRC energy savings estimator
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Passive cooling energy calculator
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Estimate annual kWh saved and CO₂ avoided for your roof — using
            pre-computed lookup tables from NASA POWER solar data, IEA grid
            emission factors, and PDRC-style physics.{" "}
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
                  "rounded-2xl border border-primary/25 bg-gradient-to-br from-card to-secondary/30 p-6 transition-all duration-300",
                  animating && "scale-[0.98] opacity-90"
                )}
              >
                <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
                  Annual savings estimate
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <BigStat
                    value={results.kwhPerYear.toLocaleString()}
                    unit="kWh / yr"
                    label="Energy saved"
                    colorClass="text-energy"
                    icon="⚡"
                  />
                  <BigStat
                    value={results.co2MTPerYear.toLocaleString()}
                    unit="MT CO₂e / yr"
                    label="Carbon avoided"
                    colorClass="text-impact"
                    icon="🌿"
                  />
                  <BigStat
                    value={`$${results.costSavings.toLocaleString()}`}
                    unit="/ yr"
                    label="Cost savings"
                    colorClass="text-highlight"
                    icon="💰"
                  />
                  <BigStat
                    value={results.homeEquiv}
                    unit="homes"
                    label="Equivalent homes (US avg.)"
                    colorClass="text-climate"
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
                      className="flex items-center gap-3 rounded-lg border border-impact/25 bg-impact/10 px-3 py-2.5 text-xs text-foreground"
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
                        ["kWh/m²/yr", d.k.toFixed(1), "text-energy"],
                        ["kg CO₂/m²/yr", d.c.toFixed(2), "text-impact"],
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

              <div className="rounded-xl border border-border bg-secondary/15 p-4 text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Methodology:</strong>{" "}
                Pre-computed lookup using PDRC-style cooling physics, NASA POWER
                GHI, IEA grid factors, ASHRAE CDD, and humidity corrections. For
                bankable estimates, run EnergyPlus or the ORNL Roof Savings
                Calculator for your site.
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
              Configure inputs to see results
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 text-center text-xs text-muted-foreground">
        <span>NASA POWER</span>
        <span className="text-border">·</span>
        <span>IEA grid factors</span>
        <span className="text-border">·</span>
        <span>ASHRAE CDD</span>
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
