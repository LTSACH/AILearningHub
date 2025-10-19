"""
Oxford Pets Spatial Distribution - Plotly Version

Tutorial: Spatial Distribution Analysis
Library: Plotly
Author: AILearningHub
Dataset: Oxford-IIIT Pets
URL: https://ltsach.github.io/AILearningHub/

Description:
    Analyze spatial distribution of bounding boxes.
    Check for center bias, position patterns, and edge proximity.

Requirements:
    pip install pandas plotly numpy

Data Source:
    https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/spatial_distribution.csv
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px

# ============================================================================
# Load Data
# ============================================================================

print("🗺️ Loading Spatial Distribution Data...")
print("=" * 70)

base_url = 'https://raw.githubusercontent.com/LTSACH/AILearningHub/main/datasets/oxford-pets/precomputed/detection/'
df = pd.read_csv(base_url + 'spatial_distribution.csv')

print(f"✓ Loaded {len(df):,} bounding boxes")

# ============================================================================
# Visualization 1: Position Heatmap (Center Points)
# ============================================================================

print("\n🔥 Creating position heatmap...")

# Create 2D histogram for heatmap
fig_heatmap = go.Figure(data=go.Histogram2d(
    x=df['center_x'],
    y=df['center_y'],
    colorscale='Hot',
    nbinsx=30,
    nbinsy=30,
    colorbar=dict(title="Count")
))

fig_heatmap.update_layout(
    title='Bounding Box Center Position Heatmap',
    xaxis_title='Normalized X Position',
    yaxis_title='Normalized Y Position',
    template='plotly_white',
    height=500,
    xaxis=dict(range=[0, 1]),
    yaxis=dict(range=[0, 1], scaleanchor='x', scaleratio=1)
)

fig_heatmap.show()

# ============================================================================
# Visualization 2: Center Bias Analysis
# ============================================================================

print("\n🎯 Creating center bias analysis...")

# Calculate distance from center
df['distance_from_center'] = np.sqrt((df['center_x'] - 0.5)**2 + (df['center_y'] - 0.5)**2)

fig_bias = go.Figure(data=[
    go.Histogram(
        x=df['distance_from_center'],
        nbinsx=50,
        marker=dict(color='#8b5cf6', opacity=0.7)
    )
])

fig_bias.update_layout(
    title='Distance from Image Center Distribution',
    xaxis_title='Distance from Center (normalized)',
    yaxis_title='Count',
    template='plotly_white',
    height=400
)

fig_bias.show()

print(f"  Mean distance from center: {df['distance_from_center'].mean():.3f}")
print(f"  Median distance: {df['distance_from_center'].median():.3f}")

# Check center bias
center_threshold = 0.3
center_boxes = (df['distance_from_center'] < center_threshold).sum()
center_pct = center_boxes / len(df) * 100
print(f"  Boxes near center (<{center_threshold}): {center_boxes} ({center_pct:.1f}%)")

# ============================================================================
# Visualization 3: Scatter Plot by Species
# ============================================================================

print("\n🔵 Creating scatter plot by species...")

fig_scatter = px.scatter(
    df,
    x='center_x',
    y='center_y',
    color='species',
    size='normalized_area',
    opacity=0.5,
    color_discrete_map={'dog': '#3b82f6', 'cat': '#f59e0b'},
    title='Bounding Box Centers by Species',
    labels={'center_x': 'X Position', 'center_y': 'Y Position'}
)

fig_scatter.update_layout(
    template='plotly_white',
    height=500,
    xaxis=dict(range=[0, 1]),
    yaxis=dict(range=[0, 1], scaleanchor='x', scaleratio=1)
)

fig_scatter.show()

# ============================================================================
# Visualization 4: Grid Distribution
# ============================================================================

print("\n📊 Creating grid distribution...")

# Divide into 3x3 grid
df['grid_x'] = pd.cut(df['center_x'], bins=3, labels=['Left', 'Center', 'Right'])
df['grid_y'] = pd.cut(df['center_y'], bins=3, labels=['Top', 'Middle', 'Bottom'])
df['grid_cell'] = df['grid_y'].astype(str) + '-' + df['grid_x'].astype(str)

grid_counts = df['grid_cell'].value_counts()

# Create 3x3 heatmap
grid_matrix = np.zeros((3, 3))
for idx, (cell, count) in enumerate(grid_counts.items()):
    y_label, x_label = cell.split('-')
    y_idx = ['Top', 'Middle', 'Bottom'].index(y_label)
    x_idx = ['Left', 'Center', 'Right'].index(x_label)
    grid_matrix[y_idx, x_idx] = count

fig_grid = go.Figure(data=go.Heatmap(
    z=grid_matrix,
    x=['Left', 'Center', 'Right'],
    y=['Top', 'Middle', 'Bottom'],
    colorscale='Blues',
    text=grid_matrix,
    texttemplate='%{text:.0f}',
    textfont={"size": 16},
    colorbar=dict(title="Count")
))

fig_grid.update_layout(
    title='3×3 Grid Distribution (Bbox Centers)',
    template='plotly_white',
    height=400,
    xaxis=dict(side='top'),
    yaxis=dict(autorange='reversed')
)

fig_grid.show()

# ============================================================================
# Summary
# ============================================================================

print("\n" + "=" * 70)
print("🗺️ SPATIAL DISTRIBUTION SUMMARY")
print("=" * 70)
print(f"\n📍 Center Position:")
print(f"  Mean X: {df['center_x'].mean():.3f}")
print(f"  Mean Y: {df['center_y'].mean():.3f}")
print(f"  Center bias: {center_pct:.1f}% within {center_threshold} of center")

print(f"\n📊 Grid Distribution (most common):")
top_grids = grid_counts.head(3)
for cell, count in top_grids.items():
    pct = count / len(df) * 100
    print(f"  {cell:20s}: {count:4d} ({pct:5.1f}%)")

print(f"\n💡 Observation: Check if bboxes are centered or distributed evenly")
print("=" * 70)

