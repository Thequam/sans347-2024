'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import type { GraphConfig } from '@/lib/graphData';

interface SANSGraphProps {
  config: GraphConfig;
  plotPoint?: { x: number; y: number; category?: string; color?: string } | null;
  width?: number;
  height?: number;
}

export default function SANSGraph({ config, plotPoint, width = 800, height = 550 }: SANSGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Margins
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    // Log scale helpers
    const logX = (v: number) => {
      const minLog = Math.log10(config.xMin);
      const maxLog = Math.log10(config.xMax);
      return margin.left + ((Math.log10(Math.max(v, config.xMin)) - minLog) / (maxLog - minLog)) * plotW;
    };
    const logY = (v: number) => {
      const minLog = Math.log10(config.yMin);
      const maxLog = Math.log10(config.yMax);
      return margin.top + plotH - ((Math.log10(Math.max(v, config.yMin)) - minLog) / (maxLog - minLog)) * plotH;
    };

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 0.5;

    // Major gridlines for Y-axis
    const yMinLog = Math.floor(Math.log10(config.yMin));
    const yMaxLog = Math.ceil(Math.log10(config.yMax));
    for (let e = yMinLog; e <= yMaxLog; e++) {
      const val = Math.pow(10, e);
      if (val >= config.yMin && val <= config.yMax) {
        const py = logY(val);
        ctx.beginPath();
        ctx.moveTo(margin.left, py);
        ctx.lineTo(margin.left + plotW, py);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      // Minor gridlines (2-9)
      for (let m = 2; m <= 9; m++) {
        const mval = val * m;
        if (mval >= config.yMin && mval <= config.yMax) {
          const py = logY(mval);
          ctx.beginPath();
          ctx.moveTo(margin.left, py);
          ctx.lineTo(margin.left + plotW, py);
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }

    // Major gridlines for X-axis
    const xMinLog = Math.floor(Math.log10(config.xMin));
    const xMaxLog = Math.ceil(Math.log10(config.xMax));
    for (let e = xMinLog; e <= xMaxLog; e++) {
      const val = Math.pow(10, e);
      if (val >= config.xMin && val <= config.xMax) {
        const px = logX(val);
        ctx.beginPath();
        ctx.moveTo(px, margin.top);
        ctx.lineTo(px, margin.top + plotH);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      for (let m = 2; m <= 9; m++) {
        const mval = val * m;
        if (mval >= config.xMin && mval <= config.xMax) {
          const px = logX(mval);
          ctx.beginPath();
          ctx.moveTo(px, margin.top);
          ctx.lineTo(px, margin.top + plotH);
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }

    // Draw plot area border
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    // Draw red boundary lines
    for (const line of config.lines) {
      const x1p = logX(line.x1);
      const y1p = logY(line.y1);
      const x2p = logX(line.x2);
      const y2p = logY(line.y2);

      ctx.beginPath();
      ctx.moveTo(
        Math.max(margin.left, Math.min(margin.left + plotW, x1p)),
        Math.max(margin.top, Math.min(margin.top + plotH, y1p))
      );
      ctx.lineTo(
        Math.max(margin.left, Math.min(margin.left + plotW, x2p)),
        Math.max(margin.top, Math.min(margin.top + plotH, y2p))
      );
      ctx.strokeStyle = line.color || '#dc2626';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw label
      if (line.label) {
        const midX = (x1p + x2p) / 2;
        const midY = (y1p + y2p) / 2;
        const angle = Math.atan2(y2p - y1p, x2p - x1p);

        ctx.save();
        ctx.translate(midX, midY);

        // Only rotate for diagonal lines
        const isHorizontal = Math.abs(line.y1 - line.y2) < 0.01 * Math.max(line.y1, line.y2);
        const isVertical = Math.abs(line.x1 - line.x2) < 0.01 * Math.max(line.x1, line.x2);

        if (!isHorizontal && !isVertical) {
          ctx.rotate(angle);
        } else if (isVertical) {
          ctx.rotate(-Math.PI / 2);
        }

        ctx.fillStyle = isHorizontal || isVertical ? '#374151' : '#dc2626';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(line.label, 0, isHorizontal ? -6 : isVertical ? -6 : -6);
        ctx.restore();
      }
    }

    // Draw category zone labels
    for (const zone of config.categoryZones) {
      const zx = logX(zone.x);
      const zy = logY(zone.y);
      if (zx > margin.left && zx < margin.left + plotW && zy > margin.top && zy < margin.top + plotH) {
        ctx.fillStyle = '#6b7280';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(zone.label, zx, zy);
      }
    }

    // Y-axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let e = yMinLog; e <= yMaxLog; e++) {
      const val = Math.pow(10, e);
      if (val >= config.yMin && val <= config.yMax) {
        const py = logY(val);
        const label = val >= 1000 ? (val / 1000 >= 1000 ? `${val / 1000} ` : `${val.toLocaleString('en').replace(/,/g, ' ')}`) : val.toString().replace('.', ',');
        ctx.fillText(label, margin.left - 8, py + 4);
      }
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let e = xMinLog; e <= xMaxLog; e++) {
      const val = Math.pow(10, e);
      if (val >= config.xMin && val <= config.xMax) {
        const px = logX(val);
        const label = val >= 1000 ? `${val.toLocaleString('en').replace(/,/g, ' ')}` : val.toString().replace('.', ',');
        ctx.fillText(label, px, margin.top + plotH + 18);
      }
    }

    // Axis titles
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(config.xAxisLabel, margin.left + plotW / 2, height - 10);

    ctx.save();
    ctx.translate(15, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(config.yAxisLabel, 0, 0);
    ctx.restore();

    // Draw plot point
    if (plotPoint) {
      const px = logX(plotPoint.x);
      const py = logY(plotPoint.y);

      if (px >= margin.left && px <= margin.left + plotW && py >= margin.top && py <= margin.top + plotH) {
        // Crosshair lines
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = plotPoint.color || '#f97316';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(px, margin.top);
        ctx.lineTo(px, margin.top + plotH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(margin.left, py);
        ctx.lineTo(margin.left + plotW, py);
        ctx.stroke();

        ctx.setLineDash([]);

        // Point dot
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = plotPoint.color || '#f97316';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label "Your Equipment"
        ctx.fillStyle = plotPoint.color || '#f97316';
        const labelBgX = px + 12;
        const labelBgY = py - 12;
        const labelText = 'Your Equipment';
        ctx.font = 'bold 11px Arial';
        const textWidth = ctx.measureText(labelText).width;

        // Background pill
        const pillPad = 6;
        ctx.beginPath();
        const rx = labelBgX - pillPad;
        const ry = labelBgY - 12;
        const rw = textWidth + pillPad * 2;
        const rh = 20;
        const radius = 4;
        ctx.moveTo(rx + radius, ry);
        ctx.lineTo(rx + rw - radius, ry);
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
        ctx.lineTo(rx + rw, ry + rh - radius);
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
        ctx.lineTo(rx + radius, ry + rh);
        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
        ctx.lineTo(rx, ry + radius);
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
        ctx.closePath();
        ctx.fillStyle = plotPoint.color || '#f97316';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, labelBgX, labelBgY + 2);
      }
    }
  }, [config, plotPoint, width, height]);

  useEffect(() => {
    drawGraph();
    const handleResize = () => drawGraph();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 'auto', maxWidth: `${width}px` }}
    />
  );
}
