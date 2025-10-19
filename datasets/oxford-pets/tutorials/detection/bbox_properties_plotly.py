"""
Oxford Pets Bounding Box Properties - Plotly Version

Tutorial: Bbox Properties Analysis
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Analyze bounding box dimensions, aspect ratios, and size distributions.
    Understand bbox characteristics for pet head detection.

Requirements:
    pip install pandas plotly numpy

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# ============================================================================
# Load Data
# ============================================================================

print("📏 Loading Bounding Box Properties...")
print("=" * 70)

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'bbox_statistics.csv')

print(f"✓ Loaded {len(df):,} bounding boxes")

# ============================================================================
# Visualization 1: Size Distribution (Width & Height)
# ============================================================================

print("\n📊 Creating size distribution...")

# Calculate statistics
width_stats = {
    'Mean': df['width'].mean(),
    'Median': df['width'].median(),
    'Std': df['width'].std()
}

height_stats = {
    'Mean': df['height'].mean(),
    'Median': df['height'].median(),
    'Std': df['height'].std()
}

fig_size = make_subplots(
    rows=1, cols=2,
    subplot_titles=('Width Distribution', 'Height Distribution'),
    specs=[[{'type': 'histogram'}, {'type': 'histogram'}]]
)

# Width histogram
fig_size.add_trace(
    go.Histogram(
        x=df['width'],
        nbinsx=50,
        name='Width',
        marker=dict(color='#3b82f6', opacity=0.7)
    ),
    row=1, col=1
)

# Height histogram
fig_size.add_trace(
    go.Histogram(
        x=df['height'],
        nbinsx=50,
        name='Height',
        marker=dict(color='#f59e0b', opacity=0.7)
    ),
    row=1, col=2
)

fig_size.update_xaxes(title_text="Width (pixels)", row=1, col=1)
fig_size.update_xaxes(title_text="Height (pixels)", row=1, col=2)
fig_size.update_yaxes(title_text="Count", row=1, col=1)
fig_size.update_yaxes(title_text="Count", row=1, col=2)

fig_size.update_layout(
    title_text='Bounding Box Size Distribution',
    template='plotly_white',
    height=400,
    showlegend=False
)

fig_size.show()

print(f"  Width:  Mean={width_stats['Mean']:.1f}, Median={width_stats['Median']:.1f}, Std={width_stats['Std']:.1f}")
print(f"  Height: Mean={height_stats['Mean']:.1f}, Median={height_stats['Median']:.1f}, Std={height_stats['Std']:.1f}")

# ============================================================================
# Visualization 2: Aspect Ratio Distribution
# ============================================================================

print("\n📐 Creating aspect ratio distribution...")

fig_aspect = go.Figure(data=[
    go.Histogram(
        x=df['aspect_ratio'],
        nbinsx=50,
        marker=dict(
            color=df['aspect_ratio'],
            colorscale='Viridis',
            showscale=True,
            colorbar=dict(title="Aspect Ratio")
        )
    )
])

# Add vertical lines for categories
fig_aspect.add_vline(x=0.67, line_dash="dash", line_color="red", 
                     annotation_text="Tall", annotation_position="top")
fig_aspect.add_vline(x=1.5, line_dash="dash", line_color="red",
                     annotation_text="Wide", annotation_position="top")

fig_aspect.update_layout(
    title='Aspect Ratio Distribution (Width/Height)',
    xaxis_title='Aspect Ratio',
    yaxis_title='Count',
    template='plotly_white',
    height=400,
    annotations=[
        dict(x=0.4, y=0.95, xref='paper', yref='paper', text='← Tall', showarrow=False),
        dict(x=0.5, y=0.95, xref='paper', yref='paper', text='Square', showarrow=False),
        dict(x=0.6, y=0.95, xref='paper', yref='paper', text='Wide →', showarrow=False)
    ]
)

fig_aspect.show()

print(f"  Mean aspect ratio: {df['aspect_ratio'].mean():.2f}")
print(f"  Median aspect ratio: {df['aspect_ratio'].median():.2f}")

# ============================================================================
# Visualization 3: Size Categories (COCO-style)
# ============================================================================

print("\n📦 Creating size categories...")

size_counts = df['size_category'].value_counts()

fig_categories = go.Figure(data=[
    go.Bar(
        x=size_counts.index,
        y=size_counts.values,
        marker=dict(
            color=['#ef4444', '#f59e0b', '#10b981'],
            opacity=0.8
        ),
        text=size_counts.values,
        textposition='auto'
    )
])

fig_categories.update_layout(
    title='COCO-style Size Categories (by diagonal length)',
    xaxis_title='Category',
    yaxis_title='Count',
    template='plotly_white',
    height=400,
    showlegend=False,
    annotations=[
        dict(x=0, y=size_counts.get('small', 0), text='< 32px', yanchor='bottom'),
        dict(x=1, y=size_counts.get('medium', 0), text='32-96px', yanchor='bottom'),
        dict(x=2, y=size_counts.get('large', 0), text='> 96px', yanchor='bottom')
    ]
)

fig_categories.show()

# ============================================================================
# Visualization 4: Area Distribution
# ============================================================================

print("\n📐 Creating area distribution...")

fig_area = go.Figure(data=[
    go.Histogram(
        x=df['normalized_area'],
        nbinsx=50,
        marker=dict(color='#8b5cf6', opacity=0.7)
    )
])

fig_area.update_layout(
    title='Normalized Bbox Area Distribution (bbox_area / image_area)',
    xaxis_title='Normalized Area',
    yaxis_title='Count',
    template='plotly_white',
    height=400
)

fig_area.show()

print(f"  Mean coverage: {df['normalized_area'].mean():.2%}")
print(f"  Median coverage: {df['normalized_area'].median():.2%}")

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("📊 BOUNDING BOX PROPERTIES SUMMARY")
print("=" * 70)
print(f"\n📏 Size Statistics:")
print(f"  Width:  {df['width'].mean():.1f} ± {df['width'].std():.1f} px")
print(f"  Height: {df['height'].mean():.1f} ± {df['height'].std():.1f} px")
print(f"  Area:   {df['area'].mean():.0f} ± {df['area'].std():.0f} px²")

print(f"\n📐 Aspect Ratios:")
print(f"  Mean:   {df['aspect_ratio'].mean():.2f}")
print(f"  Median: {df['aspect_ratio'].median():.2f}")
print(f"  Range:  {df['aspect_ratio'].min():.2f} - {df['aspect_ratio'].max():.2f}")

print(f"\n📦 Size Categories:")
for cat in ['small', 'medium', 'large']:
    count = (df['size_category'] == cat).sum()
    pct = count / len(df) * 100
    print(f"  {cat.capitalize():8s}: {count:4d} ({pct:5.1f}%)")

print(f"\n💡 Average image coverage: {df['normalized_area'].mean():.2%}")
print("=" * 70)

