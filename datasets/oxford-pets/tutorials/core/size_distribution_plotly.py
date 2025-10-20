"""
Core EDA - Image Size Distribution Analysis (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_core.html

Run this in Google Colab:
1. Copy & paste entire code
2. Run cell
3. See exact same charts as web report!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd

print("="*70)
print("📊 CORE EDA - Image Size Distribution Analysis (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading image statistics from GitHub Pages...")
url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/core/image_statistics.csv'
df = pd.read_csv(url)
print(f"   ✓ Loaded {len(df):,} images")
print(f"   ✓ Columns: {', '.join(df.columns[:10])}")

# ============================================================================
# 2. CHART 1: Size Marginal (Width vs Height Scatter Plot)
# ============================================================================
print("\n2️⃣ Creating Size Distribution chart...")

# Colors matching web report
colors = {'cat': '#f59e0b', 'dog': '#3b82f6'}  # Orange for cats, Blue for dogs

fig1 = go.Figure()

# Add scatter traces for each species
for species in df['species'].unique():
    species_data = df[df['species'] == species]
    
    fig1.add_trace(go.Scatter(
        x=species_data['width'],
        y=species_data['height'],
        mode='markers',
        name=species.capitalize(),
        marker=dict(
            color=colors.get(species, '#10b981'),
            size=6,
            opacity=0.6,
            line=dict(width=0.5, color='white')
        ),
        text=species_data['breed'],
        hovertemplate='<b>%{text}</b><br>Width: %{x} px<br>Height: %{y} px<extra></extra>'
    ))

fig1.update_layout(
    title="Image Size Distribution (Width x Height)",
    xaxis=dict(
        title="Width (pixels)",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    yaxis=dict(
        title="Height (pixels)",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    showlegend=True,
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="right",
        x=1
    ),
    template="plotly_white",
    height=600,
    hovermode="closest"
)

print("   ✓ Size marginal chart created")
fig1.show()

# ============================================================================
# 3. CHART 2: File Size Distribution Histogram
# ============================================================================
print("\n3️⃣ Creating File Size Distribution chart...")

fig2 = go.Figure()

# Add histogram traces for each species
for species in df['species'].unique():
    species_data = df[df['species'] == species]
    
    fig2.add_trace(go.Histogram(
        x=species_data['file_size_kb'],
        name=species.capitalize(),
        opacity=0.7,
        marker=dict(color=colors.get(species, '#10b981')),
        nbinsx=30
    ))

fig2.update_layout(
    title="File Size Distribution",
    xaxis=dict(
        title="File Size (KB)",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    yaxis=dict(
        title="Count",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    barmode="overlay",
    showlegend=True,
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="right",
        x=1
    ),
    template="plotly_white",
    height=400
)

print("   ✓ File size histogram created")
fig2.show()

# ============================================================================
# 4. CHART 3: Aspect Ratio Distribution
# ============================================================================
print("\n4️⃣ Creating Aspect Ratio Distribution chart...")

fig3 = go.Figure()

# Add histogram traces for each species
for species in df['species'].unique():
    species_data = df[df['species'] == species]
    
    fig3.add_trace(go.Histogram(
        x=species_data['aspect_ratio'],
        name=species.capitalize(),
        opacity=0.7,
        marker=dict(color=colors.get(species, '#10b981')),
        nbinsx=30
    ))

# Add vertical lines for common aspect ratios
common_ratios = [0.75, 1.0, 1.33, 1.5, 2.0]
shapes = []
annotations = []

for ratio in common_ratios:
    shapes.append(dict(
        type="line",
        x0=ratio, y0=0,
        x1=ratio, y1=1,
        yref="paper",
        line=dict(color="red", width=1, dash="dash")
    ))
    annotations.append(dict(
        x=ratio, y=1,
        yref="paper",
        text=f"{ratio}:1",
        showarrow=False,
        yanchor="bottom",
        font=dict(size=10, color="red")
    ))

fig3.update_layout(
    title="Aspect Ratio Distribution",
    xaxis=dict(
        title="Aspect Ratio (Width/Height)",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    yaxis=dict(
        title="Count",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    barmode="overlay",
    showlegend=True,
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="right",
        x=1
    ),
    template="plotly_white",
    height=400,
    shapes=shapes,
    annotations=annotations
)

print("   ✓ Aspect ratio histogram created")
fig3.show()

# ============================================================================
# 5. STATISTICS (Matching Web Report)
# ============================================================================
print("\n5️⃣ Statistics Summary:")
print("="*70)
print(f"📊 Total Images: {len(df):,}")
print(f"   • Cats: {len(df[df['species']=='cat']):,}")
print(f"   • Dogs: {len(df[df['species']=='dog']):,}")
print(f"\n📐 Dimensions:")
print(f"   • Mean width: {df['width'].mean():.1f} px (std: {df['width'].std():.1f})")
print(f"   • Mean height: {df['height'].mean():.1f} px (std: {df['height'].std():.1f})")
print(f"   • Min size: {df['width'].min()} x {df['height'].min()} px")
print(f"   • Max size: {df['width'].max()} x {df['height'].max()} px")
print(f"\n💾 File Sizes:")
print(f"   • Mean: {df['file_size_kb'].mean():.1f} KB")
print(f"   • Median: {df['file_size_kb'].median():.1f} KB")
print(f"   • Total: {df['file_size_kb'].sum()/1024:.1f} MB")
print(f"\n📏 Aspect Ratios:")
print(f"   • Mean: {df['aspect_ratio'].mean():.2f}")
print(f"   • Median: {df['aspect_ratio'].median():.2f}")
print(f"   • Range: {df['aspect_ratio'].min():.2f} - {df['aspect_ratio'].max():.2f}")
print("="*70)
print("✅ Analysis complete! Charts match web report.")
