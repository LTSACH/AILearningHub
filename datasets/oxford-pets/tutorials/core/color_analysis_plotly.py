"""
Core EDA - Color Space Analysis & Quality Metrics (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_core.html

Run this in Google Colab:
1. Copy & paste entire code
2. Run cell
3. See exact same charts as web report!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

print("="*70)
print("🎨 CORE EDA - Color Space Analysis & Quality Metrics (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading color analysis data from GitHub Pages...")

# Load main image statistics (has brightness, contrast, sharpness)
url_stats = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/core/image_statistics.csv'
df = pd.read_csv(url_stats)
print(f"   ✓ Loaded {len(df):,} images")
print(f"   ✓ Color columns: mean_r, mean_g, mean_b, brightness, contrast, sharpness")

# ============================================================================
# 2. CHART 1: 3D Color Space Distribution (RGB Cube)
# ============================================================================
print("\n2️⃣ Creating 3D Color Space chart...")

fig1 = go.Figure(data=[go.Scatter3d(
    x=df['mean_r'],
    y=df['mean_g'],
    z=df['mean_b'],
    mode='markers',
    marker=dict(
        size=5,
        color=df['brightness'],  # Color by brightness
        colorscale='Viridis',
        opacity=0.6,
        colorbar=dict(title="Brightness", thickness=15, len=0.7)
    ),
    text=df['breed'],
    hovertemplate='<b>%{text}</b><br>' +
                 'R: %{x:.1f}<br>' +
                 'G: %{y:.1f}<br>' +
                 'B: %{z:.1f}<br>' +
                 'Brightness: %{marker.color:.1f}<extra></extra>'
)])

fig1.update_layout(
    title="Color Space Distribution (RGB)",
    scene=dict(
        xaxis=dict(title='Red Channel', range=[0, 255]),
        yaxis=dict(title='Green Channel', range=[0, 255]),
        zaxis=dict(title='Blue Channel', range=[0, 255]),
        bgcolor='rgba(240, 240, 240, 0.9)'
    ),
    width=800,
    height=600,
    showlegend=False,
    hovermode='closest'
)

print("   ✓ 3D color space chart created")
fig1.show()

# ============================================================================
# 3. CHART 2: Image Quality Metrics (Sharpness vs Contrast)
# ============================================================================
print("\n3️⃣ Creating Quality Metrics chart...")

# Colors matching web report
colors = {'cat': '#f59e0b', 'dog': '#3b82f6'}

fig2 = go.Figure()

# Add scatter traces for each species
for species in df['species'].unique():
    species_data = df[df['species'] == species]
    
    fig2.add_trace(go.Scatter(
        x=species_data['sharpness'],
        y=species_data['contrast'],
        mode='markers',
        name=species.capitalize(),
        marker=dict(
            color=colors.get(species, '#10b981'),
            size=8,
            opacity=0.6,
            line=dict(width=0.5, color='white')
        ),
        text=species_data['breed'],
        hovertemplate='<b>%{text}</b><br>' +
                     'Sharpness: %{x:.1f}<br>' +
                     'Contrast: %{y:.1f}<extra></extra>'
    ))

fig2.update_layout(
    title="Image Quality Metrics",
    xaxis=dict(
        title="Sharpness (Laplacian Variance)",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    yaxis=dict(
        title="Contrast (Standard Deviation)",
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    width=800,
    height=500,
    showlegend=True,
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="right",
        x=1
    ),
    template="plotly_white",
    hovermode="closest"
)

print("   ✓ Quality metrics chart created")
fig2.show()

# ============================================================================
# 4. CHART 3: RGB Channel Distribution (Box Plots)
# ============================================================================
print("\n4️⃣ Creating RGB Channel Distribution chart...")

fig3 = go.Figure()

# Add box plots for each channel
channels = {
    'Red': ('mean_r', '#ef4444'),
    'Green': ('mean_g', '#22c55e'),
    'Blue': ('mean_b', '#3b82f6')
}

for channel_name, (col, color) in channels.items():
    fig3.add_trace(go.Box(
        y=df[col],
        name=channel_name,
        marker_color=color,
        boxmean='sd'  # Show mean and std
    ))

fig3.update_layout(
    title="RGB Channel Value Distribution",
    yaxis=dict(
        title="Channel Value (0-255)",
        range=[0, 255],
        showgrid=True,
        gridcolor="#f0f0f0"
    ),
    xaxis=dict(title="Channel"),
    width=800,
    height=500,
    template="plotly_white",
    showlegend=False
)

print("   ✓ RGB distribution chart created")
fig3.show()

# ============================================================================
# 5. CHART 4: Brightness & Contrast Distribution by Species
# ============================================================================
print("\n5️⃣ Creating Brightness & Contrast Distribution chart...")

fig4 = make_subplots(
    rows=1, cols=2,
    subplot_titles=('Brightness Distribution', 'Contrast Distribution')
)

# Brightness histogram
for species in df['species'].unique():
    species_data = df[df['species'] == species]
    
    fig4.add_trace(
        go.Histogram(
            x=species_data['brightness'],
            name=species.capitalize(),
            marker_color=colors.get(species, '#10b981'),
            opacity=0.7,
            nbinsx=30
        ),
        row=1, col=1
    )
    
    # Contrast histogram
    fig4.add_trace(
        go.Histogram(
            x=species_data['contrast'],
            name=species.capitalize(),
            marker_color=colors.get(species, '#10b981'),
            opacity=0.7,
            nbinsx=30,
            showlegend=False
        ),
        row=1, col=2
    )

fig4.update_xaxes(title_text="Brightness", row=1, col=1)
fig4.update_xaxes(title_text="Contrast (Std Dev)", row=1, col=2)
fig4.update_yaxes(title_text="Count", row=1, col=1)
fig4.update_yaxes(title_text="Count", row=1, col=2)

fig4.update_layout(
    height=400,
    width=1000,
    barmode='overlay',
    template="plotly_white",
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.08,
        xanchor="center",
        x=0.5
    )
)

print("   ✓ Brightness/Contrast distribution created")
fig4.show()

# ============================================================================
# 6. STATISTICS SUMMARY
# ============================================================================
print("\n6️⃣ Statistics Summary:")
print("="*70)

print(f"🎨 Color Statistics:")
print(f"   Red Channel:")
print(f"      • Mean: {df['mean_r'].mean():.1f} (±{df['mean_r'].std():.1f})")
print(f"      • Range: {df['mean_r'].min():.1f} - {df['mean_r'].max():.1f}")
print(f"   Green Channel:")
print(f"      • Mean: {df['mean_g'].mean():.1f} (±{df['mean_g'].std():.1f})")
print(f"      • Range: {df['mean_g'].min():.1f} - {df['mean_g'].max():.1f}")
print(f"   Blue Channel:")
print(f"      • Mean: {df['mean_b'].mean():.1f} (±{df['mean_b'].std():.1f})")
print(f"      • Range: {df['mean_b'].min():.1f} - {df['mean_b'].max():.1f}")

print(f"\n💡 Quality Metrics:")
print(f"   Brightness:")
print(f"      • Mean: {df['brightness'].mean():.1f} (±{df['brightness'].std():.1f})")
print(f"      • Range: {df['brightness'].min():.1f} - {df['brightness'].max():.1f}")
print(f"   Contrast:")
print(f"      • Mean: {df['contrast'].mean():.1f} (±{df['contrast'].std():.1f})")
print(f"      • Range: {df['contrast'].min():.1f} - {df['contrast'].max():.1f}")
print(f"   Sharpness:")
print(f"      • Mean: {df['sharpness'].mean():.1f} (±{df['sharpness'].std():.1f})")
print(f"      • Range: {df['sharpness'].min():.1f} - {df['sharpness'].max():.1f}")

print("\n🐱🐶 By Species:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • Mean RGB: ({species_df['mean_r'].mean():.1f}, {species_df['mean_g'].mean():.1f}, {species_df['mean_b'].mean():.1f})")
    print(f"      • Brightness: {species_df['brightness'].mean():.1f}")
    print(f"      • Contrast: {species_df['contrast'].mean():.1f}")
    print(f"      • Sharpness: {species_df['sharpness'].mean():.1f}")

print("="*70)
print("✅ Analysis complete! Charts match web report.")
