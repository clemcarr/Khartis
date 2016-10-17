import Ember from 'ember';
import d3lper from 'mapp/utils/d3lper';
import PatternMaker from 'mapp/utils/pattern-maker';
import SymbolMaker from 'mapp/utils/symbol-maker';
import ValueMixin from 'mapp/models/mapping/mixins/value';
import TextEditor from './text-editor/component';

export default Ember.Mixin.create({
  
  resizingMargin: false,

  legendInit() {

    let legendG = this.d3l().append("g")
      .classed("legend", true);
    
    //LEGEND DRAG
    let drag = d3.behavior.drag()
      .origin(() => {
        return {x: legendG.attr('tx'), y: legendG.attr('ty')};
      })
      .on("dragstart", () => {
        d3.event.sourceEvent.stopPropagation();
        legendG.classed("dragging", true);
        this.set('resizingMargin', true);
      })
      .on("drag", () => {
        let bbox = this.d3l().select(".bg").node().getBBox(),
            pos = {
              tx: Math.min(bbox.width-2, Math.max(d3.event.x, 0)),
              ty: Math.min(bbox.height-10, Math.max(d3.event.y, 0))
            };
        legendG.attr({
         'transform': d3lper.translate(pos), 
          tx: pos.tx,
          ty: pos.ty
        });
      })
      .on("dragend", () => {
        legendG.classed("dragging", false);
        this.set('resizingMargin', false);
        let t = this.getViewboxTransform()({
          x: legendG.attr('tx'),
          y: legendG.attr('ty')
        });
        this.get('graphLayout').setProperties({
          legendTx: t.x,
          legendTy: t.y
        });
        this.sendAction('onAskVersioning', "freeze");
      });
    
    this.drawLegend();
    legendG.call(drag);
    this.updateLegendOpacity();
    
  },
  
  updateLegendPosition: function() {
    
    let legendG = this.d3l().select("g.legend"),
        legendContentG = legendG.select("g.legend-content"),
        t = {x: this.get('graphLayout.legendTx'), y: this.get('graphLayout.legendTy')};
    
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
          this.get('graphLayout').setProperties({
              legendTx: t.x,
              legendTy: t.y
            });
        }
        
      } else {
        t = this.getViewboxTransform().invert(t);
      }

      legendG.attr({
        "tx": t.x,
        "ty": t.y,
        "transform": d3lper.translate({tx: t.x, ty: t.y})
      });

      let padding = 12,
          contentBox = legendContentG.node().getBBox();
      
      legendG.select("rect.legend-bg")
        .attr({
          x: contentBox.x - padding,
          y: contentBox.y - padding,
          width: contentBox.width + 2*padding,
          height: contentBox.height + 2*padding,
        });
        
    } else {
      if (autoMargin) {
        this.get('graphLayout.margin').resetValue('b');
      }
    }
    
  }.observes('$width', '$height',
    'graphLayout.legendTx', 'graphLayout.legendTy',
    'graphLayout.width', 'graphLayout.height', 'graphLayout.margin.manual'),
  
  updateLegendOpacity: function() {
    
    this.d3l().selectAll("g.legend rect.legend-bg")
      .style("opacity", this.get('graphLayout.legendOpacity'));
      
  }.observes('graphLayout.legendOpacity'),
  
  drawLegend: function() {
    
    let svg = this.d3l(),
        layers = this.get('graphLayers'),
        width = layers.length * 120;
    
    let legendG = this.d3l().selectAll("g.legend")
      
    let containerG = legendG.selectAll("g.legend-content"),
        bgG = legendG.selectAll("rect.legend-bg");
    
    if (!this.get('graphLayout.showLegend') || !this.get('graphLayers').length) {
      containerG.remove();
      bgG.remove();
      this.updateLegendPosition();
      return;
    }
    
    if (bgG.empty()) {
      bgG = legendG.append("rect")
        .classed("legend-bg", true)
        .attr({
          "x": -18,
          "y": -5
        })
        .attr("stroke", "#F0F0F0")
        .attr("fill", "white");
    }
    
    if (containerG.empty()) {
      containerG = legendG.append("g")
        .classed("legend-content", true);
    }
    
    containerG.attr("flow-css", "flow: horizontal; padding-left: 5; height: 500; width: "+width);  
    
    let bindLayer = (_) => {
      
      _.attr("flow-css", "flow: vertical; stretch: true; margin-right: 34; margin-top: 16");
      
      _.each( function(d, i) {
        
        let el = d3.select(this),
            xOrigin = (d.get('mapping.visualization.type') === "symbol" ?
              d.get('mapping.visualization.maxSize') : 10),
            textOffset = xOrigin + 16,
            formatter = d3.format(`0.${d.get('mapping.maxValuePrecision')}f`);

        el.selectAll("*").remove();
          
        let label = el.append("g")
          .attr("flow-css", "margin-bottom: 16")
          .append("text")
          .attr("flow-css", "wrap-text: true; max-width: 250px")
          .classed("legend-title", true)
          .attr("transform", d3lper.translate({tx: -xOrigin/2}))
          .style({
            "font-size": "14px",
            "font-weight": "bold"
          });
        
        label.text(d.get('legendTitleComputed'));

        label.on("click", function() {
          if (d3.event.defaultPrevented) return;
          TextEditor.showAt("legend-title-editor", this, d.get('legendTitleComputed'), function(val) {
            d.set('legendTitle', val);
          });
        });
          
        let appendSurfaceIntervalLabel = function(val, i) {
          
          let r = {x: 24/2, y: 16/2};

          d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${2*r.y}px; index: ${i}; margin-top: ${ i > 0 ? 0 : 0 }px`);
              
          let g = d3.select(this).append("g")
            .attr("flow-css", `margin-right: -${r.x}px`);
          
          //border
          g.append("rect")
            .attr({
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "width": 2*r.x,
              "height": 2*r.y,
              y: 0,
              "stroke-width": 1,
              "stroke": "black",
              fill: "none" 
            });

          g.append("rect")
            .attr({
              "transform": d3lper.translate({tx: -r.x, ty: 0}),
              "width": 2*r.x,
              "height": 2*r.y,
              y: 0,
              "fill": d.get('mapping').getScaleOf('color')(val - 0.000000001),
              "opacity": d.get('opacity'),
              "mask": () => {
                
                let mask = d.get('mapping').getScaleOf("texture")(val - 0.000000001)
                if (mask && mask.fn != PatternMaker.NONE) {
                  svg.call(mask.fn);
                  return `url(${mask.fn.url()})`;
                } else {
                  return null;
                }
              },
              "stroke-width": 0
            });
            
          g = d3.select(this).append("g");
            
          if (i === 0) {
            
            /*g.append("line").attr({
              x1: -2*r.x,
              y1: 0,
              x2: 0,
              y2: 0,
              stroke: "black"
            });*/
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: textOffset - 12,
                y:  0,
                dy: "0.3em",
                "font-size": "0.75em"
              });
            
          }
          
          /*g.append("line").attr({
              x1: -2*r.x,
              y1: 2*r.y,
              x2: 0,
              y2: 2*r.y,
              stroke: "black"
            });*/
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: textOffset - 12,
              y: 2*r.y,
              dy: "0.3em",
              "font-size": "0.75em"
            });
          
        };
        
        let appendSymbolIntervalLabel = function(val, i) {

          
          let r = {x: d.get('mapping').getScaleOf('size')(val - 0.000000001), y: d.get('mapping').getScaleOf('size')(val - 0.000000001)},
              symbol = SymbolMaker.symbol({name: d.get('mapping.visualization.shape')});

          let symH = Math.max(2*r.y + d.get('mapping.visualization.stroke'), 12),
              dy = 2*r.y + d.get('mapping.visualization.stroke') - symH;
      
          d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${symH}px; margin-bottom: 4px`);

          if (!(r.x > 0 && r.y > 0)) return;

          symbol.call(svg);
          
          let g = d3.select(this).append("g")
            .attr("flow-css", `margin-right: ${-r.x}px; width: ${r.x}px`);
          
          let symG = g.append("g")
            .attr("transform", d3lper.translate({ty: r.y+d.get('mapping.visualization.stroke')/2 - dy/2}));

          symbol.insert(symG, r.x*2)
            .attr({
              "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke'), r.x*2),
              "ai:ai:stroke-width": d.get('mapping.visualization.stroke'),
              "stroke": d.get('mapping.visualization.strokeColor'),
              "fill": d.get('mapping').getScaleOf('color')(val - 0.000000001),
              "opacity": d.get('opacity')
            });
            
          g = d3.select(this).append("g");
            
          if (i === 0) {
            
            g.append("line").attr({
              x1: 0,
              y1: -2,
              x2: textOffset - 6,
              y2: -2,
              stroke: "black"
            });
            
            g.append("text")
              .text( formatter(d.get('mapping.extent')[0]) )
              .attr({
                x: textOffset,
                y: -2,
                dy: "0.3em",
                "font-size": "0.75em"
              });
            
          }
          
          g.append("line").attr({
              x1: 0,
              y1: Math.max(symH+2, 10),
              x2: textOffset - 6,
              y2: Math.max(symH+2, 10),
              stroke: "black"
            });
          
          g.append("text")
            .text( v => formatter(v) )
            .attr({
              x: textOffset,
              y: Math.max(symH+2, 10),
              dy: "0.3em",
              "font-size": "0.75em"
            });
              
          
        };
        
        let appendSymbolIntervalLinearLabel = function(val, i) {
          
          let r = {x: d.get('mapping').getScaleOf('size')(val - 0.000000001), y: d.get('mapping').getScaleOf('size')(val - 0.000000001)},
              symbol = SymbolMaker.symbol({name: d.get('mapping.visualization.shape')});
      
          if (!(r.x > 0 && r.y > 0)) return;

          let symH = Math.max(2*r.y + d.get('mapping.visualization.stroke'), 12),
              dy = 2*r.y + d.get('mapping.visualization.stroke') - symH;

          d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${symH}px; margin-bottom: 4px`);
          
          symbol.call(svg);
          
          let g = d3.select(this).append("g")
           .attr("flow-css", `margin-right: ${-r.x}; width: ${r.x}px`);

          let symG = g.append("g")
            .attr("transform", d3lper.translate({ty: r.y - dy/2}));

          symbol.insert(symG, r.x*2)
            .attr({
              "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke'), r.x*2),
              "ai:ai:stroke-width": d.get('mapping.visualization.stroke'),
              "stroke": d.get('mapping.visualization.strokeColor'),
              "fill": d.get('mapping').getScaleOf('color')(val - 0.000000001),
              "opacity": d.get('opacity')
            });
            
          d3.select(this).append("g")
            .append("text")
            .text( v => formatter(v) )
            .attr({
              x: textOffset,
              y: r.y - dy/2,
              dy: "0.3em",
              "font-size": "0.75em"
            });
          
        };
        
        let appendRuleLabel = function(rule, i) {

          let r;

          if (d.get('mapping.visualization.type') === "symbol") {

            let shape = rule.get('shape') ? rule.get('shape') : d.get('mapping.visualization.shape'),
                symH = 2*rule.get('size') + d.get('mapping.visualization.stroke');
            
            r = {
              x: rule.get('size'),
              y: rule.get('size')
            };
            
            d3.select(this).attr("flow-css", `flow: horizontal; height: ${symH}px; stretch: true; margin-bottom: 4px`);

            let symbol = SymbolMaker.symbol({name: shape});
      
            symbol.call(svg);
            
            let g = d3.select(this).append("g")
              .attr("flow-css", `margin-right: ${-r.x}px; width: ${r.x}px`);
            
            let symG = g.append("g")
              .attr("transform", d3lper.translate({ty: r.y}));

            symbol.insert(symG, r.x*2)
              .attr({
                "stroke-width": symbol.unscale(d.get('mapping.visualization.stroke'), r.x*2),
                "ai:ai:stroke-width": d.get('mapping.visualization.stroke'),
                "stroke": rule.get('strokeColor'),
                "fill": rule.get('color'),
                "opacity": d.get('opacity')
              });
              
          } else {
            
            r = {x: 24/2, y: 16/2};
            
            d3.select(this).attr("flow-css", `flow: horizontal; stretch: true; height: ${r.y*2}px; margin-bottom: 4px`);

            let mask = rule.get('pattern') ? PatternMaker.Composer.build(rule.get('pattern')) : null;
            if (mask && mask.fn != PatternMaker.NONE) {
              svg.call(mask.fn);
            }
            
            let g = d3.select(this).append("g")
              .attr("flow-css", `margin-right: ${-r.x}px; width: ${r.x}px`);
            
            g.append("rect")
              .attr({
                "width": 2*r.x,
                "height": 2*r.y,
                "transform": d3lper.translate({tx: -r.x, ty: 0}),
                "stroke": "#CCCCCC",
                "fill": "none"
              });
            
            g.append("rect")
              .attr({
                "width": 2*r.x,
                "height": 2*r.y,
                "transform": d3lper.translate({tx: -r.x, ty: 0}),
                "fill": rule.get('color'),
                "mask": mask ? `url(${mask.fn.url()})` : null
              });
            
          }
          
          d3.select(this).append("g")
            .append("text")
            .text( rule.get('label') )
            .attr({
              x: textOffset,
              y: r.y,
              dy: "0.3em",
              "font-size": "0.75em"
            });
          
        };

        //re-calcul de l'offset du texte si il y a des rules symboles
        if (d.get('mapping.rules') && d.get('mapping.rules').length && d.get('mapping.visualization.type') === "symbol") {
          xOrigin = Math.max.apply(null, [xOrigin].concat(d.get('mapping.rules').map( r => r.get('size') )));
          textOffset = xOrigin + 16;
        }

        //regroupe les intervales si l'écart est minime
        let compressIntervals = function(intervals) {
          return intervals.reduce( (arr, v) => {
            if (!arr.length || Math.abs(arr[arr.length-1] - v) > 0.0000001) {
              arr.push(v);
            }
            return arr;
          }, []);
        };
        
        if (ValueMixin.Data.detect(d.get('mapping'))) {
          
          let intervals = d.get('mapping.intervals').slice(),
              fn;
          
          if (ValueMixin.Surface.detect(d.get('mapping'))) {
            fn = appendSurfaceIntervalLabel;
            intervals.push(d.get('mapping.extent')[1]); //push max
            intervals = compressIntervals(intervals);
          } else {
            if (d.get('mapping.scale.usesInterval')) {

              fn = appendSymbolIntervalLabel;
              intervals.push(d.get('mapping.extent')[1]); //push max
              
            } else {

              fn = appendSymbolIntervalLinearLabel;
              if (d.get('mapping.values').length > 2) {
                let steps = Math.min(d.get('mapping.values').length - 2, 5),
                    i = (d.get('mapping.extent')[1] - d.get('mapping.extent')[0]) / steps,
                    nearest = Array.from({length: steps-1}, (v, idx) => d.get('mapping.extent')[0] + i*(idx+1))
                      .reduce( (arr, v) => {
                        let nVal = Math.round(v);//d.get('mapping').findNearestValue(v);
                        /*if (arr.indexOf(nVal) === -1 && intervals.indexOf(nVal) === -1) {
                          arr.push(nVal);
                        }*/
                        arr.push(nVal);
                        return arr;
                      }, []);
                
                 //Array.prototype.splice.apply(intervals, [intervals.length - 1, 0].concat(nearest));
                 intervals = [d.get('mapping.extent')[0]]
                  .concat(nearest)
                  .concat(d.get('mapping.extent')[1]);
                 
              }
              
              intervals = compressIntervals(intervals);
              
            }
          }
          
          let sel = el.selectAll("g.interval")
            .data(intervals)
            .each(fn);
            
          sel.enter()
            .append("g")
            .classed("interval", true)
            .each(fn);
          
          sel.exit().remove();
          
          if (d.get('mapping.rules').length) {
            
            el.append("g")
              .attr("flow-css", "margin-top: 10; margin-bottom: 10")
              .append("line")
                .attr({
                  x1: 0,
                  y1: 0,
                  x2: 50,
                  y2: 0,
                  stroke: "#BBBBBB"
                });
            
          }
          
        }
        
        if (d.get('mapping.rules') && d.get('mapping.rules').length) {

          let sel = el.selectAll("g.rule")
            .data(d.get('mapping.rules').filter( r => r.get('visible') ).slice(0, 10))
            .each(appendRuleLabel);
            
          sel.enter()
            .append("g")
            .classed("rule", true)
            .each(appendRuleLabel);
            
          sel.exit().remove();
          
        }
        
      });
      
    };
    
    let sel = containerG.selectAll("g.legend-label")
      .data(this.get('graphLayers').filter( gl => gl.get('displayable') ))
      .call(bindLayer);
      
    sel.enter()
      .append("g")
      .classed("legend-label", true)
      .call(bindLayer);
      
    sel.exit().remove();
    
    containerG.call(d3lper.flow);
    
    Ember.run.later(() => {
      this.updateLegendPosition();
      this.updateLegendOpacity();
    });
    
  }.observes('graphLayout.showLegend', 'graphLayers.[]',
    'graphLayers.@each._defferedChangeIndicator')
  
  
});
