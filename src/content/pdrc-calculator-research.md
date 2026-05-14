# How we built the energy savings calculator

> **Executive summary:** This tool estimates **annual kWh saved** and **CO₂ avoided** when a high-performance passive daytime radiative cooling roof replaces a darker baseline. It uses **field-calibrated physics**, **NASA POWER** solar data, **IEA 2023** grid factors, and **ASHRAE-style** cooling demand proxies. Results are presented as **conservative / central / optimistic ranges** to reflect the inherent uncertainty of simplified models. It runs **entirely in your browser** (no live API calls). **[Try the calculator →](/tools/energy-savings)**  
> For **equations, symbols, and the formula pipeline**, see **[Formulas & pipeline →](/blog/pdrc-engineering)**.

---

## What passive cooling is (plain English)

A passive cooling surface does two things at once:

1. **Reflects sunlight** so less energy enters the roof as heat. Dark roofs absorb **~85–95 %** of solar radiation; advanced passive cooling finishes push solar reflectance to ~0.95, dramatically cutting solar heat gain.

2. **Radiates heat to the sky** through the **atmospheric window** (roughly **8–13 µm**), where the atmosphere is relatively transparent. High thermal emittance in this band lets the roof shed heat even when the air is warm — the key distinction between serious passive cooling and a simple white-paint cool roof.

Net cooling power is often written as:

```
cooling ≈ (reflected solar) + (radiation to sky) − (convection / gains from air)
```

### Real-world net cooling power: what the field data show

Laboratory measurements of passive cooling materials peak at **93–150 W/m²** under ideal clear-sky, low-humidity, clean-surface desert conditions. But deployed buildings are not lab environments. Published field studies consistently measure:

- **Hot-dry climates** (e.g., Arizona, Middle East): **40–70 W/m²** net cooling power
- **Hot-humid and subtropical** (e.g., Florida, South China): **20–50 W/m²**
- **Tropical / high-humidity** (e.g., Singapore, Mumbai): **15–40 W/m²**

The two biggest real-world attenuators are **humidity** (water vapour blocks and re-emits the longwave radiation that passive cooling relies on) and **soiling** (dust, biological growth, and air pollution degrade solar reflectance faster than lab aging tests predict). Our updated calculator explicitly models both.

---

## Why we used a lookup table (not live simulation)

We considered three architectures:

| Approach | Strength | Tradeoff |
|----------|----------|----------|
| **Live EnergyPlus / attic simulation** | Most physically faithful | Slow, server-heavy, poor fit for instant UX |
| **Live formulas in-browser** | Flexible geography | Harder to validate against reference calculators |
| **Precalculated lookup JSON** | Instant, offline, auditable batch physics | Fixed city list (84 cities; interpolation extends coverage) |
| **Lookup + client-side corrections** | Field calibration without re-generating tables | Adds transparency on what each factor does |

We chose **precalculated tables** embedded in the client bundle, with client-side correction factors applied for field performance, coating aging, seasonal COP, and building storey class. This means users can see exactly how each assumption affects the result without a server round-trip.

---

## Data sources we rely on

- **NASA POWER:** global horizontal irradiance (**GHI**), temperature, humidity cues; where network access was constrained we used **verified GHI overrides** (Global Solar Atlas, NSRDB, PVGIS) documented in the build pipeline.
- **IEA Emissions Factors 2023:** **grid emission factors** (kg CO₂e per kWh). The same kWh saving implies very different CO₂ outcomes in coal-heavy vs. low-carbon grids. The IEA vintage is labelled in the UI for transparency.
- **ASHRAE / Meteonorm-style thinking:** **cooling degree days (CDD)** and building-type cooling patterns shape how electrical savings map from the roof load.
- **CRRC (Cool Roof Rating Council):** **3-year aged reflectance** values and soiling rate data. CRRC requires aged values for product certification because initial reflectance overstates long-term performance. This is the basis for the coating aging factor (α_age).
- **LBNL aged solar reflectance database:** Lawrence Berkeley National Laboratory's field-measured aged reflectance data underpins the α_age correction table by climate class.
- **ASHRAE 90.1 reference building simulation data:** the basis for roof-fraction-of-cooling-load (f_roof) per building type and storey class.

Implementation details and constants are in **[Formulas & pipeline](/blog/pdrc-engineering)**.

---

## A note on the lab-to-field performance gap

Passive cooling materials are characterised under **ideal conditions** — clear sky, low humidity, clean surface, no wind. Deployed buildings experience all of these in combination. Published field studies (Fan et al. 2022; Hossain et al. 2021; Tang et al. 2021) consistently find that the ratio of field-measured to lab-measured net cooling power is:

- **0.70–0.85** in hot-dry climates
- **0.60–0.70** in hot-humid climates
- **0.55–0.65** in tropical / high-humidity climates

The updated lookup tables incorporate a **field attenuation factor (f_field)** drawn from this range. The effect on the headline kWh numbers is significant: without this correction, our model would overstate savings by roughly **15–30 %** before accounting for aging.

---

## How savings flow through the pipeline (conceptual)

1. **Geography** → climate class, GHI, humidity correction (h), field calibration (f_field), grid EF.
2. **Building type + storey class** → seasonal COP, storey-adjusted roof share of cooling load (f_roof × storey factor).
3. **Maintenance regime** → coating aging factor (α_age), which degrades over time without cleaning.
4. **Conditioned area fraction** → HVAC electricity savings apply only to the air-conditioned portion of the roof.
5. **Roof starting point** (dark / medium / light) → delta in solar absorption and passive cooling radiative layer.
6. **Multiply** per-m² annual **kWh** by **roof area** (m²).
7. **Convert** kWh × grid EF → **metric tonnes CO₂e**.
8. **Apply ±35 % uncertainty band** → conservative / central / optimistic range.

The **[formulas article](/blog/pdrc-engineering)** names all symbols and the end-to-end chain from irradiance to kWh and CO₂.

---

## Validation, limitations, and honesty

This calculator is an **estimation and education** tool, not a substitute for bankable M&V or compliance models. Specific known limitations:

1. **Initial vs. aged reflectance:** the model uses field-calibrated aging factors, but your specific coating's durability may differ from the reference values. A formal M&V programme using CRRC 3-year aged values for your product will give more accurate projections.

2. **Storey count and roof fraction:** the roof's share of total cooling load decreases significantly with building height. Multi-storey commercial and hospital buildings are the most sensitive to this — the mid-rise default applies a 49–57 % downward correction to the base lookup for these types.

3. **Conditioned area assumption:** unconditioned or naturally ventilated buildings (e.g., logistics sheds, agricultural buildings) yield near-zero HVAC electricity savings from roofing the uncooled area. Set the conditioned fraction slider to reflect your actual situation.

4. **Grid emission factors (IEA 2023):** rapidly decarbonising grids (EU, UK, India) show materially lower kg CO₂/kWh than data from even two years prior. The CO₂ savings figures will overstate impact as grids clean up. We commit to refreshing grid factors annually.

5. **Model uncertainty: ±30–50 %** applies to all central-estimate figures. The ±35 % range shown in the UI reflects the uncertainty documented in ORNL Roof Savings Calculator methodology and LBNL cool roof tools.

6. **Heating penalty in cold climates:** in ASHRAE climate zones 4–7 (mixed-humid, cold, very cold), a high-reflectance roof *loses* solar gain in winter, potentially wiping out some or all of the cooling-season savings. The UI shows a warning for these cities and reduces the estimate via a heating penalty factor.

Stating limits in-product is part of credibility. For procurement-grade numbers, we point teams to **EnergyPlus**, **ORNL Roof Savings Calculator**, or vendor-specific studies.

---

## Frontend and reproducibility

- The published app loads a **compact JSON lookup** and runs **pure client-side** React.
- Correction factors (f_field, α_age, COP adjustment, f_roof by storey) are applied in-browser so users can inspect them directly.
- To change assumptions (revised COP table, updated grid factors), adjust the **offline generator** and ship a new JSON artifact. No server changes required.
- Partner-facing extensions (custom coating tables, site-specific reflectance) are described in the formulas article.

---

## Customize for your coating (partners & R&D)

If you are a **coating manufacturer** with lab-measured **solar reflectance**, **thermal emittance**, and **3-year aged reflectance** data, the same pipeline can regenerate lookup tables for your SKU instead of the reference passive cooling band. Contact us with datasheet + target geographies.

---

## References (selected)

1. Fan, S. et al. (2022). Thermal Cooling System using Passive Radiative Cooling. *Science.*
2. Hossain, M.M. et al. (2021). Field performance of passive cooling coatings under subtropical conditions.
3. Tang, H. et al. (2021). Real-world net cooling power measurements for sub-ambient radiative cooling. *Applied Energy.*
4. Cool Roof Rating Council (CRRC). *Determining the Energy Savings of a Cool Roof.* 2020 edition.
5. Lawrence Berkeley National Laboratory. *Aged solar reflectance database.* 2023.
6. ASHRAE 90.1 Reference Building Simulation Data (commercial buildings, roof load fractions).
7. IEA. *Emissions Factors 2023.* International Energy Agency.
8. PNNL Technical Report PNNL-24904 (2016). *Energy Savings Potential of Radiative Cooling Technologies.*
9. npj Urban Sustainability (2024). *Building energy savings by green roofs and cool roofs in current and future climates.*

Key passive cooling, cool roof, and radiative cooling literature informed the humidity factors and field calibration constants; full citations are available on request for diligence.

---

*Related: [All blog posts](/blog) · [Formulas & pipeline](/blog/pdrc-engineering) · [FlamTabX venture story](/blog/flamtabx) · [Run the calculator](/tools/energy-savings)*
