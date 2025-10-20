"""
Segmentation EDA - Mask Overview (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/.../eda_segmentation.html

Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd

print("="*70)
print("🎨 SEGMENTATION EDA - Mask Overview (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading mask statistics from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/segmentation/mask_statistics.csv'
df = pd.read_csv(url)

print(f"   ✓ Loaded {len(df):,} segmentation masks")
print(f"   ✓ Breeds: {df['breed'].nunique()}")
print(f"   ✓ Species: {df['species'].unique().tolist()}")

# ============================================================================
# 2. DATASET OVERVIEW STATISTICS
# ============================================================================
print("\n2️⃣ Computing overview statistics...")

total_masks = len(df)
num_breeds = df['breed'].nunique()
num_species = df['species'].nunique()

# Count by species
species_counts = df['species'].value_counts().to_dict()

# Count by split
split_counts = df['split'].value_counts().to_dict()

print(f"   ✓ Total: {total_masks:,} masks")
print(f"   ✓ Breeds: {num_breeds}")
print(f"   ✓ Species: {num_species}")

# ============================================================================
# 3. CHART 1: Species Distribution
# ============================================================================
print("\n3️⃣ Creating Species Distribution Chart...")

# Colors matching web report
species_colors = {'cat': '#f59e0b', 'dog': '#3b82f6'}  # Orange for cats, Blue for dogs

fig1 = go.Figure(data=[go.Bar(
    x=[s.capitalize() for s in species_counts.keys()],
    y=list(species_counts.values()),
    marker=dict(color=[species_colors.get(s, '#10b981') for s in species_counts.keys()]),
    text=list(species_counts.values()),
    textposition='outside',
    hovertemplate='<b>%{x}</b><br>Count: %{y}<extra></extra>'
)])

fig1.update_layout(
    title="Species Distribution",
    xaxis_title="Species",
    yaxis_title="Count",
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Species distribution chart created")
fig1.show()

# ============================================================================
# 4. CHART 2: Split Distribution
# ============================================================================
print("\n4️⃣ Creating Split Distribution Chart...")

split_colors = {
    'train': '#3b82f6',  # Blue
    'val': '#10b981'     # Green
}

fig2 = go.Figure(data=[go.Bar(
    x=[s.capitalize() for s in split_counts.keys()],
    y=list(split_counts.values()),
    marker=dict(color=[split_colors.get(s, '#f59e0b') for s in split_counts.keys()]),
    text=list(split_counts.values()),
    textposition='outside',
    hovertemplate='<b>%{x}</b><br>Count: %{y}<extra></extra>'
)])

fig2.update_layout(
    title="Train/Val Split Distribution",
    xaxis_title="Split",
    yaxis_title="Count",
    template="plotly_white",
    height=400,
    showlegend=False
)

print("   ✓ Split distribution chart created")
fig2.show()

# ============================================================================
# 5. CHART 3: Overall Pixel Class Distribution (Trimap)
# ============================================================================
print("\n5️⃣ Creating Overall Pixel Class Distribution...")

# Calculate overall percentages
total_fg = df['fg_pixels'].sum()
total_boundary = df['boundary_pixels'].sum()
total_bg = df['bg_pixels'].sum()
total_pixels = total_fg + total_boundary + total_bg

fg_pct = (total_fg / total_pixels) * 100
boundary_pct = (total_boundary / total_pixels) * 100
bg_pct = (total_bg / total_pixels) * 100

# Trimap colors - EXACT matching web report
trimap_colors = {
    'Foreground': '#ef4444',   # Red - matching web report
    'Boundary': '#f59e0b',     # Orange - matching web report
    'Background': '#3b82f6'    # Blue - matching web report
}

fig3 = go.Figure(data=[go.Pie(
    labels=['Foreground', 'Boundary', 'Background'],
    values=[fg_pct, boundary_pct, bg_pct],
    marker=dict(colors=[trimap_colors['Foreground'], trimap_colors['Boundary'], trimap_colors['Background']]),
    hole=0.3,  # Donut chart matching web report
    textinfo='label+percent',
    textposition='auto',
    hovertemplate='<b>%{label}</b><br>Percentage: %{percent}<extra></extra>'
)])

fig3.update_layout(
    title="Trimap Pixel Class Distribution",
    showlegend=True,
    legend=dict(orientation="h", yanchor="bottom", y=-0.2, xanchor="center", x=0.5),
    template="plotly_white",
    height=400
)

print("   ✓ Pixel class distribution chart created")
fig3.show()

# ============================================================================
# 6. CHART 4: Average Mask Coverage by Breed
# ============================================================================
print("\n6️⃣ Creating Mask Coverage by Breed...")

# Calculate average coverage per breed
breed_coverage = df.groupby('breed')['mask_coverage'].mean().sort_values(ascending=True)

# Top 15 and bottom 15
top_n = 15
breeds_to_plot = pd.concat([breed_coverage.head(top_n), breed_coverage.tail(top_n)])

fig4 = go.Figure(data=[go.Bar(
    x=breeds_to_plot.values,
    y=[breed.replace('_', ' ').title() for breed in breeds_to_plot.index],
    orientation='h',
    marker_color='#10b981',  # Green - matching web report
    hovertemplate='<b>%{y}</b><br>Coverage: %{x:.1%}<extra></extra>'
)])

fig4.update_layout(
    title=f"Average Mask Coverage by Breed (Top & Bottom {top_n})",
    xaxis=dict(title="Mask Coverage (% of image)", tickformat='.0%'),
    yaxis=dict(title="Breed"),
    template="plotly_white",
    height=600,
    showlegend=False
)

print("   ✓ Mask coverage chart created")
fig4.show()

# ============================================================================
# 7. STATISTICS SUMMARY
# ============================================================================
print("\n7️⃣ Statistics Summary:")
print("="*70)

print(f"🎨 Segmentation Overview:")
print(f"   • Total Masks: {total_masks:,}")
print(f"   • Number of Breeds: {num_breeds}")
print(f"   • Number of Species: {num_species}")

print(f"\n🐱🐶 Species Distribution:")
for species, count in species_counts.items():
    percentage = (count / total_masks) * 100
    print(f"   • {species.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n📚 Split Distribution:")
for split_name, count in sorted(split_counts.items()):
    percentage = (count / total_masks) * 100
    print(f"   • {split_name.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n🎨 Trimap Pixel Class Distribution:")
print(f"   • Foreground: {fg_pct:.1f}% ({total_fg:,} pixels)")
print(f"   • Boundary: {boundary_pct:.1f}% ({total_boundary:,} pixels)")
print(f"   • Background: {bg_pct:.1f}% ({total_bg:,} pixels)")
print(f"   • Total pixels: {total_pixels:,}")

print(f"\n📏 Mask Coverage Statistics:")
print(f"   • Mean: {df['mask_coverage'].mean():.1%}")
print(f"   • Median: {df['mask_coverage'].median():.1%}")
print(f"   • Range: {df['mask_coverage'].min():.1%} - {df['mask_coverage'].max():.1%}")

print(f"\n💡 Trimap Explanation:")
print(f"   • Foreground (Red): Pet body pixels")
print(f"   • Boundary (Orange): Edge/transition pixels (2-3px thick)")
print(f"   • Background (Blue): Non-pet pixels")

print("="*70)
print("✅ Mask overview complete! Charts match web report.")
