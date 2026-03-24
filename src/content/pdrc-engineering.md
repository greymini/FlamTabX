# PDRC calculator: formulas and pipeline

> **For readers:** This article presents the **core equations and correction factors** behind the public lookup tool. It replaces a downloadable engineering dump. Everything here is meant to be read in context with the [methodology overview](/blog/energy-calculator) and the [live calculator](/tools/energy-savings).

---

## Net cooling power (conceptual balance)

A high-performance PDRC roof reduces solar absorption and adds sky-facing radiative exchange. A compact way to write the balance is:

$$
Q_{\mathrm{cool}} = Q_{\mathrm{solar,reflected}} + Q_{\mathrm{radiative}} - Q_{\mathrm{convective}}
$$

where $Q_{\mathrm{cool}}$ is net cooling power per unit area (W/m²). In the **offline engine** we separate a **solar term** proportional to the change in solar reflectance and a **radiative baseline** scaled by emittance, then apply a **humidity factor** $h \in [0.48,\,1]$ that captures tropical / cloudy penalties on the radiative path:

$$
Q_{\mathrm{net}} = \bigl(\Delta\rho \cdot I_{\mathrm{avg}} + \varepsilon_{\mathrm{pdrc}} \cdot R_{\mathrm{base}}\bigr) \cdot h
$$

- $\Delta\rho = \rho_{\mathrm{pdrc}} - \rho_{\mathrm{baseline}}$ (change in solar reflectance; baseline is dark / medium / light roof band).
- $I_{\mathrm{avg}}$ is a **cooling-season–weighted** average irradiance (W/m²), derived from annual GHI with a seasonal boost and a physical cap (see below).
- $\varepsilon_{\mathrm{pdrc}}$ is longwave emittance (near 0.95 for the reference coating).
- $R_{\mathrm{base}} = 45\,\mathrm{W/m^2}$: conservative incremental radiative benefit during **cooling hours**, after literature-guided tuning (field studies show strong humidity/cloud dependence).

---

## From annual GHI to average irradiance during cooling

Annual global horizontal irradiance $G_{\mathrm{yr}}$ (kWh/m²/yr) is converted to a cooling-relevant average (W/m²) with a **seasonal boost** $\beta \approx 1.3$ and a cap $I_{\max} = 850\,\mathrm{W/m^2}$:

$$
I_{\mathrm{avg}} = \min\!\left( \frac{G_{\mathrm{yr}} \times 1000 \times \beta}{\max(t_{\mathrm{cool}},\,200)} ,\; I_{\max} \right)
$$

Here $t_{\mathrm{cool}}$ is **cooling hours** per year (from climate class), i.e. hours when mechanical cooling is meaningfully active, not simply “daylight hours.”

---

## Solar and radiative components (engine form)

With PDRC solar reflectance $\rho_{\mathrm{pdrc}}$ (reference 0.95) and baseline $\rho_{\mathrm{base}}$:

$$
\begin{aligned}
\Delta\rho &= \rho_{\mathrm{pdrc}} - \rho_{\mathrm{base}} \\
Q_{\mathrm{solar}} &= \Delta\rho \cdot I_{\mathrm{avg}} \\
Q_{\mathrm{rad}} &= \varepsilon_{\mathrm{pdrc}} \cdot 45\,\mathrm{W/m^2} \\
Q_{\mathrm{net}} &= (Q_{\mathrm{solar}} + Q_{\mathrm{rad}}) \cdot h
\end{aligned}
$$

The **humidity factor** $h$ is the single most sensitive knob in the simplified model: it folds in water vapour, clouds, and documented PDRC degradation in humid / tropical skies.

---

## Annual electrical savings per m² (thermal → electrical)

Let $t_{\mathrm{cool}}$ be cooling hours, $f_{\mathrm{roof}}$ the fraction of total cooling load attributed to the roof, $\mathrm{COP}$ the chiller / AC coefficient of performance, and $p_{\mathrm{heat}}$ a **heating penalty** $\in (0,1]$ that debits winter solar gain loss in cold climates.

Thermal energy removed from the cooling load (Wh/m²/yr):

$$
E_{\mathrm{thermal}} = Q_{\mathrm{net}} \cdot t_{\mathrm{cool}} \cdot f_{\mathrm{roof}}
$$

Electrical energy saved (kWh/m²/yr):

$$
E_{\mathrm{elec}} = \frac{E_{\mathrm{thermal}}}{\mathrm{COP} \times 1000} \cdot p_{\mathrm{heat}}
$$

**Why COP appears in the denominator:** if the system delivers $\mathrm{COP}$ kWh of cooling per kWh of electricity, then each watt-hour of avoided thermal load corresponds to $1/\mathrm{COP}$ watt-hours of metered electricity.

---

## CO₂ avoided

With grid emission factor $\gamma$ (kg CO₂e per kWh):

$$
m_{\mathrm{CO_2}} = \frac{E_{\mathrm{elec}} \cdot A \cdot \gamma}{1000} \quad [\mathrm{metric\ tonnes\ per\ year}]
$$

where $A$ is roof area (m²) and $E_{\mathrm{elec}}$ is per-m² annual savings from above.

---

## Climate tables (summary)

**Humidity factor** $h$ (illustrative classes used in the pipeline):

| Class | Typical $h$ |
|-------|----------------|
| hot_dry | 1.00 |
| hot_humid | 0.68 |
| tropical | 0.48 |
| marine | 0.72 |
| very_cold | 0.75 |

**Heating penalty** $p_{\mathrm{heat}}$: near $1$ in hot climates, down to $\approx 0.70$ in very cold regions where winter solar gain loss matters.

**Cooling hours** $t_{\mathrm{cool}}$: from a few hundred in cold climates to $\approx 4000$ in tropical near-year-round cooling.

Exact keyed values live in the offline generator scripts; the [methodology article](/blog/energy-calculator) explains why we prefer **precalculated lookups** over live simulation for this UX.

---

## Lookup table + client

For each city $\times$ building type $\times$ roof baseline, the pipeline stores **precalculated** $E_{\mathrm{elec}}$ and CO₂ per m². The website multiplies by user area and shows equivalents. **No** per-keystroke physics in the browser beyond that multiply.

---

## Limitations (read this before quoting numbers)

- **Roof-only:** wall and window loads are not modelled per building.
- **Simplified radiative term:** $45\,\mathrm{W/m^2}$ and $h$ compress a full radiative transfer problem; bankable projects need site simulation (e.g. EnergyPlus, ORNL Roof Savings Calculator).
- **Interpolation:** cities not in the table may use ML interpolation; treat as indicative.

---

## Further reading

- [PDRC methodology (narrative)](/blog/energy-calculator)  
- [Venture story: FlamTabX](/blog/flamtabx)  
- [Run the calculator](/tools/energy-savings)
