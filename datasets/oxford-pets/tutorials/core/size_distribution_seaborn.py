"""
Core EDA - Image Size Distribution Analysis (Seaborn)
Reproduces charts from: https://ltsach.github.io/AILearningHub/01_Data_Analysis/01_EDA/oxford_pets_classification/eda_core.html

Run this in Google Colab:
1. Copy & paste entire code
2. Run cell
3. See exact same charts as web report!
"""

import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

print("="*70)
print("📊 CORE EDA - Image Size Distribution Analysis (Seaborn)")
print("="*70)

# ============================================================================
# 1. LOAD DATA FROM GITHUB PAGES
# ============================================================================
print("\n1️⃣ Loading image statistics from GitHub Pages...")
url = 'https://ltsach.github.io/AILearningHub/datasets/oxford-pets/precomputed/core/image_statistics.csv'
df = pd.read_csv(url)
print(f"   ✓ Loaded {len(df):,} images")

# Set seaborn style
sns.set_style("whitegrid")

# Colors matching web report
colors_dict = {'cat': '#f59e0b', 'dog': '#3b82f6'}  # Orange for cats, Blue for dogs
palette = [colors_dict[species] for species in df['species'].unique()]

# ============================================================================
# 2. CREATE ALL CHARTS
# ============================================================================
print("\n2️⃣ Creating visualizations...")

fig = plt.figure(figsize=(16, 12))

# ----------------------------------------------------------------------------
# Chart 1: Size Distribution (Width vs Height Scatter) - Joint Plot Style
# ----------------------------------------------------------------------------
ax1 = plt.subplot(2, 2, 1)

sns.scatterplot(
    data=df,
    x='width',
    y='height',
    hue='species',
    palette=colors_dict,
    s=80,
    alpha=0.6,
    edgecolor='white',
    linewidth=0.5,
    ax=ax1
)

ax1.set_xlabel('Width (pixels)', fontsize=12, fontweight='bold')
ax1.set_ylabel('Height (pixels)', fontsize=12, fontweight='bold')
ax1.set_title('Image Size Distribution (Width x Height)', fontsize=14, fontweight='bold', pad=15)
ax1.legend(title='Species', loc='upper left', framealpha=0.9)
ax1.grid(True, alpha=0.3)

# ----------------------------------------------------------------------------
# Chart 2: File Size Distribution Histogram
# ----------------------------------------------------------------------------
ax2 = plt.subplot(2, 2, 2)

sns.histplot(
    data=df,
    x='file_size_kb',
    hue='species',
    palette=colors_dict,
    bins=30,
    alpha=0.7,
    edgecolor='white',
    linewidth=0.5,
    ax=ax2
)

ax2.set_xlabel('File Size (KB)', fontsize=12, fontweight='bold')
ax2.set_ylabel('Count', fontsize=12, fontweight='bold')
ax2.set_title('File Size Distribution', fontsize=14, fontweight='bold', pad=15)
ax2.legend(title='Species', framealpha=0.9)
ax2.grid(True, alpha=0.3, axis='y')

# ----------------------------------------------------------------------------
# Chart 3: Aspect Ratio Distribution with Common Ratios
# ----------------------------------------------------------------------------
ax3 = plt.subplot(2, 2, 3)

sns.histplot(
    data=df,
    x='aspect_ratio',
    hue='species',
    palette=colors_dict,
    bins=30,
    alpha=0.7,
    edgecolor='white',
    linewidth=0.5,
    ax=ax3
)

# Add vertical lines for common aspect ratios
common_ratios = [0.75, 1.0, 1.33, 1.5, 2.0]
ratio_labels = ['3:4', '1:1', '4:3', '3:2', '2:1']

for ratio, label in zip(common_ratios, ratio_labels):
    ax3.axvline(x=ratio, color='red', linestyle='--', linewidth=1.5, alpha=0.7)
    ax3.text(ratio, ax3.get_ylim()[1]*0.95, label, 
             color='red', fontsize=9, ha='center', va='top',
             bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

ax3.set_xlabel('Aspect Ratio (Width/Height)', fontsize=12, fontweight='bold')
ax3.set_ylabel('Count', fontsize=12, fontweight='bold')
ax3.set_title('Aspect Ratio Distribution', fontsize=14, fontweight='bold', pad=15)
ax3.legend(title='Species', framealpha=0.9)
ax3.grid(True, alpha=0.3, axis='y')

# ----------------------------------------------------------------------------
# Chart 4: Box Plot - Size Comparison by Species
# ----------------------------------------------------------------------------
ax4 = plt.subplot(2, 2, 4)

# Prepare data for box plot
box_data = []
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    box_data.append({
        'Species': species.capitalize(),
        'Width': species_df['width'].values,
        'Height': species_df['height'].values,
        'File Size (KB)': species_df['file_size_kb'].values
    })

# Create box plot for width
width_data = df[['species', 'width', 'height']].copy()
width_data['Metric'] = 'Width (px)'
width_data['Value'] = width_data['width']

height_data = df[['species', 'height']].copy()
height_data['Metric'] = 'Height (px)'
height_data['Value'] = height_data['height']

combined = pd.concat([
    width_data[['species', 'Metric', 'Value']],
    height_data[['species', 'Metric', 'Value']]
])

sns.boxplot(
    data=combined,
    x='Metric',
    y='Value',
    hue='species',
    palette=colors_dict,
    ax=ax4
)

ax4.set_xlabel('')
ax4.set_ylabel('Pixels', fontsize=12, fontweight='bold')
ax4.set_title('Dimension Statistics by Species', fontsize=14, fontweight='bold', pad=15)
ax4.legend(title='Species', framealpha=0.9)
ax4.grid(True, alpha=0.3, axis='y')

# ============================================================================
# FINAL LAYOUT
# ============================================================================
plt.suptitle('Oxford Pets - Core EDA: Image Size Distribution Analysis (Seaborn)', 
             fontsize=16, fontweight='bold', y=0.995)
plt.tight_layout(rect=[0, 0, 1, 0.99])
fig.patch.set_facecolor('white')

print("   ✓ All charts created")
plt.show()

# ============================================================================
# STATISTICS SUMMARY
# ============================================================================
print("\n" + "="*70)
print("📊 STATISTICS SUMMARY")
print("="*70)
print(f"Total Images: {len(df):,}")
print(f"   • Cats: {len(df[df['species']=='cat']):,}")
print(f"   • Dogs: {len(df[df['species']=='dog']):,}")

print(f"\n📐 Dimensions:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • Width: {species_df['width'].mean():.1f} px (±{species_df['width'].std():.1f})")
    print(f"      • Height: {species_df['height'].mean():.1f} px (±{species_df['height'].std():.1f})")

print(f"\n💾 File Sizes:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • Mean: {species_df['file_size_kb'].mean():.1f} KB")
    print(f"      • Median: {species_df['file_size_kb'].median():.1f} KB")

print(f"\n📏 Aspect Ratios:")
for species in df['species'].unique():
    species_df = df[df['species'] == species]
    print(f"   {species.capitalize()}:")
    print(f"      • Mean: {species_df['aspect_ratio'].mean():.2f}")
    print(f"      • Median: {species_df['aspect_ratio'].median():.2f}")

print("="*70)
print("✅ Analysis complete! Charts match web report style.")
