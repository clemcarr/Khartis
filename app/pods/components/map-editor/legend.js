import Ember from 'ember';
import d3 from 'npm:d3';
import d3lper from 'khartis/utils/d3lper';
import FlowLayout from 'khartis/utils/svg-flow-layout';
import PatternMaker from 'khartis/utils/pattern-maker';
import SymbolMaker from 'khartis/utils/symbol-maker';
import ValueMixin from 'khartis/models/mapping/mixins/value';
import TextEditor from './text-editor/component';
import {compressIntervals} from 'khartis/utils/stats';

const RULES_LIMIT = 8,
      MARGIN_SYMBOL_TEXT = 6,
      MARGIN_SURFACE_TEXT = 6;

export default Ember.Mixin.create({
  
  resizingMargin: false,
  overRectElement: null,
  anchorLineElement: null,

  legendInit() {
    this.d3l().append("g").classed("legend", true);
    this.drawLegend();
    this.updateLegendOpacity();
    this.set(
      'overRectElement',
      this.d3l().append("rect")
        .classed("legend-over-rect", true)
        .attr("kis:kis:transient", "true")
        .style("visibility", "hidden")
    );
    this.set(
      'anchorLineElement',
      this.d3l().append("line")
        .classed("legend-anchor-line", true)
        .attr("kis:kis:transient", "true")
        .style("visibility", "hidden")
    );
    this.hideOverRect();
  },

  displayOverRect(node) {
    let nodeBox = d3lper.absoluteSVGBox(this.d3l().node(), node);
    this.get('overRectElement')
      .attrs({
        x: nodeBox.x,
        y: nodeBox.y,
        width: nodeBox.width,
        height: nodeBox.height,
        opacity: 0.3
      })
      .style("visibility", "visible");
  },

  hideOverRect() {
    this.get('overRectElement')
      .attrs({
        x: -1000,
        y: -1000,
        width: 0,
        height: 0,
        opacity: 0
      })
      .style("visibility", "visible");
  },

  displayAnchorLine(node, anchor) {
    let margin = 3,
        nodeBox = d3lper.absoluteSVGBox(this.d3l().node(), node),
        coords = {x1: 0, x2: 0, y1: 0, y2: 0};
    if (anchor === "left") coords = {x1: nodeBox.x - margin, x2: nodeBox.x - margin, y1: nodeBox.y, y2: nodeBox.y + nodeBox.height};
    if (anchor === "right") coords = {x1: nodeBox.x + nodeBox.width + margin, x2: nodeBox.x + nodeBox.width + margin, y1: nodeBox.y, y2: nodeBox.y + nodeBox.height};
    if (anchor === "top") coords = {x1: nodeBox.x, x2: nodeBox.x + nodeBox.width, y1: nodeBox.y - margin, y2: nodeBox.y - margin};
    if (anchor === "bottom") coords = {x1: nodeBox.x, x2: nodeBox.x + nodeBox.width, y1: nodeBox.y + nodeBox.height + margin, y2: nodeBox.y + nodeBox.height + margin};
    this.get('anchorLineElement')
      .attrs({
        ...coords,
        opacity: 0.3
      })
      .style("visibility", "visible");
  },

  hideAnchorLine() {
    this.get('anchorLineElement')
      .attrs({
        opacity: 0,
        stroke: null
      })
      .style("visibility", "visible");
  },

  getLegendBlockUnderPoint() {
    const margin = 10;
    let [mouseX, mouseY] = d3.mouse(document.body);
    let selectedLayerEl;
    if (d3.select(this).classed("legend-layer")) {
      selectedLayerEl = d3.select(this).node();
    } else {
      selectedLayerEl = d3.select(this).selectAll("g.legend-layer").nodes()
        .find( n => {
          let bbox = n.getBoundingClientRect();
          return mouseX > bbox.x + margin && mouseX <= bbox.x + bbox.width - margin
            && mouseY > bbox.y + margin && mouseY <= bbox.y + bbox.height - margin;
        });
    }
    if (selectedLayerEl) { //check if layer is part of a multiple group
      let parentGroupEl = d3.select(selectedLayerEl).closestParent("g.legend-group"),
          parentGroup = parentGroupEl.datum();
      if (!parentGroup.get('isMultiple')) {
        return parentGroupEl.node(); //layer can't be selected if alone, fallback to group
      }
    }
    return selectedLayerEl || this;
  },

  getLegendAnchorUnderPoint(excludeSel) {
    let [mouseX, mouseY] = d3.mouse(document.body);
    let excludes = excludeSel.classed("legend-group") ? excludeSel.selectAll("g.legend-layer").nodes() : [excludeSel.node()];
    let layerEls = this.d3l().selectAll("g.legend-layer").nodes()
      .filter( n => {
        let bbox = n.getBoundingClientRect();
        return excludes.indexOf(n) === -1 && mouseX > bbox.x && mouseX <= bbox.x + bbox.width
          && mouseY > bbox.y && mouseY <= bbox.y + bbox.height;
      })
      .reverse();
    if (layerEls.length) {
      let n = layerEls[0],
          anchors = {vertical: null, horizontal: null};
      let bbox = n.getBoundingClientRect();
      if (mouseX < bbox.x + bbox.width / 2 ) anchors.horizontal = "left";
      if (mouseX >= bbox.x + bbox.width / 2 ) anchors.horizontal = "right";
      if (mouseY < bbox.y + bbox.height / 2 ) anchors.vertical = "top";
      if (mouseY >= bbox.y + bbox.height / 2 ) anchors.vertical = "bottom";
      return {lyr: n, anchors};
    }
    return {lyr: null, anchors: null};
  },

  updateLegendPosition: function(legendG, group) {

    let legendContentG = legendG.select("g.legend-content"),
        t = {x: group.get('tx'), y: group.get('ty')};
    
    if (!legendG.node()) {
      return;
    }
    
    let autoMargin = !this.get('graphLayout.margin.manual'),
        bbox = legendG.node().getBBox(),
        {w, h} = this.getSize();

    if (!legendContentG.empty()) {

      if (t.x === null || t.y === null) {
        
        let vPadding = 16;
        t.x = (w - bbox.width) / 2;

        if (autoMargin) {
          this.set('graphLayout.margin.b', 
            Math.min(
              this.get('graphLayout.height')*0.33,
              bbox.height+2*vPadding+this.get('graphLayout.margin').getInitialValue('b')
              )
            );
          t.y = h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') + vPadding;
        } else {
          //fix tx, ty
          t.y = h - this.get('graphLayout').vOffset(h) - this.get('graphLayout.margin.b') + vPadding;
          group.setProperties({
              tx: t.x,
              ty: t.y
            });
        }
        
      } else {
        t = this.getViewboxTransform().invert(t);
      }

      legendG.attrs({
        "kis:kis:tx": t.x,
        "kis:kis:ty": t.y,
        "transform": d3lper.translate({tx: t.x, ty: t.y})
      });

      let padding = 12,
          contentBox = legendContentG.node().getBBox();
      
      legendG.select("rect.legend-bg")
        .attrs({
          x: contentBox.x - padding,
          y: contentBox.y - padding,
          width: contentBox.width + 2*padding,
          height: contentBox.height + 2*padding,
        });

      legendG.selectAll("g.legend-layer").each(function() {
        let lyrEl = d3.select(this),
            lyrBox = lyrEl.node().getBoundingClientRect();

        lyrEl.select("rect.legend-layer-bg")
          .attrs({
            width: lyrBox.width,
            height: lyrBox.height,
            "kis:kis:transient": "true"
          });

      });
        
    } else {
      if (autoMargin) {
        this.get('graphLayout.margin').resetValue('b');
      }
    }
    
  },
  
  updateLegendOpacity: function() {
    this.d3l().selectAll("g.legend-group rect.legend-bg")
      .style("opacity", this.get('graphLayout.legendLayout.opacity'));
  }.observes('graphLayout.legendLayout.opacity'),
  
  drawLegend: function() {

    let groups = this.get('graphLayout.legendLayout.groups');

    if (!this.get('graphLayout.showLegend') || !this.get('graphLayers').length) {
      groups = [];
    }

    this.d3l().select("g.legend").selectAll("g.legend-group")
      .data(groups)
      .enterUpdate({
        enter: sel => this.initLegendGroup(sel),
        update: sel => sel.eachWithArgs(this.drawLegendGroup, this)
      });

  }.observes('$width', '$height', 'graphLayout.width', 'graphLayout.height', 'graphLayout.margin.manual',
    'i18n.locale', 'graphLayout.showLegend', 'graphLayout.legendLayout.stacking', 
    'graphLayout.legendLayout.groups.[]',
    'graphLayers.[]',
    'graphLayers.@each._defferedChangeIndicator'),

  initLegendGroup(sel) {
    
    let self = this,
      legendG = sel.append("g").classed("legend-group", true);

    legendG.append("rect")
      .classed("legend-bg", true)
      .attrs({
        "x": -18,
        "y": -5
      })
      .attr("stroke", "#F0F0F0")
      .attr("fill", "white");
    legendG.append("g").classed("legend-content", true);

    legendG.each( function() { self.bindDrag(d3.select(this)); } );
    
    //handle mouseover
    legendG.on("mousemove", function() {
      self.displayOverRect(self.getLegendBlockUnderPoint.bind(this)());
    }).on("mouseout", function() {
      self.hideOverRect();
    });

    return legendG;
  },

  bindDrag(legendG) {

    let self = this;

    //LEGEND DRAG
    let drag = d3.drag()
    .filter(function() {
      let el = self.getLegendBlockUnderPoint.bind(this)();
      return el == this && !$(d3.event.target).hasClass("no-drag") && !$(d3.event.target).parents(".no-drag").length;
    })
    .subject(() => {
      let bg = this.d3l().select(".bg").node(),
          pos = {x: parseInt(legendG.attr('kis:kis:tx')), y: parseInt(legendG.attr('kis:kis:ty'))},
          xyBgRelative = d3lper.xyRelativeTo(bg, legendG.node()),
          xyParentGroupRelative = {x: 0, y: 0};
      if (legendG.classed("legend-layer")) {
        xyParentGroupRelative = d3lper.xyRelativeTo(legendG.node(), legendG.closestParent("g.legend-group").node());
        pos.x = xyParentGroupRelative.x;
        pos.y = xyParentGroupRelative.y;
      }
      return {
        ...pos,
        rx: xyBgRelative.x + pos.x,
        ry: xyBgRelative.y + pos.y
      };
    })
    .on("start", () => {
      d3.event.sourceEvent.stopPropagation();
      legendG.classed("dragging", true);
      this.set('resizingMargin', true);
      this.hideOverRect();
    })
    .on("drag", () => {
      let bg = this.d3l().select(".bg").node(),
          bbox = bg.getBBox(),
          pos = {
            tx: Math.min(d3.event.subject.rx + bbox.width-2, Math.max(d3.event.x, d3.event.subject.rx)),
            ty: Math.min(d3.event.subject.ry + bbox.height-10, Math.max(d3.event.y, d3.event.subject.ry))
          };
      legendG.attrs({
        'transform': d3lper.translate(pos), 
        "kis:kis:tx": pos.tx,
        "kis:kis:ty": pos.ty
      });

      //check if element is overing a layer
      let {lyr, anchors} = this.getLegendAnchorUnderPoint(legendG);
      if (lyr) {
        this.displayAnchorLine(lyr, anchors[this.get('graphLayout.legendLayout.stacking')]);
      } else {
        this.hideAnchorLine();
      }

    })
    .on("end", (d) => {

      this.hideAnchorLine();
      legendG.classed("dragging", false);
      this.set('resizingMargin', false);

      let {lyr, anchors} = this.getLegendAnchorUnderPoint(legendG);
      if (lyr) { // not translate, just modify group and layers 
        let anchor = anchors[this.get('graphLayout.legendLayout.stacking')],
            layers = this.get('graphLayout.legendLayout').detachLayers(d),
            lyrDatum = d3.select(lyr).datum(),
            lyrGrp = this.get('graphLayout.legendLayout').getLayerGroup(lyrDatum);
        if (anchor === "left" || anchor === "top") {
          lyrGrp.appendBefore(lyrDatum, layers);
        } else if (anchor === "right" || anchor === "bottom") {
          lyrGrp.appendAfter(lyrDatum, layers);
        }
        this.get('graphLayout.legendLayout').cleanGroups();
      } else {
        if (legendG.classed("legend-layer")) {
          //coordinates are relative to old group
          let oldGrp = legendG.closestParent("g.legend-group");
          let tOldGrp = this.getViewboxTransform()({
            x: oldGrp.attr('kis:kis:tx'),
            y: oldGrp.attr('kis:kis:ty'),
          });
          let grp = this.get('graphLayout.legendLayout').layerToGroup(d);
          let t = this.getViewboxTransform()({
            x: parseInt(oldGrp.attr('kis:kis:tx')) + parseInt(legendG.attr('kis:kis:tx')),
            y: parseInt(oldGrp.attr('kis:kis:ty')) + parseInt(legendG.attr('kis:kis:ty'))
          });
          grp.setProperties({
            tx: t.x,
            ty: t.y
          });
          this.get('graphLayout.legendLayout').addGroupIfNeeded(grp);
          this.get('graphLayout.legendLayout').cleanGroups();
        } else if (legendG.classed("legend-group")) {
          let t = this.getViewboxTransform()({
            x: legendG.attr('kis:kis:tx'),
            y: legendG.attr('kis:kis:ty')
          });
          d.setProperties({
            tx: t.x,
            ty: t.y
          });
        }
      }
      this.sendAction('onAskVersioning', "freeze");
    });

    legendG.call(drag);

  },

  drawLegendGroup(self, group, i) {

    let legendG = d3.select(this),
        containerG = legendG.selectAll("g.legend-content"),
        bgG = legendG.selectAll("rect.legend-bg"),
        svg = self.d3l(),
        layers = group.get('layers'),
        d3Locale = d3lper.getLocale(self.get('i18n')),
        orientation = self.get('graphLayout.legendLayout.stacking') === "vertical" ? "v-mode" : "h-mode";
    

    let flowLayout = new FlowLayout(containerG);
    
    containerG.flowClass("flow")
      .flowState(`g-${orientation}`)
      .flowClass("g-h-mode", "horizontal")
      .flowClass("g-v-mode", "vertical")
      .flowStyle(`padding-left: 5px;`);
    
    let bindLayer = (_) => {

      _.flowClass("stretched vertical flow")
        .flowStyle("margin-top: 16px")
        .flowStyle("g-h-mode", "margin-right: 34px")
        .flowStyle("g-v-mode", "margin-bottom: 24px");
      
      _.each( function(d, i) {

        let el = d3.select(this),
            formatter;
            
        if (d.get('mapping.maxValuePrecision') != null) {
          formatter = d3Locale.format(`0,.${d.get('mapping.maxValuePrecision')}f`);
        } else {
          formatter = t => t;
        }

        self.bindDrag(el);
        el.selectAll("*").remove();

        let layerBg = el.append("rect")
          .classed("legend-layer-bg", true)
          .attrs({
            x: 0,
            y: 0
          });
          
        let label = el.append("g")
          .flowClass("vertical solid")
          .flowStyle("margin-bottom: 8px; margin-top: 1em;")
          .classed("no-drag", true)
          .append("text")
          .classed("legend-title", true)
          .styles({
            "font-size": "14px",
            "font-weight": "bold",
            "text-anchor": "left"
          });
        
        label.text(d.get('legendTitleComputed'))
          .call(d3lper.wrapText, 200);

        label.on("click", function() {
          if (d3.event.defaultPrevented) return;
          d3.event.preventDefault();
          TextEditor.showAt("legend-title-editor", this, d.get('legendTitleComputed'), function(val) {
            d.set('legendTitle', val);
          });
        });

        let contentEl = el.append("g")
          .flowClass("solid flow")
          .flowClass("h-mode", "horizontal")
          .flowClass("v-mode", "vertical")
          .flowState(
            d.legendOrientation === "horizontal" && d.get('mapping.visualization.shape') !== "bar" ? "h-mode":"v-mode"
          );

        let ruleEl = contentEl;

        if (ValueMixin.Data.detect(d.get('mapping'))) {
          
          let intervals = d.get('mapping.intervals').slice(),
              fn;
          
          if (ValueMixin.Surface.detect(d.get('mapping'))) {
            fn = self.appendSurfaceIntervalLabel;
            intervals = compressIntervals(intervals, d.get('mapping.extent'));
            intervals.push(d.get('mapping.extent')[1]); //push max
          } else {
            if (d.get('mapping.scale.usesInterval')) {
              fn = self.appendSymbolIntervalLabel;
            } else {
              fn = self.appendSymbolIntervalLinearLabel;
            }
            intervals = d.get('mapping').getLegendIntervals();
          }
          
          if (d.get('mapping.visualization.shape') === "bar") {
            self.appendBarIntervals(contentEl, intervals, d, formatter);
          } else {
            contentEl.selectAll("g.row")
              .data(intervals)
              .enterUpdate({
                enter: (sel) => sel.append("g").classed("row", true),
                update: (sel) => sel.eachWithArgs(fn, svg, d, formatter)
              });
          }

          
          if (d.get('mapping.rules').length) {
            
            ruleEl = el.append("g")
              .flowClass("solid flow")
              .flowClass("h-mode", "horizontal")
              .flowClass("v-mode", "vertical")
              .flowStyle("h-mode", "position: relative; margin-top: 20px; padding-top: 14px;")
              .flowState(d.legendOrientation === "horizontal" ? "h-mode":"v-mode");

            ruleEl.append("g")
              .flowStyle("v-mode", "margin-top: 10px; margin-bottom: 10px")
              .flowStyle("h-mode", "position: absolute; top: 0px; left: 0px")
              .append("line")
              .flowComputedAttrs("v-mode", function() {
                let maxW = d3lper.selectionMaxWidth(contentEl.selectAll("g.symG"));
                return {
                  x1: 0,
                  y1: 0,
                  x2: Math.max(maxW, 30),
                  y2: 0,
                  stroke: "#BBBBBB"
                }
              })
              .flowComputedAttrs("h-mode", function() {
                return {
                  x1: 0,
                  y1: 0,
                  x2: 50,
                  y2: 0,
                  stroke: "#BBBBBB"
                }
              });
            
          }
          
        }
        
        if (d.get('mapping.rules') && d.get('mapping.rules').length) {
          ruleEl.selectAll("g.rule")
            .data(d.get('mapping.rules').filter( r => r.get('visible') && (d.get('mapping.visualization.mainType') === "surface" || r.get('shape'))).slice(0, RULES_LIMIT))
            .enterUpdate({
              enter: (sel) => sel.append("g").classed("rule", true),
              update: (sel) => sel.eachWithArgs(self.appendRuleLabel, svg, d)
            });
        }
        
      });
      
    };
    
    containerG.selectAll("g.legend-layer")
      .data(layers.filter( gl => gl.get('displayable') ))
      .enterUpdate({
        enter: (sel) => sel.append("g").classed("legend-layer", true),
        update: (sel) => sel.call(bindLayer)
      })
    
    flowLayout.commit();
    
    Ember.run.later(() => {
      self.updateLegendPosition(legendG, group);
      self.updateLegendOpacity();
    });
    
  },


  appendSurfaceIntervalLabel(svg, d, formatter, val, i) {
          
    let r = {x: 24/2, y: 16/2};

    d3.select(this).flowClass("horizontal solid flow")
      .flowClass("v-mode", "stretched")
      .flowStyle(`height: ${2*r.y}px; index: ${i};`)
      .flowStyle("h-mode", "margin-bottom: 2px; position: relative");

    let hModeWidth = function(sel) {
      const margin = 10;
      let textEls = sel.selectAll("text.symLbl").nodes(),
      widths = [];
      for (let i = 1; i < textEls.length; i++) {
        widths.push(textEls[i-1].getBoundingClientRect().width/2+textEls[i].getBoundingClientRect().width/2+10);
      }
      return Math.max.apply(undefined, widths);
    };
        
    let g = d3.select(this).append("g")
      .flowStyle("v-mode", `width: ${2*r.x}px`)
      .flowComputed("h-mode", "width", function() {
        return hModeWidth(d3.select(this).closestParent(".legend-layer"));
      });
    
    //border
    g.append("rect")
      .attrs({
        "width": 2*r.x,
        "height": 2*r.y,
        y: 0,
        "stroke-width": 1,
        "stroke": "black",
        fill: "none" 
      })
      .flowStyle("h-mode", "position: absolute")
      .flowComputed("h-mode", "width", function() {
        return hModeWidth(d3.select(this).closestParent(".legend-layer"));
      });

    g.append("rect")
      .attrs({
        "width": 2*r.x,
        "height": 2*r.y,
        y: 0,
        "opacity": d.get('opacity'),
        "fill": () => {
          let v = val*(1-Math.sign(val)*Number.EPSILON) - Number.EPSILON;
          let pattern = d.get('mapping').getScaleOf("texture")(v),
              color = d.get('mapping').getScaleOf("color")(v);
          window.test = d.get('mapping').getScaleOf("color");
          if (pattern && pattern.fn != PatternMaker.NONE) {
            let fn = new pattern.fn(false, color);
            fn.init(svg);
            return `url(${fn.url()})`;
          } else {
            return color;
          }
        },
        "stroke-width": 0
      })
      .flowStyle("h-mode", "position: absolute")
      .flowComputed("h-mode", "width", function() {
        return hModeWidth(d3.select(this).closestParent(".legend-layer"));
      });
      
    g = d3.select(this).append("g")
      .flowStyle("v-mode", "margin-left: 3px;")
      .flowStyle("h-mode", "position: absolute; left: 0; width: 100%;");
      
    if (i === 0) {
      
      g.append("text")
        .classed("symLbl", true)
        .flowStyle("v-mode", `position: absolute; margin-left: ${MARGIN_SURFACE_TEXT}px`)
        .flowStyle("h-mode", `position: absolute; margin-top: ${2*r.y+12}px`)
        .text( formatter(d.get('mapping.extent')[0]) )
        .attrs({
          x: 0,
          y:  0,
          dy: "0.3em",
          "font-size": "0.75em",
          "text-anchor": d.legendOrientation === "horizontal" ? "middle" : null
        });
        
      }
      
      g.append("text")
      .classed("symLbl", true)
      .flowStyle("v-mode", `margin-left: ${MARGIN_SURFACE_TEXT}px; margin-top: ${2*r.y}px`)
      .flowStyle("h-mode", `position: absolute; left: 100%; margin-top: ${2*r.y+12}px`)
      .text( v => formatter(v) )
      .attrs({
        x: 0,
        y: 0,
        dy: "0.3em",
        "font-size": "0.75em",
        "text-anchor": d.legendOrientation === "horizontal" ? "middle" : null
      });
      
  },

  appendSymbolIntervalLinearLabel(svg, d, formatter, val, i) {
        
    let r, dy;

    d3.select(this).flowComputed("h-mode", "margin-left", function() {
      if (!this.previousSibling) {
        return d3.select(this).closestParent(".legend-layer").selectAll("g.row")
          .nodes()[0].getBoundingClientRect().width/2;
      } else {
        return 0;
      }
    });

    let g = d3.select(this).append("g")
      .flowStyle("position: relative")
      .flowStyle("h-mode", `margin-right:10px`)
      .flowComputed("h-mode", "margin-top", function() {
        return d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2 +"px";
      })
      .flowComputed("v-mode", "width", function() {
        let maxSymG = d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
        let maxSymLbl = d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("text.symLbl"));
        return maxSymG + maxSymLbl + MARGIN_SYMBOL_TEXT;
      });

    if (val !== d.get('mapping.scale.valueBreak')) {

      let symbol = SymbolMaker.symbol({
          name: d.get('mapping.visualization.shape'),
          size: d.get('mapping').getScaleOf('size')(val)*2,
          barWidth: d.get('mapping.visualization.barWidth')
        });

      r = symbol.getSize();

      if (!(r.x > 0 && r.y > 0)) return;

      let symH = Math.max(r.y + d.get('mapping.visualization.stroke'), 12);
        
      dy = r.y + d.get('mapping.visualization.stroke') - symH;

      d3.select(this)
        .flowClass("horizontal stretched solid flow")
        .flowStyle(`height: ${symH}px; margin-bottom: 4px`);

      let symG = g.append("g")
        .classed("symG", true)
        .flowStyle("v-mode", `margin-top: ${r.anchorY - dy/2}px`)
        .flowComputed("v-mode", "margin-left", function() {
          return d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2 +"px";
        })
        .flowComputed("h-mode", "margin-top", function() {
          let maxH = d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
          return (maxH - this.getBoundingClientRect().height)/2 +"px";
        });

      symbol.insert(symG)
        .attrs({
          "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
          "i:i:stroke-width": d.get('mapping.visualization.stroke'),
          "stroke": d.get('mapping.visualization.strokeColor'),
          "fill": d.get('mapping').getScaleOf('color')(val),
          "opacity": d.get('opacity')
        });

    } else {

      r = {x: 20, y: 12, anchorY: 12};
      dy = 0;

      d3.select(this).flowClass("horizontal stretched solid flow")
        .flowStyle(`height: ${2*r.y}px; margin-bottom: 4px`);

      g.flowComputed("h-mode", "width", function() {
        let siblingW = 0;
        if (d3.select(this.parentElement.previousSibling).select(".symG").node()) {
          siblingW = d3.select(this.parentElement.previousSibling).select(".symG").node().getBoundingClientRect().width
        } else if (d3.select(this.parentElement.nextSibling).select(".symG").node()) {
          siblingW = d3.select(this.parentElement.nextSibling).select(".symG").node().getBoundingClientRect().width
        }
        return Math.max(
          this.getBoundingClientRect().width,
          siblingW
        );
      });

      let line = g.append("line")
        .flowComputed("v-mode", "margin-left", function() {
          return d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2;
        })
        .flowComputedAttrs("v-mode", function() {
          return {
            x1: -r.x / 2,
            y1: r.y,
            x2: r.x / 2,
            y2: r.y,
            stroke: "#BBBBBB"
          }
        })
        .flowComputedAttrs("h-mode", function() {
          let maxH = d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
          return {
            x1: 0,
            y1: -maxH / 2,
            x2: 0,
            y2: maxH / 2,
            stroke: "#BBBBBB"
          }
        });
    }

    g.append("g")
      .flowStyle("position: absolute")
      .flowStyle("h-mode", `left: 0px;`)
      .flowStyle("v-mode", `margin-left: ${MARGIN_SYMBOL_TEXT}px; top: ${r.anchorY - dy/2}px`)
      .flowComputed("v-mode", "left", function() {
        return d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
      })
      .flowComputed("h-mode", "top", function() {
        return d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2 + 12;
      })
      .append("text")
      .classed("symLbl", true)
      .text( v => formatter(v) )
      .attrs({
        y: 0,
        dy: "0.3em",
        "font-size": "0.75em",
        "text-anchor": d.legendOrientation === "horizontal" ? "middle" : null
      });
        
  },

  appendSymbolIntervalLabel(svg, d, formatter, val, i) {
        
    let symbol = SymbolMaker.symbol({
          name: d.get('mapping.visualization.shape'),
          size: d.get('mapping').getScaleOf('size')(val)*2,
          barWidth: d.get('mapping.visualization.barWidth')
        }),
        r = symbol.getSize();

    let symH = Math.max(r.y + d.get('mapping.visualization.stroke'), 12),
        dy = r.y + d.get('mapping.visualization.stroke') - symH;

    d3.select(this).flowClass("horizontal solid stretched flow")
      .flowStyle(`position: relative; margin-bottom: 4px`)
      .flowStyle("v-mode", `height: ${symH}px`)
      .flowComputed("h-mode", "margin-left", function() {
        if (!this.previousSibling) {
          return d3.select(this).closestParent(".legend-layer").selectAll("g.row")
            .nodes()[0].getBoundingClientRect().width/2;
        } else {
          return "0px";
        }
      })
      .flowComputed("h-mode", "height", function() {
        return d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
      })
      .flowComputed("h-mode", "width", function() {
        let margin = 8;
        let widthSym = d3.select(this).selectAll("g.symG")
          .nodes()[0].getBoundingClientRect().width + margin*2;
        let widthsTextInner = d3.select(this).selectAll("text.symLbl")
          .nodes().map(n => n.getBoundingClientRect().width);
        let widthTextPreviousSibling = 0;
        if (this.previousSibling) {
          widthTextPreviousSibling = d3.select(this.previousSibling).selectAll("text.symLbl").nodes()[0].getBoundingClientRect().width;
        }
        let widths = [
          widthSym,
          (widthsTextInner.length == 2 && (widthsTextInner[0]+widthsTextInner[1])/2+10) || 0,
          (widthsTextInner[widthsTextInner.length-1]+widthTextPreviousSibling)/2+10
        ];
        return Math.max.apply(undefined, widths);
      });

    if (!(r.x > 0 && r.y > 0)) return;

    let g = d3.select(this).append("g")
      .flowStyle("position: relative")
      .flowClass("h-mode", "horizontal center stretched flow")
      .flowStyle("h-mode", "width: 100%")
      .flowComputed("v-mode", "margin-left", function() {
        return d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2;
      })
      .flowComputed("h-mode", "margin-top", function() {
        return d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2;
      });
      
    
    let symG = g.append("g")
      .classed("symG", true)
      .flowStyle("v-mode", `margin-top: ${r.anchorY+d.get('mapping.visualization.stroke')/2 - dy/2}px`)
      .flowStyle("h-mode", `margin-left: ${r.x}px`)
      .flowClass("h-mode", "solid")
      .flowComputed("h-mode", "margin-top", function() {
        let maxH = d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
        return (maxH - this.getBoundingClientRect().height)/2;
      });

    symbol.insert(symG)
      .attrs({
        "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
        "i:i:stroke-width": d.get('mapping.visualization.stroke'),
        "stroke": d.get('mapping.visualization.strokeColor'),
        "fill": d.get('mapping').getScaleOf('color')(val),
        "opacity": d.get('opacity')
      });
      
    g = g.append("g").flowClass("outer fluid flow-no-size")
      .flowStyle("width: 100%; height: 100%")
      .flowComputed("h-mode", "top", function() {
        return d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2;
      })

    if (i === 0) {

      let firstStepG = g.append("g")
        .flowClass("flow-no-size")
        .flowStyle("position: absolute; left: 0px")
        .flowStyle("v-mode", "top: 0px");
      
      firstStepG.append("line")
        .flowComputedAttrs("v-mode", function() {
          let maxW = d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
          return {
            x1: 0,
            y1: -2,
            x2: maxW / 2,
            y2: -2,
            stroke: "black"
          };
        })
        .flowComputedAttrs("h-mode", function() {
          let maxH = d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
          return {
            x1: 0,
            y1: -maxH,
            x2: 0,
            y2: 0,
            stroke: "black"
          };
        });

      firstStepG.append("text")
        .classed("symLbl", true)
        .flowStyle("h-mode", "position: absolute; top: 12px")
        .flowComputed("v-mode", "margin-left", function() {
          return d3lper.selectionMaxWidth(
            d3.select(this).closestParent(".legend-layer").selectAll("g.symG")
          ) / 2 + MARGIN_SYMBOL_TEXT;
        })
        .text( formatter(d.get('mapping.extent')[1]) )
        .attrs({
          x: 0,
          y: 0,
          dy: "0.3em",
          "font-size": "0.75em",
          "text-anchor": d.legendOrientation === "horizontal" ? "middle" : null
        });
      
    }

    g = g.append("g")
      .flowClass("flow-no-size")
      .flowStyle("position: absolute;")
      .flowStyle("v-mode", `left: 0px; top: ${Math.max(symH+2, 10)}px`)
      .flowStyle("h-mode", "left: 100%; top: 0px");
    
    g.append("line")
      .flowComputedAttrs("v-mode", function() {
        let maxW = d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
        return {
          x1: 0,
          y1: 0,
          x2: maxW / 2,
          y2: 0,
          stroke: "black"
        };
      })
      .flowComputedAttrs("h-mode", function() {
        console.log(this.parentElement.parentElement.parentElement.parentElement);
        let maxH = d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG"));
        return {
          x1: 0,
          y1: -maxH,
          x2: 0,
          y2: 0,
          stroke: "black"
        };
      });
    
    g.append("text")
      .classed("symLbl", true)
      .flowStyle("h-mode", "position: absolute; top: 12px")
      .flowComputed("v-mode", "margin-left", function() {
        return d3lper.selectionMaxWidth(
          d3.select(this).closestParent(".legend-layer").selectAll("g.symG")
        ) / 2 + MARGIN_SYMBOL_TEXT;
      })
      .text( v => formatter(v) )
      .attrs({
        x: 0,
        y: 0,
        dy: "0.3em",
        "font-size": "0.75em",
        "text-anchor": d.legendOrientation === "horizontal" ? "middle" : null
      });
  },

  appendBarIntervals(el, intervals, d, formatter) {

    let g = el.append("g").classed("row", true),
        barG = g.append("g").classed("bars", true),
        axisG = g.append("g").classed("axis", true),
        maxHeight = 0,
        minHeight = 0;

    let appendBarSymbol = function(val, i) {

      let sign = Math.sign(val) || 1,
          symbol = SymbolMaker.symbol({
            name: d.get('mapping.visualization.shape'),
            size: d.get('mapping').getScaleOf('size')(val)*2,
            barWidth: d.get('mapping.visualization.barWidth'),
            sign
          });

      let r = symbol.getSize();

      if (!(r.x > 0 && r.y > 0)) return;

      let symH = r.y + d.get('mapping.visualization.stroke');
        
      let dy = r.y + d.get('mapping.visualization.stroke') - symH;

      d3.select(this).flowClass("horizontal solid")
        .flowStyle(`height: ${symH}px; margin-right: 2px`);

      let symG = d3.select(this).append("g")
          .classed("barG", true);

      symbol.insert(symG)
        .attrs({
          "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
          "i:i:stroke-width": d.get('mapping.visualization.stroke'),
          "stroke": d.get('mapping.visualization.strokeColor'),
          "fill": d.get('mapping').getScaleOf('color')(val),
          "opacity": d.get('opacity')
        });

        maxHeight = Math.max(maxHeight, -sign*symH);
        minHeight = Math.min(minHeight, -sign*symH);

    };

    let customScale = function() {
      let transform = d.get('mapping').getScaleOf('size'),
          domain = d3.extent(intervals),
          range = [maxHeight, minHeight];
      function scale(x) {
        return -Math.sign(x)*transform(x-Math.sign(x)*0.0000001)*2;
      }
      scale.invert = function(x) {
        return transform.invert(x/2);
      };
      scale.domain = function() {
        return domain;
      };
      scale.range = function() {
        let vals = [0, ...intervals, d.get('mapping.extent')[1]];
        return d3.extent(vals).map(scale);
      };
      scale.ticks = function(n) {
        let range = d3.extent(scale.range()),
            ints, scaledInts;

        if (transform.invert) { //proportional
          let h = 0;
          for (++n; h < 13 && n > 2; n--) {
            h = (range[1]-range[0])/(n-2);
          }
          scaledInts = Array.from({length: n}, (v, i) => range[0]+i*h);
          ints = scaledInts.map( y => (y < 0 ? 1: -1) * scale.invert(y) );
          if (d.get('mapping.scale.diverging')) {
            ints.push(d.get('mapping.scale.valueBreak'));
          }
        } else {
          ints = [...intervals, d.get('mapping.extent')[1]];
          scaledInts = ints.map( x => scale(x) );
        }

        //remove duplicates scaled values, and scaled values too close to 0
        let intsExtIdx = d3.extent(ints.concat(0)).map( x => ints.indexOf(x) ).filter( idx => idx !== -1 );
        ints = scaledInts.reduce( (out, y, i, arr) => {
            let minH = Math.min.apply(void 0, out.map(idx => arr[idx]).concat(0).map( x => Math.abs(y-x) ));
            if (out.indexOf(i) === -1 && arr.slice(i+1).indexOf(y) === -1 && (minH > 12 || intsExtIdx.indexOf(i) !== -1)) {
              out.push(i);
            }
            return out;
          }, [...intsExtIdx] )
          .map( idx => ints[idx] );

        return compressIntervals([0, ...ints]);
      };
      scale.tickFormat = function() {
        return formatter;
      };
      scale.copy = function() {
        return customScale();
      };
      return scale;
    }

    barG.selectAll(".bar")
      .data(intervals)
      .enterUpdate({
        enter: (sel) => sel.append("g").classed("bar", true),
        update: (sel) => sel.each(appendBarSymbol)
      });

    //set axis
    let yAxis = d3.axisRight()
      .scale(customScale())
      .ticks(6);

    axisG.call(yAxis);

    /*//add value break axis
    let rValueBreak = d.get('mapping').getScaleOf('size')(d.get('mapping.scale.valueBreak'))*2;
    g.append("line")
      .attrs({
        x1: 0,
        y1: -rValueBreak,
        x2: 100,
        y2: -rValueBreak,
        stroke: "black"
      });*/

    barG.flowClass("horizontal solid flow");
    axisG.flowClass("solid").flowStyle(`margin-left: 5px`);
    g.flowClass("horizontal flow").flowStyle(`margin-top: ${-minHeight+10}px`);
    el.flowClass("vertical solid flow").flowStyle(`margin-right: 22px`)
      .flowComputed("height", function() {
        return d3lper.selectionMaxHeight(d3.select(this.parentElement).selectAll("g.barG"));
      })
      .flowComputed("margin-left", function() {
        return d3lper.selectionMaxWidth(d3.select(this.parentElement).selectAll("g.barG")) / 2;
      });
  },

  appendRuleLabel(svg, d, rule, i) {

    let converter = d.get('mapping.ruleFn').bind(d.get('mapping')),
        isSymbol = d.get('mapping.visualization.mainType') === "symbol",
        r;

    let g = d3.select(this).append("g")
      .flowClass("horizontal flow")
      .flowStyle("v-mode", `margin-right: 3px;`)
      .flowComputed("v-mode", "margin-left", function() {
        return d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2;
      });

    if (isSymbol) {

      g.flowComputed("h-mode", "margin-top", function() {
        return d3lper.selectionMaxHeight(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2;
      });

      let shape = rule.get('shape') ? rule.get('shape') : d.get('mapping.visualization.shape'),
          symbol = SymbolMaker.symbol({
            name: shape,
            size: rule.get('size')*2,
          });
      
      r = symbol.getSize();

      let symH = r.y + d.get('mapping.visualization.stroke');
      
      d3.select(this).flowClass("horizontal stretched solid flow")
        .flowStyle("v-mode", `height: ${symH/2}px; margin-bottom: 4px; margin-top: ${symH/2}px`);

      let symG = g.append("g")
        .classed("symG", true)
        .flowStyle("h-mode", `width: ${r.x/2}px; margin-right: 4px; margin-left: ${r.x/2}px`)
        .flowComputed("v-mode", "width", function() {
          return d3lper.selectionMaxWidth(d3.select(this).closestParent(".legend-layer").selectAll("g.symG")) / 2 +"px";
        });

      symbol.insert(symG)
        .attrs({
          "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke')),
          "i:i:stroke-width": d.get('mapping.visualization.stroke'),
          "stroke": rule.get('strokeColor'),
          "fill": rule.get('color'),
          "opacity": d.get('opacity')
        });
        
    } else {
      
      r = {x: 24, y: 16};

      d3.select(this).flowClass("horizontal stretched solid flow")
        .flowStyle("v-mode", `height: ${r.y/2}px; margin-bottom: 5px; margin-top: ${r.y/2}px`);
      
      let pattern = converter(rule, "texture");

      let swatchG = g.append("g")
        .flowStyle(`margin-top: ${-r.y/2}px`)
        .flowStyle("v-mode", `width: ${r.x}px; margin-right: 2px`);
      
      swatchG.append("rect")
        .attrs({
          "width": r.x,
          "height": r.y,
          "stroke": "#CCCCCC",
          "fill": "none"
        });
      
      swatchG.append("rect")
        .attrs({
          "width": r.x,
          "height": r.y,
          "fill": () => {
          
            let color = rule.get('color');
            if (pattern && pattern.fn != PatternMaker.NONE) {
              let fn = new pattern.fn(false, color);
              fn.init(svg);
              return `url(${fn.url()})`;
            } else {
              return color;
            }

          }
        });
      
    }
    
    g.append("g")
      .flowStyle(`margin-left: ${isSymbol ? MARGIN_SYMBOL_TEXT : MARGIN_SURFACE_TEXT}px`)
      .flowStyle("h-mode", "margin-right: 20px")
      .append("text")
      .text( rule.get('label') )
      .attrs({
        x: 0,
        y: 0,
        dy: "0.3em",
        "font-size": "0.75em"
      });
    
  }
});
