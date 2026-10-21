/* Subject icons: one hand-inked 24x24 line drawing per subject family.
   Each value is the inner markup of an <svg viewBox="0 0 24 24">, drawn with
   currentColor strokes so the card decides the ink colour. */
window.SUBJECT_ICONS = {
  // graduation scroll tied with a ribbon
  dissertation: '<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6"/><path d="M6 4a2 2 0 0 0-2 2v1h4V6a2 2 0 0 0-2-2z"/><path d="M6 20a2 2 0 0 1-2-2v-1h4v1a2 2 0 0 1-2 2z"/><path d="M10 9h6M10 12h6M10 15h3"/><circle cx="16" cy="16.5" r="1.6"/>',
  // magnifying glass over a page
  research: '<path d="M5 3h8l4 4v4"/><path d="M5 3v17h6"/><path d="M8 8h4M8 11h3"/><circle cx="16" cy="16" r="3.6"/><path d="M18.6 18.6 21 21"/>',
  // bar chart on a zero baseline
  statistics: '<path d="M3 20h18"/><path d="M6 20v-6M10 20V9M14 20v-8M18 20V5"/>',
  // a die
  probability: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.1" fill="currentColor"/>',
  // sigma, integral and a little plus
  math: '<path d="M14 5H5l5 7-5 7h9"/><path d="M19 4c-1.6 0-2 1-2 2.5v11c0 1.5-.4 2.5-2 2.5"/>',
  // chess pawn
  chess: '<circle cx="12" cy="6" r="2.6"/><path d="M9.5 10.5h5"/><path d="M10.5 10.5c0 3-1 5.5-2.5 7.5h8c-1.5-2-2.5-4.5-2.5-7.5"/><path d="M6.5 20.5h11"/>',
  // three-layer neural net
  "machine-learning": '<circle cx="4.5" cy="7" r="1.8"/><circle cx="4.5" cy="17" r="1.8"/><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/><circle cx="19.5" cy="12" r="1.8"/><path d="M6.2 7.5 10.3 5.4M6.2 7.8l4.2 3.6M6.3 16.4l4-3.6M6.2 17.4l4.1 1.2M13.7 5.8l4.3 5M13.8 12h3.9M13.7 18.2l4.3-5"/>',
  // hub and spoke graph
  "social-networks": '<circle cx="12" cy="12" r="2.4"/><circle cx="4.5" cy="5.5" r="1.8"/><circle cx="19.5" cy="5" r="1.8"/><circle cx="4" cy="17.5" r="1.8"/><circle cx="19" cy="19" r="1.8"/><circle cx="12" cy="3" r="1.4"/><path d="M6 6.8l4.2 3.6M17.9 6.3l-4.2 4M5.7 16.6l4.3-3.3M17.6 17.7l-3.8-3.9M12 4.4v5.2M5.8 17.9 17.2 18.8"/>',
  // monitor with a trend line
  infosys: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/><path d="M6 13l3.5-3.5 2.5 2 5-5"/><path d="M15 6.5h2v2"/>',
  // flowchart: box, diamond, box
  systems: '<rect x="3" y="3" width="7" height="5" rx="1"/><path d="M17.5 8.5 21 12l-3.5 3.5L14 12z"/><rect x="3" y="16" width="7" height="5" rx="1"/><path d="M6.5 8v8M10 5.5h7.5V8.5M14 12h-4"/>',
  // database cylinder
  databases: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8v-13"/><path d="M4.5 12c0 1.6 3.4 2.8 7.5 2.8s7.5-1.2 7.5-2.8"/>',
  // angle brackets and a slash
  programming: '<path d="M8 6 2.5 12 8 18M16 6l5.5 6-5.5 6M14 4l-4 16"/>',
  // globe
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.5 3.8 5.6 3.8 9s-1.2 6.5-3.8 9c-2.6-2.5-3.8-5.6-3.8-9S9.4 5.5 12 3z"/>',
  // three nodes on a ring, routers on a line
  networks: '<rect x="9" y="2.5" width="6" height="4.5" rx="1"/><rect x="2.5" y="17" width="6" height="4.5" rx="1"/><rect x="15.5" y="17" width="6" height="4.5" rx="1"/><path d="M12 7v5M5.5 17v-5h13v5"/>',
  // shield with a keyhole
  security: '<path d="M12 2.8 19.5 5.5v6c0 4.6-3.2 8.2-7.5 9.7-4.3-1.5-7.5-5.1-7.5-9.7v-6z"/><circle cx="12" cy="10.5" r="1.8"/><path d="M12 12.3v3.4"/>',
  // laptop
  computing: '<rect x="5" y="4.5" width="14" height="10" rx="1.2"/><path d="M2.5 18.5h19l-1.5-4H4z"/>',
  // two people
  "org-behavior": '<circle cx="8.5" cy="7.5" r="3"/><path d="M2.5 20c.5-3.6 2.9-6 6-6s5.5 2.4 6 6"/><circle cx="16.5" cy="8.5" r="2.5"/><path d="M15.5 13.6c3.3-.3 5.6 2 6 5.4"/>',
  // target with an arrow
  strategy: '<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="4.5"/><circle cx="11" cy="13" r="1.2" fill="currentColor"/><path d="M11 13 20 4M17 3.5l3 .5.5 3"/>',
  // two speech bubbles
  consulting: '<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h9A1.5 1.5 0 0 1 15 5.5v6a1.5 1.5 0 0 1-1.5 1.5H8l-3.5 3v-3a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M17.5 9H19.5A1.5 1.5 0 0 1 21 10.5v5a1.5 1.5 0 0 1-1.5 1.5V20l-3.3-3H12a1.5 1.5 0 0 1-1.5-1.5"/>',
  // rocket
  entrepreneurship: '<path d="M14.5 3.5c3 0 6 3 6 6-2 3.5-5 6-8.5 7.5l-5-5C8.5 8.5 11 5.5 14.5 3.5z"/><circle cx="15" cy="9" r="1.8"/><path d="M7 12l-3.5.5L6 9.5M12 17l-.5 3.5 3-2.5M7.5 16.5c-1.5.2-3 1.6-3.2 3.2 1.6-.2 3-1.7 3.2-3.2z"/>',
  // coin with a dollar sign
  finance: '<circle cx="12" cy="12" r="9"/><path d="M15 8.6c-.6-.9-1.7-1.4-3-1.4-1.7 0-3 .9-3 2.3 0 3.1 6.2 1.6 6.2 4.8 0 1.4-1.4 2.4-3.2 2.4-1.4 0-2.6-.6-3.2-1.6M12 5.2v1.9M12 16.9v1.9"/>',
  // ledger with columns
  accounting: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M4 8h16M4 13h16M4 18h16M10 3v18M15 3v18"/>',
  // megaphone
  marketing: '<path d="M3.5 10v4h3l9 5V5l-9 5z"/><path d="M6.5 14l1.5 5.5h2.5L9.5 15M18.5 9.5c1 .7 1.5 1.5 1.5 2.5s-.5 1.8-1.5 2.5"/>',
  // gear
  operations: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3 5.5 5.5"/><circle cx="12" cy="12" r="6.4"/>',
  // supply and demand cross
  economics: '<path d="M3.5 3v17.5H21"/><path d="M6.5 6.5c3 6 7.5 10 13 11M6.5 17.5c4.5-1.2 9.5-5.5 12.5-11"/><circle cx="12.6" cy="12.6" r="1" fill="currentColor"/>',
  // scales of justice
  law: '<path d="M12 3v17M7 20.5h10M5 6.5h14M12 4.5 5 6.5M12 4.5l7 2"/><path d="M5 7 2.5 13a2.5 2.5 0 0 0 5 0z"/><path d="M19 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
  // compass rose for ethics and philosophy
  ethics: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13.3 13.3 8.5 15.5l2.2-4.8z"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',
  // fountain pen nib
  writing: '<path d="M12 21 5.5 11.5 12 3l6.5 8.5z"/><path d="M12 3v8"/><circle cx="12" cy="12.6" r="1.4"/><path d="M8.5 21h7"/>',
  // microphone
  speech: '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5v3.5M8.5 21h7"/>',
  // head with a thought spiral
  psychology: '<path d="M7 21v-3.5C4.8 16 3.5 13.6 3.5 11 3.5 6.3 7.3 3 12 3c4.4 0 8 3.2 8 7.5l1.5 3.5H20v3a2 2 0 0 1-2 2h-2.5V21"/><path d="M12 10.5a1 1 0 1 1 1 1 2 2 0 0 1-2-2 3 3 0 0 1 3-3 4 4 0 0 1 4 4"/>',
  // columned civic building
  politics: '<path d="M3 9.5 12 4l9 5.5z"/><path d="M5 9.5v8M9.5 9.5v8M14.5 9.5v8M19 9.5v8M3 20.5h18M4 17.5h16"/>',
  // painter's palette
  arts: '<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 1.5-2.2-.5-1.3.2-2.8 1.8-2.8H18a3 3 0 0 0 3-3c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7" r="1.2"/>',
  // flask
  science: '<path d="M9.5 3h5M10.5 3v6l-5.8 9.6A1.6 1.6 0 0 0 6.1 21h11.8a1.6 1.6 0 0 0 1.4-2.4L13.5 9V3"/><path d="M7.6 15h8.8"/>',
  // heart with a pulse line
  health: '<path d="M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4C20 15.4 12 20 12 20z"/><path d="M4.5 12.5h4l1.5-2.5 2 4.5 1.5-2h6"/>',
  // briefcase
  career: '<rect x="3" y="7" width="18" height="13" rx="1.6"/><path d="M8.5 7V5.2A1.2 1.2 0 0 1 9.7 4h4.6a1.2 1.2 0 0 1 1.2 1.2V7M3 12.5h18M11 12.5v1.8h2v-1.8"/>',
  // chalkboard
  teaching: '<rect x="3" y="3.5" width="18" height="12" rx="1"/><path d="M8 19.5l2-4M16 19.5l-2-4M7 8l3 3 3-4 4 3"/>'
};

window.UI_ICONS = {
  drive: '<path d="M8.2 3.5h7.6l6 10.4-3.8 6.6H6l-3.8-6.6z" fill="none"/><path d="M8.2 3.5 14 13.9h7.8M15.8 3.5 9.9 13.9 6 20.5M2.2 13.9H14"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.2"/><circle cx="3.5" cy="12" r="1.2"/><circle cx="3.5" cy="18" r="1.2"/>',
  timeline: '<path d="M6 3v18"/><circle cx="6" cy="7" r="2"/><circle cx="6" cy="16" r="2"/><path d="M10 7h11M10 16h8"/>'
};
