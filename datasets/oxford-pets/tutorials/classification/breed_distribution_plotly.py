"""
Classification EDA - Breed Distribution Analysis (Plotly)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_classification.html

Run this in Google Colab - Copy & paste entire code!
"""

import plotly.graph_objects as go
import pandas as pd
import numpy as np

print("="*70)
print("📊 CLASSIFICATION EDA - Breed Distribution (Plotly)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading dataset metadata from GitHub Pages...")

url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/data/full_metadata.csv'
df = pd.read_csv(url)
print(f"   ✓ Loaded {len(df):,} images")
print(f"   ✓ Breeds: {df['breed'].nunique()}")

# ============================================================================
# 2. COMPUTE BREED DISTRIBUTION
# ============================================================================
print("\n2️⃣ Computing breed distribution...")

breed_counts = df['breed'].value_counts().to_dict()
sorted_breeds = sorted(breed_counts.items(), key=lambda x: x[1], reverse=True)

breeds = [breed.replace('_', ' ').title() for breed, _ in sorted_breeds]
counts = [count for _, count in sorted_breeds]

print(f"   ✓ Analyzed {len(breeds)} breeds")
print(f"   ✓ Range: {min(counts)} - {max(counts)} images per breed")

# ============================================================================
# 3. CHART 1: Complete Breed Distribution (All 37 Breeds)
# ============================================================================
print("\n3️⃣ Creating Breed Distribution Bar Chart...")

# Generate gradient colors (blue to purple) - matching web report
colors = []
for i in range(len(breeds)):
    hue = 200 + (i / len(breeds)) * 60  # 200 (blue) to 260 (purple)
    colors.append(f'hsl({hue:.0f}, 70%, 60%)')

fig1 = go.Figure(data=[go.Bar(
    x=breeds,
    y=counts,
    marker=dict(
        color=colors,
        line=dict(width=1, color='white')
    ),
    text=counts,
    textposition='outside',
    textfont=dict(size=10),
    hovertemplate='<b>%{x}</b><br>Count: %{y}<extra></extra>'
)])

fig1.update_layout(
    title=dict(
        text="Breed Distribution (All 37 Breeds)",
        font=dict(size=18)
    ),
    xaxis=dict(
        title='Breed',
        tickangle=-45,
        gridcolor='#f0f0f0',
        tickfont=dict(size=9)
    ),
    yaxis=dict(
        title='Count',
        gridcolor='#f0f0f0'
    ),
    plot_bgcolor='#ffffff',
    paper_bgcolor='#ffffff',
    hovermode='closest',
    margin=dict(t=60, r=20, b=120, l=60),
    height=600
)

print("   ✓ Complete breed distribution chart created")
fig1.show()

# ============================================================================
# 4. CHART 2: Top 20 Breeds
# ============================================================================
print("\n4️⃣ Creating Top 20 Breeds Chart...")

top_20_breeds = breeds[:20]
top_20_counts = counts[:20]
top_20_colors = colors[:20]

fig2 = go.Figure(data=[go.Bar(
    x=top_20_breeds,
    y=top_20_counts,
    marker=dict(
        color=top_20_colors,
        line=dict(width=1, color='white')
    ),
    text=top_20_counts,
    textposition='outside',
    hovertemplate='<b>%{x}</b><br>Count: %{y}<extra></extra>'
)])

fig2.update_layout(
    title="Breed Distribution (Top 20)",
    xaxis=dict(
        title='Breed',
        tickangle=-45,
        gridcolor='#f0f0f0'
    ),
    yaxis=dict(
        title='Count',
        gridcolor='#f0f0f0'
    ),
    plot_bgcolor='#ffffff',
    paper_bgcolor='#ffffff',
    height=500
)

print("   ✓ Top 20 breeds chart created")
fig2.show()

# ============================================================================
# 5. CLASS BALANCE ANALYSIS
# ============================================================================
print("\n5️⃣ Class Balance Analysis:")
print("="*70)

max_count = max(counts)
min_count = min(counts)
mean_count = np.mean(counts)
std_count = np.std(counts)
imbalance_ratio = max_count / min_count if min_count > 0 else 0

print(f"📊 Class Balance Metrics:")
print(f"   • Max count: {max_count} ({breeds[counts.index(max_count)]})")
print(f"   • Min count: {min_count} ({breeds[counts.index(min_count)]})")
print(f"   • Mean count: {mean_count:.1f}")
print(f"   • Std deviation: {std_count:.1f}")
print(f"   • Imbalance ratio: {imbalance_ratio:.2f}x")

# Determine balance level
if imbalance_ratio < 2:
    level = "✅ Balanced"
elif imbalance_ratio < 5:
    level = "⚠️  Moderately Imbalanced"
else:
    level = "❌ Severely Imbalanced"

print(f"   • Balance level: {level}")

# ============================================================================
# 6. BREED STATISTICS BY SPECIES
# ============================================================================
print(f"\n🐱🐶 Breeds by Species:")

for species in ['cat', 'dog']:
    species_df = df[df['species'] == species]
    species_breeds = species_df['breed'].nunique()
    species_images = len(species_df)
    avg_per_breed = species_images / species_breeds if species_breeds > 0 else 0
    
    print(f"   {species.capitalize()}:")
    print(f"      • Breeds: {species_breeds}")
    print(f"      • Total images: {species_images:,}")
    print(f"      • Avg per breed: {avg_per_breed:.1f}")

# ============================================================================
# 7. TOP & BOTTOM BREEDS
# ============================================================================
print(f"\n🔝 Top 10 Most Common Breeds:")
for i in range(min(10, len(breeds))):
    percentage = (counts[i] / len(df)) * 100
    print(f"   {i+1:2d}. {breeds[i]:30s}: {counts[i]:3d} ({percentage:5.2f}%)")

print(f"\n⬇️  Bottom 10 Least Common Breeds:")
for i in range(max(0, len(breeds)-10), len(breeds)):
    percentage = (counts[i] / len(df)) * 100
    print(f"   {len(breeds)-i:2d}. {breeds[i]:30s}: {counts[i]:3d} ({percentage:5.2f}%)")

print("="*70)
print("✅ Breed distribution analysis complete! Charts match web report.")
