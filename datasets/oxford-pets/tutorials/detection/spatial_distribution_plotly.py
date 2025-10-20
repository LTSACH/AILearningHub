"""
Detection EDA - Spatial Distribution Analysis (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/.../eda_detection.html

Analyzes bbox position heatmap, center bias, grid distribution with exact colors.
Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

print("="*70)
print("🗺️ DETECTION EDA - Spatial Distribution (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading spatial distribution data from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/detection/spatial_distribution.csv'
df = pd.read_csv(url)

print(f"   ✓ Loaded {len(df):,} bounding boxes")
print(f"   ✓ Columns: {list(df.columns)}")

# ============================================================================
# 2. CHART 1: Position Heatmap (Normalized X-Y)
# ============================================================================
print("\n2️⃣ Creating Position Heatmap...")

# Create 2D histogram for heatmap
bins = 20
hist, x_edges, y_edges = np.histogram2d(
    df['center_x'], 
    df['center_y'], 
    bins=bins,
    range=[[0, 1], [0, 1]]
)

# Normalize to percentages
hist_normalized = (hist / hist.sum()) * 100

# Center coordinates for plotting
x_centers = [(x_edges[i] + x_edges[i+1]) / 2 for i in range(len(x_edges)-1)]
y_centers = [(y_edges[i] + y_edges[i+1]) / 2 for i in range(len(y_edges)-1)]

fig1 = go.Figure(data=[go.Heatmap(
    z=hist_normalized,
    x=x_centers,
    y=y_centers,
    colorscale='Hot',  # Matching web report EXACTLY
    showscale=True,
    colorbar=dict(title="Density (%)")
)])

fig1.update_layout(
    title="Bounding Box Position Heatmap",
    xaxis=dict(title="Normalized X Position", range=[0, 1]),
    yaxis=dict(title="Normalized Y Position", range=[0, 1]),
    template="plotly_white",
    height=500
)

print("   ✓ Position heatmap created")
fig1.show()

# ============================================================================
# 3. CHART 2: Center Bias Analysis (Donut Chart)
# ============================================================================
print("\n3️⃣ Analyzing Center Bias...")

# Define center region (0.25 to 0.75 on both axes)
center_region = df[
    (df['center_x'] >= 0.25) & (df['center_x'] <= 0.75) &
    (df['center_y'] >= 0.25) & (df['center_y'] <= 0.75)
]

center_percentage = (len(center_region) / len(df)) * 100
other_percentage = 100 - center_percentage

# Calculate center bias score (0-1, where 1 means all in center)
center_bias_score = center_percentage / 100

# Colors matching web report EXACTLY
fig2 = go.Figure(data=[go.Pie(
    labels=['Center Region', 'Other Regions'],
    values=[center_percentage, other_percentage],
    marker=dict(colors=['#10b981', '#e5e7eb']),  # Green & Gray - matching web report
    hole=0.4,  # Donut chart
    textposition='inside',
    textinfo='label+percent',
    hovertemplate='<b>%{label}</b><br>Percentage: %{percent}<extra></extra>'
)])

fig2.update_layout(
    title=f"Center Bias Analysis (Score: {center_bias_score:.2f})",
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5),
    template="plotly_white",
    height=400
)

print("   ✓ Center bias chart created")
fig2.show()

# ============================================================================
# 4. CHART 3: Grid Distribution (3x3)
# ============================================================================
print("\n4️⃣ Creating Grid Distribution (3x3)...")

# Divide into 3x3 grid
def get_grid_position(x, y):
    """Get grid position (0-8) for normalized coordinates"""
    row = min(int(y * 3), 2)  # 0, 1, 2
    col = min(int(x * 3), 2)  # 0, 1, 2
    return row * 3 + col

df['grid_pos'] = df.apply(lambda row: get_grid_position(row['center_x'], row['center_y']), axis=1)
grid_counts = df['grid_pos'].value_counts().sort_index()

# Create grid labels (Top-Left to Bottom-Right)
grid_labels = [
    'Top-Left', 'Top-Center', 'Top-Right',
    'Mid-Left', 'Center', 'Mid-Right',
    'Bottom-Left', 'Bottom-Center', 'Bottom-Right'
]

# Ensure all positions have a count (even if 0)
grid_values = [grid_counts.get(i, 0) for i in range(9)]

# Color: highlight center (position 4)
colors = ['#3b82f6'] * 9  # All blue
colors[4] = '#10b981'      # Center is green - matching web report

fig3 = go.Figure(data=[go.Bar(
    x=grid_labels,
    y=grid_values,
    marker_color=colors,
    text=grid_values,
    textposition='outside',
    hovertemplate='<b>%{x}</b><br>Count: %{y}<extra></extra>'
)])

fig3.update_layout(
    title="3×3 Grid Distribution",
    xaxis=dict(title="Grid Position", tickangle=-45),
    yaxis=dict(title="Count"),
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Grid distribution chart created")
fig3.show()

# ============================================================================
# 5. CHART 4: Normalized Area by Position
# ============================================================================
print("\n5️⃣ Creating Area Distribution by Position...")

fig4 = go.Figure()

fig4.add_trace(go.Scatter(
    x=df['center_x'],
    y=df['center_y'],
    mode='markers',
    marker=dict(
        size=df['normalized_area'] * 200,  # Scale for visibility
        color=df['normalized_area'],
        colorscale='Viridis',  # Nice gradient
        showscale=True,
        colorbar=dict(title="Normalized<br>Area"),
        opacity=0.6,
        line=dict(width=0.5, color='white')
    ),
    hovertemplate='<b>Position</b><br>X: %{x:.2f}<br>Y: %{y:.2f}<br>Area: %{marker.color:.3f}<extra></extra>'
))

fig4.update_layout(
    title="Bbox Area Distribution by Position",
    xaxis=dict(title="Normalized X Position", range=[0, 1]),
    yaxis=dict(title="Normalized Y Position", range=[0, 1]),
    template="plotly_white",
    height=500
)

print("   ✓ Area by position scatter plot created")
fig4.show()

# ============================================================================
# 6. STATISTICS SUMMARY
# ============================================================================
print("\n6️⃣ Statistics Summary:")
print("="*70)

print(f"🗺️ Spatial Distribution:")
print(f"   Position Centers:")
print(f"      • Mean X: {df['center_x'].mean():.3f} (±{df['center_x'].std():.3f})")
print(f"      • Mean Y: {df['center_y'].mean():.3f} (±{df['center_y'].std():.3f})")

print(f"\n   Center Bias Analysis:")
print(f"      • Center Region (25%-75%): {center_percentage:.1f}%")
print(f"      • Other Regions: {other_percentage:.1f}%")
print(f"      • Bias Score: {center_bias_score:.2f}")
if center_bias_score > 0.6:
    print(f"      ⚠️  Strong center bias detected!")
elif center_bias_score > 0.4:
    print(f"      ✓ Moderate center bias")
else:
    print(f"      ✓ Well-distributed annotations")

print(f"\n📊 3×3 Grid Distribution:")
for i, label in enumerate(grid_labels):
    count = grid_values[i]
    percentage = (count / len(df)) * 100
    marker = "🎯" if i == 4 else "  "
    print(f"      {marker} {label}: {count:,} ({percentage:.1f}%)")

print(f"\n📐 Normalized Coverage:")
print(f"   • Mean: {df['normalized_area'].mean():.3f}")
print(f"   • Median: {df['normalized_area'].median():.3f}")
print(f"   • Range: {df['normalized_area'].min():.3f} - {df['normalized_area'].max():.3f}")

print(f"\n🐱🐶 By Species:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • Count: {len(species_df):,}")
    print(f"      • Mean X: {species_df['center_x'].mean():.3f}")
    print(f"      • Mean Y: {species_df['center_y'].mean():.3f}")
    print(f"      • Mean coverage: {species_df['normalized_area'].mean():.3f}")

print("="*70)
print("✅ Spatial distribution analysis complete! Charts match web report.")
