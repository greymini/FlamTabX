# How we built the PDRC energy savings calculator

> **Executive summary:** This tool estimates **annual kWh saved** and **CO₂ avoided** when a high-performance passive daytime radiative cooling (PDRC) roof replaces a darker baseline, using **precalculated physics**, **NASA POWER** solar data, **IEA** grid factors, and **ASHRAE style** cooling demand proxies. It runs **entirely in your browser** (no live API calls). **[Try the calculator →](/tools/energy-savings)**  
> For **equations, symbols, and the formula pipeline** in proper mathematical form, see **[Formulas & pipeline →](/blog/pdrc-engineering)**.

---

## What PDRC is (plain English)

A PDRC surface does two things at once:

1. **Reflects sunlight** so less energy enters the roof as heat. Dark roofs may absorb **~85–95%** of solar radiation; advanced cool / PDRC finishes push solar reflectance much higher, dramatically cutting solar heat gain.

2. **Radiates heat to the sky** in the **atmospheric window** (roughly **8–13 µm**), where the atmosphere is relatively transparent. High thermal emittance in this band lets the roof shed heat even when the air is warm; this is what distinguishes serious PDRC marketing from “white paint only.”

Net cooling power is often written conceptually as:

```
cooling ≈ (reflected solar) + (radiation to sky) − (convection / gains from air)
```

**Humidity matters:** water vapor blocks and re-emits longwave radiation, weakening sky-facing cooling. Tropical cities therefore see **lower** per-m² savings than hot desert cities at the same temperature. Our lookup pipeline applies a **humidity factor** by climate class.

---

## Why we used a lookup table (not live simulation)

We considered three architectures:

| Approach | Strength | Tradeoff |
|----------|----------|----------|
| **Live EnergyPlus / attic simulation** | Most physically faithful | Slow, server-heavy, poor fit for instant UX |
| **Live formulas in-browser** | Flexible geography | Harder to validate against a reference calculator |
| **Precalculated lookup JSON** | Instant, offline, auditable batch physics | Fixed city list (we ship **84**; interpolation extends coverage) |

We chose **precalculated tables** embedded in the client bundle, similar in spirit to other industry tools that cache simulation or physics outputs. Offline scripts compute **city × building type × roof condition** cells; the UI multiplies per-m² savings by **roof area** and applies **grid emission factors** for CO₂.

**Trust and speed:** Heavy work runs once in maintainers’ environments; users get repeatable numbers and **no account wall**.

---

## Data sources we rely on

- **NASA POWER:** global horizontal irradiance (**GHI**), temperature, humidity cues; where network access was constrained we used **verified GHI overrides** (Global Solar Atlas, NSRDB, PVGIS) documented in the build pipeline.
- **ASHRAE / Meteonorm style thinking:** **cooling degree days (CDD)** and **COP** assumptions by building class shape how electrical savings map from roof load.
- **IEA (and national tables where available):** **grid emission factors** (kg CO₂e per kWh). The same kWh saving implies very different CO₂ outcomes in **coal heavy** vs **low carbon** grids.

Implementation details and constants are summarized in **[Formulas & pipeline](/blog/pdrc-engineering)** (maintainers keep the full script-level spec in the private repo).

---

## Validation, limitations, and honesty

This calculator is an **estimation and education** tool, not a substitute for **bankable** M&V or compliance models.

**Known limitations (high level):**

- **Roof-only** savings do not capture whole-building HVAC dynamics (thermal mass, infiltration, internal gains, schedules).
- **Lookup discretization.** We interpolate between cities for UX, but edge cases should be checked against site-specific simulation when stakes are high.
- **Coating performance** is represented through **roof condition / reflectance bands** aligned with our PDRC style assumptions, not your exact product datasheet unless you re-run the pipeline.

Stating limits **in-product** is part of credibility. For procurement-grade numbers, we point teams to **EnergyPlus**, **ORNL Roof Savings Calculator**, or vendor-specific studies.

---

## How savings flow through the pipeline (conceptual)

1. **Geography** → climate class, GHI, humidity correction, grid EF.  
2. **Building type** → COP, roof share of cooling load, operating pattern proxies.  
3. **Roof starting point** (dark / medium / light) → delta in solar absorption and PDRC physics layer.  
4. **Multiply** per-m² annual **kWh** by **area** (m²).  
5. **Convert** kWh × grid EF → **metric tonnes CO₂e**.

The **[formulas article](/blog/pdrc-engineering)** names the main symbols and the end-to-end chain from irradiance to kWh and CO₂.

---

## Frontend and reproducibility

- The published app loads a **compact JSON lookup** and runs **pure client-side** React.
- To change assumptions (a new coating SR, a revised COP table), adjust the **offline generator** and ship a new JSON artifact.
- Partner-facing extensions (custom coating tables) are described in the formulas article and in direct technical discussions.

---

## Customize for your coating (partners & R&D)

If you are a **coating manufacturer** with lab-measured **solar reflectance**, **thermal emittance**, and durability data, the same pipeline can regenerate lookup tables for **your SKU** instead of our reference PDRC band. Contact us with datasheet + target geographies.

---

## References (selected)

Key PDRC, cool roof, and radiative cooling humidity literature informed the humidity factors and sanity checks; citations are available on request for diligence.

---

*Related: [All blog posts](/blog) · [Formulas & pipeline](/blog/pdrc-engineering) · [FlamTabX venture story](/blog/flamtabx) · [Run the calculator](/tools/energy-savings)*
