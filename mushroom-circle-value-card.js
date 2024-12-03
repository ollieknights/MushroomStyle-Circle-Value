if (!customElements.get("mushroom-circle-value-card")) {
    class MushroomCircleValueCard extends HTMLElement {
        // Same constructor and basic methods as the original

        setConfig(config) {
            if (!config.entity) {
                throw new Error("Please define an entity");
            }
            this.config = {
                type: "custom:mushroom-circle-value-card",
                entity: "",
                name: "",
                icon: "mdi:circle",
                show_ticks: false,
                tick_position: "inside",
                direction: "clockwise",
                stroke_width: 8,
                hide_name: false,
                display_mode: "percentage", // Only percentage or value
                max_value: 100,
                icon_size: "24px",
                layout: {
                    width: 1,
                    height: 1
                },
                ...config
            };
        }

        _computeValue(stateObj) {
            const numericValue = parseFloat(stateObj.state);
            if (!isNaN(numericValue)) {
                if (this.config.display_mode === 'value') {
                    const maxValue = parseFloat(this.config.max_value) || 100;
                    return Math.min(100, (numericValue / maxValue) * 100);
                }
                return Math.min(100, Math.max(0, numericValue));
            }
            return 0;
        }

        _computeProgressPath(radius, progress, direction) {
            // Same as original
        }

        _computeColor(stateObj, value) {
            if (this.config.ring_color) {
                try {
                    return Function('value', 'state', 
                        `return ${this.config.ring_color}`
                    )(value, parseFloat(stateObj.state));
                } catch (e) {
                    return 'var(--primary-color)';
                }
            }
            return 'var(--primary-color)';
        }

        _formatState(stateObj) {
            const numValue = parseFloat(stateObj.state);
            if (!isNaN(numValue)) {
                if (this.config.display_mode === 'percentage') {
                    return `${Math.round(numValue)}%`;
                }
                return `${numValue}${stateObj.attributes.unit_of_measurement || ''}`;
            }
            return stateObj.state;
        }

        // Rest of the methods same as original
    }
    customElements.define("mushroom-circle-value-card", MushroomCircleValueCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "custom:mushroom-circle-value-card",
    name: "Mushroom Circle Value Card",
    description: "A circular progress card for values and percentages"
});
