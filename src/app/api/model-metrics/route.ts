import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pythonServiceUrl = process.env.PYTHON_ML_SERVICE_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${pythonServiceUrl}/api/v1/model-metrics`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      // ignore and read directly from disk
    }

    // Direct filesystem read
    const metricsPath = path.join(process.cwd(), 'ml', 'metadata', 'evaluation_metrics.json');
    const cmPath = path.join(process.cwd(), 'ml', 'metadata', 'confusion_matrix.json');

    if (fs.existsSync(metricsPath)) {
      const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
      let cm = null;
      if (fs.existsSync(cmPath)) {
        cm = JSON.parse(fs.readFileSync(cmPath, 'utf-8'));
      }
      return NextResponse.json({ metrics, confusion_matrix: cm });
    }

    return NextResponse.json({
      metrics: {
        model_architecture: 'MobileNetV3-Small (Transfer Learning)',
        evaluated_dataset: 'PlantVillage + PlantDoc Curated Benchmark',
        overall_test_accuracy: 0.5972,
        macro_avg_f1: 0.5049,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve metrics' }, { status: 500 });
  }
}
