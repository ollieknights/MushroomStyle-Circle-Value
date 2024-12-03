# Mushroom Style Circle Value Card

A Home Assistant custom card that displays numeric values and percentages in a circular progress indicator with Mushroom styling.

## Installation

### HACS (Recommended)
1. Add custom repository:
   - URL: `https://github.com/ollieknights/MushroomStyle-Circle-Value`
   - Category: `Lovelace`
2. Install "Mushroom Style Circle Value Card"

### Manual Installation
1. Download `mushroom-circle-value-card.js`
2. Copy to `www/community/mushroomstyle-circle-value/`
3. Add reference:
```yaml
resources:
  - url: /hacsfiles/mushroomstyle-circle-value/mushroom-circle-value-card.js
    type: module
```

## Usage

```yaml
type: custom:mushroom-circle-value-card
entity: sensor.battery_level
display_mode: percentage  # or 'value'
icon: mdi:battery
show_ticks: true
ring_color: >
  value > 80 ? 'var(--success-color)' :
  value > 20 ? 'var(--warning-color)' :
  'var(--error-color)'
```

## Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| entity | string | required | Entity ID |
| display_mode | string | percentage | 'percentage' or 'value' |
| icon | string | mdi:circle | Icon to display |
| show_ticks | boolean | false | Show tick marks |
| tick_position | string | inside | 'inside' or 'outside' |
| direction | string | clockwise | 'clockwise' or 'counter-clockwise' |
| max_value | number | 100 | Maximum value for 'value' mode |
| ring_color | string | - | Expression for dynamic color |

## License
MIT License
