if (!customElements.get("mushroom-circle-value-card")) {
    class MushroomCircleValueCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

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
                display_mode: "percentage",
                max_value: 100,
                icon_size: "24px",
                layout: {
                    width: 1,
                    height: 1
                },
                ...config
            };
        }

        set hass(hass) {
            this._hass = hass;
            this.render();
        }

        getCardSize() {
            return this.config?.layout?.height || 1;
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
            if (progress === 0) return '';
            if (progress === 100) {
                return `M 0,-${radius} A ${radius},${radius} 0 1,${direction === 'clockwise' ? '1' : '0'} 0.1,-${radius}`;
            }
            
            const angle = (progress / 100) * 2 * Math.PI;
            const x = radius * Math.sin(angle);
            const y = -radius * Math.cos(angle);
            const largeArcFlag = progress > 50 ? 1 : 0;
            
            if (direction === 'clockwise') {
                return `M 0,-${radius} A ${radius},${radius} 0 ${largeArcFlag},1 ${x},${y}`;
            } else {
                return `M 0,-${radius} A ${radius},${radius} 0 ${largeArcFlag},0 ${-x},${y}`;
            }
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

        _generateTicks(radius) {
            if (!this.config.show_ticks) return '';
            
            const tickCount = 60;
            const ticks = [];
            const isInside = this.config.tick_position === 'inside';
            const tickOffset = isInside ? -8 : 8;
            
            for (let i = 0; i < tickCount; i++) {
                const angle = (i * 360 / tickCount) * (Math.PI / 180);
                const isMainTick = i % 5 === 0;
                const tickLength = isMainTick ? 8 : 5;
                
                const baseRadius = radius + tickOffset;
                const x1 = baseRadius * Math.sin(angle);
                const y1 = -baseRadius * Math.cos(angle);
                const x2 = (baseRadius + (isInside ? -tickLength : tickLength)) * Math.sin(angle);
                const y2 = -(baseRadius + (isInside ? -tickLength : tickLength)) * Math.cos(angle);
                
                ticks.push(`
                    <line 
                        x1="${x1}" 
                        y1="${y1}" 
                        x2="${x2}" 
                        y2="${y2}"
                        class="tick ${isMainTick ? 'major' : ''}"
                    />
                `);
            }
            
            return ticks.join('');
        }

        render() {
            if (!this._hass || !this.config) return;

            const stateObj = this._hass.states[this.config.entity];
            if (!stateObj) {
                this.shadowRoot.innerHTML = `
                    <ha-card>
                        <div class="container">
                            Entity not found: ${this.config.entity}
                        </div>
                    </ha-card>
                `;
                return;
            }

            const value = this._computeValue(stateObj);
            const strokeWidth = this.config.stroke_width || 8;
            const radius = 42 - (strokeWidth / 2);
            const progressPath = this._computeProgressPath(radius, value, this.config.direction);
            const color = this._computeColor(stateObj, value);
            const name = this.config.name || stateObj.attributes.friendly_name || this.config.entity;

            this.shadowRoot.innerHTML = `
                <ha-card>
                    <style>
                        ha-card {
                            box-sizing: border-box;
                            padding: var(--spacing);
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            background: var(--ha-card-background, var(--card-background-color, white));
                            border-radius: var(--ha-card-border-radius, 12px);
                            box-shadow: var(--ha-card-box-shadow, none);
                            width: ${this.config?.layout?.width ? this.config.layout.width * 50 + 'px' : 'auto'};
                            height: ${this.config?.layout?.height ? this.config.layout.height * 50 + 'px' : 'auto'};
                        }
                        .container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                            min-height: 100px;
                        }
                        .circle-container {
                            position: relative;
                            width: 100px;
                            height: 100px;
                            min-height: 100px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto;
                        }
                        svg {
                            width: 100%;
                            height: 100%;
                        }
                        circle, .tick {
                            fill: none;
                            stroke-width: ${strokeWidth};
                            stroke-linecap: round;
                        }
                        .background {
                            stroke: var(--disabled-text-color);
                            opacity: 0.2;
                        }
                        .progress-path {
                            fill: none;
                            stroke: ${color};
                            stroke-width: ${strokeWidth};
                            stroke-linecap: round;
                            transition: all 0.3s ease-in-out;
                        }
                        .tick {
                            stroke: var(--disabled-text-color);
                            opacity: 0.3;
                            stroke-width: 1px;
                        }
                        .tick.major {
                            stroke-width: 2px;
                            opacity: 0.4;
                        }
                        .content {
                            position: absolute;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                            text-align: center;
                        }
                        ha-icon {
                            --mdc-icon-size: ${this.config.icon_size || '24px'};
                            color: ${color};
                        }
                        .info {
                            color: var(--primary-text-color);
                            font-size: var(--primary-font-size);
                            font-weight: var(--card-font-weight);
                            line-height: var(--card-line-height);
                            margin: 4px 0;
                        }
                        .name {
                            color: var(--secondary-text-color);
                            font-size: var(--body-font-size);
                            font-weight: var(--card-font-weight);
                            line-height: var(--body-line-height);
                            margin-top: 4px;
                        }
                    </style>

                    <div class="container">
                        <div class="circle-container">
                            <svg viewBox="-50 -50 100 100">
                                <circle
                                    class="background"
                                    cx="0"
                                    cy="0"
                                    r="${radius}"
                                />
                                ${this._generateTicks(radius)}
                                <path
                                    class="progress-path"
                                    d="${progressPath}"
                                />
                            </svg>
                            <div class="content">
                                ${this.config.icon ? `<ha-icon icon="${this.config.icon}"></ha-icon>` : ''}
                                <div class="info">${this._formatState(stateObj)}</div>
                            </div>
                        </div>
                        ${!this.config.hide_name ? `<div class="name">${name}</div>` : ''}
                    </div>
                </ha-card>
            `;
        }
    }
    customElements.define("mushroom-circle-value-card", MushroomCircleValueCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "mushroom-circle-value-card",
    name: "Mushroom Circle Value Card",
    description: "A circular progress card for values and percentages with Mushroom styling"
});
