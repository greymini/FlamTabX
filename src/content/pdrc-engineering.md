# PDRC calculator: formulas and pipeline

> **For readers:** This article presents the **core equations and correction factors** behind the public lookup tool. It replaces a downloadable engineering dump. Everything here is meant to be read in context with the [methodology overview](/blog/energy-calculator) and the [live calculator](/tools/energy-savings).

---

## Net cooling power (conceptual balance)

A high-performance PDRC roof reduces solar absorption and adds sky-facing radiative exchange. The physics balance is:

$$
Q_{\mathrm{cool}} = Q_{\mathrm{solar,reflected}} + Q_{\mathrm{radiative}} - Q_{\mathrm{convective}}
$$

where $Q_{\mathrm{cool}}$ is net cooling power per unit area (W/m²).

### Updated formula with field calibration

The **offline engine** separates a **solar term** proportional to the change in solar reflectance and a **radiative baseline**, then applies three real-world correction factors:

$$
Q_{\mathrm{net}} = \bigl(\Delta\rho \cdot I_{\mathrm{avg}} + \varepsilon_{\mathrm{pdrc}} \cdot R_{\mathrm{base}}\bigr) \cdot h \cdot f_{\mathrm{field}} \cdot \alpha_{\mathrm{age}}
$$

Where:
- $\Delta\rho = \rho_{\mathrm{pdrc}} - \rho_{\mathrm{baseline}}$ — change in solar reflectance (baseline is dark / medium / light roof band)
- $I_{\mathrm{avg}}$ — cooling-season–weighted average irradiance (W/m²), derived from annual GHI with a seasonal boost (see below)
- $\varepsilon_{\mathrm{pdrc}}$ — longwave emittance of PDRC coating (reference: 0.95)
- $R_{\mathrm{base}} = 30\,\mathrm{W/m^2}$ — conservative field-representative incremental radiative benefit. Revised down from 45 W/m² (prior value) to align with published field study ranges of 20–50 W/m² in humid subtropical conditions; 40–70 W/m² in hot-dry. Source: Fan et al. 2022; Hossain et al. 2021; Tang et al. 2021.
- $h \in [0.48,\,1.0]$ — **humidity factor**: folds in water vapour, clouds, and documented PDRC degradation in humid / tropical skies (unchanged from prior version)
- $f_{\mathrm{field}} \in [0.58,\,0.73]$ — **field attenuation factor** (new): accounts for the gap between lab-characterised and field-deployed net cooling power. See table below.
- $\alpha_{\mathrm{age}} \in [0.70,\,0.95]$ — **soiling / aging factor** (new): accounts for solar reflectance degradation over time. Parameterised by maintenance regime. See table below.

---

## From annual GHI to average irradiance during cooling

Annual global horizontal irradiance $G_{\mathrm{yr}}$ (kWh/m²/yr) is converted to a cooling-relevant average (W/m²) with a **seasonal boost** $\beta \approx 1.3$ and a cap $I_{\max} = 850\,\mathrm{W/m^2}$:

$$
I_{\mathrm{avg}} = \min\!\left( \frac{G_{\mathrm{yr}} \times 1000 \times \beta}{\max(t_{\mathrm{cool}},\,200)} ,\; I_{\max} \right)
$$

Here $t_{\mathrm{cool}}$ is cooling hours per year (from climate class), meaning hours when mechanical cooling is meaningfully active — not simply daylight hours.

---

## Annual electrical savings per m² (thermal → electrical)

$$
E_{\mathrm{thermal}} = Q_{\mathrm{net}} \cdot t_{\mathrm{cool}} \cdot f_{\mathrm{roof}} \cdot f_{\mathrm{occ}}
$$

$$
E_{\mathrm{elec}} = \frac{E_{\mathrm{thermal}}}{\mathrm{COP}_{\mathrm{seasonal}} \times 1000} \cdot p_{\mathrm{heat}}
$$

Where:
- $t_{\mathrm{cool}}$ — cooling hours per year, from climate class (ASHRAE reference building occupancy-scheduled values; see table)
- $f_{\mathrm{roof}}$ — fraction of total building cooling load attributed to the roof, adjusted by building type and storey class
- $f_{\mathrm{occ}} \in [0,\,1]$ — **occupancy / conditioned-area factor** (new): scales electrical savings to the fraction of roof area over mechanically cooled space. Set by the user. Buildings with no mechanical cooling yield $f_{\mathrm{occ}} \approx 0$ for the HVAC pathway; passive comfort benefit applies to the full area.
- $\mathrm{COP}_{\mathrm{seasonal}}$ — **seasonal (IPLV) coefficient of performance** rather than peak-rated nominal COP. See revised table below.
- $p_{\mathrm{heat}} \in (0,\,1]$ — heating penalty: debits winter solar-gain loss in cold climates

**Why COP appears in the denominator:** if the system delivers $\mathrm{COP}$ kWh of cooling per kWh of electricity, then each watt-hour of avoided thermal load corresponds to $1/\mathrm{COP}$ watt-hours of metered electricity. A lower seasonal COP (less efficient system) therefore means more electricity saved per unit of thermal-load reduction.

---

## CO₂ avoided

$$
m_{\mathrm{CO_2}} = \frac{E_{\mathrm{elec}} \cdot A \cdot \gamma_{\mathrm{current}}}{1000} \quad [\mathrm{metric\ tonnes\ per\ year}]
$$

where $A$ is roof area (m²) and $\gamma_{\mathrm{current}}$ is the IEA 2023 grid emission factor (kg CO₂e/kWh), labelled by city in the calculator UI. Grid factors are updated annually as the IEA publishes new data; using stale values systematically overstates CO₂ savings in rapidly decarbonising grids.

---

## Uncertainty and range estimates

The ±35 % uncertainty envelope is applied to all central estimates:

$$
E_{\mathrm{conservative}} = E_{\mathrm{elec}} \times 0.65
$$
$$
E_{\mathrm{central}} = E_{\mathrm{elec}}
$$
$$
E_{\mathrm{optimistic}} = E_{\mathrm{elec}} \times 1.40
$$

This range is consistent with the ±30–50 % uncertainty documented in the ORNL Roof Savings Calculator methodology and LBNL cool roof tools. It reflects the combined effect of roof-level variability (surface temperature, local shading, mounting details), HVAC system heterogeneity, occupancy patterns, and weather year-to-year variation. **Treat central estimates as indicative; treat the low end as a conservative planning baseline.**

---

## Climate tables

### Humidity factor $h$

| Climate class | $h$ |
|---|---|
| hot_dry | 1.00 |
| hot_mixed | 0.72 |
| hot_humid | 0.68 |
| mixed_humid | 0.78 |
| temperate | 0.80 |
| marine / warm_marine | 0.72 |
| tropical | 0.48 |
| cold / cold_dry | 0.75 |
| very_cold | 0.75 |

### Field attenuation factor $f_{\mathrm{field}}$

Source: published field study ranges (Fan et al. 2022; Hossain et al. 2021; Tang et al. 2021; PNNL-24904 2016).

| Climate class | $f_{\mathrm{field}}$ |
|---|---|
| hot_dry / cold_dry | 0.73 |
| hot_mixed | 0.67 |
| hot_humid | 0.63 |
| mixed_humid | 0.65 |
| temperate | 0.69 |
| marine / warm_marine | 0.68 |
| tropical | 0.58 |
| cold | 0.72 |
| very_cold | 0.72 |

### Aging / soiling factor $\alpha_{\mathrm{age}}$

CRRC long-term weathering data and ScienceDirect 2025 Mediterranean soiling study show 20–30 % reflectance loss within 3–5 years without maintenance. Values below represent average effective reflectance over a 10-year project life.

| Climate class | No maintenance | Annual cleaning | Biannual cleaning |
|---|---|---|---|
| hot_dry / cold_dry | 0.82 | 0.91 | 0.95 |
| hot_humid / mixed_humid | 0.75–0.78 | 0.88–0.89 | 0.93–0.94 |
| tropical | 0.70 | 0.85 | 0.92 |
| marine / temperate / cold | 0.80 | 0.90 | 0.94 |
| very_cold | 0.80 | 0.90 | 0.94 |

### Cooling hours $t_{\mathrm{cool}}$

Values distinguish residential 24/7 cooling from commercial occupancy-scheduled cooling per ASHRAE reference building data.

| Climate class | Residential (24/7) | Commercial (occupancy-scheduled) |
|---|---|---|
| tropical | ~4,000 hr/yr | ~2,800 hr/yr |
| hot_dry | ~3,000 hr/yr | ~2,200 hr/yr |
| hot_humid | ~2,800 hr/yr | ~2,000 hr/yr |
| mixed_humid | ~1,400 hr/yr | ~1,000 hr/yr |
| temperate / marine | ~800 hr/yr | ~600 hr/yr |
| cold | ~400 hr/yr | ~300 hr/yr |
| very_cold | ~200 hr/yr | ~150 hr/yr |

### Seasonal COP (IPLV values, revised)

These replace peak-rated nominal COP values previously used in the pipeline. Source: ASHRAE Handbook of Fundamentals seasonal performance data; PNNL-24904 modelled IPLV values.

| Building type | Seasonal COP |
|---|---|
| Warehouse / Industrial (evaporative / simple AC) | 2.5 |
| Residential / Apartment (split AC) | 3.0 |
| Retail / Supermarket (packaged RTU) | 3.0 |
| Commercial / Office (chiller plant) | 3.5 |
| Hospital / Healthcare (central plant, high load) | 4.0 |

### Heating penalty $p_{\mathrm{heat}}$

Near 1.0 in hot climates; decreasing toward mixed and cold climates where winter solar-gain loss from a reflective roof offsets some or all of the cooling benefit. In very cold climates, net annual energy savings can approach zero or turn negative without high insulation R-values.

| Climate class | $p_{\mathrm{heat}}$ |
|---|---|
| tropical / hot_dry / hot_humid | 1.00 |
| hot_mixed | 0.97 |
| mixed_humid | 0.95 |
| temperate / warm_marine | 0.90 |
| marine | 0.85 |
| cold / cold_dry | 0.65 |
| very_cold | 0.50 |

### Roof fraction of cooling load $f_{\mathrm{roof}}$, by building type and storey class

Source: ASHRAE 90.1 reference building simulation; ScienceDirect comparative review of single vs. multi-storey roof thermal performance.

| Building type | Lookup baseline | Single-storey | Low-rise (1–3 fl.) | Mid-rise (4+ fl.) |
|---|---|---|---|---|
| Warehouse / Industrial | 0.55 | 0.50–0.60 | 0.50–0.60 | 0.40–0.50 |
| Retail / Supermarket | 0.40 | 0.40–0.55 | 0.38–0.52 | 0.36–0.50 |
| Residential | 0.30 | 0.33–0.45 | 0.30–0.42 | 0.22–0.32 |
| Commercial / Office | 0.35 | 0.30–0.40 | 0.18–0.28 | 0.12–0.22 |
| Hospital / Healthcare | 0.28 | 0.24–0.32 | 0.16–0.24 | 0.08–0.16 |

The client applies a storey-class multiplier to the lookup value (e.g., commercial mid-rise: ×0.49; hospital mid-rise: ×0.43). Default storey class per building type: warehouse → single, retail → single, residential → low-rise, commercial → mid-rise, hospital → mid-rise.

---

## 10-year degradation-adjusted projection

The 10-year cumulative figure uses a **degradation-adjusted multiplier $M_{10}$** rather than a simple ×10:

$$
E_{10} = E_{\mathrm{elec,yr1}} \times M_{10}
$$

| Maintenance regime | $M_{10}$ |
|---|---|
| No maintenance | 7.5 |
| Annual cleaning | 9.0 |
| Biannual cleaning | 9.5 |

This reflects performance following a degradation curve (not a straight line): year 1 at 100 %, declining to 60–70 % by year 10 without maintenance, or 90–95 % with active cleaning. Using ×10 would overstate lifetime savings by **5–25 %** depending on climate and maintenance.

---

## Lookup table + client architecture

For each city × building type × roof baseline, the offline pipeline stores **precalculated** $E_{\mathrm{elec}}$ and CO₂ per m² (using the base formula without $f_{\mathrm{field}}$ and $\alpha_{\mathrm{age}}$, which are applied client-side to keep assumptions transparent and user-adjustable). The website then:

1. Looks up base kWh/m²/yr and kg CO₂/m²/yr for the selected city/building/roof combination.
2. Applies $f_{\mathrm{field}} \times \alpha_{\mathrm{age}} \times \mathrm{COP\text{-}ratio} \times f_{\mathrm{roof\text{-}storey}} \times f_{\mathrm{occ}}$ (conditioned fraction).
3. Multiplies by user-supplied area.
4. Derives CO₂ using $\gamma_{\mathrm{IEA\,2023}}$ for the selected city.
5. Expands to conservative / central / optimistic range via ±35 % envelope.
6. Applies $M_{10}$ to the 10-year figure.

No per-keystroke physics in the browser beyond those multiplications.

---

## Limitations (read this before quoting numbers)

1. **Roof-only model:** wall, window, and internal loads are not modelled per building. Whole-building simulation (EnergyPlus, ORNL Roof Savings Calculator) is required for compliance or bankable estimates.

2. **Simplified radiative term:** $R_{\mathrm{base}} = 30\,\mathrm{W/m^2}$ and the humidity factor $h$ compress a full radiative transfer problem. The field calibration factor $f_{\mathrm{field}}$ further adjusts for deployment reality, but site-specific atmospheric data is not used.

3. **Aging model is representative, not product-specific:** $\alpha_{\mathrm{age}}$ uses CRRC class-average data. Your coating's 3-year aged reflectance from its CRRC certification is a better input for a formal projection.

4. **Grid factors (IEA 2023):** decarbonising grids will show lower CO₂ savings than reported as coal exits the generation mix. CO₂ figures should be treated as an upper bound in rapidly decarbonising markets.

5. **Interpolation:** cities not in the 84-city table may use ML interpolation; treat as indicative with higher uncertainty.

6. **±30–50 % uncertainty envelope:** consistent with ORNL Roof Savings Calculator and LBNL cool roof tool methodology. The ±35 % displayed in the UI is a practical midpoint.

7. **The 10-year figure uses $M_{10}$, not ×10:** for no-maintenance scenarios this is a 25 % reduction from the naive linear projection. The assumption most likely to surprise users.

---

## Further reading

- [PDRC methodology (narrative)](/blog/energy-calculator)
- [Venture story: FlamTabX](/blog/flamtabx)
- [Run the calculator](/tools/energy-savings)

### References

1. Fan, S. et al. (2022). Field study of PDRC net cooling power. *Science.*
2. Hossain, M.M. et al. (2021). Subtropical field performance of PDRC coatings.
3. Tang, H. et al. (2021). Real-world radiative cooling power measurements. *Applied Energy.*
4. CRRC. *Determining the Energy Savings of a Cool Roof.* 2020 edition.
5. LBNL. *Aged solar reflectance database.* 2023.
6. PNNL-24904 (2016). *Energy Savings Potential of Radiative Cooling Technologies.*
7. ASHRAE Handbook of Fundamentals. Seasonal COP (IPLV) values.
8. IEA. *Emissions Factors 2023.*
9. ScienceDirect Energy and Buildings (2025). *Aging, soiling, and cleaning effects on cool roof performance.*
10. ORNL Roof Savings Calculator. *Methodology documentation.*
