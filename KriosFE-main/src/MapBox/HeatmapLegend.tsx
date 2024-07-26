import React from 'react';
import '../stylesheets/heatmap.css';

const HeatmapLegend: React.FC = () => {
  return (
    <div className="heatmap-legend">
      <h4>nedbørsmengde (mm)</h4>
      <div><span style={{ background: 'rgba(255,255,255,0)' }}></span>0 mm</div>
      <div><span style={{ background: 'rgb(255,237,160)' }}></span>200 mm</div>
      <div><span style={{ background: 'rgb(254,217,118)' }}></span>400 mm</div>
      <div><span style={{ background: 'rgb(253,141,60)' }}></span>600 mm</div>
      <div><span style={{ background: 'rgb(252,78,42)' }}></span>800 mm</div>
      <div><span style={{ background: 'rgb(227,26,28)' }}></span>1000 mm</div>
    </div>
  );
};

export default HeatmapLegend;