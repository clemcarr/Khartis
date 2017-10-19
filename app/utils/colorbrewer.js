import colorScaleChromatic from 'npm:d3-scale-chromatic';

// This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
let brewer = {

  categorical: {
    schemeAccent: colorScaleChromatic.schemeAccent,
    schemeDark2: colorScaleChromatic.schemeDark2,
    schemePastel2: colorScaleChromatic.schemePastel2,
    schemeSet2: colorScaleChromatic.schemeSet2
  },

  sequential: {
    BuGn: {
      2: ["#e5f5f9", "#2ca25f"],
      3: ["#e5f5f9","#99d8c9","#2ca25f"],
      4: ["#edf8fb","#b2e2e2","#66c2a4","#238b45"],
      5: ["#edf8fb","#b2e2e2","#66c2a4","#2ca25f","#006d2c"],
      6: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
      7: ["#edf8fb","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
      8: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"],
      9: ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]
    },
    BuPu: {
      2: ["#e0ecf4","#8856a7"],
      3: ["#e0ecf4","#9ebcda","#8856a7"],
      4: ["#edf8fb","#b3cde3","#8c96c6","#88419d"],
      5: ["#edf8fb","#b3cde3","#8c96c6","#8856a7","#810f7c"],
      6: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8856a7","#810f7c"],
      7: ["#edf8fb","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
      8: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#6e016b"],
      9: ["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"]
    },
    GnBu: {
      2: ["#e0f3db","#43a2ca"],
      3: ["#e0f3db","#a8ddb5","#43a2ca"],
      4: ["#f0f9e8","#bae4bc","#7bccc4","#2b8cbe"],
      5: ["#f0f9e8","#bae4bc","#7bccc4","#43a2ca","#0868ac"],
      6: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#43a2ca","#0868ac"],
      7: ["#f0f9e8","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
      8: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#08589e"],
      9: ["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"]
    },
    OrRd: {
      2: ["#fee8c8","#e34a33"],
      3: ["#fee8c8","#fdbb84","#e34a33"],
      4: ["#fef0d9","#fdcc8a","#fc8d59","#d7301f"],
      5: ["#fef0d9","#fdcc8a","#fc8d59","#e34a33","#b30000"],
      6: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#e34a33","#b30000"],
      7: ["#fef0d9","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
      8: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#990000"],
      9: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]
    },
    PuBu: {
      2: ["#ece7f2","#2b8cbe"],
      3: ["#ece7f2","#a6bddb","#2b8cbe"],
      4: ["#f1eef6","#bdc9e1","#74a9cf","#0570b0"],
      5: ["#f1eef6","#bdc9e1","#74a9cf","#2b8cbe","#045a8d"],
      6: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#2b8cbe","#045a8d"],
      7: ["#f1eef6","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
      8: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#034e7b"],
      9: ["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"]
    },
    PuBuGn: {
      2: ["#ece2f0","#1c9099"],
      3: ["#ece2f0","#a6bddb","#1c9099"],
      4: ["#f6eff7","#bdc9e1","#67a9cf","#02818a"],
      5: ["#f6eff7","#bdc9e1","#67a9cf","#1c9099","#016c59"],
      6: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#1c9099","#016c59"],
      7: ["#f6eff7","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
      8: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016450"],
      9: ["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"]
    },
    PuRd: {
      2: ["#e7e1ef","#dd1c77"],
      3: ["#e7e1ef","#c994c7","#dd1c77"],
      4: ["#f1eef6","#d7b5d8","#df65b0","#ce1256"],
      5: ["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],
      6: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#dd1c77","#980043"],
      7: ["#f1eef6","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
      8: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#91003f"],
      9: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]
    },
    RdPu: {
      2: ["#fde0dd","#c51b8a"],
      3: ["#fde0dd","#fa9fb5","#c51b8a"],
      4: ["#feebe2","#fbb4b9","#f768a1","#ae017e"],
      5: ["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"],
      6: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#c51b8a","#7a0177"],
      7: ["#feebe2","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
      8: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177"],
      9: ["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"]
    },
    YlGn: {
      2: ["#f7fcb9","#31a354"],
      3: ["#f7fcb9","#addd8e","#31a354"],
      4: ["#ffffcc","#c2e699","#78c679","#238443"],
      5: ["#ffffcc","#c2e699","#78c679","#31a354","#006837"],
      6: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#31a354","#006837"],
      7: ["#ffffcc","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
      8: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#005a32"],
      9: ["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"]
    },YlGnBu: {
      2: ["#edf8b1","#2c7fb8"],
      3: ["#edf8b1","#7fcdbb","#2c7fb8"],
      4: ["#ffffcc","#a1dab4","#41b6c4","#225ea8"],
      5: ["#ffffcc","#a1dab4","#41b6c4","#2c7fb8","#253494"],
      6: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#2c7fb8","#253494"],
      7: ["#ffffcc","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
      8: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#0c2c84"],
      9: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
    },
    YlOrRd: {
      2: ["#ffeda0","#f03b20"],
      3: ["#ffeda0","#feb24c","#f03b20"],
      4: ["#ffffb2","#fecc5c","#fd8d3c","#e31a1c"],
      5: ["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"],
      6: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#f03b20","#bd0026"],
      7: ["#ffffb2","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
      8: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#b10026"],
      9: ["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]
    },YlOrBr: {
      2: ["#fff7bc","#d95f0e"],
      3: ["#fff7bc","#fec44f","#d95f0e"],
      4: ["#ffffd4","#fed98e","#fe9929","#cc4c02"],
      5: ["#ffffd4","#fed98e","#fe9929","#d95f0e","#993404"],
      6: ["#ffffd4","#fee391","#fec44f","#fe9929","#d95f0e","#993404"],
      7: ["#ffffd4","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
      8: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#8c2d04"],
      9: ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"]
    },Purples: {
      2: ["#efedf5","#756bb1"],
      3: ["#efedf5","#bcbddc","#756bb1"],
      4: ["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"],
      5: ["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"],
      6: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#756bb1","#54278f"],
      7: ["#f2f0f7","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
      8: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"],
      9: ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]
    },Blues: {
      2: ["#deebf7","#3182bd"],
      3: ["#deebf7","#9ecae1","#3182bd"],
      4: ["#eff3ff","#bdd7e7","#6baed6","#2171b5"],
      5: ["#eff3ff","#bdd7e7","#6baed6","#3182bd","#08519c"],
      6: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#3182bd","#08519c"],
      7: ["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
      8: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"],
      9: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]
    },Greens: {
      2: ["#e5f5e0","#31a354"],
      3: ["#e5f5e0","#a1d99b","#31a354"],
      4: ["#edf8e9","#bae4b3","#74c476","#238b45"],
      5: ["#edf8e9","#bae4b3","#74c476","#31a354","#006d2c"],
      6: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"],
      7: ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
      8: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"],
      9: ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"]
    },Oranges: {
      2: ["#fee6ce","#e6550d"],
      3: ["#fee6ce","#fdae6b","#e6550d"],
      4: ["#feedde","#fdbe85","#fd8d3c","#d94701"],
      5: ["#feedde","#fdbe85","#fd8d3c","#e6550d","#a63603"],
      6: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"],
      7: ["#feedde","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
      8: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#8c2d04"],
      9: ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"]
    },Reds: {
      2: ["#fee0d2","#de2d26"],
      3: ["#fee0d2","#fc9272","#de2d26"],
      4: ["#fee5d9","#fcae91","#fb6a4a","#cb181d"],
      5: ["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],
      6: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#de2d26","#a50f15"],
      7: ["#fee5d9","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
      8: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#99000d"],
      9: ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"]
    },
    Greys: {
      2: ["#f0f0f0","#636363"],
      3: ["#f0f0f0","#bdbdbd","#636363"],
      4: ["#f7f7f7","#cccccc","#969696","#525252"],
      5: ["#f7f7f7","#cccccc","#969696","#636363","#252525"],
      6: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#636363","#252525"],
      7: ["#f7f7f7","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
      8: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525"],
      9: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]
    }
  },

  /*diverging: {
    "BuGn,BuPu": undefined,
    "GnBu,OrRd": undefined,
    "PuBu,PuRd": undefined,
    "RdPu,YlGn": undefined,
    "YlGnBu,YlOrRd": undefined
  }*/

  /*diverging: {
    PuOr: {
      3: ["#f1a340","#f7f7f7","#998ec3"],
      4: ["#e66101","#fdb863","#b2abd2","#5e3c99"],
      5: ["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],
      6: ["#b35806","#f1a340","#fee0b6","#d8daeb","#998ec3","#542788"],
      7: ["#b35806","#f1a340","#fee0b6","#f7f7f7","#d8daeb","#998ec3","#542788"],
      8: ["#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788"],
      9: ["#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788"],
      10: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],
      11: ["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"]
    },
    BrBG: {
      2: ["#d8b365","#5ab4ac"],
      3: ["#d8b365","#f5f5f5","#5ab4ac"],
      4: ["#a6611a","#dfc27d","#80cdc1","#018571"],
      5: ["#a6611a","#dfc27d","#f5f5f5","#80cdc1","#018571"],
      6: ["#8c510a","#d8b365","#f6e8c3","#c7eae5","#5ab4ac","#01665e"],
      7: ["#8c510a","#d8b365","#f6e8c3","#f5f5f5","#c7eae5","#5ab4ac","#01665e"],
      8: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e"],
      9: ["#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e"],
      10: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],
      11: ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"]
    },
    PRGn: {
      2: ["#af8dc3","#7fbf7b"],
      3: ["#af8dc3","#f7f7f7","#7fbf7b"],
      4: ["#7b3294","#c2a5cf","#a6dba0","#008837"],
      5: ["#7b3294","#c2a5cf","#f7f7f7","#a6dba0","#008837"],
      6: ["#762a83","#af8dc3","#e7d4e8","#d9f0d3","#7fbf7b","#1b7837"],
      7: ["#762a83","#af8dc3","#e7d4e8","#f7f7f7","#d9f0d3","#7fbf7b","#1b7837"],
      8: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
      9: ["#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837"],
      10: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],
      11: ["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"]
    },
    PiYG: {
      2: ["#e9a3c9","#a1d76a"],
      3: ["#e9a3c9","#f7f7f7","#a1d76a"],
      4: ["#d01c8b","#f1b6da","#b8e186","#4dac26"],
      5: ["#d01c8b","#f1b6da","#f7f7f7","#b8e186","#4dac26"],
      6: ["#c51b7d","#e9a3c9","#fde0ef","#e6f5d0","#a1d76a","#4d9221"],
      7: ["#c51b7d","#e9a3c9","#fde0ef","#f7f7f7","#e6f5d0","#a1d76a","#4d9221"],
      8: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
      9: ["#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221"],
      10: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],
      11: ["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"]
    },
    RdBu: {
      2: ["#ef8a62","#67a9cf"],
      3: ["#ef8a62","#f7f7f7","#67a9cf"],
      4: ["#ca0020","#f4a582","#92c5de","#0571b0"],
      5: ["#ca0020","#f4a582","#f7f7f7","#92c5de","#0571b0"],
      6: ["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"],
      7: ["#b2182b","#ef8a62","#fddbc7","#f7f7f7","#d1e5f0","#67a9cf","#2166ac"],
      8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
      9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac"],
      10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],
      11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"]
    },
    RdGy: {
      2: ["#ef8a62","#999999"],
      3: ["#ef8a62","#ffffff","#999999"],
      4: ["#ca0020","#f4a582","#bababa","#404040"],
      5: ["#ca0020","#f4a582","#ffffff","#bababa","#404040"],
      6: ["#b2182b","#ef8a62","#fddbc7","#e0e0e0","#999999","#4d4d4d"],
      7: ["#b2182b","#ef8a62","#fddbc7","#ffffff","#e0e0e0","#999999","#4d4d4d"],
      8: ["#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d"],
      9: ["#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d"],
      10: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],
      11: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"]
    },
    RdYlBu: {
      2: ["#fc8d59","#91bfdb"],
      3: ["#fc8d59","#ffffbf","#91bfdb"],
      4: ["#d7191c","#fdae61","#abd9e9","#2c7bb6"],
      5: ["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"],
      6: ["#d73027","#fc8d59","#fee090","#e0f3f8","#91bfdb","#4575b4"],
      7: ["#d73027","#fc8d59","#fee090","#ffffbf","#e0f3f8","#91bfdb","#4575b4"],
      8: ["#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4"],
      9: ["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"],
      10: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],
      11: ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
    },
    Spectral: {
      2: ["#fc8d59","#99d594"],
      3: ["#fc8d59","#ffffbf","#99d594"],
      4: ["#d7191c","#fdae61","#abdda4","#2b83ba"],
      5: ["#d7191c","#fdae61","#ffffbf","#abdda4","#2b83ba"],
      6: ["#d53e4f","#fc8d59","#fee08b","#e6f598","#99d594","#3288bd"],
      7: ["#d53e4f","#fc8d59","#fee08b","#ffffbf","#e6f598","#99d594","#3288bd"],
      8: ["#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd"],
      9: ["#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd"],
      10: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],
      11: ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"]
    }
  }*/

  diverging: {
    PRGn: {
        2: {
            1: ["#a068b0","#60ab69"],
        },
        3: {
            1: ["#a068b0","#d9f0d3","#60ab69"],
            2: ["#a068b0","#e7d4e8","#60ab69"],
        },
        4: {
            1: ["#a068b0","#d9f0d3","#7ebc82","#008837"],
            2: ["#a068b0","#e7d4e8","#d9f0d3","#60ab69"],
            3: ["#7b3294","#b282be","#e7d4e8","#60ab69"],
        },
        5: {
            1: ["#a068b0","#d9f0d3","#9ecd9d","#60ab69","#008837"],
            2: ["#a068b0","#e7d4e8","#d9f0d3","#7ebc82","#008837"],
            3: ["#7b3294","#b282be","#e7d4e8","#d9f0d3","#60ab69"],
            4: ["#7b3294","#a068b0","#c49ecc","#e7d4e8","#60ab69"],
        },
        6: {
            1: ["#a068b0","#d9f0d3","#acd6aa","#7ebc82","#4fa25c","#008837"],
            2: ["#a068b0","#e7d4e8","#d9f0d3","#9ecd9d","#60ab69","#008837"],
            3: ["#7b3294","#b282be","#e7d4e8","#d9f0d3","#7ebc82","#008837"],
            4: ["#7b3294","#a068b0","#c49ecc","#e7d4e8","#d9f0d3","#60ab69"],
            5: ["#7b3294","#975ba9","#b282be","#cdabd3","#e7d4e8","#60ab69"],
        },
        7: {
            1: ["#a068b0","#d9f0d3","#a2cfa1","#70ad75","#418a4e","#18662f","#00441b"],
            2: ["#a068b0","#e7d4e8","#d9f0d3","#acd6aa","#7ebc82","#4fa25c","#008837"],
            3: ["#7b3294","#b282be","#e7d4e8","#d9f0d3","#9ecd9d","#60ab69","#008837"],
            4: ["#7b3294","#a068b0","#c49ecc","#e7d4e8","#d9f0d3","#7ebc82","#008837"],
            5: ["#7b3294","#975ba9","#b282be","#cdabd3","#e7d4e8","#d9f0d3","#60ab69"],
            6: ["#40004b","#652774","#884f96","#a979b3","#c9a6cf","#e7d4e8","#60ab69"],
        },
        8: {
            1: ["#a068b0","#d9f0d3","#abd5aa","#7fb883","#589b61","#347e44","#12612c","#00441b"],
            2: ["#a068b0","#e7d4e8","#d9f0d3","#a2cfa1","#70ad75","#418a4e","#18662f","#00441b"],
            3: ["#7b3294","#b282be","#e7d4e8","#d9f0d3","#acd6aa","#7ebc82","#4fa25c","#008837"],
            4: ["#7b3294","#a068b0","#c49ecc","#e7d4e8","#d9f0d3","#9ecd9d","#60ab69","#008837"],
            5: ["#7b3294","#975ba9","#b282be","#cdabd3","#e7d4e8","#d9f0d3","#7ebc82","#008837"],
            6: ["#40004b","#652774","#884f96","#a979b3","#c9a6cf","#e7d4e8","#d9f0d3","#60ab69"],
            7: ["#40004b","#5f216d","#7c418b","#9864a5","#b387bd","#ceaed3","#e7d4e8","#60ab69"],
        }
    },
    BlRd: {
        2: {
            1: ["#6997c8","#e36453"],
        },
        3: {
            1: ["#6997c8","#fddbc7","#e36453"],
            2: ["#6997c8","#deebf7","#e36453"],
        },
        4: {
            1: ["#6997c8","#fddbc7","#ec836f","#ca0020"],
            2: ["#6997c8","#deebf7","#fddbc7","#e36453"],
            3: ["#0571b0","#88acd3","#deebf7","#e36453"],
        },
        5: {
            1: ["#6997c8","#fddbc7","#f4a08b","#e36453","#ca0020"],
            2: ["#6997c8","#deebf7","#fddbc7","#ec836f","#ca0020"],
            3: ["#0571b0","#88acd3","#deebf7","#fddbc7","#e36453"],
            4: ["#0571b0","#6997c8","#a6c1df","#deebf7","#e36453"],
        },
        6: {
            1: ["#6997c8","#fddbc7","#f7b09a","#ec836f","#dd5446","#ca0020"],
            2: ["#6997c8","#deebf7","#fddbc7","#f4a08b","#e36453","#ca0020"],
            3: ["#0571b0","#88acd3","#deebf7","#fddbc7","#ec836f","#ca0020"],
            4: ["#0571b0","#6997c8","#a6c1df","#deebf7","#fddbc7","#e36453"],
            5: ["#0571b0","#588ec2","#88acd3","#b3cbe5","#deebf7","#e36453"],
        },
        7: {
            1: ["#6997c8","#fddbc7","#f3a994","#de7968","#c14b44","#991f2b","#67001f"],
            2: ["#6997c8","#deebf7","#fddbc7","#f7b09a","#ec836f","#dd5446","#ca0020"],
            3: ["#0571b0","#88acd3","#deebf7","#fddbc7","#f4a08b","#e36453","#ca0020"],
            4: ["#0571b0","#6997c8","#a6c1df","#deebf7","#fddbc7","#ec836f","#ca0020"],
            5: ["#0571b0","#588ec2","#88acd3","#b3cbe5","#deebf7","#fddbc7","#e36453"],
            6: ["#053061","#225387","#4c77a9","#7b9dc6","#abc4e0","#deebf7","#e36453"],
        },
        8: {
            1: ["#6997c8","#fddbc7","#f6b19c","#e68976","#d16155","#b43c3a","#921728","#67001f"],
            2: ["#6997c8","#deebf7","#fddbc7","#f3a994","#de7968","#c14b44","#991f2b","#67001f"],
            3: ["#0571b0","#88acd3","#deebf7","#fddbc7","#f7b09a","#ec836f","#dd5446","#ca0020"],
            4: ["#0571b0","#6997c8","#a6c1df","#deebf7","#fddbc7","#f4a08b","#e36453","#ca0020"],
            5: ["#0571b0","#588ec2","#88acd3","#b3cbe5","#deebf7","#fddbc7","#ec836f","#ca0020"],
            6: ["#053061","#225387","#4c77a9","#7b9dc6","#abc4e0","#deebf7","#fddbc7","#e36453"],
            7: ["#053061","#1c4d82","#3e6b9e","#6389b8","#8ba9cf","#b3cae4","#deebf7","#e36453"],
        }
    },
    BGBr: {
        2: {
            1: ["#59a696","#c48c52"],
        },
        3: {
            1: ["#59a696","#f6e8c3","#c48c52"],
            2: ["#59a696","#c7eae5","#c48c52"],
        },
        4: {
            1: ["#59a696","#f6e8c3","#d2a36d","#a6611a"],
            2: ["#59a696","#c7eae5","#f6e8c3","#c48c52"],
            3: ["#018571","#75b7a9","#c7eae5","#c48c52"],
        },
        5: {
            1: ["#59a696","#f6e8c3","#dfb989","#c48c52","#a6611a"],
            2: ["#59a696","#c7eae5","#f6e8c3","#d2a36d","#a6611a"],
            3: ["#018571","#75b7a9","#c7eae5","#f6e8c3","#c48c52"],
            4: ["#018571","#59a696","#90c8bc","#c7eae5","#c48c52"],
        },
        6: {
            1: ["#59a696","#f6e8c3","#e5c597","#d2a36d","#bd8245","#a6611a"],
            2: ["#59a696","#c7eae5","#f6e8c3","#dfb989","#c48c52","#a6611a"],
            3: ["#018571","#75b7a9","#c7eae5","#f6e8c3","#d2a36d","#a6611a"],
            4: ["#018571","#59a696","#90c8bc","#c7eae5","#f6e8c3","#c48c52"],
            5: ["#018571","#499d8c","#75b7a9","#9fd1c7","#c7eae5","#c48c52"],
        },
        7: {
            1: ["#59a696","#f6e8c3","#dfbe8f","#c39461","#a36f3a","#7e4d1a","#543005"],
            2: ["#59a696","#c7eae5","#f6e8c3","#e5c597","#d2a36d","#bd8245","#a6611a"],
            3: ["#018571","#75b7a9","#c7eae5","#f6e8c3","#dfb989","#c48c52","#a6611a"],
            4: ["#018571","#59a696","#90c8bc","#c7eae5","#f6e8c3","#d2a36d","#a6611a"],
            5: ["#018571","#499d8c","#75b7a9","#9fd1c7","#c7eae5","#f6e8c3","#c48c52"],
            6: ["#003c30","#145e4f","#388171","#62a496","#93c7bd","#c7eae5","#c48c52"],
        },
        8: {
            1: ["#59a696","#f6e8c3","#e3c497","#cda16f","#b3824c","#97632e","#764815","#543005"],
            2: ["#59a696","#c7eae5","#f6e8c3","#dfbe8f","#c39461","#a36f3a","#7e4d1a","#543005"],
            3: ["#018571","#75b7a9","#c7eae5","#f6e8c3","#e5c597","#d2a36d","#bd8245","#a6611a"],
            4: ["#018571","#59a696","#90c8bc","#c7eae5","#f6e8c3","#dfb989","#c48c52","#a6611a"],
            5: ["#018571","#499d8c","#75b7a9","#9fd1c7","#c7eae5","#f6e8c3","#d2a36d","#a6611a"],
            6: ["#003c30","#145e4f","#388171","#62a496","#93c7bd","#c7eae5","#f6e8c3","#c48c52"],
            7: ["#003c30","#0e584a","#2c7566","#4d9284","#72afa2","#9bcdc3","#c7eae5","#c48c52"],
        }
    }
  }
};

// Reverse-duplicate each diverging palette
Object.keys(brewer.diverging).forEach(function(pid){
  var rev_pid = pid.replace(/^(..)(.*)$/, '$2$1');
  brewer.diverging[rev_pid] = {};
  Object.keys(brewer.diverging[pid]).forEach(function(n){
    brewer.diverging[rev_pid][n] = {};
    Object.keys(brewer.diverging[pid][n]).forEach(function(m){
      brewer.diverging[rev_pid][n][n-m] = brewer.diverging[pid][n][m].slice(0).reverse();
    });
  });
});

brewer.Composer = {

  compose(palette, diverging, reverse, classes, before, categorical=false) {

    let res = null;

    if (diverging) {
      res = brewer.diverging[palette][classes][before].slice(0);
      if (reverse) {
        res = res.slice(0, before).reverse().concat(res.slice(before, classes).reverse());
      }
    } else {
      if (!categorical) {
        res = brewer.sequential[palette][classes].slice(0);
        reverse && res.reverse();
      } else {
        res = brewer.categorical[palette].slice(0);
      }
    }

    return res;

  }

};

export default brewer;
