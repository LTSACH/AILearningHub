"""
Segmentation EDA - Pixel Analysis (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/.../eda_segmentation.html

Analyzes foreground/boundary/background pixel distributions with exact trimap colors.
Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

print("="*70)
print("🔍 SEGMENTATION EDA - Pixel Analysis (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading pixel distribution data from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/segmentation/pixel_distribution.csv'
df = pd.read_csv(url)

print(f"   ✓ Loaded pixel stats for {len(df)} breeds")
print(f"   ✓ Columns: {list(df.columns[:8])}")

# ============================================================================
# 2. CHART 1: Class Distribution Statistics (Mean & Std)
# ============================================================================
print("\n2️⃣ Creating Class Distribution Statistics Chart...")

# Calculate overall statistics
classes = ['Foreground', 'Boundary', 'Background']
means = [
    df['fg_percentage_mean'].mean(),
    df['boundary_percentage_mean'].mean(),
    df['bg_percentage_mean'].mean()
]
stds = [
    df['fg_percentage_std'].mean(),
    df['boundary_percentage_std'].mean(),
    df['bg_percentage_std'].mean()
]

# Colors matching web report EXACTLY
fig1 = go.Figure(data=[
    go.Bar(
        name='Mean (%)',
        x=classes,
        y=means,
        marker_color='#3b82f6',  # Blue - matching web report
        text=[f"{val:.1f}%" for val in means],
        textposition='outside'
    ),
    go.Bar(
        name='Std Dev (%)',
        x=classes,
        y=stds,
        marker_color='#10b981',  # Green - matching web report
        text=[f"{val:.1f}%" for val in stds],
        textposition='outside'
    )
])

fig1.update_layout(
    title="Class Distribution Statistics",
    xaxis_title="Class",
    yaxis_title="Percentage (%)",
    barmode='group',
    template="plotly_white",
    height=400,
    showlegend=True,
    legend=dict(orientation='h', yanchor='top', y=1.1, xanchor='right', x=1)
)

print("   ✓ Class statistics chart created")
fig1.show()

# ============================================================================
# 3. CHART 2: Foreground Percentage Distribution
# ============================================================================
print("\n3️⃣ Creating Foreground Percentage Distribution...")

fig2 = go.Figure(data=[go.Histogram(
    x=df['fg_percentage_mean'],
    nbinsx=20,
    marker_color='#ef4444',  # Red - matching foreground color from web report
    opacity=0.75,
    name='Foreground %'
)])

fig2.update_layout(
    title="Foreground Percentage Distribution by Breed",
    xaxis_title="Foreground Percentage (%)",
    yaxis_title="Number of Breeds",
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Foreground distribution histogram created")
fig2.show()

# ============================================================================
# 4. CHART 3: Boundary Percentage Distribution
# ============================================================================
print("\n4️⃣ Creating Boundary Percentage Distribution...")

fig3 = go.Figure(data=[go.Histogram(
    x=df['boundary_percentage_mean'],
    nbinsx=20,
    marker_color='#f59e0b',  # Orange - matching boundary color from web report
    opacity=0.75,
    name='Boundary %'
)])

fig3.update_layout(
    title="Boundary Percentage Distribution by Breed",
    xaxis_title="Boundary Percentage (%)",
    yaxis_title="Number of Breeds",
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Boundary distribution histogram created")
fig3.show()

# ============================================================================
# 5. CHART 4: Background Percentage Distribution
# ============================================================================
print("\n5️⃣ Creating Background Percentage Distribution...")

fig4 = go.Figure(data=[go.Histogram(
    x=df['bg_percentage_mean'],
    nbinsx=20,
    marker_color='#3b82f6',  # Blue - matching background color from web report
    opacity=0.75,
    name='Background %'
)])

fig4.update_layout(
    title="Background Percentage Distribution by Breed",
    xaxis_title="Background Percentage (%)",
    yaxis_title="Number of Breeds",
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Background distribution histogram created")
fig4.show()

# ============================================================================
# 6. CHART 5: Pixel Class Comparison (Box Plot)
# ============================================================================
print("\n6️⃣ Creating Pixel Class Comparison Box Plot...")

fig5 = go.Figure()

# Trimap colors - EXACT matching web report
trimap_colors = {
    'Foreground': '#ef4444',   # Red
    'Boundary': '#f59e0b',     # Orange
    'Background': '#3b82f6'    # Blue
}

fig5.add_trace(go.Box(
    y=df['fg_percentage_mean'],
    name='Foreground',
    marker_color=trimap_colors['Foreground'],
    boxmean='sd'  # Show mean and std
))

fig5.add_trace(go.Box(
    y=df['boundary_percentage_mean'],
    name='Boundary',
    marker_color=trimap_colors['Boundary'],
    boxmean='sd'
))

fig5.add_trace(go.Box(
    y=df['bg_percentage_mean'],
    name='Background',
    marker_color=trimap_colors['Background'],
    boxmean='sd'
))

fig5.update_layout(
    title="Pixel Class Distribution Across Breeds",
    yaxis_title="Percentage (%)",
    template="plotly_white",
    height=400,
    showlegend=True
)

print("   ✓ Box plot comparison created")
fig5.show()

# ============================================================================
# 7. CHART 6: Breed-wise Pixel Composition (Stacked Bar)
# ============================================================================
print("\n7️⃣ Creating Breed-wise Pixel Composition...")

# Select top 20 breeds by count for visualization
df_top = df.nlargest(20, 'count')

fig6 = go.Figure()

fig6.add_trace(go.Bar(
    name='Foreground',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['fg_percentage_mean'],
    marker_color=trimap_colors['Foreground'],
    hovertemplate='<b>%{x}</b><br>Foreground: %{y:.1f}%<extra></extra>'
))

fig6.add_trace(go.Bar(
    name='Boundary',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['boundary_percentage_mean'],
    marker_color=trimap_colors['Boundary'],
    hovertemplate='<b>%{x}</b><br>Boundary: %{y:.1f}%<extra></extra>'
))

fig6.add_trace(go.Bar(
    name='Background',
    x=[breed.replace('_', ' ').title() for breed in df_top['breed']],
    y=df_top['bg_percentage_mean'],
    marker_color=trimap_colors['Background'],
    hovertemplate='<b>%{x}</b><br>Background: %{y:.1f}%<extra></extra>'
))

fig6.update_layout(
    title="Pixel Composition by Breed (Top 20)",
    xaxis=dict(title="Breed", tickangle=-45),
    yaxis=dict(title="Percentage (%)"),
    barmode='stack',
    template="plotly_white",
    height=500,
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

print("   ✓ Breed composition chart created")
fig6.show()

# ============================================================================
# 8. STATISTICS SUMMARY
# ============================================================================
print("\n8️⃣ Statistics Summary:")
print("="*70)

print(f"🔍 Pixel Class Analysis:")
print(f"   Foreground (Pet Body):")
print(f"      • Mean: {df['fg_percentage_mean'].mean():.1f}% (±{df['fg_percentage_std'].mean():.1f}%)")
print(f"      • Median: {df['fg_percentage_mean'].median():.1f}%")
print(f"      • Range: {df['fg_percentage_min'].min():.1f}% - {df['fg_percentage_max'].max():.1f}%")

print(f"\n   Boundary (Edge Pixels):")
print(f"      • Mean: {df['boundary_percentage_mean'].mean():.1f}% (±{df['boundary_percentage_std'].mean():.1f}%)")
print(f"      • Median: {df['boundary_percentage_mean'].median():.1f}%")
print(f"      • Range: {df['boundary_percentage_min'].min():.1f}% - {df['boundary_percentage_max'].max():.1f}%")

print(f"\n   Background (Non-pet):")
print(f"      • Mean: {df['bg_percentage_mean'].mean():.1f}% (±{df['bg_percentage_std'].mean():.1f}%)")
print(f"      • Median: {df['bg_percentage_mean'].median():.1f}%")
print(f"      • Range: {df['bg_percentage_min'].min():.1f}% - {df['bg_percentage_max'].max():.1f}%")

print(f"\n📊 Mask Coverage:")
print(f"      • Mean: {df['mask_coverage_mean'].mean():.1%}")
print(f"      • Std: {df['mask_coverage_std'].mean():.3f}")

print(f"\n🏆 Top 5 Breeds by Foreground %:")
top_fg = df.nlargest(5, 'fg_percentage_mean')
for idx, row in top_fg.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: {row['fg_percentage_mean']:.1f}%")

print(f"\n⬇️ Bottom 5 Breeds by Foreground %:")
bottom_fg = df.nsmallest(5, 'fg_percentage_mean')
for idx, row in bottom_fg.iterrows():
    print(f"      {row['breed'].replace('_', ' ').title()}: {row['fg_percentage_mean']:.1f}%")

print(f"\n💡 Interpretation:")
print(f"   • Higher foreground % = pet fills more of the image")
print(f"   • Higher boundary % = more complex pet shapes")
print(f"   • Higher background % = smaller pets or more negative space")

print("="*70)
print("✅ Pixel analysis complete! Charts match web report.")

