"""
Detection EDA - Bounding Box Properties Analysis (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/.../eda_detection.html

Analyzes bbox dimensions, aspect ratios, area distributions with exact colors from web report.
Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

print("="*70)
print("📏 DETECTION EDA - Bounding Box Properties (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading bbox statistics from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv'
df = pd.read_csv(url)

print(f"   ✓ Loaded {len(df):,} bounding boxes")
print(f"   ✓ Columns: {list(df.columns[:10])}")

# ============================================================================
# 2. CHART 1: Bbox Size Statistics (Width & Height)
# ============================================================================
print("\n2️⃣ Creating Bbox Size Statistics Chart...")

# Compute statistics
width_stats = {
    'mean': df['width'].mean(),
    'median': df['width'].median()
}
height_stats = {
    'mean': df['height'].mean(),
    'median': df['height'].median()
}

# Colors matching web report EXACTLY
fig1 = go.Figure(data=[
    go.Bar(
        x=['Mean', 'Median'],
        y=[width_stats['mean'], width_stats['median']],
        name='Width (pixels)',
        marker_color='#3b82f6',  # Blue - matching web report
        text=[f"{width_stats['mean']:.1f}", f"{width_stats['median']:.1f}"],
        textposition='outside'
    ),
    go.Bar(
        x=['Mean', 'Median'],
        y=[height_stats['mean'], height_stats['median']],
        name='Height (pixels)',
        marker_color='#10b981',  # Green - matching web report
        text=[f"{height_stats['mean']:.1f}", f"{height_stats['median']:.1f}"],
        textposition='outside'
    )
])

fig1.update_layout(
    title="Bounding Box Size Statistics",
    xaxis_title="Statistic",
    yaxis=dict(title="Pixels", rangemode="tozero"),
    barmode='group',
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    template="plotly_white",
    height=400
)

print("   ✓ Size statistics chart created")
fig1.show()

# ============================================================================
# 3. CHART 2: Aspect Ratio Distribution (Donut Chart)
# ============================================================================
print("\n3️⃣ Creating Aspect Ratio Distribution...")

# Categorize aspect ratios
def categorize_aspect_ratio(ar):
    if ar < 0.9:
        return 'portrait'
    elif ar > 1.1:
        return 'landscape'
    else:
        return 'square'

df['ar_category'] = df['aspect_ratio'].apply(categorize_aspect_ratio)
ar_counts = df['ar_category'].value_counts().to_dict()

# Colors matching web report EXACTLY
ar_colors = {
    'landscape': '#f59e0b',  # Orange
    'square': '#10b981',     # Green
    'portrait': '#ef4444'    # Red
}

fig2 = go.Figure(data=[go.Pie(
    labels=[cat.capitalize() for cat in ar_counts.keys()],
    values=list(ar_counts.values()),
    marker=dict(colors=[ar_colors.get(cat, '#10b981') for cat in ar_counts.keys()]),
    hole=0.4,  # Donut chart - matching web report
    textposition='inside',
    textinfo='label+percent',
    hovertemplate='<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
)])

fig2.update_layout(
    title="Aspect Ratio Distribution",
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5),
    template="plotly_white",
    height=400
)

print("   ✓ Aspect ratio chart created")
fig2.show()

# ============================================================================
# 4. CHART 3: Area Distribution Histogram
# ============================================================================
print("\n4️⃣ Creating Area Distribution Histogram...")

fig3 = go.Figure(data=[go.Histogram(
    x=df['area'],
    nbinsx=50,
    marker_color='#3b82f6',  # Blue - matching web report
    opacity=0.75,
    name='Area'
)])

fig3.update_layout(
    title="Bounding Box Area Distribution",
    xaxis_title="Area (pixels²)",
    yaxis_title="Count",
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Area distribution chart created")
fig3.show()

# ============================================================================
# 5. CHART 4: Width vs Height Scatter Plot
# ============================================================================
print("\n5️⃣ Creating Width vs Height Scatter Plot...")

# Color by size category
size_colors = {
    'small': '#f59e0b',
    'medium': '#10b981',
    'large': '#3b82f6'
}

fig4 = go.Figure()

for size_cat in df['size_category'].unique():
    subset = df[df['size_category'] == size_cat]
    fig4.add_trace(go.Scatter(
        x=subset['width'],
        y=subset['height'],
        mode='markers',
        name=size_cat.capitalize(),
        marker=dict(
            size=6,
            color=size_colors.get(size_cat, '#10b981'),
            opacity=0.6,
            line=dict(width=0.5, color='white')
        ),
        hovertemplate='<b>%{text}</b><br>Width: %{x}<br>Height: %{y}<extra></extra>',
        text=[size_cat.capitalize()] * len(subset)
    ))

fig4.update_layout(
    title="Width vs Height Distribution",
    xaxis_title="Width (pixels)",
    yaxis_title="Height (pixels)",
    template="plotly_white",
    height=500,
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
)

print("   ✓ Width vs Height scatter plot created")
fig4.show()

# ============================================================================
# 6. STATISTICS SUMMARY
# ============================================================================
print("\n6️⃣ Statistics Summary:")
print("="*70)

print(f"📏 Bounding Box Dimensions:")
print(f"   Width:")
print(f"      • Mean: {df['width'].mean():.1f} px (±{df['width'].std():.1f})")
print(f"      • Median: {df['width'].median():.1f} px")
print(f"      • Range: {df['width'].min():.0f} - {df['width'].max():.0f} px")
print(f"   Height:")
print(f"      • Mean: {df['height'].mean():.1f} px (±{df['height'].std():.1f})")
print(f"      • Median: {df['height'].median():.1f} px")
print(f"      • Range: {df['height'].min():.0f} - {df['height'].max():.0f} px")

print(f"\n📐 Aspect Ratios:")
print(f"   • Mean: {df['aspect_ratio'].mean():.2f}")
print(f"   • Median: {df['aspect_ratio'].median():.2f}")
print(f"   • Range: {df['aspect_ratio'].min():.2f} - {df['aspect_ratio'].max():.2f}")
print(f"\n   Distribution:")
for cat, count in ar_counts.items():
    percentage = (count / len(df)) * 100
    print(f"      • {cat.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n📊 Areas:")
print(f"   • Mean: {df['area'].mean():.1f} px²")
print(f"   • Median: {df['area'].median():.1f} px²")
print(f"   • Range: {df['area'].min():.0f} - {df['area'].max():.0f} px²")

print(f"\n🐱🐶 By Species:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • Count: {len(species_df):,}")
    print(f"      • Mean width: {species_df['width'].mean():.1f} px")
    print(f"      • Mean height: {species_df['height'].mean():.1f} px")
    print(f"      • Mean area: {species_df['area'].mean():.1f} px²")

print("="*70)
print("✅ Bbox properties analysis complete! Charts match web report.")
