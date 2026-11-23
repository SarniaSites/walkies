/** Walkies Guernsey — Tailwind config.
 *  Every colour is sampled from the business's own material (Facebook pack, _fb-pack/).
 *  One action colour: the red of the WALKIES lettering. Everything else supports it.
 */
module.exports = {
  content: ['./index.html', './thanks.html', './404.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // ACTION — the red "WALKIES" lettering in the logo (#e60d03). Buttons, links, the lead.
        action: { DEFAULT: '#E60D03', dark: '#B90A02', tint: '#FDE4DE' },
        // SUN — the orange band behind the logo lettering (#fd6905, #f78934) and the
        // banner's warm highlight (#f6d9b8). Big colour fields and the hero sun.
        sun: { DEFAULT: '#FD6905', soft: '#F78934', peach: '#F6D9B8' },
        // INK — the logo's brown (#795637) taken darker for text; bark is the original.
        ink: { DEFAULT: '#2A1B10', soft: '#5A4232', faint: '#86705E' },
        bark: '#795637',
        // COAT — the apricot of the doodles and spaniels in the photos. Illustration fills.
        coat: { DEFAULT: '#EBC48F', light: '#F6E2C4' },
        // CREAM — the "Let's go" lettering in the logo. Page grounds.
        cream: { DEFAULT: '#FBF4EA', deep: '#F3E6D3', paper: '#FFFCF7' },
        // SAND — the logo's beach (#b7a997), lightened for rules and borders.
        sand: { DEFAULT: '#DCCDB8', dark: '#B7A997' },
        // SKY — the banner's sky (#cad5e7, #a8b5c8). Sea and sky in the drawings.
        sky: { DEFAULT: '#CAD5E7', deep: '#8FA3BF' },
        // GORSE — the headland grass and gorse in the walk photos. Drawings only.
        gorse: { DEFAULT: '#5F7F33', light: '#C7D49C' },
      },
      fontFamily: {
        // Anybody: a heavy grotesk with a width axis. Narrowed (font-stretch 68–75%) it matches
        // the tall, heavy WALKIES lettering; the logo SVG was redrawn from the same face.
        display: ['"Anybody Variable"', '"Arial Narrow"', 'Impact', 'sans-serif'],
        // Reddit Sans: rounded, friendly and very readable. Close to the logo's "Let's go".
        sans: ['"Reddit Sans Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: { site: '76rem' },
      transitionTimingFunction: { out: 'cubic-bezier(.2,.7,.2,1)', spring: 'cubic-bezier(.34,1.4,.64,1)' },
    },
  },
  plugins: [],
};
