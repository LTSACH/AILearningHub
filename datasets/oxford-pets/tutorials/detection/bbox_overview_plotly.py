"""
Detection EDA - Bounding Box Overview (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/.../eda_detection.html

Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd

print("="*70)
print("📦 DETECTION EDA - Bounding Box Overview (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading bbox statistics from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/detection/bbox_statistics.csv'
df = pd.read_csv(url)

print(f"   ✓ Loaded {len(df):,} bounding boxes")
print(f"   ✓ Breeds: {df['breed'].nunique()}")
print(f"   ✓ Species: {df['species'].unique().tolist()}")

# ============================================================================
# 2. DATASET OVERVIEW STATISTICS
# ============================================================================
print("\n2️⃣ Computing overview statistics...")

total_boxes = len(df)
num_breeds = df['breed'].nunique()
num_species = df['species'].nunique()

# Count by species
species_counts = df['species'].value_counts().to_dict()

# Count by split
split_counts = df['split'].value_counts().to_dict()

print(f"   ✓ Total: {total_boxes:,} annotations")
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

# Only train and val have annotations (test doesn't have bbox annotations)
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
# 5. CHART 3: Size Category Distribution
# ============================================================================
print("\n5️⃣ Creating Size Category Distribution...")

size_counts = df['size_category'].value_counts().to_dict()

# COCO-style size categories
size_colors = {
    'small': '#f59e0b',    # Orange
    'medium': '#10b981',   # Green
    'large': '#3b82f6'     # Blue
}

fig3 = go.Figure(data=[go.Pie(
    labels=[s.capitalize() for s in size_counts.keys()],
    values=list(size_counts.values()),
    marker=dict(colors=[size_colors.get(s, '#10b981') for s in size_counts.keys()]),
    textinfo='label+percent',
    textposition='outside',
    hovertemplate='<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>',
    hole=0.4  # Donut chart matching web report
)])

fig3.update_layout(
    title="COCO-Style Size Category Distribution",
    showlegend=True,
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=-0.2,
        xanchor="center",
        x=0.5
    ),
    template="plotly_white",
    height=400
)

print("   ✓ Size category chart created")
fig3.show()

# ============================================================================
# 6. STATISTICS SUMMARY
# ============================================================================
print("\n6️⃣ Statistics Summary:")
print("="*70)

print(f"📦 Detection Overview:")
print(f"   • Total Annotations: {total_boxes:,}")
print(f"   • Number of Breeds: {num_breeds}")
print(f"   • Number of Species: {num_species}")

print(f"\n🐱🐶 Species Distribution:")
for species, count in species_counts.items():
    percentage = (count / total_boxes) * 100
    print(f"   • {species.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n📚 Split Distribution:")
for split_name, count in sorted(split_counts.items()):
    percentage = (count / total_boxes) * 100
    print(f"   • {split_name.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n📏 Size Categories (COCO-style):")
for size_cat, count in size_counts.items():
    percentage = (count / total_boxes) * 100
    print(f"   • {size_cat.capitalize()}: {count:,} ({percentage:.1f}%)")

print(f"\n💡 COCO Size Definitions:")
print(f"   • Small: area < 32² pixels")
print(f"   • Medium: 32² ≤ area < 96² pixels")
print(f"   • Large: area ≥ 96² pixels")

print("="*70)
print("✅ Bounding box overview complete! Charts match web report.")
