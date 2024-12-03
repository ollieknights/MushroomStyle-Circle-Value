# Mushroom Style Circle Value Card

A Home Assistant custom card that displays numeric values and percentages in a circular progress indicator with Mushroom-style UI.

## Installation

### HACS (Recommended)
1. Open HACS
2. Go to "Frontend" section
3. Click the menu icon and select "Custom repositories"
4. Add `https://github.com/ollieknights/MushroomStyle-Circle-Value` with category "Lovelace"
5. Install "Mushroom Style Circle Value Card"

### Manual Installation
1. Download `mushroom-circle-value-card.js` from the latest release
2. Copy to `www/community/mushroomstyle-circle-value/` in your Home Assistant config directory
3. Add reference in your dashboard:
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
| display_mode | string | percentage | Display mode: 'percentage' or 'value' |
| icon | string | mdi:circle | Icon to display |
| show_ticks | boolean | false | Show tick marks around circle |
| tick_position | string | inside | Tick position: 'inside' or 'outside' |
| direction | string | clockwise | Progress direction: 'clockwise' or 'counter-clockwise' |
| max_value | number | 100 | Maximum value for 'value' display mode |
| ring_color | string | - | Expression for dynamic color based on value |

## License
MIT License
