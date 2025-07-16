# Watercolor Effect Implementation Guide

## Setup Requirements

1. Add the required font:
```html
<link rel="stylesheet" href="https://use.typekit.net/lqm8rej.css">
```

2. Add the SVG filters to your HTML (place before closing body tag):
```html
<svg>
    <defs>
        <filter id="watercolor">
            <feTurbulence result="noise-lg" type="fractalNoise" baseFrequency=".0125" NumOctaves="2" seed="1222" />
            <feTurbulence result="noise-md" type="fractalNoise" baseFrequency=".12" NumOctaves="3" seed="11413" />
            <feComposite result="BaseGraphic" in="SourceGraphic" in2="noise-lg" operator="arithmetic" k1="0.3" k2="0.45" k4="-.07" />
            <feMorphology id="water" result="layer-1" in="BaseGraphic" operator="dilate" radius="0.5" />
            <feDisplacementMap result="layer-1" in="layer-1" in2="noise-lg" xChannelSelector="R" yChannelSelector="B" scale="2" />
            <feDisplacementMap result="layer-1" in="layer-1" in2="noise-md" xChannelSelector="R" yChannelSelector="B" scale="3" />
            <feDisplacementMap result="mask" in="layer-1" in2="noise-lg" xChannelSelector="A" yChannelSelector="A" scale="4" />
            <feGaussianBlur result="mask" in="mask" stdDeviation="6" />
            <feComposite result="layer-1" in="layer-1" in2="mask" operator="arithmetic" k1="1" k2=".25" k3="-.25" k4="0" />
            <feDisplacementMap result="layer-2" in="BaseGraphic" in2="noise-lg" xChannelSelector="G" yChannelSelector="R" scale="2" />
            <feDisplacementMap result="layer-2" in="layer-2" in2="noise-md" xChannelSelector="A" yChannelSelector="G" scale="3" />
            <feDisplacementMap result="glow" in="BaseGraphic" in2="noise-lg" xChannelSelector="R" yChannelSelector="A" scale="5" />
            <feMorphology result="glow-diff" in="glow" operator="erode" radius="2" />
            <feComposite result="glow" in="glow" in2="glow-diff" operator="out" />
            <feGaussianBlur result="glow" in="glow" stdDeviation=".5" />
            <feComposite id="color" result="layer-2" in="layer-2" in2="glow" operator="arithmetic" k1="1.2" k2="0.55" k3=".3" k4="-0.2" />
            <feComposite result="watercolor" in="layer-1" in2="layer-2" operator="over" />
        </filter>
        
        <filter id="watercolor2">
            <feTurbulence result="noise-lg" type="fractalNoise" baseFrequency=".0125" NumOctaves="2" seed="1222" />
            <feTurbulence result="noise-md" type="fractalNoise" baseFrequency=".12" NumOctaves="3" seed="11413" />
            <feComposite result="BaseGraphic" in="SourceGraphic" in2="noise-lg" operator="arithmetic" k1="0.3" k2="0.35" k4="-.05" />
            <feDisplacementMap result="layer-2" in="BaseGraphic" in2="noise-lg" xChannelSelector="G" yChannelSelector="R" scale="2" />
            <feDisplacementMap result="layer-2" in="layer-2" in2="noise-md" xChannelSelector="A" yChannelSelector="G" scale="3" />
            <feDisplacementMap result="glow" in="BaseGraphic" in2="noise-lg" xChannelSelector="R" yChannelSelector="A" scale="4" />
            <feMorphology result="glow-diff" in="glow" operator="erode" radius="2" />
            <feComposite result="glow" in="glow" in2="glow-diff" operator="out" />
            <feGaussianBlur result="glow" in="glow" stdDeviation="4" />
            <feComposite id="color" result="layer-2" in="layer-2" in2="glow" operator="arithmetic" k1="0.65" k2="1.0" k3="0.4" k4="-0.15" />
        </filter>
    </defs>
</svg>
```

## CSS Variables

Add these variables to your root:
```css
:root {
  --shadow: 4px;
  --hue: 0deg;
  --sat: 100%;
  --con: 1;
  --bri: 1;
}
```

## Applying the Effect

### To Buttons
```css
.btn {
  position: relative;
  isolation: isolate;
  background: transparent;
  /* Other button styles */
}

.btn:before {
  content: "";
  inset: 0;
  position: absolute;
  border-radius: inherit;
  background: rgb(0 0 0 / 100%);
  filter: url(#watercolor) drop-shadow(0 0em 0em rgba(255,255,255,1)) 
          sepia(1) brightness(var(--bri,1)) contrast(var(--con,0.75)) 
          saturate(var(--sat)) hue-rotate(var(--hue)) 
          drop-shadow(0 var(--shadow) 0.25px rgba(0,0,0,0.25));
  translate: -1px -1px;
  opacity: 0.9;
  z-index: -1;
}
```

### To Sections (like Hero)
```css
.hero {
  position: relative;
  isolation: isolate;
}

.hero:before {
  content: "";
  inset: 0;
  position: absolute;
  border-radius: inherit;
  background: rgb(0 0 0 / 100%);
  filter: url(#watercolor) drop-shadow(0 0em 0em rgba(255,255,255,1)) 
          sepia(1) brightness(1.6) contrast(1.2) 
          saturate(130%) hue-rotate(190deg);
  translate: -1px -1px;
  opacity: 0.9;
  z-index: -1;
}
```

### Customizing Colors

You can customize the watercolor effect's color using these properties:
- `--hue`: Rotation in degrees (0-360deg)
- `--sat`: Saturation percentage (100% default)
- `--con`: Contrast multiplier (1 default)
- `--bri`: Brightness multiplier (1 default)

Example for a blue button:
```css
.btn.primary {
  --hue: 190deg;
  --sat: 130%;
  --con: 1.2;
  --bri: 1.6;
}
```

## Font Usage

For headings:
```css
h1, h2, h3, h4, h5 {
  font-family: "sketchnote-text", sans-serif;
  font-weight: 700;
  font-style: normal;
}
```

For body text:
```css
body {
  font-family: duper, sans-serif;
  letter-spacing: 0.05em;
}
```

## Implementation Examples

1. Hero Section:
```css
.hero {
  position: relative;
  isolation: isolate;
  border-radius: 0 0 2rem 2rem;
  overflow: hidden;
}

.hero:before {
  content: "";
  inset: 0;
  position: absolute;
  border-radius: inherit;
  background: rgb(0 0 0 / 100%);
  filter: url(#watercolor) drop-shadow(0 0em 0em rgba(255,255,255,1)) 
          sepia(1) brightness(1.6) contrast(1.2) 
          saturate(130%) hue-rotate(190deg);
  translate: -1px -1px;
  opacity: 0.9;
  z-index: -1;
}
```

2. About Artist Section:
```css
.about-artist {
  position: relative;
  isolation: isolate;
  border-radius: 2rem;
}

.about-artist:before {
  content: "";
  inset: 0;
  position: absolute;
  border-radius: inherit;
  background: rgb(0 0 0 / 100%);
  filter: url(#watercolor2) drop-shadow(0 0em 0em rgba(255,255,255,1)) 
          sepia(1) brightness(1.6) contrast(1.2) 
          saturate(130%) hue-rotate(150deg);
  translate: -1px -1px;
  opacity: 0.9;
  z-index: -1;
}
```

## Notes

- Always use `isolation: isolate` on the parent element
- Set `position: relative` on the parent element
- Use `z-index: -1` on the watercolor effect element
- Adjust hue, saturation, contrast, and brightness to achieve different colors
- Use `watercolor2` filter for softer, more subtle effects