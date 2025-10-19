"""
Oxford Pets Quality Analysis - Plotly Version

Tutorial: Detection Quality Analysis
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Assess bounding box annotation quality.
    Check for consistency, anomalies, and quality metrics per breed.

Requirements:
    pip install pandas plotly numpy

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/quality_metrics.csv
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px

# ============================================================================
# Load Data
# ============================================================================

print("✅ Loading Quality Metrics...")
print("=" * 70)

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'

# Load quality metrics (per-breed)
quality_df = pd.read_csv(base_url + 'quality_metrics.csv')
print(f"✓ Loaded quality metrics for {len(quality_df)} breeds")

# Load full bbox data for detailed analysis
bbox_df = pd.read_csv(base_url + 'bbox_statistics.csv')
print(f"✓ Loaded {len(bbox_df):,} bounding boxes")

# ============================================================================
# Visualization 1: Size Consistency by Breed (Top 15)
# ============================================================================

print("\n📊 Creating size consistency analysis...")

# Get top 15 breeds by count
top_breeds = quality_df.nlargest(15, 'count')

fig_consistency = go.Figure()

# Add bar for area CV (lower is better)
fig_consistency.add_trace(go.Bar(
    x=top_breeds['breed'],
    y=top_breeds['area_cv'],
    name='Area CV',
    marker=dict(color='#3b82f6')
))

fig_consistency.update_layout(
    title='Size Consistency by Breed (Coefficient of Variation)',
    xaxis_title='Breed',
    yaxis_title='CV (lower = more consistent)',
    template='plotly_white',
    height=500,
    xaxis=dict(tickangle=-45),
    showlegend=False
)

fig_consistency.show()

print(f"  Most consistent breed: {top_breeds.loc[top_breeds['area_cv'].idxmin(), 'breed']}")
print(f"  Least consistent breed: {top_breeds.loc[top_breeds['area_cv'].idxmax(), 'breed']}")

# ============================================================================
# Visualization 2: Average Coverage by Breed
# ============================================================================

print("\n📐 Creating coverage analysis...")

fig_coverage = go.Figure(data=[
    go.Bar(
        x=top_breeds['breed'],
        y=top_breeds['avg_coverage'],
        marker=dict(
            color=top_breeds['avg_coverage'],
            colorscale='RdYlGn',
            showscale=True,
            colorbar=dict(title="Coverage")
        ),
        text=[f"{v:.1%}" for v in top_breeds['avg_coverage']],
        textposition='auto'
    )
])

fig_coverage.update_layout(
    title='Average Image Coverage by Breed (bbox_area / image_area)',
    xaxis_title='Breed',
    yaxis_title='Coverage Ratio',
    template='plotly_white',
    height=500,
    xaxis=dict(tickangle=-45),
    showlegend=False
)

fig_coverage.show()

print(f"  Mean coverage: {quality_df['avg_coverage'].mean():.2%}")
print(f"  Std coverage: {quality_df['avg_coverage'].std():.2%}")

# ============================================================================
# Visualization 3: Size Category Distribution by Species
# ============================================================================

print("\n📦 Creating size category by species...")

# Group by species and size category
size_by_species = bbox_df.groupby(['species', 'size_category']).size().unstack(fill_value=0)

fig_size_species = go.Figure()

for size_cat in ['small', 'medium', 'large']:
    if size_cat in size_by_species.columns:
        fig_size_species.add_trace(go.Bar(
            x=size_by_species.index,
            y=size_by_species[size_cat],
            name=size_cat.capitalize(),
            text=size_by_species[size_cat],
            textposition='auto'
        ))

fig_size_species.update_layout(
    title='Size Category Distribution by Species',
    xaxis_title='Species',
    yaxis_title='Count',
    barmode='stack',
    template='plotly_white',
    height=400
)

fig_size_species.show()

# ============================================================================
# Visualization 4: Outlier Detection
# ============================================================================

print("\n🔍 Detecting outliers...")

# Define outlier thresholds
area_q25 = bbox_df['area'].quantile(0.25)
area_q75 = bbox_df['area'].quantile(0.75)
area_iqr = area_q75 - area_q25
area_outlier_threshold = area_q75 + 1.5 * area_iqr

aspect_outliers = (bbox_df['aspect_ratio'] < 0.5) | (bbox_df['aspect_ratio'] > 2.0)
area_outliers = bbox_df['area'] > area_outlier_threshold

bbox_df['is_outlier'] = aspect_outliers | area_outliers

fig_outliers = px.scatter(
    bbox_df,
    x='width',
    y='height',
    color='is_outlier',
    color_discrete_map={True: '#ef4444', False: '#10b981'},
    opacity=0.5,
    title='Bbox Outlier Detection (Width vs Height)',
    labels={'width': 'Width (px)', 'height': 'Height (px)'}
)

fig_outliers.update_layout(
    template='plotly_white',
    height=500
)

fig_outliers.show()

outlier_count = bbox_df['is_outlier'].sum()
print(f"  Total outliers: {outlier_count} ({outlier_count/len(bbox_df)*100:.1f}%)")
print(f"  Aspect ratio outliers: {aspect_outliers.sum()}")
print(f"  Area outliers: {area_outliers.sum()}")

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("✅ QUALITY ANALYSIS SUMMARY")
print("=" * 70)
print(f"\n📊 Overall Quality Score: {((len(bbox_df) - outlier_count) / len(bbox_df) * 100):.1f}%")
print(f"\n🔍 Outliers:")
print(f"  Total: {outlier_count} / {len(bbox_df):,} ({outlier_count/len(bbox_df)*100:.1f}%)")
print(f"  Extreme aspect ratios: {aspect_outliers.sum()}")
print(f"  Abnormal areas: {area_outliers.sum()}")

print(f"\n📏 Size Consistency:")
print(f"  Most consistent: {quality_df.loc[quality_df['area_cv'].idxmin(), 'breed']}")
print(f"  Least consistent: {quality_df.loc[quality_df['area_cv'].idxmax(), 'breed']}")

print(f"\n💡 Annotation quality is {'Excellent' if outlier_count/len(bbox_df) < 0.05 else 'Good' if outlier_count/len(bbox_df) < 0.1 else 'Fair'}")
print("=" * 70)

